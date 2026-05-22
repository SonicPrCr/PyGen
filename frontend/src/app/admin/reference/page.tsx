"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminCard, AdminTable, AdminTh, AdminTd, AdminBtn, AdminInput } from "@/components/editor/AdminPage";
import api from "@/lib/api";

interface Article {
  id: number;
  title: string;
  order: number;
}

interface Category {
  id: number;
  title: string;
  order: number;
  articles: Article[];
}

export default function AdminReferencePage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatOrder, setNewCatOrder] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => {
    api.get("/api/admin/reference/categories").then((r) => {
      setCategories(r.data as Category[]);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitle.trim()) return;
    setAddingCat(true);
    try {
      const resp = await api.post("/api/admin/reference/categories", {
        title: newCatTitle.trim(),
        order: Number(newCatOrder) || 0,
      });
      setCategories((prev) => [...prev, resp.data as Category]);
      setNewCatTitle("");
      setNewCatOrder("");
    } finally {
      setAddingCat(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!confirm(`Удалить категорию «${cat.title}»? Все статьи будут удалены!`)) return;
    await api.delete(`/api/admin/reference/categories/${cat.id}`);
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
  };

  const handleDeleteArticle = async (catId: number, artId: number, title: string) => {
    if (!confirm(`Удалить статью «${title}»?`)) return;
    await api.delete(`/api/admin/reference/articles/${artId}`);
    setCategories((prev) => prev.map((c) =>
      c.id === catId ? { ...c, articles: c.articles.filter((a) => a.id !== artId) } : c
    ));
  };

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader title="Справочник" />
      <div className="p-6 flex flex-col gap-6 max-w-4xl">

        {/* Новая категория */}
        <AdminCard className="p-5">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-muted)" }}>
            Добавить категорию
          </p>
          <form onSubmit={handleAddCategory} className="flex gap-3 items-end">
            <div className="flex-1">
              <AdminInput
                label="Название"
                value={newCatTitle}
                onChange={(e) => setNewCatTitle(e.target.value)}
                required
              />
            </div>
            <div style={{ width: 100 }}>
              <AdminInput
                label="Порядок"
                type="number"
                value={newCatOrder}
                onChange={(e) => setNewCatOrder(e.target.value)}
              />
            </div>
            <AdminBtn type="submit" variant="primary" disabled={addingCat}>
              {addingCat ? "..." : "+ Добавить"}
            </AdminBtn>
          </form>
        </AdminCard>

        {/* Список категорий */}
        {loading ? (
          <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>Загрузка...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>Категорий нет</div>
        ) : (
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <AdminCard key={cat.id}>
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-mono px-1.5 py-0.5 rounded"
                      style={{ background: "var(--color-surface-raised)", color: "var(--color-text-muted)" }}
                    >
                      #{cat.order}
                    </span>
                    <span className="font-semibold text-white">{cat.title}</span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {cat.articles.length} статей
                    </span>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <AdminBtn href={`/admin/reference/articles/new?category_id=${cat.id}`} variant="ghost">
                      + Статья
                    </AdminBtn>
                    <AdminBtn variant="danger" onClick={() => handleDeleteCategory(cat)}>
                      Удалить
                    </AdminBtn>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {expanded === cat.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {expanded === cat.id && cat.articles.length > 0 && (
                  <div style={{ borderTop: "1px solid var(--color-border)" }}>
                    <AdminTable>
                      <thead>
                        <tr>
                          <AdminTh>#</AdminTh>
                          <AdminTh>Название</AdminTh>
                          <AdminTh>Действия</AdminTh>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.articles.map((art) => (
                          <tr key={art.id}>
                            <AdminTd>{art.order}</AdminTd>
                            <AdminTd><span className="text-white">{art.title}</span></AdminTd>
                            <AdminTd>
                              <div className="flex gap-2">
                                <AdminBtn href={`/admin/reference/articles/${art.id}`} variant="ghost">
                                  Редактировать
                                </AdminBtn>
                                <AdminBtn variant="danger" onClick={() => handleDeleteArticle(cat.id, art.id, art.title)}>
                                  Удалить
                                </AdminBtn>
                              </div>
                            </AdminTd>
                          </tr>
                        ))}
                      </tbody>
                    </AdminTable>
                  </div>
                )}

                {expanded === cat.id && cat.articles.length === 0 && (
                  <div
                    className="p-4 text-center text-sm"
                    style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
                  >
                    Статей нет
                  </div>
                )}
              </AdminCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
