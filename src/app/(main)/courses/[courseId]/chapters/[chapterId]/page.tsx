export const dynamic = "force-dynamic";

import { buttonVariants } from "@/components/ui/button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { db } from "@/lib/db";
import { chapters, courses } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ChapterPage({
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

  if (!course || course.published === 0) notFound();

  const chapter = await db
    .select()
    .from(chapters)
    .where(and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)))
    .then((rows) => rows[0]);

  if (!chapter) notFound();

  const allChapters = await db
    .select()
    .from(chapters)
    .where(eq(chapters.courseId, courseId))
    .orderBy(chapters.position);

  const currentIndex = allChapters.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href={`/courses/${courseId}`}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← {course.title}
      </Link>

      <h1 className="text-2xl font-bold mb-6">{chapter.title}</h1>

      <VideoPlayer youtubeUrl={chapter.youtubeUrl} />

      {/* 章ナビゲーション */}
      <div className="flex justify-between mt-8">
        {prevChapter ? (
          <Link
            href={`/courses/${courseId}/chapters/${prevChapter.id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            ← {prevChapter.title}
          </Link>
        ) : (
          <div />
        )}
        {nextChapter && (
          <Link
            href={`/courses/${courseId}/chapters/${nextChapter.id}`}
            className={buttonVariants()}
          >
            {nextChapter.title} →
          </Link>
        )}
      </div>

      {/* 章一覧サイドリスト */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3">章一覧</h2>
        <ol className="space-y-1">
          {allChapters.map((c, index) => (
            <li key={c.id}>
              <Link
                href={`/courses/${courseId}/chapters/${c.id}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  c.id === chapterId
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="text-sm text-gray-500 w-5 text-right">
                  {index + 1}
                </span>
                <span className="text-sm">{c.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
