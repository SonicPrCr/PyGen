from rest_framework import serializers
from .models import Theme, Lesson, UserProgress


class LessonListSerializer(serializers.ModelSerializer):
    """Краткий сериализатор урока для списка (без тяжёлого content)."""
    is_completed = serializers.SerializerMethodField()
    stars_earned = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'order', 'lesson_type',
            'xp_reward', 'stars_reward',
            'is_completed', 'stars_earned',
        ]

    def _get_progress(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        # Прогресс передаётся через context чтобы не делать N+1 запросов
        progress_map = self.context.get('progress_map', {})
        return progress_map.get(obj.id)

    def get_is_completed(self, obj):
        p = self._get_progress(obj)
        return p.completed if p else False

    def get_stars_earned(self, obj):
        p = self._get_progress(obj)
        return p.stars_earned if p else 0


class LessonDetailSerializer(serializers.ModelSerializer):
    """Полный сериализатор урока с контентом и тест-кейсами."""
    is_completed = serializers.SerializerMethodField()
    stars_earned = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'theme', 'title', 'order', 'lesson_type',
            'content', 'starter_code', 'test_cases',
            'xp_reward', 'stars_reward',
            'is_completed', 'stars_earned',
        ]

    def _get_progress(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        try:
            return UserProgress.objects.get(user=request.user, lesson=obj)
        except UserProgress.DoesNotExist:
            return None

    def get_is_completed(self, obj):
        p = self._get_progress(obj)
        return p.completed if p else False

    def get_stars_earned(self, obj):
        p = self._get_progress(obj)
        return p.stars_earned if p else 0


class ThemeListSerializer(serializers.ModelSerializer):
    """Тема для списка с прогрессом пользователя."""
    is_locked              = serializers.SerializerMethodField()
    progress_percent       = serializers.SerializerMethodField()
    completed_lessons_count = serializers.SerializerMethodField()
    total_lessons_count    = serializers.SerializerMethodField()
    total_xp               = serializers.SerializerMethodField()
    total_stars            = serializers.SerializerMethodField()

    class Meta:
        model = Theme
        fields = [
            'id', 'title', 'description', 'order', 'icon',
            'is_locked', 'progress_percent',
            'completed_lessons_count', 'total_lessons_count',
            'total_xp', 'total_stars',
        ]

    def _stats(self, obj):
        """Возвращает (total, completed) уроков для темы."""
        lessons = list(obj.lessons.all())
        total = len(lessons)
        if total == 0:
            return total, 0
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return total, 0
        completed = UserProgress.objects.filter(
            user=request.user, lesson__in=lessons, completed=True
        ).count()
        return total, completed

    def get_total_lessons_count(self, obj):
        total, _ = self._stats(obj)
        return total

    def get_completed_lessons_count(self, obj):
        _, completed = self._stats(obj)
        return completed

    def get_progress_percent(self, obj):
        total, completed = self._stats(obj)
        return round(completed / total * 100) if total else 0

    def get_total_xp(self, obj):
        from django.db.models import Sum
        return obj.lessons.aggregate(total=Sum('xp_reward'))['total'] or 0

    def get_total_stars(self, obj):
        from django.db.models import Sum
        return obj.lessons.aggregate(total=Sum('stars_reward'))['total'] or 0

    def get_is_locked(self, obj):
        # Первая тема всегда открыта
        if obj.order == 1:
            return False
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return True
        # Предыдущая тема должна быть пройдена на 100%
        try:
            prev = Theme.objects.get(order=obj.order - 1)
        except Theme.DoesNotExist:
            return False
        prev_total = prev.lessons.count()
        if prev_total == 0:
            return False
        prev_completed = UserProgress.objects.filter(
            user=request.user, lesson__theme=prev, completed=True
        ).count()
        return prev_completed < prev_total


class ThemeDetailSerializer(ThemeListSerializer):
    """Тема с полным списком уроков."""
    lessons = serializers.SerializerMethodField()

    class Meta(ThemeListSerializer.Meta):
        fields = ThemeListSerializer.Meta.fields + ['lessons']

    def get_lessons(self, obj):
        lessons = obj.lessons.all()
        request = self.context.get('request')
        # Строим progress_map для уроков одним запросом
        progress_map = {}
        if request and request.user.is_authenticated:
            for p in UserProgress.objects.filter(user=request.user, lesson__in=lessons):
                progress_map[p.lesson_id] = p
        return LessonListSerializer(
            lessons, many=True,
            context={**self.context, 'progress_map': progress_map},
        ).data


# ─── Admin serializers (без user-dependent полей) ─────────────────────────────

class LessonAdminSerializer(serializers.ModelSerializer):
    """Полный сериализатор урока для CRUD в админке."""

    class Meta:
        model = Lesson
        fields = [
            'id', 'theme', 'title', 'order', 'lesson_type',
            'content', 'starter_code', 'test_cases',
            'xp_reward', 'stars_reward',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ThemeAdminSerializer(serializers.ModelSerializer):
    """Сериализатор темы для CRUD в админке (с уроками, без user-полей)."""
    lessons = LessonAdminSerializer(many=True, read_only=True)
    lessons_count = serializers.IntegerField(source='lessons.count', read_only=True)

    class Meta:
        model = Theme
        fields = [
            'id', 'title', 'description', 'order', 'icon',
            'lessons_count', 'lessons',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserProgressAdminSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    theme_title = serializers.CharField(source='lesson.theme.title', read_only=True)

    class Meta:
        model = UserProgress
        fields = ['id', 'user_email', 'lesson_title', 'theme_title',
                  'completed', 'stars_earned', 'attempts', 'completed_at']
