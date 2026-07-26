export const dynamic = "force-dynamic";

import { CourseForm } from "@/components/admin/CourseForm";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditCoursePage({
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">コース編集</h1>
      <CourseForm course={course} />
    </div>
  );
}
