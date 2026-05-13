import { redirect } from "next/navigation";

export default async function OldLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  redirect(`/lessons/${lessonId}`);
}
