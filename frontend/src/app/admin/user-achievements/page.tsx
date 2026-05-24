"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminBtn } from "@/components/editor/AdminPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import api from "@/lib/api";

interface UserAchievement {
  id: number;
  user_email: string;
  achievement_name: string;
  achievement_level: number;
  achievement_color: string;
  earned_at: string;
}

export default function AdminUserAchievementsPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [items, setItems] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/user-achievements")
      .then((r) => setItems(r.data as UserAchievement[]))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleDelete = async (id: number, email: string, name: string) => {
    if (!confirm(`Удалить ачивку «${name}» у ${email}?`)) return;
    await api.delete(`/api/admin/user-achievements/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = filter
    ? items.filter((i) => i.user_email.toLowerCase().includes(filter.toLowerCase()))
    : items;

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Ачивки пользователей" />
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
              key: "achievement_name",
              label: "Ачивка",
              render: (row) => (
                <span className="font-medium text-white">{row.achievement_name}</span>
              ),
            },
            {
              key: "achievement_level",
              label: "Уровень",
              render: (row) => (
                <span className="font-mono" style={{ color: "var(--color-text-muted)" }}>
                  Lv.{row.achievement_level}
                </span>
              ),
            },
            {
              key: "achievement_color",
              label: "Цвет",
              render: (row) => (
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full border-2 shrink-0"
                    style={{ borderColor: row.achievement_color }}
                  />
                  <span style={{ color: "var(--color-text-muted)", fontFamily: "monospace", fontSize: 11 }}>
                    {row.achievement_color}
                  </span>
                </div>
              ),
            },
            {
              key: "earned_at",
              label: "Дата получения",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                  {new Date(row.earned_at).toLocaleDateString("ru")}
                </span>
              ),
            },
            {
              key: "actions",
              label: "Действия",
              render: (row) => (
                <AdminBtn
                  variant="danger"
                  onClick={() => handleDelete(row.id, row.user_email, row.achievement_name)}
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
          emptyText="Ачивок не найдено"
        />
      </div>
    </div>
  );
}
