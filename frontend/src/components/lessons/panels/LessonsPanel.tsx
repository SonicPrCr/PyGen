"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { useLessonContext, type LessonDetail } from "@/lib/hooks/useLessonContext";
import { useEditorPanelStore } from "@/lib/stores/editorPanelStore";
import { useAuthStore } from "@/lib/stores/authStore";
import api from "@/lib/api";

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}ч ${m}м`;
  if (m > 0) return `${m}м ${s}с`;
  return `${s}с`;
}

interface Props {
  previewLessonId: string;
}

// ─── Lesson content renderer ──────────────────────────────────────────────────

function LessonContentView({ lesson }: { lesson: LessonDetail }) {
  const content = lesson.content as Record<string, unknown> | null;

  if (!content) {
    return <p className="text-xs px-1" style={{ color: "rgba(255,255,255,0.25)" }}>Нет содержимого</p>;
  }

  if (content.type === "doc") {
    return <TipTapEditor content={content} mode="read" />;
  }

  const markdown = (content as { markdown?: string }).markdown;
  if (markdown) {
    return (
      <p className="text-xs leading-relaxed whitespace-pre-wrap px-1" style={{ color: "rgba(255,255,255,0.7)" }}>
        {markdown}
      </p>
    );
  }

  return <p className="text-xs px-1" style={{ color: "rgba(255,255,255,0.25)" }}>Нет содержимого</p>;
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function LessonsPanel({ previewLessonId }: Props) {
  const store = useEditorPanelStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditorPage = store.onCheck !== null;
  const [isNavigating, setIsNavigating] = useState(false);

  const { data: previewLesson, isLoading: previewLoading } = useQuery<LessonDetail>({
    queryKey: ["lesson-preview", previewLessonId],
    queryFn: async () => {
      const { data } = await api.get(`/api/lessons/${previewLessonId}`);
      return data as LessonDetail;
    },
    enabled: !!previewLessonId,
    staleTime: 60_000,
  });

  const { themeLessons } = useLessonContext(previewLessonId);
  const currentIdx = themeLessons.findIndex((l) => String(l.id) === previewLessonId);
  const nextLesson = currentIdx >= 0 ? themeLessons[currentIdx + 1] ?? null : null;

  const isPractice = previewLesson?.lesson_type === "practice";

  const handleNextLesson = async () => {
    if (!nextLesson || isNavigating) return;
    setIsNavigating(true);
    try {
      if (previewLesson && !previewLesson.is_completed) {
        const { data } = await api.post(`/api/lessons/${previewLessonId}/complete/`, { stars_earned: 3 });
        if (data.user) useAuthStore.setState({ user: data.user });
        queryClient.invalidateQueries({ queryKey: ["lesson", previewLessonId] });
        queryClient.invalidateQueries({ queryKey: ["theme", previewLesson.theme] });
        queryClient.invalidateQueries({ queryKey: ["themes"] });
        queryClient.invalidateQueries({ queryKey: ["lesson-preview", previewLessonId] });
      }
      router.push(
        nextLesson.lesson_type === "practice"
          ? `/lessons/${nextLesson.id}/editor`
          : `/lessons/${nextLesson.id}`
      );
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* ── Preview lesson content ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {previewLoading ? (
          <div className="p-4 flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 rounded animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
            ))}
          </div>
        ) : previewLesson ? (
          <>
            {/* Lesson header */}
            <div className="px-3 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: isPractice ? "rgba(105,94,176,0.2)" : "rgba(255,255,255,0.07)",
                  color: isPractice ? "#c4b5fd" : "rgba(255,255,255,0.45)",
                }}
              >
                {isPractice ? "</> Задание" : "≡ Теория"}
              </span>
              <p className="text-sm font-bold text-white mt-1.5 leading-tight">
                Урок {previewLesson.order}. {previewLesson.title}
              </p>
            </div>

            {/* Active task card (practice + task loaded in editor) */}
            {isPractice && store.taskTitle && (
              <div
                className="mx-3 mt-3 rounded-xl p-3"
                style={{ backgroundColor: "rgba(105,94,176,0.12)", border: "1px solid rgba(105,94,176,0.25)" }}
              >
                {store.taskSource && (
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium mb-2 inline-block"
                    style={{ backgroundColor: "rgba(105,94,176,0.2)", color: "#c4b5fd" }}>
                    {store.taskSource === "ai" ? "🤖 ИИ" : "📦 Пул"}
                  </span>
                )}
                <p className="text-xs font-bold text-white mb-1">{store.taskTitle}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{store.taskDescription}</p>
              </div>
            )}

            {/* Lesson content */}
            <div className="px-2 py-3">
              <LessonContentView lesson={previewLesson} />
            </div>

            {/* AI Hint */}
            {store.aiHint && isPractice && (
              <div className="mx-3 mb-3 p-3 rounded-xl"
                style={{ backgroundColor: "rgba(105,94,176,0.1)", borderLeft: "3px solid var(--color-accent-purple)" }}>
                <p className="text-xs font-bold text-white mb-1">💡 Подсказка от ИИ:</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{store.aiHint}</p>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* ── Theory navigation buttons ──────────────────────────────────────── */}
      {!isPractice && previewLesson && (
        <div className="shrink-0 flex flex-col gap-2 px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => router.push(`/lessons/${previewLessonId}`)}
            className="w-full py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 flex items-center justify-center gap-2"
            style={{ backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            Открыть урок
          </button>
          {nextLesson && (
            <button
              onClick={handleNextLesson}
              disabled={isNavigating}
              className="w-full py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-accent-yellow)", color: "#0C0827" }}
            >
              {isNavigating
                ? <span className="w-3 h-3 rounded-full border-2 border-t-transparent border-[#0C0827] animate-spin" />
                : "Следующий урок →"}
            </button>
          )}
        </div>
      )}

      {/* ── Practice action buttons ─────────────────────────────────────────── */}
      {isPractice && (
        <div className="shrink-0 flex flex-col gap-2 px-3 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>

          {isEditorPage ? (
            <>
              <button
                onClick={() => store.onCheck?.()}
                disabled={store.isRunning}
                className="w-full py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--color-accent-purple)", color: "#fff" }}
              >
                {store.isRunning
                  ? <><span className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin" />Проверка...</>
                  : "▶ Проверить"}
              </button>

              {store.taskTitle && store.lastCheckFailed && (
                <button
                  onClick={() => store.onHint?.()}
                  disabled={store.isLoadingHint}
                  className="w-full py-2 rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
                  style={{ backgroundColor: "rgba(105,94,176,0.12)", color: "#c4b5fd", border: "1px solid rgba(105,94,176,0.3)" }}
                >
                  {store.isLoadingHint
                    ? <span className="w-3 h-3 rounded-full border-2 border-t-transparent border-purple-400 animate-spin" />
                    : "💡"} Подсказка
                </button>
              )}

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => store.onGenerate?.()}
                  disabled={store.isGenerating || store.isRunning || store.remainingGenerations === 0}
                  className="w-full py-2 rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
                  style={{ backgroundColor: "rgba(255,219,58,0.08)", color: "var(--color-accent-yellow)", border: "1px solid rgba(255,219,58,0.2)" }}
                >
                  {store.isGenerating
                    ? <span className="w-3 h-3 rounded-full border-2 border-t-transparent border-yellow-400 animate-spin" />
                    : "✦"} Генерация ({store.remainingGenerations})
                </button>
                {store.remainingGenerations === 0 && store.resetInSeconds !== null && (
                  <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Сброс через {formatCountdown(store.resetInSeconds)}
                  </p>
                )}
              </div>

              <button
                onClick={() => store.onNext?.()}
                disabled={!store.canProceed}
                className="w-full py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--color-accent-yellow)", color: "#0C0827" }}
              >
                {store.nextLessonLabel}
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push(`/lessons/${previewLessonId}/editor`)}
              className="w-full py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-80 flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-accent-purple)", color: "#fff" }}
            >
              Перейти к заданию →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
