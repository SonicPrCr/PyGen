"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { createLowlight, common } from "lowlight";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Code, FileCode, Quote, Table2,
  Undo2, Redo2,
} from "lucide-react";

const lowlight = createLowlight(common);

// ─── Props ────────────────────────────────────────────────────────────────────

interface TipTapEditorProps {
  content: Record<string, unknown> | null;
  onChange?: (json: Record<string, unknown>) => void;
  mode?: "edit" | "read";
  placeholder?: string;
  compact?: boolean;
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarBtn({
  active,
  onClick,
  title,
  children,
  compact,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  const size = compact ? "w-6 h-6" : "w-8 h-8";
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`${size} flex items-center justify-center rounded text-xs font-bold transition-colors shrink-0`}
      style={{
        backgroundColor: active ? "var(--color-accent-purple)" : "rgba(255,255,255,0.06)",
        color: active ? "#fff" : "rgba(255,255,255,0.6)",
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div
      className="w-px self-stretch mx-0.5"
      style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
    />
  );
}

// ─── Copy buttons for code blocks (read mode) ─────────────────────────────────

function useCopyButtons(containerRef: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    const addButtons = () => {
      container.querySelectorAll("pre").forEach((pre) => {
        if (pre.querySelector(".tiptap-copy-btn")) return;
        pre.style.position = "relative";

        const btn = document.createElement("button");
        btn.className = "tiptap-copy-btn";
        btn.style.cssText = `
          position:absolute; top:10px; right:10px;
          width:32px; height:32px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.1);
          cursor:pointer; opacity:0; transition:opacity 0.15s;
        `;
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

        btn.onclick = async () => {
          await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ""));
          btn.style.background = "rgba(74,222,128,0.12)";
          btn.style.borderColor = "rgba(74,222,128,0.25)";
          btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7l3.5 3.5 5.5-6" stroke="#4ADE80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
          setTimeout(() => {
            btn.style.background = "rgba(255,255,255,0.07)";
            btn.style.borderColor = "rgba(255,255,255,0.1)";
            btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
          }, 2000);
        };

        pre.addEventListener("mouseenter", () => { btn.style.opacity = "1"; });
        pre.addEventListener("mouseleave", () => { btn.style.opacity = "0"; });
        pre.appendChild(btn);
      });
    };

    addButtons();
    const observer = new MutationObserver(addButtons);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [enabled, containerRef]);
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TipTapEditor({
  content,
  onChange,
  mode = "edit",
  placeholder,
  compact = false,
}: TipTapEditorProps) {
  const isEdit = mode === "edit";
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "python" }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Underline,
      Placeholder.configure({
        placeholder: placeholder ?? "Начни писать урок...",
      }),
    ],
    content: content ?? { type: "doc", content: [] },
    editable: isEdit,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class: "tiptap-content",
      },
    },
    immediatelyRender: false,
  });

  // Sync content from outside (e.g. when switching between lessons)
  const prevContent = useRef(content);
  useEffect(() => {
    if (!editor || content === prevContent.current) return;
    prevContent.current = content;
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(content)) {
      editor.commands.setContent(content ?? { type: "doc", content: [] });
    }
  }, [content, editor]);

  // Copy buttons on code blocks (read mode only)
  useCopyButtons(containerRef, !isEdit);

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  return (
    <div className={isEdit ? "tiptap-edit-wrapper flex flex-col" : ""}>
      {/* ── Toolbar (edit only) ──────────────────────────────────────────────── */}
      {isEdit && editor && (
        <div
          className={`flex items-center gap-1 px-2 py-1.5 rounded-t-xl ${compact ? "overflow-x-auto flex-nowrap" : "flex-wrap"}`}
          style={{
            backgroundColor: "#1e1e2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            scrollbarWidth: "none",
          }}
        >
          <ToolbarBtn compact={compact} active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Заголовок 1">H1</ToolbarBtn>
          <ToolbarBtn compact={compact} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Заголовок 2">H2</ToolbarBtn>
          <ToolbarBtn compact={compact} active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Заголовок 3">H3</ToolbarBtn>
          <Divider />
          <ToolbarBtn compact={compact} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Жирный (Ctrl+B)"><Bold size={compact ? 12 : 14} /></ToolbarBtn>
          <ToolbarBtn compact={compact} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Курсив (Ctrl+I)"><Italic size={compact ? 12 : 14} /></ToolbarBtn>
          <ToolbarBtn compact={compact} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Подчёркивание (Ctrl+U)"><UnderlineIcon size={compact ? 12 : 14} /></ToolbarBtn>
          <ToolbarBtn compact={compact} active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Зачёркнутый"><Strikethrough size={compact ? 12 : 14} /></ToolbarBtn>
          <Divider />
          <ToolbarBtn compact={compact} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Маркированный список"><List size={compact ? 13 : 15} /></ToolbarBtn>
          <ToolbarBtn compact={compact} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Нумерованный список"><ListOrdered size={compact ? 13 : 15} /></ToolbarBtn>
          <Divider />
          <ToolbarBtn compact={compact} active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} title="Инлайн-код"><Code size={compact ? 12 : 14} /></ToolbarBtn>
          <ToolbarBtn compact={compact} active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Блок кода"><FileCode size={compact ? 12 : 14} /></ToolbarBtn>
          <ToolbarBtn compact={compact} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Цитата"><Quote size={compact ? 12 : 14} /></ToolbarBtn>
          <Divider />
          <ToolbarBtn compact={compact} active={false} onClick={insertTable} title="Вставить таблицу 3×3"><Table2 size={compact ? 12 : 14} /></ToolbarBtn>
          <Divider />
          <ToolbarBtn compact={compact} active={false} onClick={() => editor.chain().focus().undo().run()} title="Отменить (Ctrl+Z)"><Undo2 size={compact ? 12 : 14} /></ToolbarBtn>
          <ToolbarBtn compact={compact} active={false} onClick={() => editor.chain().focus().redo().run()} title="Повторить (Ctrl+Y)"><Redo2 size={compact ? 12 : 14} /></ToolbarBtn>
        </div>
      )}

      {/* ── Editor content ───────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className={isEdit ? "flex-1" : ""}
        style={isEdit ? {
          border: "1px solid rgba(255,255,255,0.1)",
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          backgroundColor: "rgba(255,255,255,0.02)",
          padding: compact ? "0.75rem" : "1rem 1.25rem",
          minHeight: compact ? "80px" : "320px",
        } : undefined}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
