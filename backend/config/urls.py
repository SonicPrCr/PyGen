from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from users.urls import admin_urlpatterns as users_admin_urlpatterns
from tasks.urls import admin_urlpatterns as tasks_admin_urlpatterns
from content.urls import admin_urlpatterns as content_admin_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),

    # Аутентификация
    path('api/auth/', include('users.urls')),

    # Уроки и темы
    path('api/', include('lessons.urls')),

    # Задания
    path('api/', include('tasks.urls')),

    # Контент (закладки, конспекты, справочник)
    path('api/', include('content.urls')),

    # Ачивки
    path('api/', include('achievements.urls')),

    # Admin: управление пользователями, заданиями, справочником (на /api/, не /api/auth/)
    *[path('api/', include((users_admin_urlpatterns, 'users-admin')))],
    *[path('api/', include((tasks_admin_urlpatterns, 'tasks-admin')))],
    *[path('api/', include((content_admin_urlpatterns, 'content-admin')))],

    # Документация API (Swagger)
    path('api/schema/',        SpectacularAPIView.as_view(),                            name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'),  name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
