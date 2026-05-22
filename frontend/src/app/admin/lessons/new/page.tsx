"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { AdminHeader, AdminBtn, AdminCard, AdminInput, AdminTextarea, AdminSelect } from "@/components/editor/AdminPage";
import api from "@/lib/api";

interface Theme { id: number; title: string; }

export default function AdminLessonNewPage() {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultThemeId = searchParams.get("theme_id") ?? "";

  const [themes, setThemes] = useState<Theme[]>([]);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState<Record<string, unknown> | null>(null);

  const [form, setForm] = useState({
    theme: defaultThemeId,
    title: "",
    order: "",
    lesson_type: "theory",
    xp_reward: "10",
    stars_reward: "1",
    starter_code: "",
    test_cases: "[]",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/api/admin/themes").then((r) => setThemes(r.data as Theme[]));
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.theme || !form.title || !form.order) { setError("Заполните тему, название и порядок"); return; }

    let parsedTestCases = [];
    if (form.lesson_type === "practice") {
      try { parsedTestCases = JSON.parse(form.test_cases); }
      catch { setError("Тест-кейсы — невалидный JSON"); return; }
    }

    setSaving(true);
    try {
      const resp = await api.post("/api/admin/lessons", {
        theme: Number(form.theme),
        title: form.title.trim(),
        order: Number(form.order),
        lesson_type: form.lesson_type,
        xp_reward: Number(form.xp_reward),
        stars_reward: Number(form.stars_reward),
        content: content ?? { type: "doc", content: [] },
        starter_code: form.lesson_type === "practice" ? form.starter_code : "",
        test_cases: parsedTestCases,
      });
      const lesson = resp.data as { id: number; theme: number };
      router.push(`/admin/themes/${lesson.theme}/lessons`);
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
        title="Новый урок"
        action={
          <div className="flex gap-2">
            <AdminBtn variant="ghost" onClick={() => setPreview((p) => !p)}>
              {preview ? "✏️ Редактировать" : "👁 Предпросмотр"}
            </AdminBtn>
          </div>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="flex gap-0 h-[calc(100vh-73px)]">
          {/* ── Left: settings ─────────────────────────────────────────────── */}
          <div
            className="w-80 shrink-0 flex flex-col gap-4 p-5 overflow-y-auto"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            <AdminSelect label="Тема" value={form.theme} onChange={(e) => set("theme", e.target.value)} required>
              <option value="">Выберите тему...</option>
              {themes.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </AdminSelect>

            <AdminInput label="Название урока" value={form.title} onChange={(e) => set("title", e.target.value)} required />
            <AdminInput label="Порядок" type="number" value={form.order} onChange={(e) => set("order", e.target.value)} required />

            <AdminSelect label="Тип урока" value={form.lesson_type} onChange={(e) => set("lesson_type", e.target.value)}>
              <option value="theory">Теория</option>
              <option value="practice">Практика</option>
            </AdminSelect>

            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="XP" type="number" value={form.xp_reward} onChange={(e) => set("xp_reward", e.target.value)} />
              <AdminInput label="Звёзды" type="number" min="1" max="3" value={form.stars_reward} onChange={(e) => set("stars_reward", e.target.value)} />
            </div>

            {form.lesson_type === "practice" && (
              <>
                <AdminTextarea
                  label="Стартовый код"
                  value={form.starter_code}
                  onChange={(e) => set("starter_code", e.target.value)}
                  rows={5}
                  placeholder="# напиши код здесь"
                  style={{ fontFamily: "monospace" }}
                />
                <AdminTextarea
                  label='Тест-кейсы (JSON)'
                  value={form.test_cases}
                  onChange={(e) => set("test_cases", e.target.value)}
                  rows={4}
                  placeholder='[{"input":"","expected_output":"Hello"}]'
                  style={{ fontFamily: "monospace" }}
                />
              </>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex flex-col gap-2 pt-2">
              <AdminBtn type="submit" variant="primary" disabled={saving}>
                {saving ? "Сохраняем..." : "Создать урок"}
              </AdminBtn>
              <AdminBtn href="/admin/themes" variant="ghost">Отмена</AdminBtn>
            </div>
          </div>

          {/* ── Right: TipTap editor ────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6">
            <TipTapEditor
              content={content}
              onChange={setContent}
              mode={preview ? "read" : "edit"}
              placeholder="Начни писать контент урока..."
            />
          </div>
        </div>
      </form>
    </div>
  );
}
