"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/topics", label: "Курсы" },
  { href: "/reference", label: "Справочник" },
  { href: "/help", label: "Помощь" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Блокируем прокрутку страницы пока меню открыто
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b flex items-center justify-between px-4 sm:px-6 lg:px-16 py-4"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg-secondary)",
        }}
      >
        {/* Логотип */}
        <Link
          href="/"
          className="font-bold text-xl leading-none"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          <span style={{ color: "var(--color-accent-purple)" }}>Py</span>
          <span style={{ color: "var(--color-accent-yellow)" }}>Gen</span>
        </Link>

        {/* Десктоп навигация (lg+) */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Десктоп кнопки (lg+) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg transition-colors hover:opacity-80"
            style={{
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded-lg font-semibold transition-colors hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent-purple)",
              color: "#FFFFFF",
            }}
          >
            Начать бесплатно
          </Link>
        </div>

        {/* Бургер кнопка (до lg) */}
        <button
          className="lg:hidden flex flex-col justify-center gap-[5px] w-10 h-10 -mr-2"
          onClick={() => setIsOpen(true)}
          aria-label="Открыть меню"
        >
          <span className="block w-6 h-0.5 rounded-full mx-auto transition-all" style={{ backgroundColor: "var(--color-text-primary)" }} />
          <span className="block w-6 h-0.5 rounded-full mx-auto transition-all" style={{ backgroundColor: "var(--color-text-primary)" }} />
          <span className="block w-6 h-0.5 rounded-full mx-auto transition-all" style={{ backgroundColor: "var(--color-text-primary)" }} />
        </button>
      </header>

      {/* Мобильное меню — полноэкранный оверлей */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col lg:hidden"
          style={{ backgroundColor: "var(--color-bg-primary)" }}
        >
          {/* Шапка оверлея */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <Link
              href="/"
              className="font-bold text-xl"
              style={{ fontFamily: "var(--font-heading), sans-serif" }}
              onClick={() => setIsOpen(false)}
            >
              <span style={{ color: "var(--color-accent-purple)" }}>Py</span>
              <span style={{ color: "var(--color-accent-yellow)" }}>Gen</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-2xl leading-none transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-primary)" }}
              aria-label="Закрыть меню"
            >
              ×
            </button>
          </div>

          {/* Ссылки */}
          <nav className="flex flex-col px-6 sm:px-8 pt-8 pb-6 gap-2 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-xl font-semibold border-b transition-opacity hover:opacity-70"
                style={{
                  color: "var(--color-text-primary)",
                  borderColor: "var(--color-border-muted)",
                }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Кнопки авторизации внизу */}
            <div className="mt-auto pt-8 flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full text-center py-3.5 rounded-lg font-semibold text-base transition-opacity hover:opacity-80"
                style={{
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                }}
                onClick={() => setIsOpen(false)}
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="w-full text-center py-3.5 rounded-lg font-bold text-base transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-accent-yellow)",
                  color: "#000000",
                }}
                onClick={() => setIsOpen(false)}
              >
                Начать бесплатно
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
