export default function LessonPage({
  params,
}: {
  params: Promise<{ topicId: string; lessonId: string }>;
}) {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <h1 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
        Урок / Редактор кода — скоро здесь
      </h1>
    </div>
  );
}
