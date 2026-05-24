"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
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
    <nav className="py-2">
      {categories.map((cat) => (
        <div key={cat.id}>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-4 pt-4 pb-1 block"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {cat.title}
          </span>
          <div>
            {cat.articles.map((article) => (
              <button
                key={article.id}
                onClick={() => onSelect(article.id)}
                className="w-full text-left px-4 py-2 text-sm transition-colors"
                style={{
                  backgroundColor:
                    activeId === article.id
                      ? "var(--color-accent-purple)"
                      : "transparent",
                  color:
                    activeId === article.id
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.65)",
                  fontWeight: activeId === article.id ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (activeId !== article.id) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeId !== article.id) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "transparent";
                  }
                }}
              >
                {article.title}
              </button>
            ))}
            {cat.articles.length === 0 && (
              <p
                className="px-4 py-1 text-xs"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
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
      <div className="space-y-4 animate-pulse">
        <div className="h-8 rounded-lg w-2/3" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
        <div className="h-4 rounded w-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
        <div className="h-4 rounded w-5/6" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
        <div className="h-4 rounded w-4/5" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
        <div className="h-32 rounded-lg w-full mt-6" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div>
      <h1
        className="text-2xl lg:text-3xl font-bold text-white mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {article.title}
      </h1>

      {article.content?.type === "doc" ? (
        <TipTapEditor content={article.content} mode="read" />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-4xl mb-4">📖</p>
          <p className="text-white/40 text-sm">
            Содержимое этой статьи ещё не добавлено
          </p>
          <p className="text-white/25 text-xs mt-1">
            Вернитесь позже или выберите другую статью
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReferencePage() {
  const [activeArticleId, setActiveArticleId] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { data: categories = [], isLoading: catsLoading } = useQuery<Category[]>({
    queryKey: ["reference-categories"],
    queryFn: async () => {
      const { data } = await api.get("/api/reference/categories");
      return data as Category[];
    },
    staleTime: 5 * 60_000,
  });

  // Авто-выбор первой статьи при загрузке
  useEffect(() => {
    if (activeArticleId === null && categories.length > 0) {
      const first = categories[0]?.articles[0];
      if (first) setActiveArticleId(first.id);
    }
  }, [categories, activeArticleId]);

  const handleSelect = (id: number) => {
    setActiveArticleId(id);
    setMobileNavOpen(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-16 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">

          {/* ── Мобильная кнопка открытия меню ── */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden flex items-center gap-2 mb-6 text-sm transition-colors"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <Menu size={18} />
            <span>Разделы справочника</span>
          </button>

          {/* ── Мобильный overlay ── */}
          {mobileNavOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 flex"
              onClick={() => setMobileNavOpen(false)}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <aside
                className="relative z-10 w-72 flex flex-col h-full"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Заголовок overlay */}
                <div
                  className="flex items-center justify-between px-4 py-3 shrink-0"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="font-bold text-sm text-white">Справочник</span>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
                {/* Список */}
                <div className="flex-1 overflow-y-auto">
                  {catsLoading ? (
                    <div className="p-4 flex flex-col gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-6 rounded animate-pulse"
                          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <CategoryNav
                      categories={categories}
                      activeId={activeArticleId}
                      onSelect={handleSelect}
                    />
                  )}
                </div>
              </aside>
            </div>
          )}

          {/* ── Основной layout ── */}
          <div className="flex gap-6 lg:gap-8 items-start">

            {/* Десктоп меню */}
            <aside
              className="hidden lg:block w-56 shrink-0"
              style={{
                border: "1px solid var(--color-accent-yellow)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {catsLoading ? (
                <div className="p-4 flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-6 rounded animate-pulse"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div
                  className="p-6 text-center text-sm"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
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

            {/* Контентная зона */}
            <div className="flex-1 min-w-0">
              {activeArticleId !== null ? (
                <ArticleView articleId={activeArticleId} />
              ) : (
                <div className="flex items-center justify-center py-16">
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Выбери статью из списка слева
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
