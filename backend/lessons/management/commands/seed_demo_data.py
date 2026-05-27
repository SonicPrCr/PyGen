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
# Контент уроков в формате TipTap JSON
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 1. Коротко о Python'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Python — это '},
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'интерпретируемый'},
                            {'type': 'text', 'text': ' язык программирования высокого уровня, созданный Гвидо ван Россумом в 1991 году.'},
                        ],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Что такое языки программирования?'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Компьютер понимает только нули и единицы, поэтому нам нужен посредник — язык программирования. Python — один из самых простых и популярных.'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Первая программа'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Напишем классическую первую программу:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'print("Привет, мир!")'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Функция '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'print()'},
                            {'type': 'text', 'text': ' выводит текст на экран. Всё просто!'},
                        ],
                    },
                    {
                        'type': 'blockquote',
                        'content': [{
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Важно: '},
                                {'type': 'text', 'text': 'Python чувствителен к регистру. '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'Print'},
                                {'type': 'text', 'text': ' и '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'print'},
                                {'type': 'text', 'text': ' — разные слова. Всегда используй строчные буквы для встроенных функций.'},
                            ],
                        }],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Почему Python?'}],
                    },
                    {
                        'type': 'bulletList',
                        'content': [
                            {'type': 'listItem', 'content': [{'type': 'paragraph', 'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Простой синтаксис'},
                                {'type': 'text', 'text': ' — код читается почти как английский текст'},
                            ]}]},
                            {'type': 'listItem', 'content': [{'type': 'paragraph', 'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Универсальный'},
                                {'type': 'text', 'text': ' — подходит для веб, аналитики, машинного обучения'},
                            ]}]},
                            {'type': 'listItem', 'content': [{'type': 'paragraph', 'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Огромное сообщество'},
                                {'type': 'text', 'text': ' — всегда найдёшь ответ на любой вопрос'},
                            ]}]},
                        ],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'В следующем уроке ты напишешь свою первую программу в редакторе кода.'}],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: Первая программа'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Выведи на экран строку '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'Hello, World!'},
                        ],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'используй функцию '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'print()'},
                            {'type': 'text', 'text': ' и передай ей текст в кавычках.'},
                        ],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 3. Ввод данных от пользователя'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Программа становится полезной, когда она умеет общаться с пользователем. Для этого в Python есть функция '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'input()'},
                            {'type': 'text', 'text': '.'},
                        ],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Как работает input()'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'name = input("Как тебя зовут? ")\nprint("Привет,", name)'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'input()'},
                            {'type': 'text', 'text': ' приостанавливает программу и ждёт, пока пользователь что-то введёт и нажмёт Enter. Введённое значение всегда является '},
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'строкой'},
                            {'type': 'text', 'text': ' ('},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'str'},
                            {'type': 'text', 'text': ').'},
                        ],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Преобразование типов'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Чтобы работать с числами, нужно преобразовать строку:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'age = int(input("Сколько тебе лет? "))\nprint("Через 10 лет тебе будет", age + 10)'}],
                    },
                    {
                        'type': 'blockquote',
                        'content': [{
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Важно: '},
                                {'type': 'text', 'text': 'Если пользователь введёт не число, а буквы — программа выдаст ошибку. Обработку ошибок мы разберём в следующих темах.'},
                            ],
                        }],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Функции преобразования'}],
                    },
                    {
                        'type': 'table',
                        'content': [
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Функция'}]}]},
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Что делает'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'int(x)'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Преобразует в целое число'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'float(x)'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Преобразует в дробное число'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'str(x)'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Преобразует в строку'}]}]},
                            ]},
                        ],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: Работа с вводом'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Прочитай имя пользователя и выведи приветствие в формате:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'Привет, Иван!'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'используй конкатенацию строк или f-строку: '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'f"Привет, {name}!"'},
                        ],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 1. Переменные и типы данных'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Переменная — это именованная ячейка памяти, в которой хранится значение. В Python создать переменную очень просто:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'name = "Алиса"\nage = 25\nheight = 1.68\nis_student = True'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Основные типы данных'}],
                    },
                    {
                        'type': 'table',
                        'content': [
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Тип'}]}]},
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Пример'}]}]},
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Описание'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'str'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '"привет"'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Строка текста'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'int'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '42'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Целое число'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'float'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '3.14'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Дробное число'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'bool'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'True'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Истина или ложь'}]}]},
                            ]},
                        ],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Арифметические операции'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'a = 10\nb = 3\nprint(a + b)   # 13\nprint(a - b)   # 7\nprint(a * b)   # 30\nprint(a / b)   # 3.333...\nprint(a // b)  # 3  (целочисленное деление)\nprint(a % b)   # 1  (остаток от деления)\nprint(a ** b)  # 1000 (возведение в степень)'}],
                    },
                    {
                        'type': 'blockquote',
                        'content': [{
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Важно: '},
                                {'type': 'text', 'text': 'В Python не нужно объявлять тип переменной заранее. Python определяет его автоматически — это называется '},
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'динамическая типизация'},
                                {'type': 'text', 'text': '.'},
                            ],
                        }],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: Площадь прямоугольника'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Введи ширину и высоту прямоугольника (каждое число на отдельной строке). Выведи его площадь.'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Пример:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'Ввод:\n4\n5\nВывод: 20'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'площадь = ширина × высота'},
                        ],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 3. Условные операторы'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Условные операторы позволяют программе принимать решения в зависимости от данных.'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Синтаксис if-elif-else'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'age = int(input())\n\nif age < 18:\n    print("Несовершеннолетний")\nelif age < 65:\n    print("Взрослый")\nelse:\n    print("Пенсионер")'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Операторы сравнения'}],
                    },
                    {
                        'type': 'table',
                        'content': [
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Оператор'}]}]},
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Значение'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '=='}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Равно'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '!='}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Не равно'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '< / >'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Меньше / Больше'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '<= / >='}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Меньше или равно / Больше или равно'}]}]},
                            ]},
                        ],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Логические операторы'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'x = 15\nif x > 10 and x < 20:\n    print("x от 10 до 20")\n\nif x < 0 or x > 100:\n    print("x вне диапазона 0-100")'}],
                    },
                    {
                        'type': 'blockquote',
                        'content': [{
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Важно: '},
                                {'type': 'text', 'text': 'В Python блоки кода выделяются '},
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'отступами'},
                                {'type': 'text', 'text': ' (4 пробела или Tab), а не фигурными скобками, как в других языках.'},
                            ],
                        }],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: Чётное или нечётное'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Введи целое число. Выведи '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'even'},
                            {'type': 'text', 'text': ' если оно чётное, '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'odd'},
                            {'type': 'text', 'text': ' если нечётное.'},
                        ],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Пример:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'Ввод: 4  → Вывод: even\nВвод: 7  → Вывод: odd'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'используй оператор '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': '%'},
                            {'type': 'text', 'text': '. Число чётное, если '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'n % 2 == 0'},
                            {'type': 'text', 'text': '.'},
                        ],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 1. Цикл for и range()'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Цикл — это способ повторить действие много раз без копирования кода. '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'for'},
                            {'type': 'text', 'text': ' — самый частый цикл в Python.'},
                        ],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Синтаксис'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'for i in range(5):\n    print(i)\n# Выведет: 0 1 2 3 4'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Функция range()'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'range(5)        # 0, 1, 2, 3, 4\nrange(2, 7)     # 2, 3, 4, 5, 6\nrange(0, 10, 2) # 0, 2, 4, 6, 8 (с шагом 2)'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Практический пример'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': '# Сумма чисел от 1 до 10\ntotal = 0\nfor i in range(1, 11):\n    total += i\nprint(total)  # 55'}],
                    },
                    {
                        'type': 'blockquote',
                        'content': [{
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Важно: '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'range(n)'},
                                {'type': 'text', 'text': ' генерирует числа от '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': '0'},
                                {'type': 'text', 'text': ' до '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'n-1'},
                                {'type': 'text', 'text': ', а НЕ до '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'n'},
                                {'type': 'text', 'text': '. Чтобы включить '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'n'},
                                {'type': 'text', 'text': ', используй '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'range(1, n+1)'},
                                {'type': 'text', 'text': '.'},
                            ],
                        }],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: Сумма от 1 до N'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Введи число N. Выведи сумму всех целых чисел от 1 до N включительно.'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Пример:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'Ввод: 5  → Вывод: 15  (1+2+3+4+5)\nВвод: 10 → Вывод: 55'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'создай переменную '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'total = 0'},
                            {'type': 'text', 'text': ' и в цикле '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'for'},
                            {'type': 'text', 'text': ' добавляй к ней каждое число.'},
                        ],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 3. Цикл while и управление циклом'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Цикл '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'while'},
                            {'type': 'text', 'text': ' повторяет блок кода, пока условие истинно.'},
                        ],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Синтаксис'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'count = 0\nwhile count < 5:\n    print(count)\n    count += 1\n# Выведет: 0 1 2 3 4'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'break и continue'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': '# break — выход из цикла\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)  # 0 1 2 3 4\n\n# continue — пропуск итерации\nfor i in range(5):\n    if i == 2:\n        continue\n    print(i)  # 0 1 3 4'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Когда использовать while вместо for?'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Используй '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'while'},
                            {'type': 'text', 'text': ', когда заранее не знаешь, сколько итераций нужно:'},
                        ],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': "answer = ''\nwhile answer != 'да':\n    answer = input('Ты согласен? ')\nprint('Отлично!')"}],
                    },
                    {
                        'type': 'blockquote',
                        'content': [{
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Важно: '},
                                {'type': 'text', 'text': 'Убедись, что условие цикла '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'while'},
                                {'type': 'text', 'text': ' рано или поздно станет ложным. Иначе получится '},
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'бесконечный цикл'},
                                {'type': 'text', 'text': ' и программа зависнет.'},
                            ],
                        }],
                    },
                ],
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
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: Таблица умножения'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Введи число N. Выведи таблицу умножения на N от 1 до 10 — каждый результат на отдельной строке.'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Пример для N=2:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': '2\n4\n6\n8\n10\n12\n14\n16\n18\n20'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'используй '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'for i in range(1, 11)'},
                            {'type': 'text', 'text': ' и выводи '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'n * i'},
                            {'type': 'text', 'text': '.'},
                        ],
                    },
                ],
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
                'content': {
                    'type': 'doc',
                    'content': [
                        {
                            'type': 'heading',
                            'attrs': {'level': 2},
                            'content': [{'type': 'text', 'text': 'Функция print()'}],
                        },
                        {
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'text': 'Функция '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'print()'},
                                {'type': 'text', 'text': ' выводит данные на экран. Принимает любое количество аргументов.'},
                            ],
                        },
                        {
                            'type': 'codeBlock',
                            'attrs': {'language': 'python'},
                            'content': [{'type': 'text', 'text': 'print("Привет, мир!")        # Привет, мир!\nprint("a =", 42)             # a = 42\nprint("x:", 1, "y:", 2)      # x: 1 y: 2\nprint("a", "b", sep="-")     # a-b\nprint("строка", end="")      # без переноса строки'}],
                        },
                        {
                            'type': 'heading',
                            'attrs': {'level': 2},
                            'content': [{'type': 'text', 'text': 'Функция input()'}],
                        },
                        {
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'text': 'Функция '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'input()'},
                                {'type': 'text', 'text': ' приостанавливает программу и ожидает ввода пользователя. Возвращает введённую строку.'},
                            ],
                        },
                        {
                            'type': 'codeBlock',
                            'attrs': {'language': 'python'},
                            'content': [{'type': 'text', 'text': 'name = input("Введи имя: ")          # ждёт ввода\nprint("Привет,", name)\n\nage = int(input("Твой возраст: "))   # преобразуем в число'}],
                        },
                        {
                            'type': 'blockquote',
                            'content': [{
                                'type': 'paragraph',
                                'content': [
                                    {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Важно: '},
                                    {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'input()'},
                                    {'type': 'text', 'text': ' всегда возвращает строку. Для работы с числами используй '},
                                    {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'int()'},
                                    {'type': 'text', 'text': ' или '},
                                    {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'float()'},
                                    {'type': 'text', 'text': '.'},
                                ],
                            }],
                        },
                    ],
                },
            },
            {
                'title': 'len(), type(), range()',
                'order': 2,
                'content': {
                    'type': 'doc',
                    'content': [
                        {
                            'type': 'heading',
                            'attrs': {'level': 2},
                            'content': [{'type': 'text', 'text': 'len()'}],
                        },
                        {
                            'type': 'paragraph',
                            'content': [{'type': 'text', 'text': 'Возвращает длину (количество элементов) объекта.'}],
                        },
                        {
                            'type': 'codeBlock',
                            'attrs': {'language': 'python'},
                            'content': [{'type': 'text', 'text': 'len("привет")    # 6\nlen([1, 2, 3])  # 3\nlen((10, 20))   # 2'}],
                        },
                        {
                            'type': 'heading',
                            'attrs': {'level': 2},
                            'content': [{'type': 'text', 'text': 'type()'}],
                        },
                        {
                            'type': 'paragraph',
                            'content': [{'type': 'text', 'text': 'Возвращает тип объекта.'}],
                        },
                        {
                            'type': 'codeBlock',
                            'attrs': {'language': 'python'},
                            'content': [{'type': 'text', 'text': "type(42)        # <class 'int'>\ntype(3.14)      # <class 'float'>\ntype('hello')   # <class 'str'>\ntype(True)      # <class 'bool'>"}],
                        },
                        {
                            'type': 'heading',
                            'attrs': {'level': 2},
                            'content': [{'type': 'text', 'text': 'range()'}],
                        },
                        {
                            'type': 'paragraph',
                            'content': [{'type': 'text', 'text': 'Создаёт последовательность чисел. Часто используется в циклах.'}],
                        },
                        {
                            'type': 'codeBlock',
                            'attrs': {'language': 'python'},
                            'content': [{'type': 'text', 'text': 'range(5)           # 0, 1, 2, 3, 4\nrange(1, 6)        # 1, 2, 3, 4, 5\nrange(0, 10, 2)    # 0, 2, 4, 6, 8\nrange(10, 0, -1)   # 10, 9, ..., 1\n\nfor i in range(3):\n    print(i)  # 0 1 2'}],
                        },
                    ],
                },
            },
            {
                'title': 'int(), float(), str()',
                'order': 3,
                'content': {
                    'type': 'doc',
                    'content': [
                        {
                            'type': 'paragraph',
                            'content': [{'type': 'text', 'text': 'Функции для преобразования (приведения) типов данных в Python.'}],
                        },
                        {
                            'type': 'table',
                            'content': [
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Функция'}]}]},
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Что делает'}]}]},
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Пример'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'int()'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Преобразует в целое число'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'int("42") → 42'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'float()'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Преобразует в дробное число'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'float("3.14") → 3.14'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'str()'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Преобразует в строку'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'str(100) → "100"'}]}]},
                                ]},
                            ],
                        },
                        {
                            'type': 'codeBlock',
                            'attrs': {'language': 'python'},
                            'content': [{'type': 'text', 'text': '# Преобразование при вводе\nn = int(input())          # строка → целое число\nx = float(input())        # строка → дробное число\n\n# Преобразование для вывода\nage = 25\nprint("Мне " + str(age) + " лет")  # Мне 25 лет'}],
                        },
                    ],
                },
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
                'content': {
                    'type': 'doc',
                    'content': [
                        {
                            'type': 'paragraph',
                            'content': [{'type': 'text', 'text': 'Арифметические операторы выполняют математические вычисления над числами.'}],
                        },
                        {
                            'type': 'table',
                            'content': [
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Оператор'}]}]},
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Описание'}]}]},
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Пример'}]}]},
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Результат'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '+'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Сложение'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '5 + 3'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': '8'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '-'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Вычитание'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '5 - 3'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': '2'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '*'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Умножение'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '5 * 3'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': '15'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '/'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Деление'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '7 / 2'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': '3.5'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '//'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Целочисленное деление'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '7 // 2'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': '3'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '%'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Остаток от деления'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '7 % 2'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': '1'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '**'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Возведение в степень'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '2 ** 8'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': '256'}]}]},
                                ]},
                            ],
                        },
                        {
                            'type': 'codeBlock',
                            'attrs': {'language': 'python'},
                            'content': [{'type': 'text', 'text': 'a, b = 10, 3\nprint(a + b)   # 13\nprint(a - b)   # 7\nprint(a * b)   # 30\nprint(a / b)   # 3.3333...\nprint(a // b)  # 3\nprint(a % b)   # 1\nprint(a ** b)  # 1000'}],
                        },
                    ],
                },
            },
            {
                'title': 'Операторы сравнения',
                'order': 2,
                'content': {
                    'type': 'doc',
                    'content': [
                        {
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'text': 'Операторы сравнения используются для сравнения двух значений. Результатом всегда является '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'True'},
                                {'type': 'text', 'text': ' или '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'False'},
                                {'type': 'text', 'text': '.'},
                            ],
                        },
                        {
                            'type': 'table',
                            'content': [
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Оператор'}]}]},
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Описание'}]}]},
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Пример'}]}]},
                                    {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Результат'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '=='}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Равно'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '5 == 5'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'True'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '!='}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Не равно'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '5 != 3'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'True'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '<'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Меньше'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '3 < 5'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'True'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '>'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Больше'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '5 > 3'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'True'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '<='}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Меньше или равно'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '5 <= 5'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'True'}]}]},
                                ]},
                                {'type': 'tableRow', 'content': [
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '>='}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Больше или равно'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '3 >= 5'}]}]},
                                    {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'False'}]}]},
                                ]},
                            ],
                        },
                        {
                            'type': 'codeBlock',
                            'attrs': {'language': 'python'},
                            'content': [{'type': 'text', 'text': 'x = 10\nif x >= 5 and x <= 15:\n    print("x в диапазоне 5-15")\n\nif x != 0:\n    print("x не равен нулю")'}],
                        },
                    ],
                },
            },
        ],
    },
]

