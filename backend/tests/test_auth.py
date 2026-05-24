"""Authentication: register, login, token refresh, /me endpoint."""
import pytest
from rest_framework.test import APIClient
from tests.factories import UserFactory


@pytest.fixture
def client():
    return APIClient()


class TestRegisterView:
    def test_register_creates_user_and_returns_tokens(self, client):
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "StrongPass123",
        }
        response = client.post("/api/auth/register/", payload, format="json")
        assert response.status_code == 201
        assert "tokens" in response.data
        assert "access" in response.data["tokens"]
        assert "refresh" in response.data["tokens"]

    def test_register_duplicate_email_fails(self, client):
        UserFactory(email="taken@example.com", username="taken")
        payload = {
            "username": "other",
            "email": "taken@example.com",
            "password": "StrongPass123",
        }
        response = client.post("/api/auth/register/", payload, format="json")
        assert response.status_code == 400


class TestLoginView:
    def test_valid_credentials_return_tokens(self, client):
        user = UserFactory(email="login@example.com")
        response = client.post(
            "/api/auth/login/",
            {"email": "login@example.com", "password": "password123"},
            format="json",
        )
        assert response.status_code == 200
        assert "tokens" in response.data

    def test_wrong_password_returns_401(self, client):
        UserFactory(email="user@example.com")
        response = client.post(
            "/api/auth/login/",
            {"email": "user@example.com", "password": "wrongpassword"},
            format="json",
        )
        assert response.status_code == 401

    def test_nonexistent_email_returns_401(self, client):
        response = client.post(
            "/api/auth/login/",
            {"email": "nobody@example.com", "password": "password123"},
            format="json",
        )
        assert response.status_code == 401

    def test_missing_credentials_returns_400(self, client):
        response = client.post("/api/auth/login/", {}, format="json")
        assert response.status_code == 400


class TestMeView:
    def test_authenticated_user_gets_profile(self):
        user = UserFactory()
        c = APIClient()
        c.force_authenticate(user=user)
        response = c.get("/api/auth/me/")
        assert response.status_code == 200
        assert response.data["email"] == user.email

    def test_unauthenticated_returns_401(self, client):
        response = client.get("/api/auth/me/")
        assert response.status_code == 401
