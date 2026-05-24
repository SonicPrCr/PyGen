"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import api from "@/lib/api";

interface Stats {
  themes: number;
  lessons: number;
  users: number;
  solutions: number;
  generations: number;
  bookmarks: number;
  notes: number;
}

export default function AdminDashboard() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      api.get("/api/admin/themes"),
      api.get("/api/admin/users"),
      api.get("/api/admin/user-solutions"),
      api.get("/api/admin/task-generations"),
      api.get("/api/admin/bookmarks"),
      api.get("/api/admin/notes"),
    ]).then(([themes, users, solutions, generations, bookmarks, notes]) => {
      const themeList = themes.data as Array<{ lessons_count: number }>;
      const lessonTotal = themeList.reduce((s, t) => s + (t.lessons_count ?? 0), 0);
      setStats({
        themes: themeList.length,
        lessons: lessonTotal,
        users: (users.data as unknown[]).length,
        solutions: (solutions.data as unknown[]).length,
        generations: (generations.data as unknown[]).length,
        bookmarks: (bookmarks.data as unknown[]).length,
        notes: (notes.data as unknown[]).length,
      });
    }).catch(() => {});
  }, [isAdmin]);

  if (!isInitialized || !isAdmin) return null;

  const cards = [
    { label: "Тем",           value: stats?.themes,      icon: "📚" },
    { label: "Уроков",        value: stats?.lessons,     icon: "🎓" },
    { label: "Пользователей", value: stats?.users,       icon: "👥" },
    { label: "Решений",       value: stats?.solutions,   icon: "💻" },
    { label: "Генераций ИИ",  value: stats?.generations, icon: "🤖" },
    { label: "Закладок",      value: stats?.bookmarks,   icon: "🔖" },
    { label: "Конспектов",    value: stats?.notes,       icon: "📝" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1
        className="text-2xl font-black text-white mb-8"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Дашборд
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span className="text-3xl">{card.icon}</span>
            <div>
              <p
                className="text-3xl sm:text-4xl font-black text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stats ? (card.value ?? 0) : "—"}
              </p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
