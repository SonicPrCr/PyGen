from django.urls import path
from . import views

urlpatterns = [
    path('tasks/random',                              views.RandomTaskView.as_view(),            name='task-random'),
    path('tasks/generate',                            views.GenerateTaskView.as_view(),           name='task-generate'),
    path('tasks/generate/status/<str:task_id>',       views.GenerateTaskStatusView.as_view(),     name='task-generate-status'),
    path('tasks/generation-status',                   views.UserGenerationStatusView.as_view(),   name='task-generation-status'),
    path('tasks/<int:pk>/check',                      views.CheckCodeView.as_view(),              name='task-check'),
    path('tasks/<int:pk>/hint',                       views.TaskHintView.as_view(),               name='task-hint'),
]

admin_urlpatterns = [
    path('admin/tasks',                                views.TaskAdminListView.as_view(),              name='admin-task-list'),
    path('admin/tasks/<int:pk>',                       views.TaskAdminDetailView.as_view(),            name='admin-task-detail'),
    path('admin/user-solutions',                       views.UserSolutionAdminListView.as_view(),      name='admin-user-solutions'),
    path('admin/user-solutions/<int:pk>',              views.UserSolutionAdminDeleteView.as_view(),    name='admin-user-solution-delete'),
    path('admin/task-generations',                     views.UserTaskGenerationAdminListView.as_view(), name='admin-task-generations'),
    path('admin/task-generations/<int:pk>/reset',      views.UserTaskGenerationAdminResetView.as_view(), name='admin-task-generation-reset'),
]
