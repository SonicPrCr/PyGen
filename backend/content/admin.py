from django.contrib import admin
from .models import Bookmark, Note, ReferenceCategory, ReferenceArticle

admin.site.register(Bookmark)
admin.site.register(Note)

@admin.register(ReferenceCategory)
class ReferenceCategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'order']

@admin.register(ReferenceArticle)
class ReferenceArticleAdmin(admin.ModelAdmin):
    list_display = ['category', 'title', 'order']
    list_filter = ['category']
