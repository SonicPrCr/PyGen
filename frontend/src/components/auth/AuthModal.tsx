"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal() {
  const { modal, closeModal } = useAuthStore();

  // Close on Escape
  useEffect(() => {
    if (!modal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal, closeModal]);

  // Lock scroll
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl p-6 sm:p-8 w-full max-w-[440px] shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 p-1.5 rounded hover:bg-gray-100 transition-colors"
          aria-label="Закрыть"
        >
          <Image src="/images/Cross.svg" alt="" width={12} height={12} />
        </button>

        {modal === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
