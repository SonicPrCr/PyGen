from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    middle_name = models.CharField('Отчество', max_length=150, blank=True)
    age = models.PositiveSmallIntegerField('Возраст', null=True, blank=True)
    avatar = models.ImageField('Аватар', upload_to='avatars/', blank=True)
    xp = models.PositiveIntegerField('Опыт (XP)', default=0)
    current_level = models.PositiveSmallIntegerField('Текущий уровень', default=1)
    total_stars = models.PositiveIntegerField('Всего звёзд', default=0)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.username
