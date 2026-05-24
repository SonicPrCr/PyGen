"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          backgroundColor: "#0C0827",
          margin: 0,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <p style={{ fontSize: "4rem", marginBottom: "1rem" }}>💥</p>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              marginBottom: "0.5rem",
            }}
          >
            Критическая ошибка
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              marginBottom: "2rem",
              maxWidth: "360px",
            }}
          >
            Приложение столкнулось с серьёзной проблемой.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              backgroundColor: "#695EB0",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Перезагрузить
          </button>
        </div>
      </body>
    </html>
  );
}
