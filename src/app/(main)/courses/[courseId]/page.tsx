import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chapters, courses } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CourseDetailPage({
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

  if (!course || course.published === 0) notFound();

  const chapterList = await db
    .select()
    .from(chapters)
    .where(eq(chapters.courseId, courseId))
    .orderBy(chapters.position);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/courses"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← コース一覧に戻る
      </Link>

      {course.thumbnail && (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100 mb-6">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
      {course.description && (
        <p className="text-gray-600 mb-8">{course.description}</p>
      )}

      <h2 className="text-xl font-semibold mb-4">
        章一覧{" "}
        <Badge variant="secondary">{chapterList.length}章</Badge>
      </h2>

      {chapterList.length === 0 ? (
        <p className="text-gray-500">章はまだありません。</p>
      ) : (
        <ol className="space-y-2">
          {chapterList.map((chapter, index) => (
            <li key={chapter.id}>
              <Link
                href={`/courses/${courseId}/chapters/${chapter.id}`}
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="font-medium">{chapter.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      {chapterList.length > 0 && (
        <div className="mt-8">
          <Link
            href={`/courses/${courseId}/chapters/${chapterList[0].id}`}
            className={buttonVariants()}
          >
            最初の章から始める
          </Link>
        </div>
      )}
    </div>
  );
}
