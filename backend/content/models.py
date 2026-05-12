from django.db import models
from django.conf import settings


class Bookmark(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    lesson     = models.ForeignKey('lessons.Lesson', on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')
        ordering = ['-created_at']
        verbose_name = 'Закладка'
        verbose_name_plural = 'Закладки'

    def __str__(self):
        return f'{self.user} → {self.lesson}'


class Note(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    title      = models.CharField('Заголовок', max_length=200)
    content    = models.JSONField('Контент', default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Конспект'
        verbose_name_plural = 'Конспекты'

    def __str__(self):
        return f'{self.user} / {self.title}'


class ReferenceCategory(models.Model):
    title = models.CharField('Название', max_length=200)
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Категория справочника'
        verbose_name_plural = 'Категории справочника'

    def __str__(self):
        return self.title


class ReferenceArticle(models.Model):
    category   = models.ForeignKey(ReferenceCategory, on_delete=models.CASCADE, related_name='articles')
    title      = models.CharField('Название', max_length=200)
    content    = models.JSONField('Контент', default=dict)
    order      = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Статья справочника'
        verbose_name_plural = 'Статьи справочника'

    def __str__(self):
        return f'{self.category.title} / {self.title}'
