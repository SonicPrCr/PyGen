"""Theme and task pool API — list themes, fetch random task, pool exhaustion."""
import pytest
from rest_framework.test import APIClient
from tests.factories import UserFactory, ThemeFactory, TaskFactory


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def client(user):
    c = APIClient()
    c.force_authenticate(user=user)
    return c


class TestThemeListView:
    def test_authenticated_user_sees_themes(self, client):
        ThemeFactory.create_batch(3)
        response = client.get("/api/themes")
        assert response.status_code == 200
        assert len(response.data) == 3

    def test_unauthenticated_user_can_list_themes(self):
        ThemeFactory()
        response = APIClient().get("/api/themes")
        assert response.status_code == 200

    def test_theme_detail_returns_200(self, client):
        theme = ThemeFactory()
        response = client.get(f"/api/themes/{theme.pk}")
        assert response.status_code == 200
        assert response.data["id"] == theme.pk

    def test_missing_theme_returns_404(self, client):
        response = client.get("/api/themes/999999")
        assert response.status_code == 404


class TestRandomTaskView:
    def test_returns_task_from_pool(self, client, user):
        theme = ThemeFactory()
        TaskFactory(theme=theme, is_pregenerated=True)
        response = client.get(f"/api/tasks/random?theme_id={theme.pk}")
        assert response.status_code == 200
        assert "title" in response.data

    def test_returns_message_when_pool_empty(self, client):
        theme = ThemeFactory()
        response = client.get(f"/api/tasks/random?theme_id={theme.pk}")
        assert response.status_code == 200
        assert "message" in response.data

    def test_missing_theme_id_returns_400(self, client):
        response = client.get("/api/tasks/random")
        assert response.status_code == 400

    def test_unauthenticated_access_denied(self):
        theme = ThemeFactory()
        response = APIClient().get(f"/api/tasks/random?theme_id={theme.pk}")
        assert response.status_code == 401
