"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

export function useRequireAuth() {
  const { isAuthenticated, isInitialized, openLogin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.replace("/");
      openLogin();
    }
  }, [isInitialized, isAuthenticated, router, openLogin]);

  return { isAuthenticated, isInitialized };
}
