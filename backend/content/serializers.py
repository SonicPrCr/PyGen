from rest_framework import serializers
from .models import Bookmark, Note, ReferenceCategory, ReferenceArticle


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'lesson', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ReferenceArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferenceArticle
        fields = ['id', 'title', 'content', 'order']


class ReferenceArticleAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferenceArticle
        fields = ['id', 'category', 'title', 'content', 'order']


class ReferenceCategorySerializer(serializers.ModelSerializer):
    articles = ReferenceArticleSerializer(many=True, read_only=True)

    class Meta:
        model = ReferenceCategory
        fields = ['id', 'title', 'order', 'articles']
