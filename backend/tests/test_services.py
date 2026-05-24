"""Gamification: XP/level calculation and lesson completion service."""
import pytest
from users.services import calculate_level_from_xp
from lessons.services import complete_lesson
from achievements.models import UserAchievement
from tests.factories import UserFactory, LessonFactory, AchievementFactory


class TestCalculateLevelFromXP:
    def test_level_1_at_zero_xp(self):
        assert calculate_level_from_xp(0) == 1

    def test_level_2_at_100_xp(self):
        # costs 100*1 = 100 XP to reach level 2
        assert calculate_level_from_xp(100) == 2

    def test_level_2_below_threshold(self):
        # level 2→3 costs 200 XP; 100+199=299 still level 2
        assert calculate_level_from_xp(299) == 2

    def test_level_3_at_300_xp(self):
        # 100 + 200 = 300 XP needed for level 3
        assert calculate_level_from_xp(300) == 3

    def test_level_capped_at_99(self):
        assert calculate_level_from_xp(10_000_000) == 99


class TestCompleteLesson:
    def test_xp_added_to_user(self):
        user = UserFactory(xp=0)
        lesson = LessonFactory(xp_reward=50)
        complete_lesson(user, lesson, stars_earned=1)
        user.refresh_from_db()
        assert user.xp == 50

    def test_stars_added_to_user(self):
        user = UserFactory(total_stars=5)
        lesson = LessonFactory(stars_reward=1)
        complete_lesson(user, lesson, stars_earned=3)
        user.refresh_from_db()
        assert user.total_stars == 8

    def test_level_up_when_xp_threshold_crossed(self):
        user = UserFactory(xp=90, current_level=1)
        lesson = LessonFactory(xp_reward=10)
        complete_lesson(user, lesson, stars_earned=1)
        user.refresh_from_db()
        assert user.current_level == 2

    def test_achievement_granted_on_level_10(self):
        # Level 10 requires sum(100*n for n in 1..9) = 4500 XP
        achievement = AchievementFactory(level=10)
        user = UserFactory(xp=4400, current_level=9)
        lesson = LessonFactory(xp_reward=100)
        complete_lesson(user, lesson, stars_earned=1)
        user.refresh_from_db()
        assert user.current_level == 10
        assert UserAchievement.objects.filter(user=user, achievement=achievement).exists()

    def test_no_duplicate_achievement(self):
        achievement = AchievementFactory(level=10)
        user = UserFactory(xp=4400, current_level=9)
        lesson = LessonFactory(xp_reward=100)
        complete_lesson(user, lesson, stars_earned=1)
        complete_lesson(user, lesson, stars_earned=1)
        assert UserAchievement.objects.filter(user=user, achievement=achievement).count() == 1
