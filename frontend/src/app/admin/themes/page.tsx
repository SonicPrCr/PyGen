"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminBtn, AdminCard, AdminTable, AdminTh, AdminTd } from "@/components/editor/AdminPage";
import api from "@/lib/api";

interface Theme {
  id: number;
  title: string;
  order: number;
  icon: string | null;
  lessons_count: number;
}

export default function AdminThemesPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/api/admin/themes").then((r) => {
      setThemes(r.data as Theme[]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Удалить тему «${title}»? Все уроки будут удалены!`)) return;
    await api.delete(`/api/admin/themes/${id}`);
    setThemes((prev) => prev.filter((t) => t.id !== id));
  };

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader
        title="Темы курса"
        action={<AdminBtn href="/admin/themes/new" variant="primary">+ Создать тему</AdminBtn>}
      />

      <div className="p-4 sm:p-6">
        <AdminCard>
          {loading ? (
            <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>Загрузка...</div>
          ) : themes.length === 0 ? (
            <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>Тем нет</div>
          ) : (
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>#</AdminTh>
                  <AdminTh>Иконка</AdminTh>
                  <AdminTh>Название</AdminTh>
                  <AdminTh>Уроков</AdminTh>
                  <AdminTh>Действия</AdminTh>
                </tr>
              </thead>
              <tbody>
                {themes.map((theme) => (
                  <tr key={theme.id}>
                    <AdminTd>{theme.order}</AdminTd>
                    <AdminTd>
                      {theme.icon ? (
                        <Image src={theme.icon} alt={theme.title} width={36} height={36}
                          className="rounded-lg object-contain"
                          style={{ background: "rgba(255,255,255,0.05)" }} unoptimized />
                      ) : (
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                          style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-text-muted)" }}>
                          ?
                        </div>
                      )}
                    </AdminTd>
                    <AdminTd><span className="text-white font-medium">{theme.title}</span></AdminTd>
                    <AdminTd>{theme.lessons_count}</AdminTd>
                    <AdminTd>
                      <div className="flex items-center gap-2">
                        <AdminBtn href={`/admin/themes/${theme.id}/lessons`} variant="ghost">Уроки</AdminBtn>
                        <AdminBtn href={`/admin/themes/${theme.id}`} variant="ghost">Редактировать</AdminBtn>
                        <AdminBtn variant="danger" onClick={() => handleDelete(theme.id, theme.title)}>Удалить</AdminBtn>
                      </div>
                    </AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
