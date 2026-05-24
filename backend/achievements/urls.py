from django.urls import path
from . import views

urlpatterns = [
    path('achievements/my', views.MyAchievementsView.as_view(), name='achievements-my'),
]

admin_urlpatterns = [
    path('admin/achievements', views.AchievementAdminListView.as_view(), name='admin-achievements'),
    path('admin/user-achievements', views.UserAchievementAdminListView.as_view(), name='admin-user-achievements'),
    path('admin/user-achievements/<int:pk>', views.UserAchievementAdminDeleteView.as_view(), name='admin-user-achievement-delete'),
]
