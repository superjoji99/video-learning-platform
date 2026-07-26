"use server";

import { db } from "@/lib/db";
import { chapters } from "@/lib/schema";
import { validateChapterInput } from "@/lib/validation";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createChapter(courseId: string, formData: FormData) {
  const title = (formData.get("title") as string) ?? "";
  const youtubeUrl = (formData.get("youtubeUrl") as string) ?? "";
  const position = Number(formData.get("position") ?? 0);

  const result = validateChapterInput({ title, youtubeUrl });
  if (!result.ok) throw new Error(result.errors.join(", "));

  const [created] = await db
    .insert(chapters)
    .values({ courseId, title: title.trim(), youtubeUrl, position })
    .returning();

  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/${courseId}`);
  return created;
}

export async function updateChapter(
  courseId: string,
  chapterId: string,
  formData: FormData
) {
  const title = (formData.get("title") as string) ?? "";
  const youtubeUrl = (formData.get("youtubeUrl") as string) ?? "";
  const position = Number(formData.get("position") ?? 0);

  const result = validateChapterInput({ title, youtubeUrl });
  if (!result.ok) throw new Error(result.errors.join(", "));

  const [updated] = await db
    .update(chapters)
    .set({ title: title.trim(), youtubeUrl, position })
    .where(and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)))
    .returning();

  if (!updated) throw new Error("章が見つかりません");

  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/${courseId}`);
  return updated;
}

export async function deleteChapter(courseId: string, chapterId: string) {
  const [deleted] = await db
    .delete(chapters)
    .where(and(eq(chapters.id, chapterId), eq(chapters.courseId, courseId)))
    .returning();

  if (!deleted) throw new Error("章が見つかりません");

  revalidatePath(`/admin/courses`);
  revalidatePath(`/courses/${courseId}`);
  return { success: true };
}

export async function reorderChapters(
  courseId: string,
  orderedIds: string[]
) {
  if (orderedIds.length === 0) return;

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(chapters)
        .set({ position: index })
        .where(and(eq(chapters.id, id), eq(chapters.courseId, courseId)))
    )
  );

  revalidatePath(`/courses/${courseId}`);
}
