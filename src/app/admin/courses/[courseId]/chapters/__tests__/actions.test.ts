import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { createChapter, reorderChapters } from "../actions";
import { db } from "@/lib/db";

const mockChapter = {
  id: "chapter-1",
  courseId: "course-1",
  title: "第1章",
  youtubeUrl: "https://youtu.be/abc123",
  position: 0,
  createdAt: 0,
};

function makeFormData(data: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) fd.append(k, v);
  return fd;
}

describe("createChapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常作成：作成された章オブジェクトを返す", async () => {
    (db as Record<string, unknown>).insert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockChapter]),
      }),
    });

    const fd = makeFormData({
      title: "第1章",
      youtubeUrl: "https://youtu.be/abc123",
      position: "0",
    });
    const result = await createChapter("course-1", fd);
    expect(result).toEqual(mockChapter);
  });

  it("YouTube URL 不正：バリデーションエラーをスロー", async () => {
    const fd = makeFormData({
      title: "第1章",
      youtubeUrl: "https://vimeo.com/abc",
      position: "0",
    });
    await expect(createChapter("course-1", fd)).rejects.toThrow(
      "YouTube の URL を入力してください"
    );
  });

  it("タイトルなし：バリデーションエラーをスロー", async () => {
    const fd = makeFormData({
      title: "",
      youtubeUrl: "https://youtu.be/abc123",
      position: "0",
    });
    await expect(createChapter("course-1", fd)).rejects.toThrow(
      "タイトルは必須です"
    );
  });
});

describe("reorderChapters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常並び替え：各章の position が更新される", async () => {
    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
    (db as Record<string, unknown>).update = mockUpdate;

    await reorderChapters("course-1", ["chapter-1", "chapter-2", "chapter-3"]);
    expect(mockUpdate).toHaveBeenCalledTimes(3);
  });

  it("空配列のとき何もせず正常終了する", async () => {
    const mockUpdate = vi.fn();
    (db as Record<string, unknown>).update = mockUpdate;

    await reorderChapters("course-1", []);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
