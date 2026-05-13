import { LessonLayoutClient } from "@/components/lessons/LessonLayoutClient";

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LessonLayoutClient lessonId={id}>{children}</LessonLayoutClient>;
}
