"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader } from "@/components/editor/AdminPage";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import api from "@/lib/api";

interface Achievement {
  id: number;
  level: number;
  name: string;
  color: string;
}

export default function AdminAchievementsPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/achievements")
      .then((r) => setAchievements(r.data as Achievement[]))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Ачивки" />
      <div className="p-4 sm:p-6">
        <AdminDataTable
          columns={[
            {
              key: "level",
              label: "Уровень",
              render: (row) => (
                <span className="font-mono text-white">Lv.{row.level}</span>
              ),
            },
            {
              key: "name",
              label: "Название",
              render: (row) => (
                <span className="text-white font-medium">{row.name}</span>
              ),
            },
            {
              key: "color",
              label: "Цвет",
              render: (row) => (
                <span style={{ color: "var(--color-text-muted)", fontFamily: "monospace", fontSize: 12 }}>
                  {row.color}
                </span>
              ),
            },
            {
              key: "preview",
              label: "Превью",
              render: (row) => (
                <div
                  className="w-8 h-8 rounded-full border-2"
                  style={{ borderColor: row.color }}
                />
              ),
            },
          ]}
          data={achievements}
          isLoading={loading}
          emptyText="Ачивки не найдены"
        />
      </div>
    </div>
  );
}
