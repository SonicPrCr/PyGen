"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminCard, AdminTable, AdminTh, AdminTd, AdminBtn, AdminSelect } from "@/components/editor/AdminPage";
import api from "@/lib/api";

interface PoolTask {
  id: number;
  theme: number;
  title: string;
  description: string;
  is_pregenerated: boolean;
  created_at: string;
}

interface Theme { id: number; title: string; }

export default function AdminTasksPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [tasks, setTasks] = useState<PoolTask[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTheme, setFilterTheme] = useState("");

  const load = () => {
    setLoading(true);
    const params = filterTheme ? `?theme=${filterTheme}` : "";
    Promise.all([
      api.get(`/api/admin/tasks${params}`),
      api.get("/api/admin/themes"),
    ]).then(([tasksRes, themesRes]) => {
      setTasks(tasksRes.data as PoolTask[]);
      setThemes(themesRes.data as Theme[]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, filterTheme]);

  const handleDelete = async (taskId: number, title: string) => {
    if (!confirm(`Удалить задание «${title}»?`)) return;
    await api.delete(`/api/admin/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const themeTitle = (id: number) => themes.find((t) => t.id === id)?.title ?? `#${id}`;

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Пул заданий" />
      <div className="p-6">
        <div className="mb-4 flex items-end gap-4">
          <div style={{ width: 260 }}>
            <AdminSelect label="Фильтр по теме" value={filterTheme} onChange={(e) => setFilterTheme(e.target.value)}>
              <option value="">Все темы</option>
              {themes.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </AdminSelect>
          </div>
          <span className="pb-2.5" style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
            Всего: {tasks.length}
          </span>
        </div>

        <AdminCard>
          {loading ? (
            <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>Загрузка...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>
              Заданий нет. Запустите <code style={{ fontFamily: "monospace", fontSize: 12 }}>python manage.py seed_task_pool --all</code>
            </div>
          ) : (
            <AdminTable>
              <thead>
                <tr>
                  <AdminTh>ID</AdminTh>
                  <AdminTh>Название</AdminTh>
                  <AdminTh>Тема</AdminTh>
                  <AdminTh>Дата</AdminTh>
                  <AdminTh>Действия</AdminTh>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <AdminTd>
                      <span style={{ color: "var(--color-text-muted)" }}>#{task.id}</span>
                    </AdminTd>
                    <AdminTd>
                      <span className="text-white font-medium">{task.title}</span>
                      <p
                        className="text-xs mt-0.5"
                        style={{
                          color: "var(--color-text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 340,
                        }}
                      >
                        {task.description}
                      </p>
                    </AdminTd>
                    <AdminTd>
                      <span style={{ color: "var(--color-text-muted)" }}>{themeTitle(task.theme)}</span>
                    </AdminTd>
                    <AdminTd>
                      <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                        {new Date(task.created_at).toLocaleDateString("ru")}
                      </span>
                    </AdminTd>
                    <AdminTd>
                      <AdminBtn variant="danger" onClick={() => handleDelete(task.id, task.title)}>
                        Удалить
                      </AdminBtn>
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
