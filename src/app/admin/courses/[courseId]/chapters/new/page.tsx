export const dynamic = "force-dynamic";

import { ChapterForm } from "@/components/admin/ChapterForm";
import { db } from "@/lib/db";
import { chapters, courses } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function NewChapterPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .then((rows) => rows[0]);

  if (!course) notFound();

  const existingChapters = await db
    .select()
    .from(chapters)
    .where(eq(chapters.courseId, courseId))
    .orderBy(chapters.position);

  const nextPosition = existingChapters.length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">章を追加</h1>
      <p className="text-gray-600 mb-6">コース：{course.title}</p>
      <ChapterForm courseId={courseId} defaultPosition={nextPosition} />
    </div>
  );
}
