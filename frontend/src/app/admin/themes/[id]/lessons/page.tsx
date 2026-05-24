"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminBtn, AdminCard, AdminTable, AdminTh, AdminTd } from "@/components/editor/AdminPage";
import api from "@/lib/api";

interface Lesson {
  id: number;
  title: string;
  order: number;
  lesson_type: string;
  xp_reward: number;
}

interface Theme {
  id: number;
  title: string;
}

export default function AdminThemeLessonsPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const { id } = useParams<{ id: string }>();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get(`/api/admin/themes/${id}`).then((r) => {
      const d = r.data as { id: number; title: string; lessons: Lesson[] };
      setTheme({ id: d.id, title: d.title });
      setLessons(d.lessons ?? []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, id]);

  const handleDelete = async (lessonId: number, title: string) => {
    if (!confirm(`Удалить урок «${title}»?`)) return;
    await api.delete(`/api/admin/lessons/${lessonId}`);
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
  };

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader
        title={theme ? `Уроки: ${theme.title}` : "Уроки"}
        action={<AdminBtn href={`/admin/lessons/new?theme_id=${id}`} variant="primary">+ Создать урок</AdminBtn>}
      />
      <div className="p-4 sm:p-6">
        <AdminCard>
          {loading ? (
            <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>Загрузка...</div>
          ) : lessons.length === 0 ? (
            <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>Уроков нет</div>
          ) : (
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>#</AdminTh>
                  <AdminTh>Название</AdminTh>
                  <AdminTh>Тип</AdminTh>
                  <AdminTh>XP</AdminTh>
                  <AdminTh>Действия</AdminTh>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id}>
                    <AdminTd>{lesson.order}</AdminTd>
                    <AdminTd><span className="text-white font-medium">{lesson.title}</span></AdminTd>
                    <AdminTd>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: lesson.lesson_type === "practice" ? "rgba(105,94,176,0.2)" : "rgba(255,219,58,0.1)",
                          color: lesson.lesson_type === "practice" ? "var(--color-accent-purple-light)" : "var(--color-accent-yellow)",
                        }}
                      >
                        {lesson.lesson_type === "practice" ? "Практика" : "Теория"}
                      </span>
                    </AdminTd>
                    <AdminTd>{lesson.xp_reward} XP</AdminTd>
                    <AdminTd>
                      <div className="flex items-center gap-2">
                        <AdminBtn href={`/admin/lessons/${lesson.id}`} variant="ghost">Редактировать</AdminBtn>
                        <AdminBtn variant="danger" onClick={() => handleDelete(lesson.id, lesson.title)}>Удалить</AdminBtn>
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
