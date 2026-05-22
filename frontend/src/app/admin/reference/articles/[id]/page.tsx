"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { AdminHeader, AdminBtn, AdminInput, AdminSelect } from "@/components/editor/AdminPage";
import api from "@/lib/api";

interface Category { id: number; title: string; }

export default function AdminArticleEditPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState({ category: "", title: "", order: "0" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      api.get("/api/admin/reference/categories"),
      api.get(`/api/admin/reference/articles/${id}`),
    ]).then(([catsRes, artRes]) => {
      setCategories(catsRes.data as Category[]);
      const d = artRes.data as { category: number; title: string; order: number; content: Record<string, unknown> };
      setForm({ category: String(d.category), title: d.title, order: String(d.order) });
      setContent(d.content ?? { type: "doc", content: [] });
    }).finally(() => setLoading(false));
  }, [isAdmin, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.category || !form.title) { setError("Выберите категорию и введите название"); return; }
    setSaving(true);
    try {
      await api.patch(`/api/admin/reference/articles/${id}`, {
        category: Number(form.category),
        title: form.title.trim(),
        order: Number(form.order),
        content: content ?? { type: "doc", content: [] },
      });
      router.push("/admin/reference");
    } catch (err: unknown) {
      const e = err as { response?: { data?: Record<string, unknown> } };
      setError(JSON.stringify(e.response?.data ?? "Ошибка сохранения"));
      setSaving(false);
    }
  };

  if (!isInitialized || !isAdmin) return null;

  return (
    <div>
      <AdminHeader
        title="Редактировать статью"
        action={
          <div className="flex gap-2">
            <AdminBtn variant="ghost" onClick={() => setPreview((p) => !p)}>
              {preview ? "✏️ Редактировать" : "👁 Предпросмотр"}
            </AdminBtn>
            <AdminBtn href="/admin/reference" variant="ghost">← Справочник</AdminBtn>
          </div>
        }
      />
      {loading ? (
        <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>Загрузка...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-0 h-[calc(100vh-73px)]">
            <div
              className="w-80 shrink-0 flex flex-col gap-4 p-5 overflow-y-auto"
              style={{ borderRight: "1px solid var(--color-border)" }}
            >
              <AdminSelect label="Категория" value={form.category} onChange={(e) => set("category", e.target.value)} required>
                <option value="">Выберите категорию...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </AdminSelect>
              <AdminInput label="Название статьи" value={form.title} onChange={(e) => set("title", e.target.value)} required />
              <AdminInput label="Порядок" type="number" value={form.order} onChange={(e) => set("order", e.target.value)} />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex flex-col gap-2 pt-2">
                <AdminBtn type="submit" variant="primary" disabled={saving}>
                  {saving ? "Сохраняем..." : "Сохранить статью"}
                </AdminBtn>
                <AdminBtn href="/admin/reference" variant="ghost">Отмена</AdminBtn>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TipTapEditor
                content={content}
                onChange={setContent}
                mode={preview ? "read" : "edit"}
                placeholder="Начни писать содержимое статьи..."
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
