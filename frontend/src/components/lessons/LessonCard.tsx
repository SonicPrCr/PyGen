import Link from "next/link";

export interface Lesson {
  id: number;
  title: string;
  order: number;
  lesson_type: "theory" | "practice" | "test";
  xp_reward: number;
  stars_reward: number;
  is_completed: boolean;
  stars_earned: number;
}

interface LessonCardProps {
  lesson: Lesson;
  topicId: number;
  isLocked: boolean;
}

const TYPE_ICON: Record<Lesson["lesson_type"], string> = {
  theory:   "≡",
  practice: "</>",
  test:     "✎",
};

const TYPE_LABEL: Record<Lesson["lesson_type"], string> = {
  theory:   "Перейти к уроку",
  practice: "Перейти к заданию",
  test:     "Перейти к тесту",
};

export function LessonCard({ lesson, topicId, isLocked }: LessonCardProps) {
  const statusIcon = lesson.is_completed
    ? { symbol: "✓", color: "#4ADE80" }
    : isLocked
    ? { symbol: "🔒", color: "rgba(255,255,255,0.3)" }
    : { symbol: TYPE_ICON[lesson.lesson_type], color: "rgba(255,255,255,0.5)" };

  const progressPct = lesson.is_completed
    ? 100
    : isLocked
    ? 0
    : 0;

  const card = (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-opacity"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        border: `1px solid ${isLocked ? "rgba(105,94,176,0.3)" : "var(--color-accent-yellow)"}`,
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      {/* Top row: number + type icon | stars badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/50">#{lesson.order}</span>
          <span style={{ color: statusIcon.color }}>{statusIcon.symbol}</span>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold shrink-0"
          style={{
            backgroundColor: "rgba(105,94,176,0.25)",
            color: "var(--color-accent-yellow)",
            border: "1px solid rgba(105,94,176,0.4)",
          }}
        >
          ★ {lesson.stars_reward}
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-xl font-black text-white leading-tight"
        style={{ fontFamily: "'Science Gothic', sans-serif" }}
      >
        {lesson.title}
      </h3>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPct}%`,
              backgroundColor: "var(--color-accent-purple)",
            }}
          />
        </div>
        <span className="text-xs text-white/40">{progressPct}%</span>
      </div>

      {/* Bottom: button */}
      <div className="flex justify-between items-center">
        <div />
        {isLocked ? (
          <span className="text-xs text-white/25 px-4 py-2 rounded-xl border border-white/10">
            Заблокировано
          </span>
        ) : (
          <span
            className="text-sm font-semibold px-4 py-2 rounded-xl"
            style={{
              backgroundColor: "var(--color-accent-purple)",
              color: "#FFFFFF",
            }}
          >
            {TYPE_LABEL[lesson.lesson_type]}
          </span>
        )}
      </div>
    </div>
  );

  if (isLocked) return <div className="cursor-not-allowed">{card}</div>;

  return (
    <Link href={`/topics/${topicId}/lessons/${lesson.id}`} className="block hover:scale-[1.005] transition-transform">
      {card}
    </Link>
  );
}
