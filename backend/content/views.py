from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema

from .models import Bookmark, Note, ReferenceCategory, ReferenceArticle
from .serializers import (
    BookmarkSerializer, NoteSerializer,
    ReferenceCategorySerializer, ReferenceArticleSerializer,
)


class BookmarkListCreateView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).select_related('lesson')


class BookmarkDeleteView(generics.DestroyAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)


class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)


class ReferenceCategoryListView(generics.ListAPIView):
    queryset = ReferenceCategory.objects.prefetch_related('articles')
    serializer_class = ReferenceCategorySerializer
    permission_classes = [AllowAny]

    @extend_schema(summary='Список категорий справочника с вложенными статьями')
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ReferenceArticleDetailView(generics.RetrieveAPIView):
    queryset = ReferenceArticle.objects.select_related('category')
    serializer_class = ReferenceArticleSerializer
    permission_classes = [AllowAny]

    @extend_schema(summary='Детали статьи справочника')
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
