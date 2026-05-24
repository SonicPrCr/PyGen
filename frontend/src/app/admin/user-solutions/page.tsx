"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminBtn } from "@/components/editor/AdminPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import api from "@/lib/api";

interface UserSolution {
  id: number;
  user_email: string;
  task_title: string;
  code_preview: string;
  is_correct: boolean;
  attempts: number;
  created_at: string;
}

export default function AdminUserSolutionsPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [items, setItems] = useState<UserSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/user-solutions")
      .then((r) => setItems(r.data as UserSolution[]))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleDelete = async (id: number, email: string, task: string) => {
    if (!confirm(`Удалить решение «${task}» от ${email}?`)) return;
    await api.delete(`/api/admin/user-solutions/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = filter
    ? items.filter((i) => i.user_email.toLowerCase().includes(filter.toLowerCase()))
    : items;

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Решения пользователей" />
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
              key: "task_title",
              label: "Задание",
              render: (row) => (
                <span className="font-medium text-white">{row.task_title}</span>
              ),
            },
            {
              key: "code_preview",
              label: "Код (превью)",
              render: (row) => {
                const preview = row.code_preview.length > 60
                  ? row.code_preview.slice(0, 60) + "..."
                  : row.code_preview;
                return (
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "monospace",
                      color: "var(--color-text-muted)",
                      whiteSpace: "pre",
                    }}
                  >
                    {preview || "—"}
                  </span>
                );
              },
            },
            {
              key: "is_correct",
              label: "Верно",
              render: (row) =>
                row.is_correct ? (
                  <span className="text-green-400 font-bold text-base">✓</span>
                ) : (
                  <span className="text-red-400 font-bold text-base">✗</span>
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
              key: "created_at",
              label: "Дата",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                  {new Date(row.created_at).toLocaleDateString("ru")}
                </span>
              ),
            },
            {
              key: "actions",
              label: "Действия",
              render: (row) => (
                <AdminBtn
                  variant="danger"
                  onClick={() => handleDelete(row.id, row.user_email, row.task_title)}
                >
                  Удалить
                </AdminBtn>
              ),
            },
          ]}
          data={filtered}
          isLoading={loading}
          filterValue={filter}
          onFilterChange={setFilter}
          filterPlaceholder="Фильтр по email..."
          emptyText="Решений не найдено"
        />
      </div>
    </div>
  );
}
