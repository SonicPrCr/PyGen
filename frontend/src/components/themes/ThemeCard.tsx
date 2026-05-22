import Link from "next/link";

export interface Theme {
  id: number;
  title: string;
  description: string;
  order: number;
  icon: string;
  is_locked: boolean;
  progress_percent: number;
  completed_lessons_count: number;
  total_lessons_count: number;
  total_xp: number;
  total_stars: number;
}

interface ThemeCardProps {
  theme: Theme;
  showBar?: boolean;
}

export function ThemeCard({ theme, showBar = false }: ThemeCardProps) {
  const locked = theme.is_locked;

  const card = (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 h-full transition-opacity"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        border: `1px solid ${locked ? "rgba(105,94,176,0.35)" : "var(--color-accent-yellow)"}`,
        opacity: locked ? 0.55 : 1,
      }}
    >
      {/* Top: title + icon */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className="text-lg font-black text-white leading-tight"
          style={{ fontFamily: "'Science Gothic', sans-serif" }}
        >
          {theme.title}
        </h3>

        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          {theme.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={theme.icon} alt={theme.title} className="w-10 h-10 object-contain" />
          ) : (
            <span>🐍</span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 flex-1 leading-relaxed">
        {theme.description}
      </p>

      {showBar ? (
        /* Profile variant: XP + stars row, then progress bar */
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">{theme.total_xp} EXP</span>
            <span className="font-semibold" style={{ color: "var(--color-accent-yellow)" }}>
              ★ {theme.total_stars}
            </span>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${theme.progress_percent}%`,
                  backgroundColor: "var(--color-accent-purple)",
                }}
              />
            </div>
            <span className="text-xs text-white/40">{theme.progress_percent}%</span>
          </div>
        </>
      ) : (
        /* Default variant: text stats */
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">
            {theme.progress_percent}%&nbsp;&nbsp;{theme.total_xp} EXP
          </span>
          <span className="font-semibold" style={{ color: "var(--color-accent-yellow)" }}>
            ★ {theme.total_stars}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/40">
          Уроков: {theme.completed_lessons_count}/{theme.total_lessons_count}
        </span>

        {locked ? (
          <span className="text-white/30">🔒 Заблокировано</span>
        ) : (
          <span className="font-semibold" style={{ color: "var(--color-accent-yellow)" }}>
            Перейти к курсу →
          </span>
        )}
      </div>
    </div>
  );

  if (locked) return <div className="cursor-not-allowed">{card}</div>;

  return (
    <Link href={`/topics/${theme.id}`} className="block h-full hover:scale-[1.01] transition-transform">
      {card}
    </Link>
  );
}
