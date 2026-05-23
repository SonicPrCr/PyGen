"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Bookmark {
  id: number;
  lesson: {
    id: number;
    title: string;
    order: number;
    lesson_type: "theory" | "practice";
  };
  created_at: string;
}

export function useBookmarks(lessonId?: number) {
  const queryClient = useQueryClient();

  const { data: bookmarks = [] } = useQuery<Bookmark[]>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const { data } = await api.get("/api/bookmarks");
      return data as Bookmark[];
    },
  });

  const bookmarkForLesson = lessonId
    ? bookmarks.find((b) => b.lesson.id === lessonId)
    : undefined;
  const isBookmarked = !!bookmarkForLesson;

  const addBookmark = useMutation({
    mutationFn: (id: number) => api.post("/api/bookmarks", { lesson_id: id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  const removeBookmark = useMutation({
    mutationFn: (bookmarkId: number) => api.delete(`/api/bookmarks/${bookmarkId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  const toggleBookmark = async (id: number) => {
    if (bookmarkForLesson) {
      await removeBookmark.mutateAsync(bookmarkForLesson.id);
    } else {
      await addBookmark.mutateAsync(id);
    }
  };

  const deleteBookmark = async (bookmarkId: number) => {
    await removeBookmark.mutateAsync(bookmarkId);
  };

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    deleteBookmark,
    isLoading: addBookmark.isPending || removeBookmark.isPending,
  };
}
