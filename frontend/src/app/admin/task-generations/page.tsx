"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader } from "@/components/editor/AdminPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import api from "@/lib/api";

interface TaskGeneration {
  id: number;
  user_email: string;
  theme_title: string;
  count: number;
  last_generated_at: string | null;
}

const LIMIT = 3;

export default function AdminTaskGenerationsPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [items, setItems] = useState<TaskGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/task-generations")
      .then((r) => setItems(r.data as TaskGeneration[]))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleReset = async (id: number, email: string, theme: string) => {
    if (!confirm(`Сбросить счётчик генераций «${theme}» для ${email}?`)) return;
    setResetting(id);
    try {
      await api.post(`/api/admin/task-generations/${id}/reset`);
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, count: 0 } : i));
    } finally {
      setResetting(null);
    }
  };

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Генерации ИИ" />
      <div className="p-4 sm:p-6">
        <AdminDataTable
          columns={[
            {
              key: "user_email",
              label: "Пользователь",
              render: (row) => (
                <span className="text-white">{row.user_email}</span>
              ),
            },
            {
              key: "theme_title",
              label: "Тема",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)" }}>{row.theme_title}</span>
              ),
            },
            {
              key: "count",
              label: "Использовано генераций",
              render: (row) => {
                const pct = Math.min((row.count / LIMIT) * 100, 100);
                const exhausted = row.count >= LIMIT;
                return (
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: exhausted
                            ? "#EF4444"
                            : "var(--color-accent-purple)",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs shrink-0 font-mono"
                      style={{ color: exhausted ? "#EF4444" : "var(--color-text-muted)" }}
                    >
                      {row.count}/{LIMIT}
                    </span>
                  </div>
                );
              },
            },
            {
              key: "last_generated_at",
              label: "Последняя генерация",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                  {row.last_generated_at
                    ? new Date(row.last_generated_at).toLocaleString("ru")
                    : "—"}
                </span>
              ),
            },
            {
              key: "actions",
              label: "Действия",
              render: (row) => (
                <button
                  disabled={resetting === row.id || row.count === 0}
                  onClick={() => handleReset(row.id, row.user_email, row.theme_title)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--color-accent-yellow)",
                    color: "#000000",
                  }}
                >
                  {resetting === row.id ? "..." : "Сбросить"}
                </button>
              ),
            },
          ]}
          data={items}
          isLoading={loading}
          emptyText="Генераций не найдено"
        />
      </div>
    </div>
  );
}
