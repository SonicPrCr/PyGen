import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
          <span style={{ color: "var(--color-accent-purple)" }}>Py</span>
          <span style={{ color: "var(--color-accent-yellow)" }}>Gen</span>
        </h1>

        <p className="text-2xl font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
          Учи Python — не засыпай
        </p>

        <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          Интерактивные уроки, задания от нейросети и встроенный редактор кода.
          Открывай темы последовательно и прокачивай свой уровень.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-8 py-3 rounded-lg font-semibold text-base transition-colors"
            style={{
              backgroundColor: "var(--color-accent-yellow)",
              color: "#0D0B14",
            }}
          >
            Начать учиться
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 rounded-lg font-semibold text-base transition-colors"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            Узнать больше
          </Link>
        </div>
      </div>
    </div>
  );
}
