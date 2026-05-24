"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminBtn } from "@/components/editor/AdminPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import api from "@/lib/api";

interface Note {
  id: number;
  user_email: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function AdminNotesPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/notes")
      .then((r) => setItems(r.data as Note[]))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleDelete = async (id: number, email: string, title: string) => {
    if (!confirm(`Удалить конспект «${title}» у ${email}?`)) return;
    await api.delete(`/api/admin/notes/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = filter
    ? items.filter((i) => i.user_email.toLowerCase().includes(filter.toLowerCase()))
    : items;

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Конспекты" />
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
              key: "title",
              label: "Заголовок",
              render: (row) => (
                <span className="font-medium text-white">{row.title || "Без заголовка"}</span>
              ),
            },
            {
              key: "created_at",
              label: "Создан",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                  {new Date(row.created_at).toLocaleDateString("ru")}
                </span>
              ),
            },
            {
              key: "updated_at",
              label: "Обновлён",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                  {new Date(row.updated_at).toLocaleDateString("ru")}
                </span>
              ),
            },
            {
              key: "actions",
              label: "Действия",
              render: (row) => (
                <AdminBtn
                  variant="danger"
                  onClick={() => handleDelete(row.id, row.user_email, row.title)}
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
          emptyText="Конспектов не найдено"
        />
      </div>
    </div>
  );
}
