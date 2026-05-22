from django.urls import path
from . import views

urlpatterns = [
    # ── Публичные/авторизованные эндпоинты ───────────────────────────────────
    path('themes',                          views.ThemeListView.as_view(),           name='theme-list'),
    path('themes/<int:pk>',                 views.ThemeDetailView.as_view(),         name='theme-detail'),
    path('lessons/<int:pk>',                views.LessonDetailView.as_view(),        name='lesson-detail'),
    path('lessons/<int:pk>/complete/',      views.LessonCompleteView.as_view(),      name='lesson-complete'),

    # ── Admin CRUD (только IsAdminUser) ──────────────────────────────────────
    path('admin/themes',                    views.ThemeAdminListCreateView.as_view(),  name='admin-themes'),
    path('admin/themes/<int:pk>',           views.ThemeAdminDetailView.as_view(),      name='admin-theme-detail'),
    path('admin/lessons',                   views.LessonAdminCreateView.as_view(),     name='admin-lesson-create'),
    path('admin/lessons/<int:pk>',          views.LessonAdminDetailView.as_view(),     name='admin-lesson-detail'),
]
