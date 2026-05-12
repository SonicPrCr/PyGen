from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для отдачи данных пользователя (без пароля)."""
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email',
            'first_name', 'last_name', 'middle_name',
            'age', 'avatar', 'xp', 'current_level', 'total_stars',
        ]
        read_only_fields = ['id', 'xp', 'current_level', 'total_stars']


class RegisterSerializer(serializers.ModelSerializer):
    """Сериализатор для регистрации нового пользователя."""
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'email', 'password',
            'first_name', 'last_name', 'middle_name', 'age',
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Пользователь с таким email уже существует.')
        return value

    def create(self, validated_data):
        email = validated_data['email']
        # username = email (уникальность обеспечена через email)
        validated_data['username'] = email
        return User.objects.create_user(**validated_data)
