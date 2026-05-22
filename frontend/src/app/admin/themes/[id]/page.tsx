"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { AdminHeader, AdminBtn, AdminCard, AdminInput, AdminTextarea } from "@/components/editor/AdminPage";
import api from "@/lib/api";

export default function AdminThemeEditPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", order: "" });
  const [currentIcon, setCurrentIcon] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!isAdmin) return;
    api.get(`/api/admin/themes/${id}`).then((r) => {
      const d = r.data as { title: string; description: string; order: number; icon: string | null };
      setForm({ title: d.title, description: d.description, order: String(d.order) });
      setCurrentIcon(d.icon ?? null);
    }).finally(() => setLoading(false));
  }, [isAdmin, id]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setIconFile(file);
    setIconPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("order", String(Number(form.order)));
      if (iconFile) formData.append("icon", iconFile);

      await api.patch(`/api/admin/themes/${id}`, formData, {
        headers: { "Content-Type": undefined as unknown as string },
      });
      router.push("/admin/themes");
    } catch (err: unknown) {
      const e = err as { response?: { data?: Record<string, unknown> } };
      setError(JSON.stringify(e.response?.data ?? "Ошибка сохранения"));
      setSaving(false);
    }
  };

  if (!isInitialized || !isAdmin) return null;

  const displayIcon = iconPreview ?? currentIcon;

  return (
    <div>
      <AdminHeader title="Редактировать тему" />
      <div className="p-6 max-w-xl">
        {loading ? (
          <p style={{ color: "var(--color-text-muted)" }}>Загрузка...</p>
        ) : (
          <AdminCard className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AdminInput label="Название" value={form.title} onChange={(e) => set("title", e.target.value)} required />
              <AdminTextarea label="Описание" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
              <AdminInput label="Порядок" type="number" value={form.order} onChange={(e) => set("order", e.target.value)} required />

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Иконка темы</span>
                <div className="flex items-center gap-3">
                  {displayIcon && (
                    <Image src={displayIcon} alt="icon" width={48} height={48} className="rounded-lg object-contain"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--color-border)" }} unoptimized />
                  )}
                  <input type="file" accept="image/*" onChange={handleIconChange}
                    className="text-sm" style={{ color: "var(--color-text-secondary)" }} />
                </div>
                {currentIcon && !iconFile && (
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Выберите файл, чтобы заменить текущую иконку
                  </p>
                )}
              </label>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <AdminBtn type="submit" variant="primary" disabled={saving}>{saving ? "Сохраняем..." : "Сохранить"}</AdminBtn>
                <AdminBtn href="/admin/themes" variant="ghost">Отмена</AdminBtn>
              </div>
            </form>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
