"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText, Code, Check, Lock } from "lucide-react";
import api from "@/lib/api";
import { useLessonContext, type SidebarLesson } from "@/lib/hooks/useLessonContext";

interface ThemeSummary {
  id: number;
  title: string;
  is_locked: boolean;
  progress_percent: number;
}

interface ThemeDetail {
  id: number;
  lessons: SidebarLesson[];
}

interface Props {
  currentLessonId: string;
}

function lessonUrl(lesson: SidebarLesson): string {
  return lesson.lesson_type === "practice"
    ? `/lessons/${lesson.id}/editor`
    : `/lessons/${lesson.id}`;
}

function isLessonLocked(lessons: SidebarLesson[], index: number): boolean {
  if (index === 0) return false;
  return !lessons[index - 1].is_completed;
}

// ─── Status/type icon (right side of row) ─────────────────────────────────────

function LessonIcon({ lesson, locked }: { lesson: SidebarLesson; locked: boolean }) {
  if (lesson.is_completed) {
    return <Check size={16} color="var(--color-success)" />;
  }
  if (locked) {
    return <Lock size={14} color="rgba(255,255,255,0.2)" />;
  }
  if (lesson.lesson_type === "practice") {
    return <Code size={16} color="var(--color-accent-purple-light)" />;
  }
  return <FileText size={16} color="var(--color-accent-yellow)" />;
}

// ─── Single lesson row ────────────────────────────────────────────────────────

function LessonRow({
  lesson,
  locked,
  active,
}: {
  lesson: SidebarLesson;
  locked: boolean;
  active: boolean;
}) {
  const inner = (
    <div
      className="flex items-center gap-2 px-3 py-2 mx-2 rounded-lg transition-colors"
      style={{
        backgroundColor: active ? "var(--color-accent-purple)" : "transparent",
        opacity: locked ? 0.45 : 1,
      }}
    >
      <span
        className={`flex-1 text-[13px] leading-snug truncate ${active ? "font-semibold" : ""}`}
        style={{ color: active ? "#FFFFFF" : "rgba(255,255,255,0.65)" }}
      >
        {lesson.title}
        <span className="ml-1.5 text-[11px]" style={{ color: active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.28)" }}>
          #{lesson.order}
        </span>
      </span>
      <span className="shrink-0 flex items-center">
        <LessonIcon lesson={lesson} locked={locked} />
      </span>
    </div>
  );

  if (locked) return <div className="cursor-not-allowed select-none">{inner}</div>;
  return (
    <Link href={lessonUrl(lesson)} className="block hover:bg-white/[0.04] transition-colors">
      {inner}
    </Link>
  );
}

// ─── Collapsible theme section ────────────────────────────────────────────────

function ThemeSection({
  theme,
  currentLessonId,
  defaultExpanded,
}: {
  theme: ThemeSummary;
  currentLessonId: string;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const { data: themeDetail } = useQuery<ThemeDetail>({
    queryKey: ["theme", theme.id],
    queryFn: async () => {
      const { data } = await api.get(`/api/themes/${theme.id}`);
      return data;
    },
    enabled: expanded,
    staleTime: 60_000,
  });

  const lessons = (themeDetail?.lessons ?? []) as SidebarLesson[];

  return (
    <div>
      {/* Theme header row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 gap-2 transition-colors hover:bg-white/[0.04]"
        style={{
          borderLeft: `2px solid ${expanded ? "var(--color-accent-purple)" : "transparent"}`,
        }}
      >
        <span
          className="text-[13px] font-bold leading-tight text-left truncate"
          style={{
            color: expanded ? "#FFFFFF" : "rgba(255,255,255,0.5)",
            fontFamily: "'Science Gothic', sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          {theme.title}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2.5"
          className="shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Lessons list */}
      {expanded && (
        <div className="mb-1">
          {lessons.length === 0 ? (
            <div className="px-4 pb-3 space-y-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-white/[0.04] animate-pulse" />
              ))}
            </div>
          ) : (
            lessons.map((lesson, idx) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                locked={isLessonLocked(lessons, idx)}
                active={String(lesson.id) === currentLessonId}
              />
            ))
          )}
        </div>
      )}

      {/* Thin separator between themes */}
      <div className="mx-4 h-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

// ─── Sidebar root ─────────────────────────────────────────────────────────────

export function LessonSidebar({ currentLessonId }: Props) {
  const { theme: currentTheme, isLoading: ctxLoading } = useLessonContext(currentLessonId);

  const { data: allThemes = [], isLoading: themesLoading } = useQuery<ThemeSummary[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data } = await api.get("/api/themes");
      return data;
    },
    staleTime: 60_000,
  });

  if (ctxLoading || themesLoading) {
    return (
      <div className="p-3 space-y-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-white/[0.04] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <nav className="flex flex-col py-2 select-none overflow-y-auto flex-1">
      {allThemes.map((theme) => (
        <ThemeSection
          key={theme.id}
          theme={theme}
          currentLessonId={currentLessonId}
          defaultExpanded={theme.id === currentTheme?.id}
        />
      ))}
    </nav>
  );
}
