from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(),     name='auth-register'),
    path('login/',    views.LoginView.as_view(),         name='auth-login'),
    path('refresh/',  views.TokenRefreshView.as_view(),  name='auth-refresh'),
    path('me/',       views.MeView.as_view(),            name='auth-me'),
]

# Отдельный список для подключения в config/urls.py на /api/ (не /api/auth/)
admin_urlpatterns = [
    path('admin/users',          views.UserAdminListView.as_view(),    name='admin-users'),
    path('admin/users/<int:pk>', views.UserAdminDetailView.as_view(),  name='admin-user-detail'),
]
