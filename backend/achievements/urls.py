from django.urls import path
from . import views

urlpatterns = [
    path('achievements/my', views.MyAchievementsView.as_view(), name='achievements-my'),
]
