"use client";

import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ThemeCard, type Theme } from "@/components/themes/ThemeCard";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import api from "@/lib/api";

function ThemeCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 h-52 animate-pulse"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />
  );
}

export default function TopicsPage() {
  const { isAuthenticated, isInitialized } = useRequireAuth();

  const { data: themes, isLoading, isError } = useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data } = await api.get("/api/themes");
      return data;
    },
    enabled: isAuthenticated,
  });

  if (!isInitialized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-16 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-8"
          style={{ fontFamily: "'Science Gothic', sans-serif" }}
        >
          Темы
        </h1>

        {isError && (
          <p className="text-red-400 text-sm">
            Не удалось загрузить темы. Убедитесь, что бэкенд запущен.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ThemeCardSkeleton key={i} />
              ))
            : themes?.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
