"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

export function useRequireAdmin() {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    if (!user || !user.is_staff) {
      router.replace("/");
    }
  }, [user, isInitialized, router]);

  return { isAdmin: !!user?.is_staff, isInitialized };
}
