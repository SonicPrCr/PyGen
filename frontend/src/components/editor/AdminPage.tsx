"use client";

// Shared UI primitives for admin pages

export function AdminHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between px-8 py-6"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <h1
        className="text-2xl font-black text-white"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h1>
      {action}
    </div>
  );
}

export function AdminBtn({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  href?: string;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: "var(--color-accent-purple)", color: "#fff" },
    danger:  { backgroundColor: "#EF4444", color: "#fff" },
    ghost:   { backgroundColor: "transparent", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" },
  };

  const cls = "px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed";

  if (href) {
    return (
      <a href={href} className={cls} style={styles[variant]}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={styles[variant]}>
      {children}
    </button>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
      }}
    >
      {children}
    </div>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
      style={{ color: "var(--color-text-muted)", borderBottom: "1px solid var(--color-border)" }}
    >
      {children}
    </th>
  );
}

export function AdminTd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td
      className={`px-4 py-3 ${className}`}
      style={{ color: "var(--color-text-secondary)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {children}
    </td>
  );
}

export function AdminInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">{label}</span>
      <input
        {...props}
        className="px-3 py-2.5 rounded-lg text-sm text-white outline-none transition-colors"
        style={{
          backgroundColor: "var(--color-bg-tertiary)",
          border: "1px solid var(--color-border)",
        }}
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">{label}</span>
      <textarea
        {...props}
        className="px-3 py-2.5 rounded-lg text-sm text-white outline-none resize-y transition-colors"
        style={{
          backgroundColor: "var(--color-bg-tertiary)",
          border: "1px solid var(--color-border)",
          minHeight: "80px",
        }}
      />
    </label>
  );
}

export function AdminSelect({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">{label}</span>
      <select
        {...props}
        className="px-3 py-2.5 rounded-lg text-sm text-white outline-none"
        style={{
          backgroundColor: "var(--color-bg-tertiary)",
          border: "1px solid var(--color-border)",
        }}
      >
        {children}
      </select>
    </label>
  );
}
