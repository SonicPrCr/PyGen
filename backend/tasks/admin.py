from django.contrib import admin
from .models import Task, UserSolution, UserTaskGeneration

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'theme', 'is_pregenerated', 'created_at']
    list_filter = ['theme', 'is_pregenerated']

@admin.register(UserSolution)
class UserSolutionAdmin(admin.ModelAdmin):
    list_display = ['user', 'task', 'is_correct', 'attempts', 'created_at']
    list_filter = ['is_correct']

admin.site.register(UserTaskGeneration)
