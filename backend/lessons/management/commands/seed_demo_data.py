from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


ACHIEVEMENTS_DATA = [
    (10, 'Новичок',    '#FFDB3A'),
    (20, 'Ученик',     '#FF9F43'),
    (30, 'Знаток',     '#FF6B6B'),
    (40, 'Эксперт',    '#A29BFE'),
    (50, 'Мастер',     '#6C5CE7'),
    (60, 'Гуру',       '#00CEC9'),
    (70, 'Легенда',    '#00B894'),
    (80, 'Чемпион',    '#0984E3'),
    (90, 'Король Python', '#E17055'),
]

THEMES_DATA = [
    (1, 'Введение',  'Знакомство с Python и средой разработки'),
    (2, 'Основы',    'Переменные, типы данных, операторы'),
    (3, 'Циклы',     'For, while, управление циклами'),
]

# (title, lesson_type, xp, stars, starter_code, test_cases)
LESSONS_TEMPLATE = [
    (
        'Знакомство с темой',
        'theory', 10, 3,
        '',
        [],
    ),
    (
        'Первое задание',
        'practice', 20, 3,
        '# напиши код здесь\n',
        [{'input': '', 'expected_output': 'Hello, World!'}],
    ),
    (
        'Углублённая теория',
        'theory', 10, 3,
        '',
        [],
    ),
    (
        'Итоговый тест',
        'test', 15, 3,
        '',
        [],
    ),
]

# Пул заранее сгенерированных заданий (5 на тему)
TASKS_DATA = {
    'Введение': [
        {
            'title': 'Привет, мир!',
            'description': 'Выведи строку "Hello, World!" на экран.',
            'starter_code': '# Напиши код здесь\n',
            'test_cases': [{'input': '', 'expected_output': 'Hello, World!'}],
        },
        {
            'title': 'Сумма двух чисел',
            'description': 'Пользователь вводит два числа через input. Выведи их сумму.',
            'starter_code': 'a = int(input())\nb = int(input())\n# выведи сумму\n',
            'test_cases': [{'input': '3\n5\n', 'expected_output': '8'}],
        },
        {
            'title': 'Длина строки',
            'description': 'Прочитай строку и выведи её длину.',
            'starter_code': 's = input()\n# выведи длину\n',
            'test_cases': [{'input': 'hello\n', 'expected_output': '5'}],
        },
        {
            'title': 'Тип переменной',
            'description': 'Создай переменную x = 42 и выведи её тип через type().',
            'starter_code': '# создай переменную и выведи тип\n',
            'test_cases': [{'input': '', 'expected_output': "<class 'int'>"}],
        },
        {
            'title': 'Конкатенация строк',
            'description': 'Введи имя пользователя и выведи "Привет, <имя>!".',
            'starter_code': 'name = input()\n# выведи приветствие\n',
            'test_cases': [{'input': 'Иван\n', 'expected_output': 'Привет, Иван!'}],
        },
    ],
    'Основы': [
        {
            'title': 'Чётное или нечётное',
            'description': 'Введи число. Выведи "even" если чётное, "odd" если нечётное.',
            'starter_code': 'n = int(input())\n',
            'test_cases': [
                {'input': '4\n', 'expected_output': 'even'},
                {'input': '7\n', 'expected_output': 'odd'},
            ],
        },
        {
            'title': 'Максимум из двух',
            'description': 'Введи два числа и выведи большее из них.',
            'starter_code': 'a = int(input())\nb = int(input())\n',
            'test_cases': [{'input': '3\n7\n', 'expected_output': '7'}],
        },
        {
            'title': 'Площадь прямоугольника',
            'description': 'Введи ширину и высоту прямоугольника. Выведи его площадь.',
            'starter_code': 'w = int(input())\nh = int(input())\n',
            'test_cases': [{'input': '4\n5\n', 'expected_output': '20'}],
        },
        {
            'title': 'Перевод температуры',
            'description': 'Введи температуру в Цельсиях. Выведи её в Фаренгейтах (F = C * 9/5 + 32).',
            'starter_code': 'c = float(input())\n',
            'test_cases': [{'input': '0\n', 'expected_output': '32.0'}],
        },
        {
            'title': 'Абсолютное значение',
            'description': 'Введи число. Выведи его абсолютное значение без использования abs().',
            'starter_code': 'n = int(input())\n',
            'test_cases': [
                {'input': '-5\n', 'expected_output': '5'},
                {'input': '3\n', 'expected_output': '3'},
            ],
        },
    ],
    'Циклы': [
        {
            'title': 'Сумма от 1 до N',
            'description': 'Введи N. Выведи сумму чисел от 1 до N включительно.',
            'starter_code': 'n = int(input())\n',
            'test_cases': [{'input': '5\n', 'expected_output': '15'}],
        },
        {
            'title': 'Таблица умножения',
            'description': 'Введи число N. Выведи таблицу умножения на N от 1 до 10.',
            'starter_code': 'n = int(input())\n',
            'test_cases': [
                {'input': '2\n', 'expected_output': '2\n4\n6\n8\n10\n12\n14\n16\n18\n20'},
            ],
        },
        {
            'title': 'Факториал',
            'description': 'Введи N. Выведи N! (факториал).',
            'starter_code': 'n = int(input())\n',
            'test_cases': [{'input': '5\n', 'expected_output': '120'}],
        },
        {
            'title': 'Числа Фибоначчи',
            'description': 'Введи N. Выведи первые N чисел Фибоначчи через пробел.',
            'starter_code': 'n = int(input())\n',
            'test_cases': [{'input': '7\n', 'expected_output': '0 1 1 2 3 5 8'}],
        },
        {
            'title': 'Подсчёт цифр',
            'description': 'Введи натуральное число. Выведи количество его цифр.',
            'starter_code': 'n = input()\n',
            'test_cases': [{'input': '12345\n', 'expected_output': '5'}],
        },
    ],
}

