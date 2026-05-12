from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from .models import UserAchievement
from .serializers import UserAchievementSerializer


class MyAchievementsView(generics.ListAPIView):
    serializer_class = UserAchievementSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(summary='Мои ачивки')
    def get_queryset(self):
        return UserAchievement.objects.filter(
            user=self.request.user
        ).select_related('achievement').order_by('achievement__level')
