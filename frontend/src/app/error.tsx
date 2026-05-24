"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div className="mb-6 text-7xl select-none">⚠️</div>

      <h1
        className="text-5xl sm:text-7xl font-black text-white mb-4"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Ошибка
      </h1>

      <p className="text-lg mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
        Что-то пошло не так
      </p>
      <p
        className="text-sm mb-10 max-w-sm"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        Произошла непредвиденная ошибка. Попробуй обновить страницу или вернись на главную.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-accent-purple)",
            color: "#FFFFFF",
          }}
        >
          Попробовать снова
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            color: "rgba(255,255,255,0.8)",
            border: "1px solid var(--color-border)",
          }}
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
