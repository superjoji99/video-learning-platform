export const dynamic = "force-dynamic";

import { ChapterForm } from "@/components/admin/ChapterForm";
import { db } from "@/lib/db";
import { chapters, courses } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId, chapterId } = await params;

  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .then((rows) => rows[0]);

  if (!course) notFound();

  const chapter = await db
    .select()
    .from(chapters)
    .where(and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)))
    .then((rows) => rows[0]);

  if (!chapter) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">章を編集</h1>
      <p className="text-gray-600 mb-6">コース：{course.title}</p>
      <ChapterForm courseId={courseId} chapter={chapter} defaultPosition={chapter.position} />
    </div>
  );
}
