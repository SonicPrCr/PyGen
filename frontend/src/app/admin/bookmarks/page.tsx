"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminBtn } from "@/components/editor/AdminPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import api from "@/lib/api";

interface Bookmark {
  id: number;
  user_email: string;
  lesson_title: string;
  lesson_id: number;
  created_at: string;
}

export default function AdminBookmarksPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [items, setItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/bookmarks")
      .then((r) => setItems(r.data as Bookmark[]))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleDelete = async (id: number, email: string, lesson: string) => {
    if (!confirm(`Удалить закладку «${lesson}» у ${email}?`)) return;
    await api.delete(`/api/admin/bookmarks/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = filter
    ? items.filter((i) => i.user_email.toLowerCase().includes(filter.toLowerCase()))
    : items;

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Закладки" />
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
              key: "lesson_title",
              label: "Урок",
              render: (row) => (
                <span className="font-medium text-white">{row.lesson_title}</span>
              ),
            },
            {
              key: "lesson_id",
              label: "ID урока",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)", fontFamily: "monospace" }}>
                  #{row.lesson_id}
                </span>
              ),
            },
            {
              key: "created_at",
              label: "Дата добавления",
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
                  onClick={() => handleDelete(row.id, row.user_email, row.lesson_title)}
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
          emptyText="Закладок не найдено"
        />
      </div>
    </div>
  );
}
