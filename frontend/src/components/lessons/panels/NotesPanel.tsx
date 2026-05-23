"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import api from "@/lib/api";

interface Note {
  id: number;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Recursively extracts plain text from TipTap JSON
function extractText(node: Record<string, unknown>): string {
  if (node.type === "text") return (node.text as string) ?? "";
  const children = (node.content as Record<string, unknown>[]) ?? [];
  return children.map(extractText).join(" ");
}

function getNotePreview(content: Record<string, unknown>): string {
  if (!content || Object.keys(content).length === 0) return "";
  return extractText(content).trim();
}

export function NotesPanel() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Note | null | "new">(null);
  const [title, setTitle] = useState("");
  const contentRef = useRef<Record<string, unknown>>({});

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await api.get("/api/notes");
      return data as Note[];
    },
  });

  const createNote = useMutation({
    mutationFn: (body: { title: string; content: Record<string, unknown> }) =>
      api.post("/api/notes", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeEditor();
    },
  });

  const updateNote = useMutation({
    mutationFn: ({ id, body }: { id: number; body: { title: string; content: Record<string, unknown> } }) =>
      api.put(`/api/notes/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeEditor();
    },
  });

  const deleteNote = useMutation({
    mutationFn: (id: number) => api.delete(`/api/notes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const openNew = () => {
    setTitle("");
    contentRef.current = {};
    setEditing("new");
  };

  const openEdit = (note: Note) => {
    setTitle(note.title);
    contentRef.current = note.content ?? {};
    setEditing(note);
  };

  const closeEditor = () => setEditing(null);

  const handleSave = () => {
    const body = { title: title.trim() || "Без названия", content: contentRef.current };
    if (editing === "new") {
      createNote.mutate(body);
    } else if (editing) {
      updateNote.mutate({ id: editing.id, body });
    }
  };

  const handleDelete = (note: Note) => {
    if (!confirm(`Удалить конспект «${note.title}»?`)) return;
    deleteNote.mutate(note.id);
  };

  const isSaving = createNote.isPending || updateNote.isPending;

  // ── Editor view ──────────────────────────────────────────────────────────────
  if (editing !== null) {
    return (
      <div className="h-full flex flex-col">
        {/* Title — fixed top */}
        <div
          className="shrink-0 px-3 pt-3 pb-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок..."
            className="w-full bg-transparent text-white text-sm font-semibold outline-none placeholder:text-white/25"
          />
        </div>

        {/* TipTap — scrollable middle */}
        <div className="flex-1 overflow-y-auto px-1">
          <TipTapEditor
            content={contentRef.current && Object.keys(contentRef.current).length > 0 ? contentRef.current : null}
            onChange={(json) => { contentRef.current = json; }}
            mode="edit"
            placeholder="Начни писать..."
            compact
          />
        </div>

        {/* Save / Cancel — fixed bottom */}
        <div
          className="shrink-0 flex gap-2 px-3 py-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "var(--color-bg-secondary)",
          }}
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ backgroundColor: "var(--color-accent-purple)", color: "#fff" }}
          >
            {isSaving ? "Сохраняем..." : "Сохранить"}
          </button>
          <button
            onClick={closeEditor}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Отмена
          </button>
        </div>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">
      {/* New note button — fixed top */}
      <div className="shrink-0 px-3 pt-3 pb-2">
        <button
          onClick={openNew}
          className="w-full py-2 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
          style={{ backgroundColor: "var(--color-accent-purple)", color: "#fff" }}
        >
          + Новый конспект
        </button>
      </div>

      {/* Notes list — scrollable */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-2">
        {isLoading ? (
          [1, 2].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl animate-pulse"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            />
          ))
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ color: "rgba(255,255,255,0.2)" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Нет конспектов</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Создай первый!</p>
          </div>
        ) : (
          notes.map((note) => {
            const preview = getNotePreview(note.content);
            return (
              <div
                key={note.id}
                className="rounded-xl p-3 flex flex-col gap-2"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Title + delete */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-white leading-tight">{note.title}</span>
                  <button
                    onClick={() => handleDelete(note)}
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/10 text-white/25 hover:text-white/60"
                    title="Удалить"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content preview — CSS line-clamp, no overflow */}
                {preview && (
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      wordBreak: "break-word",
                    }}
                  >
                    {preview}
                  </p>
                )}

                {/* Date + edit */}
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {formatDate(note.updated_at)}
                  </span>
                  <button
                    onClick={() => openEdit(note)}
                    className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors hover:opacity-80"
                    style={{ backgroundColor: "rgba(105,94,176,0.2)", color: "#c4b5fd" }}
                  >
                    Редактировать
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