REFERENCE_DATA = [
    {
        'title': 'Встроенные функции',
        'order': 1,
        'articles': [
            {
                'title': 'print() и input()',
                'order': 1,
                'content': {'text': 'print() выводит данные. input() считывает строку с клавиатуры.'},
            },
            {
                'title': 'len(), type(), range()',
                'order': 2,
                'content': {'text': 'len() — длина объекта. type() — тип. range() — последовательность чисел.'},
            },
            {
                'title': 'int(), float(), str()',
                'order': 3,
                'content': {'text': 'Функции преобразования типов данных.'},
            },
        ],
    },
    {
        'title': 'Операторы',
        'order': 2,
        'articles': [
            {
                'title': 'Арифметические операторы',
                'order': 1,
                'content': {'text': '+, -, *, /, //, %, ** — основные арифметические операции.'},
            },
            {
                'title': 'Операторы сравнения',
                'order': 2,
                'content': {'text': '==, !=, <, >, <=, >= — сравнение значений.'},
            },
        ],
    },
]


class Command(BaseCommand):
    help = 'Заполняет базу данных тестовыми данными для разработки'

    def handle(self, *args, **options):
        self.stdout.write('=== Начинаем заполнение базы данных ===')

        self._seed_achievements()
        themes = self._seed_themes()
        self._seed_lessons(themes)
        self._seed_tasks(themes)
        self._seed_reference()
        self._seed_test_user()

        self.stdout.write(self.style.SUCCESS('=== Готово! База заполнена. ==='))

    def _seed_achievements(self):
        from achievements.models import Achievement
        for level, name, color in ACHIEVEMENTS_DATA:
            obj, created = Achievement.objects.get_or_create(
                level=level,
                defaults={'name': name, 'color': color},
            )
            action = 'Создана' if created else 'Уже есть'
            self.stdout.write(f'  {action}: Ачивка "{name}" (уровень {level})')

    def _seed_themes(self):
        from lessons.models import Theme
        themes = {}
        for order, title, description in THEMES_DATA:
            obj, created = Theme.objects.get_or_create(
                order=order,
                defaults={'title': title, 'description': description},
            )
            themes[title] = obj
            action = 'Создана' if created else 'Уже есть'
            self.stdout.write(f'  {action}: Тема "{title}"')
        return themes

    def _seed_lessons(self, themes):
        from lessons.models import Lesson
        for theme_title, theme in themes.items():
            for i, (title, lesson_type, xp, stars, starter_code, test_cases) in enumerate(LESSONS_TEMPLATE, start=1):
                full_title = f'{title} — {theme_title}'
                obj, created = Lesson.objects.get_or_create(
                    theme=theme,
                    order=i,
                    defaults={
                        'title': full_title,
                        'lesson_type': lesson_type,
                        'content': {'text': f'Это содержимое урока "{full_title}" (заглушка для разработки)'},
                        'starter_code': starter_code,
                        'test_cases': test_cases,
                        'xp_reward': xp,
                        'stars_reward': stars,
                    },
                )
                action = 'Создан' if created else 'Уже есть'
                self.stdout.write(f'    {action}: Урок "{full_title}"')

    def _seed_tasks(self, themes):
        from tasks.models import Task
        for theme_title, tasks in TASKS_DATA.items():
            theme = themes.get(theme_title)
            if not theme:
                continue
            for task_data in tasks:
                obj, created = Task.objects.get_or_create(
                    theme=theme,
                    title=task_data['title'],
                    defaults={
                        'description': task_data['description'],
                        'starter_code': task_data['starter_code'],
                        'test_cases': task_data['test_cases'],
                        'is_pregenerated': True,
                    },
                )
                action = 'Создано' if created else 'Уже есть'
                self.stdout.write(f'    {action}: Задание "{task_data["title"]}"')

    def _seed_reference(self):
        from content.models import ReferenceCategory, ReferenceArticle
        for cat_data in REFERENCE_DATA:
            cat, created = ReferenceCategory.objects.get_or_create(
                title=cat_data['title'],
                defaults={'order': cat_data['order']},
            )
            action = 'Создана' if created else 'Уже есть'
            self.stdout.write(f'  {action}: Категория "{cat_data["title"]}"')

            for art_data in cat_data['articles']:
                art, created = ReferenceArticle.objects.get_or_create(
                    category=cat,
                    title=art_data['title'],
                    defaults={
                        'order': art_data['order'],
                        'content': art_data['content'],
                    },
                )
                action = 'Создана' if created else 'Уже есть'
                self.stdout.write(f'    {action}: Статья "{art_data["title"]}"')

    def _seed_test_user(self):
        email = 'test@pygen.ru'
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': 'Тест',
                'last_name': 'Тестов',
            },
        )
        if created:
            user.set_password('testpass123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'  Создан тестовый пользователь: {email} / testpass123'))
        else:
            self.stdout.write(f'  Тестовый пользователь уже есть: {email}')
