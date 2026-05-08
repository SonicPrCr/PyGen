# PyGen — интерактивная платформа для изучения Python

Веб-платформа с автогенерацией заданий через нейросеть, встроенным редактором кода и системой геймификации.

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand |
| Backend | Django 5, Django REST Framework, SimpleJWT, drf-spectacular |
| База данных | PostgreSQL 16 |
| Кэш / Очередь | Redis 7, Celery (позже) |
| AI | DeepSeek API (позже) |

## Как запустить

### 1. Запустить базу данных и Redis через Docker

```bash
docker-compose up -d
```

> После этой команды PostgreSQL будет доступен на порту 5432, Redis — на 6379.

### 2. Запустить бэкенд (Django)

```bash
cd backend

# Windows — активировать виртуальное окружение:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Установить зависимости (только первый раз)
pip install -r requirements.txt

# Применить миграции (только первый раз или после изменений моделей)
python manage.py migrate

# Запустить сервер разработки
python manage.py runserver
```

Бэкенд будет доступен на http://localhost:8000  
Swagger (документация API) — http://localhost:8000/api/schema/swagger-ui/

### 3. Запустить фронтенд (Next.js)

```bash
cd frontend

# Установить зависимости (только первый раз)
npm install

# Запустить сервер разработки
npm run dev
```

Фронтенд будет доступен на http://localhost:3000

## Структура папок

```
PyGen/
├── docker-compose.yml      # PostgreSQL + Redis для локальной разработки
├── backend/                # Django API
│   ├── config/             # Настройки проекта (settings, urls, wsgi)
│   ├── users/              # Кастомная модель пользователя, аутентификация
│   ├── lessons/            # Темы и уроки
│   ├── tasks/              # Задания и решения
│   ├── content/            # Заметки, закладки, справочник
│   └── achievements/       # Ачивки и достижения
└── frontend/               # Next.js приложение
    └── src/
        ├── app/            # Страницы (App Router)
        ├── components/     # UI-компоненты
        ├── lib/            # Утилиты (API-клиент, хелперы)
        └── styles/         # CSS-переменные с цветами
```

## Переменные окружения

- `backend/.env.example` — шаблон для бэкенда
- `frontend/.env.local.example` — шаблон для фронтенда

Скопируй нужный файл, убери `.example` из названия и заполни значения.
