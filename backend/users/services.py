def calculate_level_from_xp(xp: int) -> int:
    """
    Считает уровень по накопленному XP.
    Для уровня N нужно 100*N XP сверх предыдущего.
    Уровень 1 → нужно 100 XP для уровня 2.
    Уровень 2 → ещё 200 XP для уровня 3. И т.д.
    Максимум — 99.
    """
    level = 1
    remaining = xp
    while level < 99:
        cost = 100 * level          # XP для перехода на следующий уровень
        if remaining >= cost:
            remaining -= cost
            level += 1
        else:
            break
    return level


def get_xp_for_next_level(current_level: int) -> int:
    """Возвращает сколько XP нужно набрать для перехода на следующий уровень."""
    if current_level >= 99:
        return 0
    return 100 * current_level
