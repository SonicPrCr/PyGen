from rest_framework import serializers
from .models import Task, UserSolution, UserTaskGeneration


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'theme', 'lesson', 'title', 'description',
            'starter_code', 'test_cases', 'is_pregenerated', 'created_at',
        ]


class CheckCodeSerializer(serializers.Serializer):
    code = serializers.CharField()


class UserSolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSolution
        fields = ['id', 'task', 'code', 'is_correct', 'attempts', 'created_at']
        read_only_fields = ['id', 'is_correct', 'attempts', 'created_at']


class UserSolutionAdminSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    code_preview = serializers.SerializerMethodField()

    class Meta:
        model = UserSolution
        fields = ['id', 'user_email', 'task_title', 'code_preview',
                  'is_correct', 'attempts', 'created_at']

    def get_code_preview(self, obj):
        code = obj.code or ''
        return code[:100] + '...' if len(code) > 100 else code


class UserTaskGenerationAdminSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    theme_title = serializers.CharField(source='theme.title', read_only=True)

    class Meta:
        model = UserTaskGeneration
        fields = ['id', 'user_email', 'theme_title', 'count', 'last_generated_at']
