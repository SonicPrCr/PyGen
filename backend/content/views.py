from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from drf_spectacular.utils import extend_schema

from .models import Bookmark, Note, ReferenceCategory, ReferenceArticle
from .serializers import (
    BookmarkSerializer, NoteSerializer,
    ReferenceCategorySerializer, ReferenceArticleSerializer,
    ReferenceArticleAdminSerializer,
    BookmarkAdminSerializer, NoteAdminSerializer,
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


# ── Admin: Reference CRUD ────────────────────────────────────────────────────

class ReferenceCategoryAdminListCreateView(generics.ListCreateAPIView):
    queryset = ReferenceCategory.objects.prefetch_related('articles').order_by('order')
    serializer_class = ReferenceCategorySerializer
    permission_classes = [IsAdminUser]


class ReferenceCategoryAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReferenceCategory.objects.prefetch_related('articles')
    serializer_class = ReferenceCategorySerializer
    permission_classes = [IsAdminUser]


class ReferenceArticleAdminCreateView(generics.CreateAPIView):
    queryset = ReferenceArticle.objects.all()
    serializer_class = ReferenceArticleAdminSerializer
    permission_classes = [IsAdminUser]


class ReferenceArticleAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReferenceArticle.objects.select_related('category')
    serializer_class = ReferenceArticleAdminSerializer
    permission_classes = [IsAdminUser]


# ── Admin: Bookmarks & Notes ─────────────────────────────────────────────────

class BookmarkAdminListView(generics.ListAPIView):
    serializer_class = BookmarkAdminSerializer
    permission_classes = [IsAdminUser]
    queryset = Bookmark.objects.select_related('user', 'lesson').order_by('-created_at')


class BookmarkAdminDeleteView(generics.DestroyAPIView):
    queryset = Bookmark.objects.all()
    permission_classes = [IsAdminUser]


class NoteAdminListView(generics.ListAPIView):
    serializer_class = NoteAdminSerializer
    permission_classes = [IsAdminUser]
    queryset = Note.objects.select_related('user').order_by('-updated_at')


class NoteAdminDeleteView(generics.DestroyAPIView):
    queryset = Note.objects.all()
    permission_classes = [IsAdminUser]
