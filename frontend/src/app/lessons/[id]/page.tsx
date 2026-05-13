"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useQueryClient } from "@tanstack/react-query";
import { useLessonContext } from "@/lib/hooks/useLessonContext";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useAuthStore } from "@/lib/stores/authStore";
import api from "@/lib/api";

// ─── Copy button for code blocks ─────────────────────────────────────────────

function CopyCodeBlock({ children }: { children?: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-5">
      <pre
        ref={preRef}
        className="rounded-xl px-5 py-4 overflow-x-auto text-sm"
        style={{ backgroundColor: "#161b22" }}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
        style={{
          backgroundColor: copied ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.07)",
          border: `1px solid ${copied ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.1)"}`,
        }}
        title="Копировать код"
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 7l3.5 3.5 5.5-6" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Markdown component overrides ────────────────────────────────────────────

const mdComponents = {
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <div
      className="my-5 px-5 py-4 rounded-xl text-sm"
      style={{
        backgroundColor: "rgba(26,21,55,0.8)",
        border: "1px solid rgba(105,94,176,0.25)",
      }}
    >
      {children}
    </div>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <CopyCodeBlock>{children}</CopyCodeBlock>
  ),
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return <code className={className} {...props}>{children}</code>;
    }
    return (
      <code
        className="px-1.5 py-0.5 rounded text-xs font-mono"
        style={{ backgroundColor: "rgba(105,94,176,0.2)", color: "#e2c4ff" }}
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th
      className="px-3 py-2 text-left font-semibold text-white/90 border-b"
      style={{ borderColor: "rgba(255,255,255,0.15)" }}
    >
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td
      className="px-3 py-2 text-white/75 border-b"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      {children}
    </td>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1
      className="text-2xl font-black text-white mb-4 mt-0"
      style={{ fontFamily: "'Science Gothic', sans-serif" }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2
      className="text-xl font-bold text-white mt-8 mb-3"
      style={{ fontFamily: "'Science Gothic', sans-serif" }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-bold text-white/90 mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-white/80 leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="space-y-1.5 mb-4 pl-0 list-none">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-2 text-white/80">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-accent-purple)" }} />
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold text-white">{children}</strong>
  ),
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LessonTheoryPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isInitialized } = useRequireAuth();
  const { lesson, theme, themeLessons, isLoading } = useLessonContext(id);

  const [isCompleting, setIsCompleting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Redirect practice lessons to editor
  useEffect(() => {
    if (lesson?.lesson_type === "practice") {
      router.replace(`/lessons/${id}/editor`);
    }
  }, [lesson, id, router]);

  const currentIdx = themeLessons.findIndex((l) => l.id === Number(id));
  const nextLesson = currentIdx >= 0 ? themeLessons[currentIdx + 1] ?? null : null;

  const handleNext = async () => {
    if (!lesson) return;

    if (!lesson.is_completed) {
      setIsCompleting(true);
      try {
        const { data } = await api.post(`/api/lessons/${id}/complete/`, { stars_earned: 3 });
        // Update user in store with fresh data from server
        if (data.user) {
          useAuthStore.setState({ user: data.user });
        }
        // Invalidate queries so sidebar/theme pages refresh
        queryClient.invalidateQueries({ queryKey: ["lesson", id] });
        queryClient.invalidateQueries({ queryKey: ["theme", lesson.theme] });
        queryClient.invalidateQueries({ queryKey: ["themes"] });
      } finally {
        setIsCompleting(false);
      }
    }

    if (nextLesson) {
      const url =
        nextLesson.lesson_type === "practice"
          ? `/lessons/${nextLesson.id}/editor`
          : `/lessons/${nextLesson.id}`;
      router.push(url);
    } else {
      router.push(`/topics/${theme?.id}`);
    }
  };

  // ── Loading / auth guard ──────────────────────────────────────────────────
  if (!isInitialized || isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-white/40 animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <p className="text-white/40">Урок не найден</p>
      </div>
    );
  }

  const isLastLesson = !nextLesson;

  return (
    <div className="flex-1 px-4 lg:px-8 py-6 lg:py-10">
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-2xl p-6 sm:p-8 lg:p-12"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            boxShadow: "0 0 40px rgba(105, 94, 176, 0.15)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* ── Lesson header ──────────────────────────────────────────── */}
          <div
            className="flex items-start justify-between gap-4 mb-6 pb-6"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <h1
              className="text-3xl lg:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Урок {lesson.order}. {lesson.title}
            </h1>
            <button
              onClick={() => setBookmarked((b) => !b)}
              className="shrink-0 mt-1 transition-opacity hover:opacity-100"
              style={{ opacity: bookmarked ? 1 : 0.35, color: bookmarked ? "var(--color-accent-yellow)" : "#FFFFFF" }}
              title="Закладка"
            >
              <svg width="22" height="26" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          {/* ── Markdown content ───────────────────────────────────────── */}
          <article>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={mdComponents}
            >
              {lesson.content?.markdown ?? ""}
            </ReactMarkdown>
          </article>

          {/* ── Bottom nav ─────────────────────────────────────────────── */}
          <div className="flex justify-end mt-8 pt-6" style={{ borderTop: "1px solid var(--color-border)" }}>
            <button
              onClick={handleNext}
              disabled={isCompleting}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                color: "#FFFFFF",
                border: "1px solid var(--color-border)",
              }}
            >
              {isCompleting
                ? "Сохраняем..."
                : isLastLesson
                ? "Завершить тему"
                : "Перейти к заданию"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
