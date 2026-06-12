# PyGen — Интерактивная платформа для изучения Python

![PyGen](https://img.shields.io/badge/PyGen-v1.0.0-7c3aed)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Django](https://img.shields.io/badge/Django-5-092e20)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![License](https://img.shields.io/badge/license-MIT-green)

Образовательная платформа для изучения основ программирования на языке Python с автоматической генерацией практических заданий через ИИ, встроенным редактором кода и системой геймификации.

---

## Содержание

- [Возможности](#возможности)
- [Стек технологий](#стек-технологий)
- [Структура проекта](#структура-проекта)
- [Локальная установка](#локальная-установка)
- [Деплой на сервер](#деплой-на-сервер)
- [Переменные окружения](#переменные-окружения)
- [Управление проектом](#управление-проектом)

---

## Возможности

- 📚 Структурированный курс Python с поэтапной разблокировкой тем
- 💻 Встроенный редактор кода Monaco Editor с выполнением Python прямо в браузере (Pyodide + WebAssembly)
- 🤖 Автоматическая генерация практических заданий через DeepSeek AI (лимит 3 на тему, сброс через 24 часа)
- 💡 Подсказки от ИИ при неверном решении
- 🏆 Система геймификации: опыт (XP), уровни, звёзды, достижения
- 🔖 Закладки и конспекты в TipTap-редакторе
- 📖 Встроенный справочник по Python
- 👤 Профиль пользователя с прогрессом и достижениями
- 🛡️ Кастомная административная панель
- 📱 Адаптивный дизайн для ПК, планшетов и мобильных устройств

---

## Стек технологий

### Frontend
| Технология | Версия | Назначение |
|-----------|--------|-----------|
| Next.js | 15 | Основной фреймворк |
| TypeScript | 5 | Типизация |
| Tailwind CSS | 3 | Стилизация |
| shadcn/ui | — | Компоненты UI |
| Zustand | — | Управление состоянием |
| TanStack Query | — | Кэширование запросов |
| Monaco Editor | — | Редактор кода |
| Pyodide | — | Python в браузере (WebAssembly) |
| TipTap | — | Rich-text редактор |
| Axios | — | HTTP-клиент |
| Zod + React Hook Form | — | Валидация форм |

### Backend
| Технология | Версия | Назначение |
|-----------|--------|-----------|
| Django | 5 | Основной фреймворк |
| Django REST Framework | — | REST API |
| Simple JWT | — | JWT-аутентификация |
| Celery | — | Асинхронные задачи |
| Redis | 7 | Брокер очередей |
| drf-spectacular | — | Swagger документация |
| Gunicorn | — | WSGI-сервер |
| OpenAI SDK | — | Клиент для DeepSeek/OpenRouter |

### База данных и инфраструктура
| Технология | Назначение |
|-----------|-----------|
| PostgreSQL 16 | Основная СУБД |
| Docker + Docker Compose | Контейнеризация |
| Nginx | Обратный прокси |
| Let's Encrypt | SSL-сертификат |
| Vercel | Хостинг фронтенда |

---

## Структура проекта

```
PyGen/
├── backend/                    # Django бэкенд
│   ├── config/                 # Настройки проекта
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── wsgi.py
│   ├── users/                  # Пользователи и авторизация
│   ├── lessons/                # Темы и уроки
│   ├── tasks/                  # Задания и генерация ИИ
│   │   ├── ai_service.py       # Сервис DeepSeek/OpenRouter
│   │   └── tasks.py            # Celery задачи
│   ├── content/                # Закладки, конспекты, справочник
│   ├── achievements/           # Достижения
│   ├── tests/                  # Pytest тесты
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # Next.js фронтенд
│   ├── src/
│   │   ├── app/                # Страницы (App Router)
│   │   │   ├── admin/          # Административная панель
│   │   │   ├── lessons/        # Страницы уроков и редактора
│   │   │   ├── topics/         # Каталог тем
│   │   │   ├── profile/        # Профиль пользователя
│   │   │   ├── reference/      # Справочник
│   │   │   └── help/           # FAQ
│   │   ├── components/         # Переиспользуемые компоненты
│   │   │   ├── editor/         # TipTap редактор
│   │   │   └── lessons/        # Компоненты уроков
│   │   ├── lib/
│   │   │   ├── api.ts          # Axios инстанс
│   │   │   ├── stores/         # Zustand сторы
│   │   │   └── hooks/          # Кастомные хуки
│   │   └── public/             # Статические файлы
│   ├── package.json
│   └── .env.example
├── docker-compose.yml          # Для локальной разработки
├── docker-compose.prod.yml     # Для продакшена
└── README.md
```

---

## Локальная установка

### Требования

Перед началом убедись что установлено:
- [Node.js](https://nodejs.org/) версии 18 или выше
- [Python](https://python.org/) версии 3.11 или выше
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (для PostgreSQL и Redis)
- [Git](https://git-scm.com/)

### Шаг 1 — Клонировать репозиторий

```bash
git clone https://github.com/ТВО_ИМЯ/PyGen.git
cd PyGen
```

### Шаг 2 — Запустить PostgreSQL и Redis через Docker

```bash
docker compose up -d postgres redis
```

Проверить что контейнеры запущены:
```bash
docker ps
# Должны быть: pygen_postgres и pygen_redis
```

### Шаг 3 — Настроить бэкенд

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv

# Активировать (Windows)
venv\Scripts\activate

# Активировать (macOS / Linux)
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Создать .env файл
cp .env.example .env
```

Открыть `.env` и заполнить обязательные переменные (см. раздел [Переменные окружения](#переменные-окружения)).

```bash
# Применить миграции
python manage.py migrate

# Создать суперпользователя (для входа в /admin)
python manage.py createsuperuser

# Загрузить демо-данные (темы, уроки, справочник)
python manage.py seed_demo_data

# Запустить сервер
python manage.py runserver
```

Бэкенд доступен по адресу: `http://localhost:8000`
Swagger документация: `http://localhost:8000/api/schema/swagger-ui/`

### Шаг 4 — Запустить Celery worker (в отдельном терминале)

```bash
cd backend
source venv/bin/activate  # или venv\Scripts\activate на Windows

celery -A config worker --loglevel=info
```

> ⚠️ Celery нужен для генерации заданий через ИИ. Без него кнопка «Генерация» будет возвращать задания из пула.

### Шаг 5 — Настроить фронтенд

```bash
cd frontend

# Установить зависимости
npm install

# Создать .env.local файл
cp .env.example .env.local
```

Открыть `.env.local` и указать:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# Запустить сервер разработки
npm run dev
```

Фронтенд доступен по адресу: `http://localhost:3000`

### Шаг 6 — Наполнить пул заданий (опционально)

Для работы генерации заданий нужен API-ключ DeepSeek или OpenRouter в `.env`. После его добавления:

```bash
cd backend
source venv/bin/activate

# Сгенерировать по 10 заданий на каждую тему
python manage.py seed_task_pool --all --count=10
```

---

## Деплой на сервер

### Требования к серверу

- Ubuntu 22.04 LTS
- Минимум 2 GB RAM, 1 vCPU, 20 GB SSD
- Публичный IP-адрес
- Открытые порты: 22 (SSH), 80 (HTTP), 443 (HTTPS)

### Шаг 1 — Подготовка сервера

Подключиться по SSH:
```bash
ssh root@ВАШ_IP
```

Обновить систему и установить зависимости:
```bash
apt update && apt upgrade -y
apt install -y curl git nginx certbot python3-certbot-nginx ufw

# Настроить файрвол
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Установить Docker
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin
```

### Шаг 2 — Настроить DNS

В панели управления доменом добавить A-записи:

| Тип | Имя | Значение |
|-----|-----|---------|
| A | `@` | ВАШ_IP |
| A | `api` | ВАШ_IP |
| A | `www` | ВАШ_IP |

### Шаг 3 — Клонировать репозиторий

```bash
# Создать пользователя
adduser pygen
usermod -aG sudo pygen
usermod -aG docker pygen

# Переключиться на пользователя
su - pygen

# Добавить репозиторий в safe list (если нужно)
git config --global --add safe.directory /home/pygen/app/PyGen

# Клонировать
mkdir -p /home/pygen/app
cd /home/pygen/app
git clone https://github.com/ТВО_ИМЯ/PyGen.git PyGen
cd PyGen
```

### Шаг 4 — Настроить переменные окружения

```bash
nano backend/.env
```

Заполнить все переменные (см. раздел [Переменные окружения](#переменные-окружения)).
Для продакшена обязательно указать:
```env
DEBUG=False
ALLOWED_HOSTS=api.ВАШ_ДОМЕН.ru,ВАШ_IP
CORS_ALLOWED_ORIGINS=https://ВАШ_ДОМЕН.ru,https://www.ВАШ_ДОМЕН.ru
CSRF_TRUSTED_ORIGINS=https://api.ВАШ_ДОМЕН.ru,https://ВАШ_ДОМЕН.ru
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Шаг 5 — Запустить контейнеры

```bash
cd /home/pygen/app/PyGen

# Запустить все сервисы
docker compose -f docker-compose.prod.yml up -d --build

# Проверить что все запущены
docker compose -f docker-compose.prod.yml ps

# Следить за логами бэкенда
docker compose -f docker-compose.prod.yml logs backend --tail=50
```

Должны быть запущены 4 контейнера:
- `pygen_postgres`
- `pygen_redis`
- `pygen_backend`
- `pygen_celery`

### Шаг 6 — Создать суперпользователя и загрузить данные

```bash
# Создать администратора
docker compose -f docker-compose.prod.yml exec backend \
  python manage.py createsuperuser

# Загрузить демо-данные
docker compose -f docker-compose.prod.yml exec backend \
  python manage.py seed_demo_data

# Наполнить пул заданий
docker compose -f docker-compose.prod.yml exec backend \
  python manage.py seed_task_pool --all --count=10

# Скопировать статику на хост (для Nginx)
docker cp pygen_backend:/app/staticfiles/. /home/pygen/app/PyGen/backend/staticfiles/
chmod -R 755 /home/pygen/app/PyGen/backend/staticfiles/
```

### Шаг 7 — Настроить Nginx

```bash
sudo nano /etc/nginx/sites-available/pygen
```

Вставить конфигурацию:

```nginx
# Редирект HTTP → HTTPS для API
server {
    listen 80;
    server_name api.ВАШ_ДОМЕН.ru;
    return 301 https://$host$request_uri;
}

# HTTPS для API (Django)
server {
    listen 443 ssl;
    server_name api.ВАШ_ДОМЕН.ru;

    ssl_certificate /etc/letsencrypt/live/api.ВАШ_ДОМЕН.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.ВАШ_ДОМЕН.ru/privkey.pem;

    # Статика Django Admin
    location /static/ {
        alias /home/pygen/app/PyGen/backend/staticfiles/;
        expires 30d;
    }

    # Media файлы
    location /media/ {
        alias /home/pygen/app/PyGen/backend/media/;
        expires 7d;
    }

    # Проксирование на Django
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        client_max_body_size 10M;
    }
}

# Редирект HTTP → HTTPS для фронтенда
server {
    listen 80;
    server_name ВАШ_ДОМЕН.ru www.ВАШ_ДОМЕН.ru;
    return 301 https://$host$request_uri;
}
```

```bash
# Активировать конфиг
sudo ln -s /etc/nginx/sites-available/pygen /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверить синтаксис
sudo nginx -t

# Перезапустить Nginx
sudo systemctl reload nginx
```

### Шаг 8 — Получить SSL сертификат

```bash
sudo certbot --nginx -d api.ВАШ_ДОМЕН.ru
```

Следовать инструкциям Certbot. Выбрать редирект на HTTPS (вариант 2).

### Шаг 9 — Задеплоить фронтенд на Vercel

1. Зайти на [vercel.com](https://vercel.com) и подключить GitHub репозиторий
2. В настройках проекта добавить переменную окружения:
   ```
   NEXT_PUBLIC_API_URL = https://api.ВАШ_ДОМЕН.ru
   ```
3. В **Settings → Domains** добавить свой домен `ВАШ_ДОМЕН.ru`
4. В панели управления доменом добавить CNAME-запись которую покажет Vercel

### Шаг 10 — Автозапуск при перезагрузке сервера

```bash
sudo nano /etc/systemd/system/pygen.service
```

```ini
[Unit]
Description=PyGen Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/pygen/app/PyGen
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down
User=pygen

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable pygen
sudo systemctl start pygen
```

---

## Переменные окружения

### backend/.env

```env
# ── Безопасность ──────────────────────────────────────────────
SECRET_KEY=сгенерируй_случайную_строку_50_символов
DEBUG=True                          # False для продакшена
ALLOWED_HOSTS=localhost,127.0.0.1   # api.домен.ru,IP для продакшена

# ── База данных ───────────────────────────────────────────────
DB_NAME=pygen_db
DB_USER=pygen_user
DB_PASSWORD=надёжный_пароль
DB_HOST=localhost                   # postgres для Docker
DB_PORT=5432

# ── CORS и CSRF ───────────────────────────────────────────────
CORS_ALLOWED_ORIGINS=http://localhost:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:8000
SESSION_COOKIE_SECURE=False         # True для продакшена
CSRF_COOKIE_SECURE=False            # True для продакшена

# ── DeepSeek / OpenRouter AI ──────────────────────────────────
DEEPSEEK_API_KEY=твой_api_ключ
DEEPSEEK_BASE_URL=https://openrouter.ai/api/v1
DEEPSEEK_MODEL=deepseek/deepseek-chat

# ── Celery + Redis ────────────────────────────────────────────
CELERY_BROKER_URL=redis://localhost:6379/0   # redis://redis:6379/0 для Docker
CELERY_RESULT_BACKEND=redis://localhost:6379/0
CELERY_TASK_TIME_LIMIT=180
CELERY_TASK_SOFT_TIME_LIMIT=150
```

Сгенерировать SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:8000   # https://api.домен.ru для продакшена
```

---

## Управление проектом

### Обновление на сервере

```bash
cd /home/pygen/app/PyGen

# Получить изменения из репозитория
git pull

# Пересобрать и перезапустить контейнеры
docker compose -f docker-compose.prod.yml up -d --build

# Применить новые миграции (если были изменения в моделях)
docker compose -f docker-compose.prod.yml exec backend \
  python manage.py migrate

# Обновить статику (если изменился Django Admin)
docker cp pygen_backend:/app/staticfiles/. ./backend/staticfiles/
chmod -R 755 ./backend/staticfiles/
```

### Запуск тестов

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

### Полезные команды Docker

```bash
# Посмотреть логи конкретного сервиса
docker compose -f docker-compose.prod.yml logs backend --tail=50
docker compose -f docker-compose.prod.yml logs celery --tail=50

# Войти в контейнер бэкенда
docker compose -f docker-compose.prod.yml exec backend bash

# Перезапустить один сервис
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart celery

# Остановить всё
docker compose -f docker-compose.prod.yml down

# Остановить и удалить все данные (включая БД!)
docker compose -f docker-compose.prod.yml down -v
```

### Management команды

```bash
# Загрузить демо-данные (темы, уроки, справочник)
python manage.py seed_demo_data

# Наполнить пул заданий для всех тем
python manage.py seed_task_pool --all --count=10

# Наполнить пул для конкретной темы (ID=1)
python manage.py seed_task_pool --theme=1 --count=5
```

### Структура URL

| URL | Описание |
|-----|---------|
| `/` | Главная страница |
| `/topics` | Каталог тем |
| `/topics/:id` | Уроки темы |
| `/lessons/:id` | Теоретический урок |
| `/lessons/:id/editor` | Редактор кода |
| `/profile` | Профиль пользователя |
| `/reference` | Справочник по Python |
| `/help` | FAQ |
| `/admin` | Административная панель |
| `api.домен/api/schema/swagger-ui/` | Swagger документация |

---

## Лицензия

MIT License — используй свободно.
