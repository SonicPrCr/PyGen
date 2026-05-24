import factory
from factory.django import DjangoModelFactory
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    is_active = True

    @factory.post_generation
    def password(obj, create, extracted, **kwargs):
        obj.set_password(extracted or "password123")
        if create:
            obj.save(update_fields=["password"])


class AdminFactory(UserFactory):
    is_staff = True
    is_superuser = True


class ThemeFactory(DjangoModelFactory):
    class Meta:
        model = "lessons.Theme"

    title = factory.Sequence(lambda n: f"Theme {n}")
    description = "Test theme"
    order = factory.Sequence(lambda n: n + 1)


class LessonFactory(DjangoModelFactory):
    class Meta:
        model = "lessons.Lesson"

    theme = factory.SubFactory(ThemeFactory)
    title = factory.Sequence(lambda n: f"Lesson {n}")
    order = factory.Sequence(lambda n: n + 1)
    lesson_type = "theory"
    content = factory.LazyFunction(dict)
    xp_reward = 10
    stars_reward = 1


class TaskFactory(DjangoModelFactory):
    class Meta:
        model = "tasks.Task"

    theme = factory.SubFactory(ThemeFactory)
    title = factory.Sequence(lambda n: f"Task {n}")
    description = "Solve the problem"
    test_cases = factory.LazyFunction(
        lambda: [{"input": "", "expected_output": "hello"}]
    )
    is_pregenerated = True


class AchievementFactory(DjangoModelFactory):
    class Meta:
        model = "achievements.Achievement"

    level = factory.Sequence(lambda n: (n + 1) * 10)
    name = factory.Sequence(lambda n: f"Achievement {(n + 1) * 10}")
    color = "#FF5733"
