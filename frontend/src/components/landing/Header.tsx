"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Btn } from "@/components/Btn";
import { useAuthStore } from "@/lib/stores/authStore";

// ─── Пункты дропдаун-меню ────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    icon: "/images/landing/icon-profile.svg",
    w: 18,
    h: 21,
    label: "Мой профиль",
    href: "/profile",
    highlight: true,
  },
  {
    icon: "/images/landing/icon-reference.svg",
    w: 20,
    h: 18,
    label: "Справочник",
    href: "/reference",
    highlight: false,
  },
  {
    icon: "/images/landing/icon-courses.svg",
    w: 16,
    h: 20,
    label: "Курсы",
    href: "/topics",
    highlight: false,
  },
];

// ─── Компонент ───────────────────────────────────────────────────────────────
export function Header({
  showBurger = false,
  fullWidth = false,
  logoSrc,
}: {
  showBurger?: boolean;
  fullWidth?: boolean;
  logoSrc?: string;
}) {
  const { isAuthenticated, user, logout, openLogin, openRegister } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarLetter =
    user?.first_name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  // Закрыть меню при клике вне (только десктоп/планшет)
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [isMenuOpen]);

  // Закрыть меню при смене auth-состояния
  useEffect(() => {
    setIsMenuOpen(false);
  }, [isAuthenticated]);

  return (
    <>
      {/* ── Хедер ──────────────────────────────────────────────────────────── */}
      <header
        className={`w-full ${fullWidth ? "px-4 sm:px-6" : "px-4 sm:px-6 lg:px-16"} py-4 sm:py-5 lg:py-6`}
        style={{
          backgroundColor: "var(--color-bg-primary)",
          borderBottom: fullWidth ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
      <div className={`${fullWidth ? "w-full" : "max-w-7xl mx-auto"} flex items-center justify-between`}>
        {/* Логотип (+ бургер если showBurger) */}
        <div className="flex items-center gap-3 shrink-0">
          {showBurger && (
            <button
              onClick={() => console.log("TODO: collapse sidebar")}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Меню"
            >
              <span className="block w-5 h-0.5 rounded-full bg-white" />
              <span className="block w-5 h-0.5 rounded-full bg-white" />
              <span className="block w-5 h-0.5 rounded-full bg-white" />
            </button>
          )}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={logoSrc ?? "/images/landing/logo.png"}
              alt="PyGen"
              width={200}
              height={80}
              priority
              className={fullWidth ? "h-9 w-auto object-contain" : "w-[58px] h-[78px] sm:w-auto sm:h-14 lg:h-20 object-contain"}
            />
          </Link>
        </div>

        {/* ── Правая часть хедера ─────────────────────────────────────────── */}
        {isAuthenticated ? (
          /* Авторизован — кружок с буквой и дропдауном */
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="flex items-center gap-2 select-none"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <span
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "#FFFFFF", backgroundColor: "transparent" }}
              >
                <span className="text-white font-bold text-base leading-none">
                  {avatarLetter}
                </span>
              </span>
              <img
                src="/images/landing/chevron-down.svg"
                alt=""
                width={12}
                height={8}
                aria-hidden
                className="transition-transform duration-200"
                style={{
                  filter: "brightness(0) invert(1)",
                  transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* ── Дропдаун на планшете / десктопе ──────────────────────── */}
            {isMenuOpen && (
              <div
                className="hidden sm:block absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                }}
              >
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-100"
                    style={{
                      backgroundColor: item.highlight ? "#F5F5F5" : "transparent",
                    }}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      width={item.w}
                      height={item.h}
                      aria-hidden
                    />
                    <span className="text-sm" style={{ color: "#1A1A2E" }}>
                      {item.label}
                    </span>
                  </Link>
                ))}
                <div className="h-px mx-4" style={{ backgroundColor: "#E5E7EB" }} />
                <button
                  className="flex items-center gap-3 px-4 py-3 w-full text-left transition-colors hover:bg-gray-100"
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                >
                  <img
                    src="/images/landing/icon-exit.svg"
                    alt=""
                    width={19}
                    height={20}
                    aria-hidden
                  />
                  <span className="text-sm" style={{ color: "#1A1A2E" }}>
                    Выйти
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Не авторизован — "Войти" + "Регистрация" */
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={openLogin}
              className="text-sm sm:text-base font-medium hover:opacity-80 transition-opacity"
              style={{ color: "#FFFFFF" }}
            >
              Войти
            </button>
            <Btn onClick={openRegister} variant="outline">Регистрация</Btn>
          </div>
        )}
      </div>
      </header>

      {/* ── Мобильное меню — полная ширина под хедером (<sm) ───────────────── */}
      {isAuthenticated && isMenuOpen && (
        <div
          className="sm:hidden w-full z-40"
          style={{ backgroundColor: "#160D35" }}
        >
          {MENU_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/5"
              style={{
                borderBottom:
                  i < MENU_ITEMS.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
              }}
            >
              <img
                src={item.icon}
                alt=""
                width={item.w}
                height={item.h}
                aria-hidden
                style={{ filter: "brightness(0) invert(1)", opacity: 0.8 }}
              />
              <span className="text-sm font-medium text-white">{item.label}</span>
            </Link>
          ))}
          <div
            className="mx-5"
            style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.12)" }}
          />
          <button
            className="flex items-center gap-4 px-5 py-4 w-full transition-colors hover:bg-white/5"
            onClick={() => { logout(); setIsMenuOpen(false); }}
          >
            <img
              src="/images/landing/icon-exit.svg"
              alt=""
              width={19}
              height={20}
              aria-hidden
              style={{ filter: "brightness(0) invert(1)", opacity: 0.8 }}
            />
            <span className="text-sm font-medium text-white">Выйти</span>
          </button>
        </div>
      )}
    </>
  );
}
