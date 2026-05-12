from django.db import models
from django.conf import settings


class Achievement(models.Model):
    level = models.PositiveSmallIntegerField('Уровень', unique=True)
    name  = models.CharField('Название', max_length=100)
    color = models.CharField('Цвет (hex)', max_length=7)

    class Meta:
        ordering = ['level']
        verbose_name = 'Ачивка'
        verbose_name_plural = 'Ачивки'

    def __str__(self):
        return f'Уровень {self.level}: {self.name}'


class UserAchievement(models.Model):
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='user_achievements')
    earned_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'achievement')
        verbose_name = 'Ачивка пользователя'
        verbose_name_plural = 'Ачивки пользователей'

    def __str__(self):
        return f'{self.user} / {self.achievement}'
