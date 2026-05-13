from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


ACHIEVEMENTS_DATA = [
    (10, 'Новичок',       '#FFDB3A'),
    (20, 'Ученик',        '#FF9F43'),
    (30, 'Знаток',        '#FF6B6B'),
    (40, 'Эксперт',       '#A29BFE'),
    (50, 'Мастер',        '#6C5CE7'),
    (60, 'Гуру',          '#00CEC9'),
    (70, 'Легенда',       '#00B894'),
    (80, 'Чемпион',       '#0984E3'),
    (90, 'Король Python', '#E17055'),
]

THEMES_DATA = [
    (1, 'Введение',  'Знакомство с Python и средой разработки'),
    (2, 'Основы',    'Переменные, типы данных, операторы'),
    (3, 'Циклы',     'For, while, управление циклами'),
]

# --------------------------------------------------------------------------
# Контент уроков: (title, lesson_type, order, xp, stars, starter_code,
#                  test_cases, content)
# --------------------------------------------------------------------------

LESSONS_DATA = {
    'Введение': [
        {
            'title': 'Коротко о Python',
            'lesson_type': 'theory',
            'order': 1,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'markdown': (
                    "# Урок 1. Коротко о Python\n\n"
                    "Python — это **интерпретируемый** язык программирования высокого уровня, "
                    "созданный Гвидо ван Россумом в 1991 году.\n\n"
                    "## Что такое языки программирования?\n\n"
                    "Компьютер понимает только нули и единицы, поэтому нам нужен посредник — "
                    "язык программирования. Python — один из самых простых и популярных.\n\n"
                    "## Первая программа\n\n"
                    "Напишем классическую первую программу:\n\n"
                    "```python\n"
                    "print(\"Привет, мир!\")\n"
                    "```\n\n"
                    "Функция `print()` выводит текст на экран. Всё просто!\n\n"
                    "> **Важно:** Python чувствителен к регистру. `Print` и `print` — разные слова. "
                    "Всегда используй строчные буквы для встроенных функций.\n\n"
                    "## Почему Python?\n\n"
                    "- **Простой синтаксис** — код читается почти как английский текст\n"
                    "- **Универсальный** — подходит для веб, аналитики, машинного обучения\n"
                    "- **Огромное сообщество** — всегда найдёшь ответ на любой вопрос\n\n"
                    "В следующем уроке ты напишешь свою первую программу в редакторе кода."
                ),
            },
        },
        {
            'title': 'Первая программа',
            'lesson_type': 'practice',
            'order': 2,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': '# Напиши свой код здесь\n',
            'test_cases': [
                {'input': '', 'expected_output': 'Hello, World!'},
            ],
            'content': {
                'markdown': (
                    "# Практика: Первая программа\n\n"
                    "Выведи на экран строку `Hello, World!`\n\n"
                    "**Подсказка:** используй функцию `print()` и передай ей текст в кавычках."
                ),
            },
        },
        {
            'title': 'Ввод данных от пользователя',
            'lesson_type': 'theory',
            'order': 3,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'markdown': (
                    "# Урок 3. Ввод данных от пользователя\n\n"
                    "Программа становится полезной, когда она умеет общаться с пользователем. "
                    "Для этого в Python есть функция `input()`.\n\n"
                    "## Как работает input()\n\n"
                    "```python\n"
                    "name = input(\"Как тебя зовут? \")\n"
                    "print(\"Привет,\", name)\n"
                    "```\n\n"
                    "`input()` приостанавливает программу и ждёт, пока пользователь что-то введёт "
                    "и нажмёт Enter. Введённое значение всегда является **строкой** (`str`).\n\n"
                    "## Преобразование типов\n\n"
                    "Чтобы работать с числами, нужно преобразовать строку:\n\n"
                    "```python\n"
                    "age = int(input(\"Сколько тебе лет? \"))\n"
                    "print(\"Через 10 лет тебе будет\", age + 10)\n"
                    "```\n\n"
                    "> **Важно:** Если пользователь введёт не число, а буквы — программа выдаст ошибку. "
                    "Обработку ошибок мы разберём в следующих темах.\n\n"
                    "## Функции преобразования\n\n"
                    "| Функция | Что делает |\n"
                    "|---------|------------|\n"
                    "| `int(x)` | Преобразует в целое число |\n"
                    "| `float(x)` | Преобразует в дробное число |\n"
                    "| `str(x)` | Преобразует в строку |"
                ),
            },
        },
        {
            'title': 'Работа с вводом',
            'lesson_type': 'practice',
            'order': 4,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': 'name = input()\n# выведи приветствие\n',
            'test_cases': [
                {'input': 'Иван\n', 'expected_output': 'Привет, Иван!'},
            ],
            'content': {
                'markdown': (
                    "# Практика: Работа с вводом\n\n"
                    "Прочитай имя пользователя и выведи приветствие в формате:\n\n"
                    "```\n"
                    "Привет, Иван!\n"
                    "```\n\n"
                    "**Подсказка:** используй конкатенацию строк или f-строку: `f\"Привет, {name}!\"`"
                ),
            },
        },
    ],

    'Основы': [
        {
            'title': 'Переменные и типы данных',
            'lesson_type': 'theory',
            'order': 1,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'markdown': (
                    "# Урок 1. Переменные и типы данных\n\n"
                    "Переменная — это именованная ячейка памяти, в которой хранится значение. "
                    "В Python создать переменную очень просто:\n\n"
                    "```python\n"
                    "name = \"Алиса\"\n"
                    "age = 25\n"
                    "height = 1.68\n"
                    "is_student = True\n"
                    "```\n\n"
                    "## Основные типы данных\n\n"
                    "| Тип | Пример | Описание |\n"
                    "|-----|--------|----------|\n"
                    "| `str` | `\"привет\"` | Строка текста |\n"
                    "| `int` | `42` | Целое число |\n"
                    "| `float` | `3.14` | Дробное число |\n"
                    "| `bool` | `True` | Истина или ложь |\n\n"
                    "## Арифметические операции\n\n"
                    "```python\n"
                    "a = 10\n"
                    "b = 3\n"
                    "print(a + b)   # 13\n"
                    "print(a - b)   # 7\n"
                    "print(a * b)   # 30\n"
                    "print(a / b)   # 3.333...\n"
                    "print(a // b)  # 3  (целочисленное деление)\n"
                    "print(a % b)   # 1  (остаток от деления)\n"
                    "print(a ** b)  # 1000 (возведение в степень)\n"
                    "```\n\n"
                    "> **Важно:** В Python не нужно объявлять тип переменной заранее. "
                    "Python определяет его автоматически — это называется **динамическая типизация**."
                ),
            },
        },
        {
            'title': 'Операции с числами',
            'lesson_type': 'practice',
            'order': 2,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': 'w = int(input())\nh = int(input())\n# вычисли и выведи площадь\n',
            'test_cases': [
                {'input': '4\n5\n', 'expected_output': '20'},
                {'input': '7\n3\n', 'expected_output': '21'},
            ],
            'content': {
                'markdown': (
                    "# Практика: Площадь прямоугольника\n\n"
                    "Введи ширину и высоту прямоугольника (каждое число на отдельной строке). "
                    "Выведи его площадь.\n\n"
                    "**Пример:**\n"
                    "```\n"
                    "Ввод: 4\n"
                    "      5\n"
                    "Вывод: 20\n"
                    "```\n\n"
                    "**Подсказка:** площадь = ширина × высота"
                ),
            },
        },
        {
            'title': 'Условные операторы',
            'lesson_type': 'theory',
            'order': 3,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'markdown': (
                    "# Урок 3. Условные операторы\n\n"
                    "Условные операторы позволяют программе принимать решения в зависимости от данных.\n\n"
                    "## Синтаксис if-elif-else\n\n"
                    "```python\n"
                    "age = int(input())\n\n"
                    "if age < 18:\n"
                    "    print(\"Несовершеннолетний\")\n"
                    "elif age < 65:\n"
                    "    print(\"Взрослый\")\n"
                    "else:\n"
                    "    print(\"Пенсионер\")\n"
                    "```\n\n"
                    "## Операторы сравнения\n\n"
                    "| Оператор | Значение |\n"
                    "|----------|----------|\n"
                    "| `==` | Равно |\n"
                    "| `!=` | Не равно |\n"
                    "| `<` / `>` | Меньше / Больше |\n"
                    "| `<=` / `>=` | Меньше или равно / Больше или равно |\n\n"
                    "## Логические операторы\n\n"
                    "```python\n"
                    "x = 15\n"
                    "if x > 10 and x < 20:\n"
                    "    print(\"x от 10 до 20\")\n\n"
                    "if x < 0 or x > 100:\n"
                    "    print(\"x вне диапазона 0-100\")\n"
                    "```\n\n"
                    "> **Важно:** В Python блоки кода выделяются **отступами** (4 пробела или Tab), "
                    "а не фигурными скобками, как в других языках."
                ),
            },
        },
        {
            'title': 'Чётное или нечётное',
            'lesson_type': 'practice',
            'order': 4,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': 'n = int(input())\n# выведи even или odd\n',
            'test_cases': [
                {'input': '4\n', 'expected_output': 'even'},
                {'input': '7\n', 'expected_output': 'odd'},
            ],
            'content': {
                'markdown': (
                    "# Практика: Чётное или нечётное\n\n"
                    "Введи целое число. Выведи `even` если оно чётное, `odd` если нечётное.\n\n"
                    "**Пример:**\n"
                    "```\n"
                    "Ввод: 4  → Вывод: even\n"
                    "Ввод: 7  → Вывод: odd\n"
                    "```\n\n"
                    "**Подсказка:** используй оператор `%` (остаток от деления).\n"
                    "Число чётное, если `n % 2 == 0`."
                ),
            },
        },
    ],

    'Циклы': [
        {
            'title': 'Цикл for и range()',
            'lesson_type': 'theory',
            'order': 1,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'markdown': (
                    "# Урок 1. Цикл for и range()\n\n"
                    "Цикл — это способ повторить действие много раз без копирования кода. "
                    "`for` — самый частый цикл в Python.\n\n"
                    "## Синтаксис\n\n"
                    "```python\n"
                    "for i in range(5):\n"
                    "    print(i)\n"
                    "# Выведет: 0 1 2 3 4\n"
                    "```\n\n"
                    "## Функция range()\n\n"
                    "```python\n"
                    "range(5)        # 0, 1, 2, 3, 4\n"
                    "range(2, 7)     # 2, 3, 4, 5, 6\n"
                    "range(0, 10, 2) # 0, 2, 4, 6, 8 (с шагом 2)\n"
                    "```\n\n"
                    "## Практический пример\n\n"
                    "```python\n"
                    "# Сумма чисел от 1 до 10\n"
                    "total = 0\n"
                    "for i in range(1, 11):\n"
                    "    total += i\n"
                    "print(total)  # 55\n"
                    "```\n\n"
                    "> **Важно:** `range(n)` генерирует числа от `0` до `n-1`, а НЕ до `n`. "
                    "Чтобы включить `n`, используй `range(1, n+1)`."
                ),
            },
        },
        {
            'title': 'Сумма от 1 до N',
            'lesson_type': 'practice',
            'order': 2,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': 'n = int(input())\n# вычисли и выведи сумму\n',
            'test_cases': [
                {'input': '5\n', 'expected_output': '15'},
                {'input': '10\n', 'expected_output': '55'},
            ],
            'content': {
                'markdown': (
                    "# Практика: Сумма от 1 до N\n\n"
                    "Введи число N. Выведи сумму всех целых чисел от 1 до N включительно.\n\n"
                    "**Пример:**\n"
                    "```\n"
                    "Ввод: 5  → Вывод: 15  (1+2+3+4+5)\n"
                    "Ввод: 10 → Вывод: 55\n"
                    "```\n\n"
                    "**Подсказка:** создай переменную `total = 0` и в цикле `for` добавляй к ней каждое число."
                ),
            },
        },
        {
            'title': 'Цикл while и управление циклом',
            'lesson_type': 'theory',
            'order': 3,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'markdown': (
                    "# Урок 3. Цикл while и управление циклом\n\n"
                    "Цикл `while` повторяет блок кода, пока условие истинно.\n\n"
                    "## Синтаксис\n\n"
                    "```python\n"
                    "count = 0\n"
                    "while count < 5:\n"
                    "    print(count)\n"
                    "    count += 1\n"
                    "# Выведет: 0 1 2 3 4\n"
                    "```\n\n"
                    "## break и continue\n\n"
                    "```python\n"
                    "# break — выход из цикла\n"
                    "for i in range(10):\n"
                    "    if i == 5:\n"
                    "        break\n"
                    "    print(i)  # 0 1 2 3 4\n\n"
                    "# continue — пропуск итерации\n"
                    "for i in range(5):\n"
                    "    if i == 2:\n"
                    "        continue\n"
                    "    print(i)  # 0 1 3 4\n"
                    "```\n\n"
                    "## Когда использовать while вместо for?\n\n"
                    "Используй `while`, когда заранее не знаешь, сколько итераций нужно:\n\n"
                    "```python\n"
                    "# Спрашивать пока не введут правильный ответ\n"
                    "answer = ''\n"
                    "while answer != 'да':\n"
                    "    answer = input(\"Ты согласен? \")\n"
                    "print(\"Отлично!\")\n"
                    "```\n\n"
                    "> **Важно:** Убедись, что условие цикла `while` рано или поздно станет ложным. "
                    "Иначе получится **бесконечный цикл** и программа зависнет."
                ),
            },
        },
        {
            'title': 'Таблица умножения',
            'lesson_type': 'practice',
            'order': 4,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': 'n = int(input())\n# выведи таблицу умножения\n',
            'test_cases': [
                {'input': '2\n', 'expected_output': '2\n4\n6\n8\n10\n12\n14\n16\n18\n20'},
                {'input': '3\n', 'expected_output': '3\n6\n9\n12\n15\n18\n21\n24\n27\n30'},
            ],
            'content': {
                'markdown': (
                    "# Практика: Таблица умножения\n\n"
                    "Введи число N. Выведи таблицу умножения на N от 1 до 10 — "
                    "каждый результат на отдельной строке.\n\n"
                    "**Пример для N=2:**\n"
                    "```\n"
                    "2\n4\n6\n8\n10\n12\n14\n16\n18\n20\n"
                    "```\n\n"
                    "**Подсказка:** используй `for i in range(1, 11)` и выводи `n * i`."
                ),
            },
        },
    ],
}

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
            'title': 'Максимум из двух',
            'description': 'Введи два числа и выведи большее из них.',
            'starter_code': 'a = int(input())\nb = int(input())\n',
            'test_cases': [{'input': '3\n7\n', 'expected_output': '7'}],
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
        {
            'title': 'Перевод температуры',
            'description': 'Введи температуру в Цельсиях. Выведи в Фаренгейтах (F = C * 9/5 + 32).',
            'starter_code': 'c = float(input())\n',
            'test_cases': [{'input': '0\n', 'expected_output': '32.0'}],
        },
        {
            'title': 'Знак числа',
            'description': 'Введи число. Выведи "positive", "negative" или "zero".',
            'starter_code': 'n = int(input())\n',
            'test_cases': [
                {'input': '5\n', 'expected_output': 'positive'},
                {'input': '-3\n', 'expected_output': 'negative'},
                {'input': '0\n', 'expected_output': 'zero'},
            ],
        },
        {
            'title': 'Минимум из трёх',
            'description': 'Введи три числа (каждое на отдельной строке). Выведи наименьшее.',
            'starter_code': 'a = int(input())\nb = int(input())\nc = int(input())\n',
            'test_cases': [{'input': '5\n2\n8\n', 'expected_output': '2'}],
        },
    ],
    'Циклы': [
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
        {
            'title': 'Степень двойки',
            'description': 'Введи N. Выведи все степени двойки от 2^0 до 2^N включительно.',
            'starter_code': 'n = int(input())\n',
            'test_cases': [{'input': '4\n', 'expected_output': '1\n2\n4\n8\n16'}],
        },
        {
            'title': 'Реверс числа',
            'description': 'Введи натуральное число. Выведи его цифры в обратном порядке.',
            'starter_code': 'n = input()\n',
            'test_cases': [{'input': '12345\n', 'expected_output': '54321'}],
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
            lessons_for_theme = LESSONS_DATA.get(theme_title, [])
            for lesson_data in lessons_for_theme:
                obj, created = Lesson.objects.get_or_create(
                    theme=theme,
                    order=lesson_data['order'],
                    defaults={
                        'title': lesson_data['title'],
                        'lesson_type': lesson_data['lesson_type'],
                        'content': lesson_data['content'],
                        'starter_code': lesson_data['starter_code'],
                        'test_cases': lesson_data['test_cases'],
                        'xp_reward': lesson_data['xp_reward'],
                        'stars_reward': lesson_data['stars_reward'],
                    },
                )
                if not created:
                    # Обновляем контент если запись уже есть
                    obj.title = lesson_data['title']
                    obj.lesson_type = lesson_data['lesson_type']
                    obj.content = lesson_data['content']
                    obj.starter_code = lesson_data['starter_code']
                    obj.test_cases = lesson_data['test_cases']
                    obj.xp_reward = lesson_data['xp_reward']
                    obj.stars_reward = lesson_data['stars_reward']
                    obj.save()
                action = 'Создан' if created else 'Обновлён'
                self.stdout.write(f'    {action}: Урок "{lesson_data["title"]}"')

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
