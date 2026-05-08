from pathlib import Path
from decouple import config, Csv
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------------------------------------------------
# Базовые настройки безопасности
# SECRET_KEY и DEBUG берём из .env файла (через python-decouple)
# -----------------------------------------------------------------------
SECRET_KEY = config('SECRET_KEY', default='django-insecure-dev-key-change-in-production')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

# -----------------------------------------------------------------------
# Приложения Django
# -----------------------------------------------------------------------
INSTALLED_APPS = [
    # Стандартные Django-приложения
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Сторонние библиотеки
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',

    # Наши приложения
    'users',
    'lessons',
    'tasks',
    'content',
    'achievements',
]

# -----------------------------------------------------------------------
# Промежуточное ПО (Middleware)
# corsheaders.middleware.CorsMiddleware ДОЛЖЕН быть как можно выше
# -----------------------------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# -----------------------------------------------------------------------
# База данных — PostgreSQL
# Данные для подключения берём из .env
# -----------------------------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='pygen_db'),
        'USER': config('DB_USER', default='pygen_user'),
        'PASSWORD': config('DB_PASSWORD', default='pygen_password'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# -----------------------------------------------------------------------
# КРИТИЧНО: кастомная модель пользователя
# Это ОБЯЗАТЕЛЬНО нужно указать ДО первой миграции
# Если изменить позже — придётся пересоздавать всю базу
# -----------------------------------------------------------------------
AUTH_USER_MODEL = 'users.User'

# -----------------------------------------------------------------------
# Валидация паролей
# -----------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# -----------------------------------------------------------------------
# Локализация
# -----------------------------------------------------------------------
LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

# -----------------------------------------------------------------------
# Статические файлы и медиа (аватарки пользователей)
# -----------------------------------------------------------------------
STATIC_URL = 'static/'
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -----------------------------------------------------------------------
# CORS — разрешаем запросы с фронтенда (localhost:3000)
# CORS_ALLOWED_ORIGINS берём из .env
# -----------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000',
    cast=Csv()
)

# -----------------------------------------------------------------------
# Django REST Framework
# -----------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# -----------------------------------------------------------------------
# JWT токены (SimpleJWT)
# Access токен живёт 1 час, Refresh — 7 дней
# -----------------------------------------------------------------------
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# -----------------------------------------------------------------------
# drf-spectacular — автоматическая документация API (Swagger)
# -----------------------------------------------------------------------
SPECTACULAR_SETTINGS = {
    'TITLE': 'PyGen API',
    'DESCRIPTION': 'API для интерактивной платформы изучения Python',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
