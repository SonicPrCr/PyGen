from django.urls import path
from . import views

urlpatterns = [
    path('bookmarks',                   views.BookmarkListCreateView.as_view(),  name='bookmark-list'),
    path('bookmarks/<int:pk>',          views.BookmarkDeleteView.as_view(),      name='bookmark-delete'),
    path('notes',                       views.NoteListCreateView.as_view(),      name='note-list'),
    path('notes/<int:pk>',              views.NoteDetailView.as_view(),          name='note-detail'),
    path('reference/categories',        views.ReferenceCategoryListView.as_view(), name='ref-categories'),
    path('reference/articles/<int:pk>', views.ReferenceArticleDetailView.as_view(), name='ref-article'),
]
