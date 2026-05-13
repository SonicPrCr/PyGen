"use client";

import { useState } from "react";
import { ChevronLeft, BookOpen, FileText, Bookmark } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { LessonSidebar } from "@/components/lessons/LessonSidebar";

interface Props {
  lessonId: string;
  children: React.ReactNode;
}

// ─── Layout root ──────────────────────────────────────────────────────────────

export function LessonLayoutClient({ lessonId, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <Header
        showBurger
        fullWidth
        logoSrc="/images/landing/logo-lesson.png"
      />

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* ── Desktop sidebar (always visible lg+) ──────────────── */}
        <aside
          className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0"
          style={{
            backgroundColor: "#1A1537",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            overflowY: "auto",
          }}
        >
          <LessonSidebar currentLessonId={lessonId} />
        </aside>

        {/* ── Mobile sidebar overlay ────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 flex"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <aside
              className="relative z-10 w-72 flex flex-col"
              style={{
                backgroundColor: "#1A1537",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile sidebar header */}
              <div
                className="flex items-center justify-between px-4 py-3 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span
                  className="text-sm font-bold text-white/60"
                  style={{ fontFamily: "'Science Gothic', sans-serif" }}
                >
                  Уроки
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <LessonSidebar currentLessonId={lessonId} />
            </aside>
          </div>
        )}

        {/* ── Main content ──────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {children}
        </main>

        {/* ── Right icon panel ──────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col items-center gap-2 w-[60px] p-2 shrink-0"
          style={{
            borderLeft: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg-primary)",
          }}
        >
          {/* Collapse button */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors mb-1 text-white/40 hover:text-white/70"
            title="Свернуть панель"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Tab buttons */}
          {([
            { id: "lessons",   Icon: BookOpen,  title: "Учебник" },
            { id: "notes",     Icon: FileText,  title: "Конспекты" },
            { id: "bookmarks", Icon: Bookmark,  title: "Закладки" },
          ] as const).map(({ id, Icon, title }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={title}
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
              style={{
                backgroundColor: activeTab === id
                  ? "var(--color-accent-purple)"
                  : "transparent",
                color: activeTab === id ? "#FFFFFF" : "rgba(255,255,255,0.35)",
              }}
            >
              <Icon size={20} />
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}
