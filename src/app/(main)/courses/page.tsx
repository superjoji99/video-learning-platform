export const dynamic = "force-dynamic";

import { CourseCard } from "@/components/CourseCard";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function CoursesPage() {
  const allCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.published, 1));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">コース一覧</h1>
      {allCourses.length === 0 ? (
        <p className="text-gray-500">コースはまだありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
