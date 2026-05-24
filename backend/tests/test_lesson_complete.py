"""Lesson completion API: XP grants, stars, progress tracking, signals."""
import pytest
from rest_framework.test import APIClient
from lessons.models import UserProgress
from tests.factories import UserFactory, LessonFactory


@pytest.fixture
def user():
    return UserFactory(xp=0, total_stars=0, current_level=1)


@pytest.fixture
def lesson():
    return LessonFactory(xp_reward=20, stars_reward=1)


@pytest.fixture
def client(user):
    c = APIClient()
    c.force_authenticate(user=user)
    return c


class TestLessonCompleteView:
    def test_first_completion_grants_xp(self, client, user, lesson):
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 2}, format="json")
        user.refresh_from_db()
        assert user.xp == 20

    def test_first_completion_grants_stars(self, client, user, lesson):
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 3}, format="json")
        user.refresh_from_db()
        assert user.total_stars == 3

    def test_second_completion_does_not_double_xp(self, client, user, lesson):
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 1}, format="json")
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 1}, format="json")
        user.refresh_from_db()
        assert user.xp == 20  # not 40

    def test_stars_update_to_higher_value_on_retry(self, client, lesson):
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 1}, format="json")
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 3}, format="json")
        progress = UserProgress.objects.get(lesson=lesson)
        assert progress.stars_earned == 3

    def test_stars_dont_decrease_on_retry(self, client, lesson):
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 3}, format="json")
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 1}, format="json")
        progress = UserProgress.objects.get(lesson=lesson)
        assert progress.stars_earned == 3

    def test_attempts_incremented_each_call(self, client, lesson):
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 1}, format="json")
        client.post(f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 1}, format="json")
        progress = UserProgress.objects.get(lesson=lesson)
        assert progress.attempts == 2

    def test_unauthenticated_access_denied(self, lesson):
        response = APIClient().post(
            f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 1}, format="json"
        )
        assert response.status_code == 401

    def test_missing_lesson_returns_404(self, client):
        response = client.post("/api/lessons/999999/complete/", {"stars_earned": 1}, format="json")
        assert response.status_code == 404

    def test_response_contains_user_data(self, client, lesson):
        response = client.post(
            f"/api/lessons/{lesson.pk}/complete/", {"stars_earned": 2}, format="json"
        )
        assert response.status_code == 200
        assert "user" in response.data
        assert "stars_earned" in response.data
