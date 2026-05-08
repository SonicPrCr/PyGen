import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PyGen — Учи Python интерактивно",
  description: "Интерактивная платформа для изучения Python с автогенерацией заданий",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header
      className="border-b flex items-center justify-between px-6 py-4"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-secondary)" }}
    >
      <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: "var(--color-text-primary)" }}>
        <span style={{ color: "var(--color-accent-purple)" }}>Py</span>
        <span style={{ color: "var(--color-accent-yellow)" }}>Gen</span>
      </Link>

      <nav className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm px-4 py-2 rounded-lg transition-colors"
          style={{
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          Войти
        </Link>
        <Link
          href="/register"
          className="text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: "var(--color-accent-purple)",
            color: "var(--color-text-primary)",
          }}
        >
          Начать бесплатно
        </Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer
      className="border-t px-6 py-8"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="font-bold text-lg mb-1" style={{ color: "var(--color-text-primary)" }}>
            <span style={{ color: "var(--color-accent-purple)" }}>Py</span>
            <span style={{ color: "var(--color-accent-yellow)" }}>Gen</span>
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Учи Python с умными заданиями
          </p>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>
              Платформа
            </p>
            <Link href="/about" className="text-sm hover:underline" style={{ color: "var(--color-text-secondary)" }}>
              О сайте
            </Link>
            <Link href="/contact" className="text-sm hover:underline" style={{ color: "var(--color-text-secondary)" }}>
              Контакты
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>
              Соцсети
            </p>
            <a href="#" className="text-sm hover:underline" style={{ color: "var(--color-text-secondary)" }}>
              GitHub
            </a>
            <a href="#" className="text-sm hover:underline" style={{ color: "var(--color-text-secondary)" }}>
              Telegram
            </a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs mt-6" style={{ color: "var(--color-text-muted)" }}>
        © 2026 PyGen. Дипломный проект.
      </p>
    </footer>
  );
}
