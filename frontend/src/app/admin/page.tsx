"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import api from "@/lib/api";

interface Stats {
  themes: number;
  lessons: number;
  users: number;
}

export default function AdminDashboard() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      api.get("/api/admin/themes"),
      api.get("/api/admin/users"),
    ]).then(([themes, users]) => {
      const themeList = themes.data as Array<{ lessons_count: number }>;
      const lessonTotal = themeList.reduce((s, t) => s + (t.lessons_count ?? 0), 0);
      setStats({
        themes: themeList.length,
        lessons: lessonTotal,
        users: (users.data as unknown[]).length,
      });
    }).catch(() => {});
  }, [isAdmin]);

  if (!isInitialized || !isAdmin) return null;

  const cards = [
    { label: "Тем", value: stats?.themes, icon: "📚" },
    { label: "Уроков", value: stats?.lessons, icon: "📝" },
    { label: "Пользователей", value: stats?.users, icon: "👥" },
  ];

  return (
    <div className="p-8">
      <h1
        className="text-2xl font-black text-white mb-8"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Дашборд
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-6 flex flex-col gap-3"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span className="text-3xl">{card.icon}</span>
            <div>
              <p
                className="text-4xl font-black text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stats ? card.value : "—"}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
