from django.db import models
from django.conf import settings


class Theme(models.Model):
    title       = models.CharField('Название', max_length=200)
    description = models.TextField('Описание', blank=True)
    order       = models.PositiveIntegerField('Порядок', unique=True)
    icon        = models.ImageField('Иконка', upload_to='theme_icons/', blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'

    def __str__(self):
        return f'{self.order}. {self.title}'


class Lesson(models.Model):
    LESSON_TYPES = [
        ('theory',   'Теория'),
        ('practice', 'Практика'),
    ]

    theme        = models.ForeignKey(Theme, on_delete=models.CASCADE, related_name='lessons')
    title        = models.CharField('Название', max_length=200)
    order        = models.PositiveIntegerField('Порядок в теме')
    lesson_type  = models.CharField('Тип урока', max_length=20, choices=LESSON_TYPES)
    content      = models.JSONField('Контент', default=dict)
    starter_code = models.TextField('Стартовый код', blank=True)
    test_cases   = models.JSONField('Тест-кейсы', default=list)
    xp_reward    = models.PositiveIntegerField('Награда XP', default=10)
    stars_reward = models.PositiveSmallIntegerField('Награда звёзды', default=1)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['theme', 'order']
        unique_together = ('theme', 'order')
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'

    def __str__(self):
        return f'{self.theme.title} / {self.order}. {self.title}'


class UserProgress(models.Model):
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    lesson       = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    completed    = models.BooleanField('Завершён', default=False)
    stars_earned = models.PositiveSmallIntegerField('Звёзды', default=0)
    attempts     = models.PositiveIntegerField('Попытки', default=0)
    completed_at = models.DateTimeField('Завершён в', null=True, blank=True)

    class Meta:
        unique_together = ('user', 'lesson')
        verbose_name = 'Прогресс пользователя'
        verbose_name_plural = 'Прогресс пользователей'

    def __str__(self):
        return f'{self.user} / {self.lesson}'
