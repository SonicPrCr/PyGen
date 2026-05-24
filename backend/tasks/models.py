from django.db import models
from django.conf import settings


class Task(models.Model):
    theme            = models.ForeignKey('lessons.Theme',  on_delete=models.CASCADE, related_name='tasks')
    lesson           = models.ForeignKey('lessons.Lesson', on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    title            = models.CharField('Название', max_length=200)
    description      = models.TextField('Описание')
    starter_code     = models.TextField('Стартовый код', blank=True)
    test_cases       = models.JSONField('Тест-кейсы', default=list)
    is_pregenerated  = models.BooleanField('Из пула', default=False)
    created_by_user  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='generated_tasks')
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Задание'
        verbose_name_plural = 'Задания'

    def __str__(self):
        return self.title


class UserSolution(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='solutions')
    task       = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='solutions')
    code       = models.TextField('Код решения')
    is_correct = models.BooleanField('Верно', default=False)
    attempts   = models.PositiveIntegerField('Попытки', default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Решение пользователя'
        verbose_name_plural = 'Решения пользователей'

    def __str__(self):
        return f'{self.user} / {self.task}'


class UserTaskGeneration(models.Model):
    user              = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='task_generations')
    theme             = models.ForeignKey('lessons.Theme', on_delete=models.CASCADE, related_name='task_generations')
    count             = models.PositiveIntegerField('Кол-во сгенерированных', default=0)
    last_generated_at = models.DateTimeField('Последняя генерация', null=True, blank=True)

    class Meta:
        unique_together = ('user', 'theme')
        verbose_name = 'Статистика генерации заданий'
        verbose_name_plural = 'Статистика генерации заданий'

    def __str__(self):
        return f'{self.user} / {self.theme} = {self.count}'
