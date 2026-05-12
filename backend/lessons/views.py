from django.utils import timezone
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from drf_spectacular.utils import extend_schema

from .models import Theme, Lesson, UserProgress
from .serializers import ThemeListSerializer, ThemeDetailSerializer, LessonDetailSerializer


class ThemeListView(generics.ListAPIView):
    queryset = Theme.objects.prefetch_related('lessons')
    serializer_class = ThemeListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(summary='Список всех тем с прогрессом пользователя')
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ThemeDetailView(generics.RetrieveAPIView):
    queryset = Theme.objects.prefetch_related('lessons')
    serializer_class = ThemeDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(summary='Детали темы со списком уроков и прогрессом')
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.select_related('theme')
    serializer_class = LessonDetailSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(summary='Детали урока (контент, код, тест-кейсы)')
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class LessonCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Отметить урок пройденным',
        request={'application/json': {'type': 'object', 'properties': {
            'stars_earned': {'type': 'integer', 'minimum': 1, 'maximum': 3},
        }, 'required': ['stars_earned']}},
    )
    def post(self, request, pk):
        try:
            lesson = Lesson.objects.get(pk=pk)
        except Lesson.DoesNotExist:
            return Response({'error': 'Урок не найден'}, status=status.HTTP_404_NOT_FOUND)

        stars = int(request.data.get('stars_earned', 1))
        stars = max(1, min(3, stars))

        progress, _ = UserProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson,
            defaults={'completed': False, 'stars_earned': 0, 'attempts': 0},
        )

        progress.attempts += 1

        if not progress.completed:
            # Первый раз — сигнал on_lesson_completed начислит XP
            progress.completed = True
            progress.stars_earned = stars
            progress.completed_at = timezone.now()
        else:
            # Повторное прохождение — обновляем звёзды только в большую сторону
            progress.stars_earned = max(progress.stars_earned, stars)

        progress.save()

        request.user.refresh_from_db()
        from users.serializers import UserSerializer
        return Response({
            'message': 'Урок пройден!',
            'stars_earned': progress.stars_earned,
            'user': UserSerializer(request.user).data,
        })
