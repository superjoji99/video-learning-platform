"use server";

import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { validateCourseInput } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const title = (formData.get("title") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";
  const thumbnail = (formData.get("thumbnail") as string) ?? "";
  const published = formData.get("published") === "1" ? 1 : 0;

  const result = validateCourseInput({ title });
  if (!result.ok) throw new Error(result.errors.join(", "));

  const [created] = await db
    .insert(courses)
    .values({ title: title.trim(), description, thumbnail, published })
    .returning();

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return created;
}

export async function updateCourse(id: string, formData: FormData) {
  const title = (formData.get("title") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";
  const thumbnail = (formData.get("thumbnail") as string) ?? "";
  const published = formData.get("published") === "1" ? 1 : 0;

  const result = validateCourseInput({ title });
  if (!result.ok) throw new Error(result.errors.join(", "));

  const [updated] = await db
    .update(courses)
    .set({ title: title.trim(), description, thumbnail, published })
    .where(eq(courses.id, id))
    .returning();

  if (!updated) throw new Error("コースが見つかりません");

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath(`/courses/${id}`);
  return updated;
}

export async function deleteCourse(id: string) {
  const [deleted] = await db
    .delete(courses)
    .where(eq(courses.id, id))
    .returning();

  if (!deleted) throw new Error("コースが見つかりません");

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true };
}
