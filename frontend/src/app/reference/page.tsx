"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import api from "@/lib/api";

interface ArticleShort {
  id: number;
  title: string;
  order: number;
}

interface Category {
  id: number;
  title: string;
  order: number;
  articles: ArticleShort[];
}

interface ArticleFull {
  id: number;
  title: string;
  content: Record<string, unknown>;
  order: number;
}

// ─── Left nav ─────────────────────────────────────────────────────────────────

function CategoryNav({
  categories,
  activeId,
  onSelect,
}: {
  categories: Category[];
  activeId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <nav className="p-4 space-y-4">
      {categories.map((cat) => (
        <div key={cat.id}>
          <span
            className="block text-xs font-bold uppercase tracking-wider px-3 py-1"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {cat.title}
          </span>
          <div className="mt-1 space-y-0.5">
            {cat.articles.map((article) => (
              <button
                key={article.id}
                onClick={() => onSelect(article.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor:
                    activeId === article.id
                      ? "var(--color-accent-purple)"
                      : "transparent",
                  color:
                    activeId === article.id
                      ? "#ffffff"
                      : "rgba(255,255,255,0.6)",
                }}
              >
                {article.title}
              </button>
            ))}
            {cat.articles.length === 0 && (
              <p className="px-3 py-1 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                Нет статей
              </p>
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}

// ─── Article content ──────────────────────────────────────────────────────────

function ArticleView({ articleId }: { articleId: number }) {
  const { data: article, isLoading } = useQuery<ArticleFull>({
    queryKey: ["reference-article", articleId],
    queryFn: async () => {
      const { data } = await api.get(`/api/reference/articles/${articleId}`);
      return data as ArticleFull;
    },
    staleTime: 5 * 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6 lg:p-10 max-w-3xl">
        <div className="h-8 w-48 rounded-lg animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
        <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
        <div className="h-4 w-5/6 rounded animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
        <div className="h-4 w-4/6 rounded animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="p-6 lg:p-10 max-w-3xl w-full">
      <h1
        className="text-2xl lg:text-3xl font-black text-white mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {article.title}
      </h1>

      {article.content?.type === "doc" ? (
        <TipTapEditor content={article.content} mode="read" />
      ) : (
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          Нет содержимого
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReferencePage() {
  const [activeArticleId, setActiveArticleId] = useState<number | null>(null);
  const [mobileShowArticle, setMobileShowArticle] = useState(false);

  const { data: categories = [], isLoading: catsLoading } = useQuery<Category[]>({
    queryKey: ["reference-categories"],
    queryFn: async () => {
      const { data } = await api.get("/api/reference/categories");
      return data as Category[];
    },
    staleTime: 5 * 60_000,
  });

  // Auto-select first article when categories load
  useEffect(() => {
    if (activeArticleId === null && categories.length > 0) {
      const first = categories[0]?.articles[0];
      if (first) setActiveArticleId(first.id);
    }
  }, [categories, activeArticleId]);

  const handleSelect = (id: number) => {
    setActiveArticleId(id);
    setMobileShowArticle(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <Header />
      <div className="h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* ── Left nav — mobile: hidden when article open ────────────────── */}
        <aside
          className={`${mobileShowArticle ? "hidden" : "flex"} lg:flex flex-col shrink-0`}
          style={{
            width: 270,
            borderRight: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "var(--color-bg-secondary)",
            overflowY: "auto",
          }}
        >
          {catsLoading ? (
            <div className="p-4 flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 rounded animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Справочник пуст
            </div>
          ) : (
            <CategoryNav
              categories={categories}
              activeId={activeArticleId}
              onSelect={handleSelect}
            />
          )}
        </aside>

        {/* ── Right content ──────────────────────────────────────────────── */}
        <main
          className={`${mobileShowArticle ? "flex" : "hidden"} lg:flex flex-1 flex-col overflow-y-auto`}
        >
          {/* Mobile back button */}
          <button
            className="lg:hidden flex items-center gap-1.5 px-4 py-3 text-sm shrink-0"
            style={{
              color: "rgba(255,255,255,0.5)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
            onClick={() => setMobileShowArticle(false)}
          >
            <ChevronLeft size={16} />
            Все категории
          </button>

          {activeArticleId !== null ? (
            <ArticleView articleId={activeArticleId} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
                Выбери статью из списка слева
              </p>
            </div>
          )}
        </main>

      </div>

      {/* Footer only on desktop (не перекрывает мобильный список) */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
