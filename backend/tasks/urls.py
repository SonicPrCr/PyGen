from django.urls import path
from . import views

urlpatterns = [
    path('tasks/random',          views.RandomTaskView.as_view(),  name='task-random'),
    path('tasks/<int:pk>/check',  views.CheckCodeView.as_view(),   name='task-check'),
]
