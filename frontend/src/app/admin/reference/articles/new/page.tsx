"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { AdminHeader, AdminBtn, AdminInput, AdminSelect } from "@/components/editor/AdminPage";
import api from "@/lib/api";

interface Category { id: number; title: string; }

export default function AdminArticleNewPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategoryId = searchParams.get("category_id") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState({ category: defaultCategoryId, title: "", order: "0" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/reference/categories").then((r) => setCategories(r.data as Category[]));
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.category || !form.title) { setError("Выберите категорию и введите название"); return; }
    setSaving(true);
    try {
      await api.post("/api/admin/reference/articles", {
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
        title="Новая статья"
        action={
          <div className="flex gap-2">
            <AdminBtn variant="ghost" onClick={() => setPreview((p) => !p)}>
              {preview ? "✏️ Редактировать" : "👁 Предпросмотр"}
            </AdminBtn>
            <AdminBtn href="/admin/reference" variant="ghost">← Справочник</AdminBtn>
          </div>
        }
      />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-73px)]">
          <div
            className="w-full lg:w-80 lg:shrink-0 flex flex-col gap-4 p-4 sm:p-5 lg:overflow-y-auto"
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
                {saving ? "Сохраняем..." : "Создать статью"}
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
    </div>
  );
}
