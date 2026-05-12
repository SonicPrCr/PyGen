from users.services import calculate_level_from_xp


def complete_lesson(user, lesson, stars_earned: int):
    """
    Начисляет XP и звёзды за пройденный урок.
    Пересчитывает уровень и выдаёт ачивки если нужно.
    """
    user.xp += lesson.xp_reward
    user.total_stars += stars_earned

    new_level = calculate_level_from_xp(user.xp)
    level_up = new_level > user.current_level
    user.current_level = new_level
    user.save(update_fields=['xp', 'total_stars', 'current_level'])

    # Выдать ачивку если новый уровень кратен 10
    if level_up and user.current_level % 10 == 0:
        _grant_achievement(user, user.current_level)


def _grant_achievement(user, level: int):
    """Выдать ачивку за уровень если ещё не выдана."""
    from achievements.models import Achievement, UserAchievement
    try:
        achievement = Achievement.objects.get(level=level)
        UserAchievement.objects.get_or_create(user=user, achievement=achievement)
    except Achievement.DoesNotExist:
        pass
