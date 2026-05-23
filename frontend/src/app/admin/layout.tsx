"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRequireAdmin } from "@/lib/hooks/useRequireAdmin";

const NAV_ITEMS = [
  { href: "/admin", label: "Дашборд", icon: "📊" },
  { href: "/admin/themes", label: "Темы курса", icon: "📚" },
  { href: "/admin/users", label: "Пользователи", icon: "👥" },
  { href: "/admin/reference", label: "Справочник", icon: "📖" },
  { href: "/admin/tasks", label: "Пул заданий", icon: "🎯" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isInitialized } = useRequireAdmin();
  const pathname = usePathname();

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
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside
        className="w-60 shrink-0 flex flex-col"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        <div
          className="px-5 py-4 shrink-0 flex flex-col gap-2"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            ← На сайт
          </Link> */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xs text-white/30 hover:text-white/60 transition-colors"
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
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "rgba(105,94,176,0.2)"
                    : "transparent",
                  color: isActive ? "#fff" : "var(--color-text-secondary)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
