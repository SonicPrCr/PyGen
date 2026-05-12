from django.urls import path
from . import views

urlpatterns = [
    path('themes',              views.ThemeListView.as_view(),    name='theme-list'),
    path('themes/<int:pk>',     views.ThemeDetailView.as_view(),  name='theme-detail'),
    path('lessons/<int:pk>',    views.LessonDetailView.as_view(), name='lesson-detail'),
    path('lessons/<int:pk>/complete', views.LessonCompleteView.as_view(), name='lesson-complete'),
]
