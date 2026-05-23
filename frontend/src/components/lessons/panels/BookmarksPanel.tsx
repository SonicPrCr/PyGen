"use client";

import Link from "next/link";
import { useBookmarks } from "@/lib/hooks/useBookmarks";

export function BookmarksPanel() {
  const { bookmarks, isLoading, deleteBookmark } = useBookmarks();

  if (isLoading && bookmarks.length === 0) {
    return (
      <div className="p-4 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl animate-pulse"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6 text-center h-48">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
          Нет закладок
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
          Нажми на иконку закладки на уроке, чтобы сохранить его
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-3 flex flex-col gap-2">
      {bookmarks.map((bookmark) => {
        const isPractice = bookmark.lesson.lesson_type === "practice";
        const href = isPractice
          ? `/lessons/${bookmark.lesson.id}/editor`
          : `/lessons/${bookmark.lesson.id}`;

        return (
          <div
            key={bookmark.id}
            className="rounded-xl p-3 flex flex-col gap-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Title + type badge */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-white leading-tight">
                {bookmark.lesson.title}
              </span>
              <span
                className="shrink-0 text-xs px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: isPractice
                    ? "rgba(105,94,176,0.25)"
                    : "rgba(255,255,255,0.08)",
                  color: isPractice ? "#c4b5fd" : "rgba(255,255,255,0.5)",
                }}
              >
                {isPractice ? "Задание" : "Теория"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={href}
                className="flex-1 text-center text-xs py-1.5 rounded-lg font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "var(--color-accent-purple)",
                  color: "#fff",
                }}
              >
                Перейти
              </Link>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 text-white/30 hover:text-white/60"
                title="Удалить закладку"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
