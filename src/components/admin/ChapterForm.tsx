"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createChapter,
  updateChapter,
} from "@/app/admin/courses/[courseId]/chapters/actions";
import type { Chapter } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  courseId: string;
  chapter?: Chapter;
  defaultPosition: number;
};

export function ChapterForm({ courseId, chapter, defaultPosition }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (chapter) {
        await updateChapter(courseId, chapter.id, formData);
      } else {
        await createChapter(courseId, formData);
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
        <Label htmlFor="title">章タイトル *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={chapter?.title}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtubeUrl">YouTube URL *</Label>
        <Input
          id="youtubeUrl"
          name="youtubeUrl"
          type="url"
          defaultValue={chapter?.youtubeUrl}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
      </div>

      <input
        type="hidden"
        name="position"
        value={chapter?.position ?? defaultPosition}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : chapter ? "更新する" : "追加する"}
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
