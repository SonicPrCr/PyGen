import pytest
from django.conf import settings
from rest_framework.test import APIClient


def pytest_configure(config):
    settings.DATABASES["default"] = {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
        "ATOMIC_REQUESTS": False,
        "AUTOCOMMIT": True,
        "CONN_MAX_AGE": 0,
        "OPTIONS": {},
        "TIME_ZONE": None,
        "USER": "",
        "PASSWORD": "",
        "HOST": "",
        "PORT": "",
        "TEST": {},
    }
    settings.CELERY_TASK_ALWAYS_EAGER = False


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass


@pytest.fixture
def api_client():
    return APIClient()
