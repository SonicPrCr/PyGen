import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 text-8xl select-none">🐍</div>

        <h1
          className="text-6xl sm:text-8xl font-black text-white mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          404
        </h1>

        <p className="text-lg sm:text-xl mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
          Страница не найдена
        </p>
        <p
          className="text-sm mb-10 max-w-sm"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Возможно, она была удалена или вы перешли по неверной ссылке.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent-yellow)",
              color: "#000000",
            }}
          >
            На главную
          </Link>
          <Link
            href="/topics"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              color: "rgba(255,255,255,0.8)",
              border: "1px solid var(--color-border)",
            }}
          >
            К курсам
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
