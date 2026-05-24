from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from drf_spectacular.utils import extend_schema

from .models import Achievement, UserAchievement
from .serializers import AchievementSerializer, UserAchievementSerializer, UserAchievementAdminSerializer


class MyAchievementsView(generics.ListAPIView):
    serializer_class = UserAchievementSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(summary='Мои ачивки')
    def get_queryset(self):
        return UserAchievement.objects.filter(
            user=self.request.user
        ).select_related('achievement').order_by('achievement__level')


class AchievementAdminListView(generics.ListAPIView):
    queryset = Achievement.objects.all().order_by('level')
    serializer_class = AchievementSerializer
    permission_classes = [IsAdminUser]


class UserAchievementAdminListView(generics.ListAPIView):
    queryset = UserAchievement.objects.select_related(
        'user', 'achievement'
    ).order_by('-earned_at')
    serializer_class = UserAchievementAdminSerializer
    permission_classes = [IsAdminUser]


class UserAchievementAdminDeleteView(generics.DestroyAPIView):
    queryset = UserAchievement.objects.all()
    permission_classes = [IsAdminUser]
