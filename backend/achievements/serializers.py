from rest_framework import serializers
from .models import Achievement, UserAchievement


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'level', 'name', 'color']


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'earned_at']


class UserAchievementAdminSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    achievement_name = serializers.CharField(source='achievement.name', read_only=True)
    achievement_level = serializers.IntegerField(source='achievement.level', read_only=True)
    achievement_color = serializers.CharField(source='achievement.color', read_only=True)

    class Meta:
        model = UserAchievement
        fields = ['id', 'user_email', 'achievement_name', 'achievement_level',
                  'achievement_color', 'earned_at']
