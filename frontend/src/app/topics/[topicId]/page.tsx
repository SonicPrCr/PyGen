"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LessonCard, type Lesson } from "@/components/lessons/LessonCard";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import api from "@/lib/api";

interface ThemeDetail {
  id: number;
  title: string;
  description: string;
  icon_url: string;
  is_locked: boolean;
  progress_percent: number;
  completed_lessons_count: number;
  total_lessons_count: number;
  total_xp: number;
  total_stars: number;
  lessons: Lesson[];
}

function LessonCardSkeleton() {
  return (
    <div
      className="rounded-2xl h-44 animate-pulse"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />
  );
}

export default function TopicLessonsPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = use(params);
  const { isAuthenticated, isInitialized } = useRequireAuth();

  const { data: theme, isLoading, isError } = useQuery<ThemeDetail>({
    queryKey: ["theme", topicId],
    queryFn: async () => {
      const { data } = await api.get(`/api/themes/${topicId}`);
      return data;
    },
    enabled: isAuthenticated,
  });

  // Lesson N is locked if lesson N-1 is not completed
  function isLocked(index: number): boolean {
    if (index === 0) return false;
    return !(theme?.lessons[index - 1]?.is_completed ?? false);
  }

  if (!isInitialized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <Header />

      {/* Divider under header */}
      <div className="h-px bg-white/10" />

      <main className="flex-1 px-4 sm:px-6 lg:px-16 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          href="/topics"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          ← Все темы
        </Link>

        {/* Title */}
        {isLoading ? (
          <div className="h-10 w-48 rounded-lg bg-white/10 animate-pulse mb-8" />
        ) : (
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-8"
            style={{ fontFamily: "'Science Gothic', sans-serif" }}
          >
            {theme?.title}
          </h1>
        )}

        {isError && (
          <p className="text-red-400 text-sm mb-4">
            Не удалось загрузить уроки. Убедитесь, что бэкенд запущен.
          </p>
        )}

        {/* Lesson list */}
        <div className="flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <LessonCardSkeleton key={i} />
              ))
            : theme?.lessons.map((lesson, idx) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isLocked={isLocked(idx)}
                />
              ))}
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
