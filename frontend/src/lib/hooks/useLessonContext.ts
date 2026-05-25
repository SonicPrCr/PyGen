"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface LessonDetail {
  id: number;
  theme: number;
  title: string;
  order: number;
  lesson_type: "theory" | "practice";
  content: { markdown?: string; type?: string; [key: string]: unknown };
  starter_code: string;
  test_cases: Array<{ input: string; expected_output: string }>;
  xp_reward: number;
  stars_reward: number;
  is_completed: boolean;
  stars_earned: number;
}

export interface SidebarLesson {
  id: number;
  title: string;
  order: number;
  lesson_type: "theory" | "practice";
  is_completed: boolean;
  stars_earned: number;
}

export interface ThemeWithLessons {
  id: number;
  title: string;
  description: string;
  lessons: SidebarLesson[];
}

export function useLessonContext(lessonId: string | number) {
  const { data: lesson, isLoading: lessonLoading, error: lessonError } = useQuery<LessonDetail>({
    queryKey: ["lesson", String(lessonId)],
    queryFn: async () => {
      const { data } = await api.get(`/api/lessons/${lessonId}`);
      return data;
    },
    enabled: !!lessonId,
    staleTime: 60_000,
  });

  const { data: theme, isLoading: themeLoading, error: themeError } = useQuery<ThemeWithLessons>({
    queryKey: ["theme", lesson?.theme],
    queryFn: async () => {
      const { data } = await api.get(`/api/themes/${lesson!.theme}`);
      return data;
    },
    enabled: !!lesson?.theme,
    staleTime: 60_000,
  });

  return {
    lesson,
    theme,
    themeLessons: (theme?.lessons ?? []) as SidebarLesson[],
    isLoading: lessonLoading || (!!lesson && themeLoading),
    error: lessonError ?? themeError ?? null,
  };
}
