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

admin_urlpatterns = [
    path('admin/reference/categories',          views.ReferenceCategoryAdminListCreateView.as_view(), name='admin-ref-categories'),
    path('admin/reference/categories/<int:pk>', views.ReferenceCategoryAdminDetailView.as_view(),     name='admin-ref-category-detail'),
    path('admin/reference/articles',            views.ReferenceArticleAdminCreateView.as_view(),      name='admin-ref-article-create'),
    path('admin/reference/articles/<int:pk>',   views.ReferenceArticleAdminDetailView.as_view(),      name='admin-ref-article-detail'),
    path('admin/bookmarks',                     views.BookmarkAdminListView.as_view(),                name='admin-bookmarks'),
    path('admin/bookmarks/<int:pk>',            views.BookmarkAdminDeleteView.as_view(),              name='admin-bookmark-delete'),
    path('admin/notes',                         views.NoteAdminListView.as_view(),                    name='admin-notes'),
    path('admin/notes/<int:pk>',                views.NoteAdminDeleteView.as_view(),                  name='admin-note-delete'),
]
