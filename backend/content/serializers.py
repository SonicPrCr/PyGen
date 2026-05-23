from rest_framework import serializers
from .models import Bookmark, Note, ReferenceCategory, ReferenceArticle
from lessons.models import Lesson


class LessonMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'order', 'lesson_type']


class BookmarkSerializer(serializers.ModelSerializer):
    lesson = LessonMinimalSerializer(read_only=True)
    lesson_id = serializers.PrimaryKeyRelatedField(
        queryset=Lesson.objects.all(), source='lesson', write_only=True
    )

    class Meta:
        model = Bookmark
        fields = ['id', 'lesson', 'lesson_id', 'created_at']
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
