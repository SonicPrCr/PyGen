"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminBtn } from "@/components/editor/AdminPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import api from "@/lib/api";

interface UserProgress {
  id: number;
  user_email: string;
  lesson_title: string;
  theme_title: string;
  completed: boolean;
  stars_earned: number;
  attempts: number;
  completed_at: string | null;
}

export default function AdminUserProgressPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [items, setItems] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/user-progress")
      .then((r) => setItems(r.data as UserProgress[]))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleDelete = async (id: number, email: string, lesson: string) => {
    if (!confirm(`Сбросить прогресс «${lesson}» для ${email}?`)) return;
    await api.delete(`/api/admin/user-progress/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = filter
    ? items.filter((i) => i.user_email.toLowerCase().includes(filter.toLowerCase()))
    : items;

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Прогресс пользователей" />
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
              key: "lesson_title",
              label: "Урок",
              render: (row) => (
                <span className="font-medium text-white">{row.lesson_title}</span>
              ),
            },
            {
              key: "completed",
              label: "Пройден",
              render: (row) =>
                row.completed ? (
                  <span className="text-green-400 font-bold text-base">✓</span>
                ) : (
                  <span style={{ color: "var(--color-text-muted)" }}>—</span>
                ),
            },
            {
              key: "stars_earned",
              label: "Звёзды",
              render: (row) => (
                <span style={{ color: row.stars_earned > 0 ? "#F5C842" : "var(--color-text-muted)" }}>
                  {"★".repeat(row.stars_earned) || "—"}
                </span>
              ),
            },
            {
              key: "attempts",
              label: "Попытки",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)" }}>{row.attempts}</span>
              ),
            },
            {
              key: "completed_at",
              label: "Дата",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                  {row.completed_at
                    ? new Date(row.completed_at).toLocaleDateString("ru")
                    : "—"}
                </span>
              ),
            },
            {
              key: "actions",
              label: "Действия",
              render: (row) => (
                <AdminBtn
                  variant="danger"
                  onClick={() => handleDelete(row.id, row.user_email, row.lesson_title)}
                >
                  Сбросить
                </AdminBtn>
              ),
            },
          ]}
          data={filtered}
          isLoading={loading}
          filterValue={filter}
          onFilterChange={setFilter}
          filterPlaceholder="Фильтр по email..."
          emptyText="Прогресс не найден"
        />
      </div>
    </div>
  );
}
