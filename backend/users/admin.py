from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'xp', 'current_level', 'is_staff')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('PyGen', {'fields': ('middle_name', 'age', 'avatar', 'xp', 'current_level', 'total_stars')}),
    )
