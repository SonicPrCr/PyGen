import subprocess
import sys
import tempfile
import os
import logging

from celery.result import AsyncResult
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from drf_spectacular.utils import extend_schema

from lessons.models import Theme
from .models import Task, UserSolution, UserTaskGeneration
from .serializers import TaskSerializer, CheckCodeSerializer

logger = logging.getLogger(__name__)


class RandomTaskView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Случайное задание из пула для темы',
        parameters=[{
            'name': 'theme_id', 'in': 'query', 'required': True,
            'schema': {'type': 'integer'},
        }],
        responses={200: TaskSerializer},
    )
    def get(self, request):
        theme_id = request.query_params.get('theme_id')
        if not theme_id:
            return Response({'error': 'Укажите theme_id'}, status=status.HTTP_400_BAD_REQUEST)

        # ID заданий, которые пользователь уже решил правильно
        solved_ids = UserSolution.objects.filter(
            user=request.user, is_correct=True
        ).values_list('task_id', flat=True)

        task = Task.objects.filter(
            theme_id=theme_id,
            is_pregenerated=True,
        ).exclude(id__in=solved_ids).order_by('?').first()

        if not task:
            return Response(
                {'message': 'Все задания из пула решены!'},
                status=status.HTTP_200_OK,
            )

        return Response(TaskSerializer(task).data)


class CheckCodeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Проверить код задания',
        request=CheckCodeSerializer,
    )
    def post(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Задание не найдено'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CheckCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data['code']

        results = []
        all_correct = True

        for tc in task.test_cases:
            stdin_data = tc.get('input', '')
            expected   = str(tc.get('expected_output', '')).strip()
            actual, error = _run_code(code, stdin_data)

            passed = (actual.strip() == expected)
            if not passed:
                all_correct = False

            results.append({
                'input':           stdin_data,
                'expected_output': expected,
                'actual_output':   actual.strip(),
                'passed':          passed,
                'error':           error,
            })

        # Сохраняем или обновляем решение
        solution, created = UserSolution.objects.get_or_create(
            user=request.user, task=task,
            defaults={'code': code, 'is_correct': all_correct, 'attempts': 1},
        )
        if not created:
            solution.code = code
            solution.attempts += 1
            if all_correct:
                solution.is_correct = True
            solution.save()

        return Response({
            'is_correct':    all_correct,
            'test_results':  results,
            'attempts':      solution.attempts,
        })


class GenerateTaskView(APIView):
    """POST /api/tasks/generate — запускает Celery-задачу генерации."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        theme_id = request.data.get('theme_id')
        if not theme_id:
            return Response({'error': 'Укажите theme_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            theme = Theme.objects.get(pk=theme_id)
        except Theme.DoesNotExist:
            return Response({'error': 'Тема не найдена'}, status=status.HTTP_404_NOT_FOUND)

        from .tasks import generate_task_async
        async_result = generate_task_async.delay(request.user.id, theme.id)
        return Response({'task_id': async_result.id, 'status': 'pending'})


class GenerateTaskStatusView(APIView):
    """GET /api/tasks/generate/status/<task_id> — статус и результат генерации."""
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        async_result = AsyncResult(task_id)

        if async_result.state == 'PENDING':
            return Response({'status': 'pending'})

        if async_result.state == 'SUCCESS':
            result = async_result.result
            if result.get('success'):
                try:
                    task = Task.objects.get(pk=result['task_id'])
                except Task.DoesNotExist:
                    return Response({'status': 'failed', 'error': 'Задание не найдено'})
                return Response({
                    'status': 'success',
                    'source': result['source'],
                    'task': TaskSerializer(task).data,
                    'remaining_generations': result['remaining_generations'],
                })
            return Response({
                'status': 'failed',
                'error': result.get('error', 'Нет доступных заданий'),
                'remaining_generations': result.get('remaining_generations', 0),
            })

        # FAILURE или другое состояние
        logger.error('GenerateTaskStatusView: задача %s в состоянии %s', task_id, async_result.state)
        return Response({'status': 'failed', 'error': 'Внутренняя ошибка'})


class TaskHintView(APIView):
    """POST /api/tasks/<pk>/hint — синхронная подсказка от ИИ."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Задание не найдено'}, status=status.HTTP_404_NOT_FOUND)

        code = request.data.get('code', '')
        if not code.strip():
            return Response({'error': 'Отправьте код в поле code'}, status=status.HTTP_400_BAD_REQUEST)

        from . import ai_service
        hint = ai_service.get_hint(task, code)
        if hint is None:
            return Response(
                {'error': 'Сервис подсказок временно недоступен'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({'hint': hint})


class TaskAdminListView(generics.ListAPIView):
    """GET /api/admin/tasks[?theme=<id>] — список заданий из пула."""
    serializer_class = TaskSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = Task.objects.filter(is_pregenerated=True).order_by('-created_at')
        theme_id = self.request.query_params.get('theme')
        if theme_id:
            qs = qs.filter(theme_id=theme_id)
        return qs


class TaskAdminDetailView(generics.DestroyAPIView):
    """DELETE /api/admin/tasks/<pk> — удаление задания из пула."""
    queryset = Task.objects.filter(is_pregenerated=True)
    serializer_class = TaskSerializer
    permission_classes = [IsAdminUser]


def _run_code(code: str, stdin_data: str) -> tuple[str, str]:
    """Запускает Python-код в subprocess с таймаутом 5 секунд."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        fname = f.name
    try:
        result = subprocess.run(
            [sys.executable, fname],
            input=stdin_data,
            capture_output=True,
            text=True,
            timeout=5,
        )
        return result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return '', 'Превышено время выполнения (5 сек)'
    except Exception as e:
        return '', str(e)
    finally:
        os.unlink(fname)
