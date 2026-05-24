"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";

const NAV_ITEMS: { href: string; label: string; icon: string; dividerBefore?: boolean }[] = [
  { href: "/admin",                   label: "Дашборд",       icon: "📊" },
  { href: "/admin/themes",            label: "Темы курса",    icon: "📚" },
  { href: "/admin/users",             label: "Пользователи",  icon: "👥" },
  { href: "/admin/reference",         label: "Справочник",    icon: "📖" },
  { href: "/admin/tasks",             label: "Пул заданий",   icon: "🎯" },
  { href: "/admin/achievements",      label: "Ачивки",        icon: "🏆", dividerBefore: true },
  { href: "/admin/user-achievements", label: "Ачивки юзеров", icon: "🎖️" },
  { href: "/admin/user-progress",     label: "Прогресс",      icon: "📈" },
  { href: "/admin/user-solutions",    label: "Решения",       icon: "💻" },
  { href: "/admin/task-generations",  label: "Генерации ИИ",  icon: "🤖" },
  { href: "/admin/bookmarks",         label: "Закладки",      icon: "🔖" },
  { href: "/admin/notes",             label: "Конспекты",     icon: "📝" },
];

function SidebarNav({
  pathname,
  onNavigate,
  showClose,
  onClose,
}: {
  pathname: string;
  onNavigate?: () => void;
  showClose?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      <div
        className="px-5 py-4 shrink-0 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={onNavigate}
        >
          <Image
            src="/images/landing/logo-lesson.png"
            alt="PyGen"
            width={82}
            height={48}
            className="rounded-lg"
          />
          <span
            className="font-black text-white text-base"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Admin
          </span>
        </Link>
        {showClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <div key={item.href}>
              {item.dividerBefore && (
                <div
                  className="h-px mx-3 my-2"
                  style={{ backgroundColor: "var(--color-border)" }}
                />
              )}
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: isActive ? "rgba(105,94,176,0.2)" : "transparent",
                  color: isActive ? "#fff" : "var(--color-text-secondary)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  if (!isAdmin) return null;

  return (
    <div
      className="min-h-screen flex overflow-x-hidden"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-60 shrink-0 flex-col"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        <SidebarNav pathname={pathname} />
      </aside>

      {/* ── Mobile sidebar overlay (<lg) ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside
            className="relative z-10 w-64 flex flex-col"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              borderRight: "1px solid var(--color-border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarNav
              pathname={pathname}
              showClose
              onClose={() => setSidebarOpen(false)}
              onNavigate={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── Main area ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">

        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 shrink-0"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Открыть меню"
          >
            <Menu size={20} className="text-white/70" />
          </button>
          <span
            className="font-black text-white text-base"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Admin
          </span>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