# ═══════════════════════════════════════════════════
# ДЕМО-КОНТЕНТ ДЛЯ РУЧНОГО ДОБАВЛЕНИЯ ЧЕРЕЗ TIPTAP
# Используй этот контент на защите диплома чтобы
# показать работу TipTap-конструктора в админке.
# Скопируй нужный JSON в поле content через
# /admin/lessons/new
# ═══════════════════════════════════════════════════

DEMO_CONTENT = {
    'Функции': [
        {
            'title': 'Что такое функции',
            'lesson_type': 'theory',
            'order': 1,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 1. Что такое функции'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Функция — это именованный блок кода, который можно вызывать многократно. Функции позволяют не повторять один и тот же код и делают программу структурированной.'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Определение функции'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'def greet(name):\n    print(f"Привет, {name}!")\n\ngreet("Иван")   # Привет, Иван!\ngreet("Мария")  # Привет, Мария!'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Возврат значения'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Функция может возвращать результат с помощью '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'return'},
                            {'type': 'text', 'text': ':'},
                        ],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'def add(a, b):\n    return a + b\n\nresult = add(3, 5)\nprint(result)  # 8'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Несколько параметров'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'def rectangle_area(width, height):\n    return width * height\n\narea = rectangle_area(4, 6)\nprint(area)  # 24'}],
                    },
                    {
                        'type': 'blockquote',
                        'content': [{
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Важно: '},
                                {'type': 'text', 'text': 'функцию нужно определить (написать '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'def'},
                                {'type': 'text', 'text': ') до того, как её вызывать. Иначе Python выдаст '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'NameError'},
                                {'type': 'text', 'text': '.'},
                            ],
                        }],
                    },
                ],
            },
        },
        {
            'title': 'Функция возведения в степень',
            'lesson_type': 'practice',
            'order': 2,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': 'def power(base, exp):\n    # вычисли base в степени exp без оператора **\n    pass\n\nprint(power(int(input()), int(input())))\n',
            'test_cases': [
                {'input': '2\n10\n', 'expected_output': '1024'},
                {'input': '3\n3\n', 'expected_output': '27'},
            ],
            'content': {
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: Функция возведения в степень'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Напиши функцию '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'power(base, exp)'},
                            {'type': 'text', 'text': ', которая возвращает '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'base'},
                            {'type': 'text', 'text': ' в степени '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'exp'},
                            {'type': 'text', 'text': ' без использования оператора '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': '**'},
                            {'type': 'text', 'text': '.'},
                        ],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Пример:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'power(2, 10) → 1024\npower(3, 3)  → 27'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'используй цикл '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'for'},
                            {'type': 'text', 'text': ' и умножай результат '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'exp'},
                            {'type': 'text', 'text': ' раз.'},
                        ],
                    },
                ],
            },
        },
        {
            'title': 'Аргументы по умолчанию',
            'lesson_type': 'theory',
            'order': 3,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 3. Аргументы по умолчанию'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Python позволяет задавать значения аргументов по умолчанию — тогда при вызове функции их можно не передавать.'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Параметры по умолчанию'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'def greet(name, greeting="Привет"):\n    print(f"{greeting}, {name}!")\n\ngreet("Иван")                   # Привет, Иван!\ngreet("Мария", "Здравствуй")    # Здравствуй, Мария!'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': '*args — произвольное число аргументов'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'def total(*args):\n    return sum(args)\n\nprint(total(1, 2, 3))         # 6\nprint(total(10, 20, 30, 40))  # 100'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': '**kwargs — именованные аргументы'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'def show_info(**kwargs):\n    for key, value in kwargs.items():\n        print(f"{key}: {value}")\n\nshow_info(name="Иван", age=25, city="Москва")\n# name: Иван\n# age: 25\n# city: Москва'}],
                    },
                    {
                        'type': 'blockquote',
                        'content': [{
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Порядок параметров: '},
                                {'type': 'text', 'text': 'сначала обязательные, затем со значениями по умолчанию, потом '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': '*args'},
                                {'type': 'text', 'text': ', и в конце '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': '**kwargs'},
                                {'type': 'text', 'text': '.'},
                            ],
                        }],
                    },
                ],
            },
        },
        {
            'title': 'Функция с параметром по умолчанию',
            'lesson_type': 'practice',
            'order': 4,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': 'def repeat(text, times=2):\n    # выведи text указанное количество раз\n    pass\n\nrepeat(input(), int(input()))\n',
            'test_cases': [
                {'input': 'hello\n3\n', 'expected_output': 'hello\nhello\nhello'},
                {'input': 'py\n2\n', 'expected_output': 'py\npy'},
            ],
            'content': {
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: Повторение строки'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'text': 'Напиши функцию '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'repeat(text, times=2)'},
                            {'type': 'text', 'text': ', которая выводит строку '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'text'},
                            {'type': 'text', 'text': ' ровно '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'times'},
                            {'type': 'text', 'text': ' раз — каждый раз на новой строке.'},
                        ],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Пример:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'repeat("hello", 3)\n# hello\n# hello\n# hello'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'используй цикл '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'for _ in range(times)'},
                            {'type': 'text', 'text': '.'},
                        ],
                    },
                ],
            },
        },
    ],

    'Строки': [
        {
            'title': 'Работа со строками',
            'lesson_type': 'theory',
            'order': 1,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 1. Работа со строками'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Строка — это последовательность символов. Python предоставляет множество встроенных методов для работы со строками.'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Срезы строк'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 's = "Python"\nprint(s[0])      # P  (первый символ)\nprint(s[-1])     # n  (последний символ)\nprint(s[1:4])    # yth (срез с 1 по 3)\nprint(s[:3])     # Pyt\nprint(s[3:])     # hon\nprint(s[::-1])   # nohtyP (разворот)'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Основные методы строк'}],
                    },
                    {
                        'type': 'table',
                        'content': [
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Метод'}]}]},
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Что делает'}]}]},
                                {'type': 'tableHeader', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Пример'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'upper()'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'В верхний регистр'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '"hi".upper() → "HI"'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'lower()'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'В нижний регистр'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '"HI".lower() → "hi"'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'strip()'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Убирает пробелы по краям'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '" hi ".strip() → "hi"'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'split()'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Разбивает строку на список'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '"a b c".split() → ["a","b","c"]'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'join()'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Объединяет список в строку'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '"-".join(["a","b"]) → "a-b"'}]}]},
                            ]},
                            {'type': 'tableRow', 'content': [
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': 'replace()'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': 'Заменяет подстроку'}]}]},
                                {'type': 'tableCell', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'marks': [{'type': 'code'}], 'text': '"abc".replace("b","X") → "aXc"'}]}]},
                            ]},
                        ],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 's = "  Hello, World!  "\nprint(s.strip())           # "Hello, World!"\nprint(s.strip().lower())   # "hello, world!"\nwords = s.strip().split(", ")\nprint(words)               # ["Hello", "World!"]'}],
                    },
                ],
            },
        },
        {
            'title': 'Методы строк',
            'lesson_type': 'practice',
            'order': 2,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': 's = input()\n# выведи строку наоборот в верхнем регистре\n',
            'test_cases': [
                {'input': 'hello\n', 'expected_output': 'OLLEH'},
                {'input': 'python\n', 'expected_output': 'NOHTYP'},
            ],
            'content': {
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: Разворот строки'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Прочитай строку, разверни её и выведи в верхнем регистре.'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Пример:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'Ввод: hello  → Вывод: OLLEH\nВвод: python → Вывод: NOHTYP'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'срез '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 's[::-1]'},
                            {'type': 'text', 'text': ' разворачивает строку, метод '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': '.upper()'},
                            {'type': 'text', 'text': ' переводит в верхний регистр.'},
                        ],
                    },
                ],
            },
        },
        {
            'title': 'Форматирование строк',
            'lesson_type': 'theory',
            'order': 3,
            'xp_reward': 10,
            'stars_reward': 3,
            'starter_code': '',
            'test_cases': [],
            'content': {
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Урок 3. Форматирование строк'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Форматирование строк позволяет вставлять значения переменных прямо в текст. В Python есть три способа.'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'f-строки (рекомендуется)'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'name = "Иван"\nage = 25\nprint(f"Меня зовут {name}, мне {age} лет.")\n# Меня зовут Иван, мне 25 лет.\n\n# Выражения внутри {}\nprint(f"Через 5 лет мне будет {age + 5} лет.")'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': 'Метод format()'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'name = "Мария"\nprint("Привет, {}!".format(name))\n\n# С именованными аргументами\nprint("Привет, {name}! Тебе {age} лет.".format(name="Иван", age=20))'}],
                    },
                    {
                        'type': 'heading',
                        'attrs': {'level': 2},
                        'content': [{'type': 'text', 'text': '%-форматирование (устаревший способ)'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'name = "Алекс"\nage = 30\nprint("Меня зовут %s, мне %d лет." % (name, age))'}],
                    },
                    {
                        'type': 'blockquote',
                        'content': [{
                            'type': 'paragraph',
                            'content': [
                                {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Рекомендация: '},
                                {'type': 'text', 'text': 'используй f-строки — они самые читаемые и быстрые. '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'format()'},
                                {'type': 'text', 'text': ' и '},
                                {'type': 'text', 'marks': [{'type': 'code'}], 'text': '%'},
                                {'type': 'text', 'text': ' встречаются в старом коде.'},
                            ],
                        }],
                    },
                ],
            },
        },
        {
            'title': 'f-строки на практике',
            'lesson_type': 'practice',
            'order': 4,
            'xp_reward': 20,
            'stars_reward': 3,
            'starter_code': 'name = input()\nage = int(input())\n# выведи строку с помощью f-строки\n',
            'test_cases': [
                {'input': 'Иван\n20\n', 'expected_output': 'Меня зовут Иван, мне 20 лет.'},
                {'input': 'Анна\n17\n', 'expected_output': 'Меня зовут Анна, мне 17 лет.'},
            ],
            'content': {
                'type': 'doc',
                'content': [
                    {
                        'type': 'heading',
                        'attrs': {'level': 1},
                        'content': [{'type': 'text', 'text': 'Практика: f-строки'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [{'type': 'text', 'text': 'Прочитай имя и возраст. Выведи строку в формате:'}],
                    },
                    {
                        'type': 'codeBlock',
                        'attrs': {'language': 'python'},
                        'content': [{'type': 'text', 'text': 'Меня зовут Иван, мне 20 лет.'}],
                    },
                    {
                        'type': 'paragraph',
                        'content': [
                            {'type': 'text', 'marks': [{'type': 'bold'}], 'text': 'Подсказка: '},
                            {'type': 'text', 'text': 'используй f-строку: '},
                            {'type': 'text', 'marks': [{'type': 'code'}], 'text': 'f"Меня зовут {name}, мне {age} лет."'},
                        ],
                    },
                ],
            },
        },
    ],
}


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
                if not created:
                    art.order = art_data['order']
                    art.content = art_data['content']
                    art.save()
                action = 'Создана' if created else 'Обновлена'
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
