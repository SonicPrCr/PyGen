import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline";

interface BtnProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  fullWidthMobile?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const STYLES: Record<Variant, { className: string; style: React.CSSProperties }> = {
  primary: {
    className:
      "inline-flex items-center justify-center px-10 py-3.5 rounded-lg font-bold text-[18px] sm:text-[20px] transition-opacity hover:opacity-90",
    style: {
      backgroundColor: "var(--color-accent-yellow)",
      color: "#000000",
      boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
    },
  },
  outline: {
    className:
      "inline-flex items-center justify-center text-sm sm:text-base font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl border transition-opacity hover:opacity-90",
    style: {
      color: "var(--color-accent-yellow)",
      borderColor: "var(--color-accent-yellow)",
    },
  },
};

export function Btn({
  children,
  href,
  variant = "primary",
  fullWidthMobile = false,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: BtnProps) {
  const { className: base, style } = STYLES[variant];
  const fullClass = `${base}${fullWidthMobile ? " w-full sm:w-auto" : ""}${className ? ` ${className}` : ""} disabled:opacity-50 disabled:cursor-not-allowed`;

  if (href) {
    return (
      <Link href={href} className={fullClass} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={fullClass} style={style}>
      {children}
    </button>
  );
}
