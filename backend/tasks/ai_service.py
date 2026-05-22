import json
import logging

from django.conf import settings
from openai import OpenAI

from .views import _run_code

logger = logging.getLogger(__name__)

_GENERATE_SYSTEM_PROMPT = """\
Ты — ИИ-помощник на образовательной платформе PyGen для изучения Python.
Твоя задача — генерировать обучающие задания для начинающих программистов.

Требования к заданию:
1. Задание должно быть посильным для новичка (5-15 строк кода).
2. Условие должно быть чётким и однозначным.
3. Задание должно иметь 2-4 тест-кейса.
4. Каждый тест-кейс: {"input": "...", "expected_output": "..."}.
5. Если задание не требует ввода — input должен быть пустой строкой.
6. expected_output — то что появится в stdout БЕЗ переноса строки в конце.
7. starter_code — минимальный шаблон с комментарием '# напиши код здесь'.
8. reference_solution — твоё решение, которое 100% проходит все test_cases.

Ответ дай СТРОГО в JSON без markdown:
{
  "title": "название (до 50 символов)",
  "description": "подробное условие на русском",
  "starter_code": "# напиши код здесь\\n",
  "test_cases": [{"input": "", "expected_output": "..."}],
  "reference_solution": "полный рабочий код"
}"""

_HINT_SYSTEM_PROMPT = """\
Ты — добрый помощник на платформе изучения Python PyGen.
Студент решает задачу, но его решение не проходит тесты.

ТВОЯ ЗАДАЧА:
- Дать КОРОТКУЮ (1-3 предложения) подсказку.
- НЕ давать готовый код.
- НЕ копировать эталонное решение.
- Помочь понять ошибку.
- Говорить дружелюбно, на ты."""

_REQUIRED_FIELDS = {'title', 'description', 'starter_code', 'test_cases', 'reference_solution'}


def _make_client() -> OpenAI:
    return OpenAI(
        api_key=settings.DEEPSEEK_API_KEY,
        base_url=settings.DEEPSEEK_BASE_URL,
    )


def _validate_task_data(data: dict) -> bool:
    """Проверяет структуру и прогоняет reference_solution через test_cases."""
    if not _REQUIRED_FIELDS.issubset(data.keys()):
        logger.warning('ai_service: отсутствуют обязательные поля: %s', _REQUIRED_FIELDS - data.keys())
        return False

    test_cases = data['test_cases']
    if not isinstance(test_cases, list) or len(test_cases) == 0:
        logger.warning('ai_service: test_cases пустой или не список')
        return False

    for tc in test_cases:
        if not isinstance(tc, dict) or 'input' not in tc or 'expected_output' not in tc:
            logger.warning('ai_service: неверная структура test_case: %s', tc)
            return False

    # Прогоняем reference_solution через каждый тест
    solution = data['reference_solution']
    for tc in test_cases:
        actual, error = _run_code(solution, tc['input'])
        if error:
            logger.warning('ai_service: reference_solution упал с ошибкой: %s', error)
            return False
        if actual.strip() != str(tc['expected_output']).strip():
            logger.warning(
                'ai_service: reference_solution не прошёл тест. Ожидалось %r, получили %r',
                tc['expected_output'], actual.strip(),
            )
            return False

    return True


def generate_task_data(theme) -> dict | None:
    """
    Генерирует задание через DeepSeek и валидирует его.
    Делает до 3 попыток. Возвращает dict или None при неудаче.
    """
    client = _make_client()
    user_prompt = f"Сгенерируй задание по теме «{theme.title}». Описание: {theme.description}"

    for attempt in range(1, 4):
        try:
            response = client.chat.completions.create(
                model=settings.DEEPSEEK_MODEL,
                messages=[
                    {'role': 'system', 'content': _GENERATE_SYSTEM_PROMPT},
                    {'role': 'user', 'content': user_prompt},
                ],
                response_format={'type': 'json_object'},
                temperature=0.8,
                timeout=30,
            )
            raw = response.choices[0].message.content
            data = json.loads(raw)

            if _validate_task_data(data):
                logger.info('ai_service: задание сгенерировано за %d попытку(и)', attempt)
                return data

            logger.warning('ai_service: попытка %d — валидация не прошла', attempt)

        except Exception as exc:
            logger.warning('ai_service: попытка %d — ошибка: %s', attempt, exc)

    logger.error('ai_service: все 3 попытки генерации для темы "%s" неудачны', theme.title)
    return None


def get_hint(task, user_code: str) -> str | None:
    """
    Возвращает короткую подсказку от DeepSeek или None при ошибке.
    """
    client = _make_client()
    user_prompt = (
        f"Задача: {task.title}\n\n"
        f"Условие: {task.description}\n\n"
        f"Код студента:\n```python\n{user_code}\n```\n\n"
        "Дай короткую подсказку, не раскрывая решение."
    )

    try:
        response = client.chat.completions.create(
            model=settings.DEEPSEEK_MODEL,
            messages=[
                {'role': 'system', 'content': _HINT_SYSTEM_PROMPT},
                {'role': 'user', 'content': user_prompt},
            ],
            temperature=0.5,
            timeout=20,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        logger.error('ai_service: get_hint ошибка: %s', exc)
        return None
