from django.urls import path
from . import views

urlpatterns = [
    path('tasks/random',                              views.RandomTaskView.as_view(),          name='task-random'),
    path('tasks/generate',                            views.GenerateTaskView.as_view(),         name='task-generate'),
    path('tasks/generate/status/<str:task_id>',       views.GenerateTaskStatusView.as_view(),   name='task-generate-status'),
    path('tasks/<int:pk>/check',                      views.CheckCodeView.as_view(),            name='task-check'),
    path('tasks/<int:pk>/hint',                       views.TaskHintView.as_view(),             name='task-hint'),
]

admin_urlpatterns = [
    path('admin/tasks',          views.TaskAdminListView.as_view(),   name='admin-task-list'),
    path('admin/tasks/<int:pk>', views.TaskAdminDetailView.as_view(), name='admin-task-detail'),
]
