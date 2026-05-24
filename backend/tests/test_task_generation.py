"""AI task generation: counter, 24h auto-reset, pool fallback."""
import pytest
from datetime import timedelta
from django.utils import timezone
from rest_framework.test import APIClient
from tasks.models import UserTaskGeneration
from tasks.views import _run_code
from tests.factories import UserFactory, ThemeFactory, TaskFactory


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def theme():
    return ThemeFactory()


@pytest.fixture
def client(user):
    c = APIClient()
    c.force_authenticate(user=user)
    return c


class TestUserGenerationStatusView:
    def test_no_usage_returns_full_limit(self, client, theme):
        response = client.get(f"/api/tasks/generation-status?theme_id={theme.pk}")
        assert response.status_code == 200
        assert response.data["remaining_generations"] == 3
        assert response.data["reset_in_seconds"] is None

    def test_partial_usage_returns_correct_remaining(self, client, user, theme):
        UserTaskGeneration.objects.create(user=user, theme=theme, count=1)
        response = client.get(f"/api/tasks/generation-status?theme_id={theme.pk}")
        assert response.data["remaining_generations"] == 2

    def test_exhausted_limit_returns_zero(self, client, user, theme):
        now = timezone.now()
        UserTaskGeneration.objects.create(
            user=user, theme=theme, count=3, last_generated_at=now
        )
        response = client.get(f"/api/tasks/generation-status?theme_id={theme.pk}")
        assert response.data["remaining_generations"] == 0
        assert response.data["reset_in_seconds"] is not None

    def test_auto_reset_after_24h(self, client, user, theme):
        old_time = timezone.now() - timedelta(hours=25)
        UserTaskGeneration.objects.create(
            user=user, theme=theme, count=3, last_generated_at=old_time
        )
        response = client.get(f"/api/tasks/generation-status?theme_id={theme.pk}")
        assert response.data["remaining_generations"] == 3
        assert response.data["reset_in_seconds"] is None

    def test_missing_theme_id_returns_400(self, client):
        response = client.get("/api/tasks/generation-status")
        assert response.status_code == 400

    def test_unauthenticated_access_denied(self, theme):
        response = APIClient().get(f"/api/tasks/generation-status?theme_id={theme.pk}")
        assert response.status_code == 401


class TestRunCode:
    def test_correct_output(self):
        code = "print('hello')"
        stdout, stderr = _run_code(code, "")
        assert stdout.strip() == "hello"
        assert stderr == ""

    def test_syntax_error_captured_in_stderr(self):
        code = "def foo(:\n    pass"
        stdout, stderr = _run_code(code, "")
        assert stdout == ""
        assert stderr != ""

    def test_stdin_piped_to_code(self):
        code = "x = input()\nprint(x.upper())"
        stdout, stderr = _run_code(code, "hello")
        assert stdout.strip() == "HELLO"
