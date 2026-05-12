from django.contrib import admin
from .models import Theme, Lesson, UserProgress

@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ['order', 'title', 'created_at']
    ordering = ['order']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['theme', 'order', 'title', 'lesson_type', 'xp_reward']
    list_filter = ['theme', 'lesson_type']

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'completed', 'stars_earned', 'attempts']
    list_filter = ['completed']
