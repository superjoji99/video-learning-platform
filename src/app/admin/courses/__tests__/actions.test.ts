import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("drizzle-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof import("drizzle-orm")>();
  return { ...actual };
});

import { createCourse, deleteCourse, updateCourse } from "../actions";
import { db } from "@/lib/db";

const mockCourse = {
  id: "course-1",
  title: "テストコース",
  description: "説明",
  thumbnail: "",
  published: 0,
  createdAt: 0,
};

function makeFormData(data: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) fd.append(k, v);
  return fd;
}

describe("createCourse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常作成：作成されたコースオブジェクトを返す", async () => {
    (db as Record<string, unknown>).insert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockCourse]),
      }),
    });

    const fd = makeFormData({ title: "テストコース", description: "説明" });
    const result = await createCourse(fd);
    expect(result).toEqual(mockCourse);
  });

  it("タイトルなし：バリデーションエラーをスロー", async () => {
    const fd = makeFormData({ title: "" });
    await expect(createCourse(fd)).rejects.toThrow("タイトルは必須です");
  });

  it("DB エラー：エラーをスロー", async () => {
    (db as Record<string, unknown>).insert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockRejectedValue(new Error("DB接続エラー")),
      }),
    });

    const fd = makeFormData({ title: "テスト" });
    await expect(createCourse(fd)).rejects.toThrow("DB接続エラー");
  });
});

describe("updateCourse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常更新：更新後のコースオブジェクトを返す", async () => {
    const updated = { ...mockCourse, title: "更新済み" };
    (db as Record<string, unknown>).update = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([updated]),
        }),
      }),
    });

    const fd = makeFormData({ title: "更新済み" });
    const result = await updateCourse("course-1", fd);
    expect(result.title).toBe("更新済み");
  });

  it("存在しない ID：エラーをスロー", async () => {
    (db as Record<string, unknown>).update = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    const fd = makeFormData({ title: "テスト" });
    await expect(updateCourse("not-exist", fd)).rejects.toThrow(
      "コースが見つかりません"
    );
  });
});

describe("deleteCourse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常削除：成功レスポンスを返す", async () => {
    (db as Record<string, unknown>).delete = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockCourse]),
      }),
    });

    const result = await deleteCourse("course-1");
    expect(result).toEqual({ success: true });
  });

  it("存在しない ID：エラーをスロー", async () => {
    (db as Record<string, unknown>).delete = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
      }),
    });

    await expect(deleteCourse("not-exist")).rejects.toThrow(
      "コースが見つかりません"
    );
  });
});
