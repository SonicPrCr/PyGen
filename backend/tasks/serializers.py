from rest_framework import serializers
from .models import Task, UserSolution


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
