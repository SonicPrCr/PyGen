export default function TopicLessonsPage({ params }: { params: Promise<{ topicId: string }> }) {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <h1 className="text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
        Уроки темы — скоро здесь
      </h1>
    </div>
  );
}
