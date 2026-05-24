"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, BookOpen, FileText, Bookmark } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { LessonSidebar } from "@/components/lessons/LessonSidebar";
import { LessonsPanel } from "@/components/lessons/panels/LessonsPanel";
import { NotesPanel } from "@/components/lessons/panels/NotesPanel";
import { BookmarksPanel } from "@/components/lessons/panels/BookmarksPanel";

interface Props {
  lessonId: string;
  children: React.ReactNode;
}

const TAB_LABELS: Record<string, string> = {
  lessons: "Учебник",
  notes: "Конспекты",
  bookmarks: "Закладки",
};

export function LessonLayoutClient({ lessonId, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isEditorPage = pathname.endsWith("/editor");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("lessons");
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [previewLessonId, setPreviewLessonId] = useState<string>(lessonId);

  // Sync when user navigates to a different lesson
  useEffect(() => { setPreviewLessonId(lessonId); }, [lessonId]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setRightPanelOpen(true);
  };

  const handleSidebarLessonClick = (id: number, type: string) => {
    setPreviewLessonId(String(id));
    setActiveTab("lessons");
    setRightPanelOpen(true);
    if (isEditorPage && type === "practice") {
      router.push(`/lessons/${id}/editor`);
    } else if (!isEditorPage && type === "theory") {
      router.push(`/lessons/${id}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <Header
        showBurger
        fullWidth
        logoSrc="/images/landing/logo-lesson.png"
        bgColor="#29292F"
        onBurgerClick={() => {
          // Desktop: toggle left sidebar; Mobile: open overlay
          if (window.innerWidth >= 1024) {
            setLeftOpen((v) => !v);
          } else {
            setSidebarOpen((v) => !v);
          }
        }}
      />

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* ── Desktop sidebar (collapsible lg+) ────────────────── */}
        <aside
          className="hidden lg:flex flex-col shrink-0 transition-all duration-200 overflow-hidden"
          style={{
            width: leftOpen ? 272 : 0,
            backgroundColor: "#3C3F41",
            borderRight: leftOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
            overflowY: leftOpen ? "auto" : "hidden",
          }}
        >
          <LessonSidebar
              currentLessonId={lessonId}
              onLessonClick={handleSidebarLessonClick}
            />
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
                backgroundColor: "#3C3F41",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
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
              <LessonSidebar
              currentLessonId={lessonId}
              onLessonClick={handleSidebarLessonClick}
            />
            </aside>
          </div>
        )}

        {/* ── Main content ──────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {children}
        </main>

        {/* ── Right panel (icon strip + expandable content) ──────── */}
        <aside
          className="flex transition-all duration-200 overflow-hidden shrink-0"
          style={{
            width: rightPanelOpen ? 380 : 60,
            borderLeft: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Icon strip (always visible, left side of right panel) */}
          <div
            className="flex flex-col items-center gap-2 p-2 shrink-0"
            style={{
              width: 60,
              backgroundColor: "#3C3F41",
              borderRight: rightPanelOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            <button
              onClick={() => setRightPanelOpen((v) => !v)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors mb-1 text-white/50 hover:text-white/90"
              title={rightPanelOpen ? "Свернуть панель" : "Развернуть панель"}
            >
              {rightPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {([
              { id: "lessons",   Icon: BookOpen,  title: "Учебник" },
              { id: "notes",     Icon: FileText,  title: "Конспекты" },
              { id: "bookmarks", Icon: Bookmark,  title: "Закладки" },
            ] as const).map(({ id, Icon, title }) => (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                title={title}
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
                style={{
                  backgroundColor:
                    activeTab === id && rightPanelOpen
                      ? "var(--color-accent-purple)"
                      : "transparent",
                  color:
                    activeTab === id && rightPanelOpen
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.35)",
                }}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>

          {/* Expandable content panel */}
          {rightPanelOpen && (
            <div
              className="flex flex-col overflow-hidden"
              style={{
                width: 320,
                backgroundColor: "#303234",
              }}
            >
              {/* Panel header */}
              <div
                className="px-4 py-3 shrink-0 flex items-center"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="font-semibold text-sm text-white">
                  {TAB_LABELS[activeTab]}
                </span>
              </div>

              {/* Panel content — panels manage their own scroll */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === "lessons" && (
                  <LessonsPanel previewLessonId={previewLessonId} />
                )}
                {activeTab === "notes" && <NotesPanel />}
                {activeTab === "bookmarks" && <BookmarksPanel />}
              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
