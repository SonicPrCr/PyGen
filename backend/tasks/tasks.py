import logging
from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone

from lessons.models import Theme
from .models import Task, UserSolution, UserTaskGeneration
from .ai_service import generate_task_data

logger = logging.getLogger(__name__)
User = get_user_model()


def _reset_in_seconds(usage, limit: int) -> float | None:
    """Возвращает секунды до автосброса, если лимит исчерпан и таймер идёт."""
    if usage.last_generated_at and usage.count >= limit:
        elapsed = (timezone.now() - usage.last_generated_at).total_seconds()
        return max(0.0, 86400.0 - elapsed)
    return None


@shared_task(bind=True)
def generate_task_async(self, user_id: int, theme_id: int) -> dict:
    """
    Асинхронно генерирует задание через DeepSeek с fallback в пул.

    Возвращаемый dict:
    {
      'success': bool,
      'source': 'ai' | 'pool',
      'task_id': int,               # если success=True
      'remaining_generations': int,
      'reset_in_seconds': float | None,  # None если лимит не исчерпан
      'error': str,                 # если success=False
    }
    """
    user = User.objects.get(pk=user_id)
    theme = Theme.objects.get(pk=theme_id)
    limit = settings.DEEPSEEK_GENERATION_LIMIT

    usage, _ = UserTaskGeneration.objects.get_or_create(user=user, theme=theme)

    # Автосброс если прошло 24 часа с последней генерации
    if usage.last_generated_at is not None:
        if timezone.now() - usage.last_generated_at >= timedelta(hours=24):
            usage.count = 0
            usage.last_generated_at = None
            usage.save()

    # Пробуем ИИ если лимит не исчерпан
    if usage.count < limit:
        data = generate_task_data(theme)
        if data:
            task = Task.objects.create(
                theme=theme,
                title=data['title'],
                description=data['description'],
                starter_code=data['starter_code'],
                test_cases=data['test_cases'],
                is_pregenerated=False,
                created_by_user=user,
            )
            usage.count += 1
            usage.last_generated_at = timezone.now()
            usage.save()
            logger.info('generate_task_async: ИИ-задание создано (id=%d) для user=%d', task.id, user_id)
            return {
                'success': True,
                'source': 'ai',
                'task_id': task.id,
                'remaining_generations': limit - usage.count,
                'reset_in_seconds': _reset_in_seconds(usage, limit),
            }
        logger.warning('generate_task_async: ИИ не смог сгенерировать, fallback в пул')

    # Fallback: задание из пула (исключаем уже решённые)
    solved_ids = UserSolution.objects.filter(
        user=user, is_correct=True,
    ).values_list('task_id', flat=True)

    pool_task = (
        Task.objects.filter(theme=theme, is_pregenerated=True)
        .exclude(id__in=solved_ids)
        .order_by('?')
        .first()
    )

    if pool_task:
        logger.info('generate_task_async: задание из пула (id=%d) для user=%d', pool_task.id, user_id)
        return {
            'success': True,
            'source': 'pool',
            'task_id': pool_task.id,
            'remaining_generations': max(0, limit - usage.count),
            'reset_in_seconds': _reset_in_seconds(usage, limit),
        }

    logger.warning('generate_task_async: нет доступных заданий для user=%d theme=%d', user_id, theme_id)
    return {
        'success': False,
        'error': 'Нет доступных заданий',
        'remaining_generations': max(0, limit - usage.count),
        'reset_in_seconds': _reset_in_seconds(usage, limit),
    }
