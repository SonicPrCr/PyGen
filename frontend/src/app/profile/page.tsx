"use client";

import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ThemeCard, type Theme } from "@/components/themes/ThemeCard";
import { useAuthStore, type AuthUser } from "@/lib/stores/authStore";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import api from "@/lib/api";

// ─── XP helpers ──────────────────────────────────────────────────────────────

function getXpInLevel(totalXp: number, level: number) {
  let xp = totalXp;
  for (let l = 1; l < level; l++) xp -= 100 * l;
  return xp;
}

function getXpForNextLevel(level: number) {
  return 100 * level;
}

// ─── User card ───────────────────────────────────────────────────────────────

interface Achievement {
  id: number;
  achievement: { id: number; level: number; name: string; color: string };
  earned_at: string;
}

function UserCard({ user, achievements }: { user: AuthUser; achievements: Achievement[] }) {
  const level = user.current_level;
  const xpInLevel = getXpInLevel(user.xp, level);
  const xpNeeded = getXpForNextLevel(level);
  const xpPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  const avatarLetter =
    user.first_name?.[0]?.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.email;

  const visibleAch = achievements.slice(0, 4);
  const extra = achievements.length - visibleAch.length;

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        border: "1px solid var(--color-accent-yellow)",
        backgroundColor: "var(--color-bg-primary)",
      }}
    >
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <span className="text-3xl font-black text-[#0C0827]">{avatarLetter}</span>
        </div>
        <span className="text-white font-bold text-lg">{displayName}</span>
      </div>

      {/* XP bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/70">
          <span>{xpInLevel}/{xpNeeded} XP</span>
          <span className="font-semibold" style={{ color: "var(--color-accent-yellow)" }}>
            ★ {user.total_stars}
          </span>
        </div>
        <div className="relative h-6 rounded-full bg-white/10 overflow-visible">
          <div
            className="h-full rounded-full"
            style={{
              width: `${xpPercent}%`,
              backgroundColor: "var(--color-accent-purple)",
            }}
          />
          {/* Level badge — hexagon with level-color border, always centered */}
          <div
            className="absolute z-10"
            style={{
              width: 40,
              height: 46,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              backgroundColor: user.current_level_color,
            }}
          >
            <div
              className="absolute flex items-center justify-center text-sm font-bold text-white"
              style={{
                width: 34,
                height: 40,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                backgroundColor: "var(--color-bg-primary)",
              }}
            >
              {level}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {visibleAch.map((ua) => (
            <div
              key={ua.id}
              title={ua.achievement.name}
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
              style={{ borderColor: ua.achievement.color }}
            >
              {ua.achievement.level}
            </div>
          ))}
          {extra > 0 && (
            <div className="w-9 h-9 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white/50">
              +{extra}
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Info */}
      <div className="space-y-1 text-sm text-white/80">
        {user.first_name && <p>Имя: {user.first_name}</p>}
        {user.last_name && <p>Фамилия: {user.last_name}</p>}
        {user.middle_name && <p>Отчество: {user.middle_name}</p>}
        {user.age != null && <p>Возраст: {user.age}</p>}
        {!user.first_name && !user.last_name && !user.middle_name && !user.age && (
          <p className="text-white/30 italic">Данные профиля не заполнены</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { isAuthenticated, isInitialized } = useRequireAuth();

  const { data: themes, isLoading: themesLoading } = useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data } = await api.get("/api/themes");
      return data;
    },
    enabled: isAuthenticated,
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data } = await api.get("/api/achievements/my");
      return data;
    },
    enabled: isAuthenticated,
  });

  if (!isInitialized || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-16 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: user card */}
          <div className="w-full lg:w-72 shrink-0">
            <UserCard user={user} achievements={achievements} />
          </div>

          {/* Right: theme cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {themesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl h-48 animate-pulse"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                ))
              : themes?.map((theme) => (
                  <ThemeCard key={theme.id} theme={theme} showBar />
                ))}
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
