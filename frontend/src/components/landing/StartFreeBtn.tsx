"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { Btn } from "@/components/Btn";

interface StartFreeBtnProps {
  fullWidthMobile?: boolean;
  className?: string;
}

export function StartFreeBtn({ fullWidthMobile, className }: StartFreeBtnProps) {
  const { isAuthenticated, openRegister } = useAuthStore();

  if (isAuthenticated) {
    return (
      <Btn href="/topics" fullWidthMobile={fullWidthMobile} className={className}>
        Начать бесплатно
      </Btn>
    );
  }

  return (
    <Btn onClick={openRegister} fullWidthMobile={fullWidthMobile} className={className}>
      Начать бесплатно
    </Btn>
  );
}
