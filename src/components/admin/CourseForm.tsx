"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCourse, updateCourse } from "@/app/admin/courses/actions";
import type { Course } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (course) {
        await updateCourse(course.id, formData);
      } else {
        await createCourse(formData);
      }
      router.push("/admin/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">タイトル *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={course?.title}
          required
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">説明</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={course?.description ?? ""}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">サムネイル URL</Label>
        <Input
          id="thumbnail"
          name="thumbnail"
          type="url"
          defaultValue={course?.thumbnail ?? ""}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          value="1"
          defaultChecked={course?.published === 1}
          className="w-4 h-4"
        />
        <Label htmlFor="published">公開する</Label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : course ? "更新する" : "作成する"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/courses")}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}
