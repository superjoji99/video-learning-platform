import { describe, expect, it } from "vitest";
import { validateCourseInput, validateChapterInput } from "../validation";

describe("validateCourseInput", () => {
  it("正常なタイトルは ok: true を返す", () => {
    expect(validateCourseInput({ title: "React入門" })).toEqual({
      ok: true,
      errors: [],
    });
  });

  it("タイトルが空文字のとき必須エラーを返す", () => {
    expect(validateCourseInput({ title: "" })).toEqual({
      ok: false,
      errors: ["タイトルは必須です"],
    });
  });

  it("タイトルが空白のみのとき必須エラーを返す", () => {
    expect(validateCourseInput({ title: "   " })).toEqual({
      ok: false,
      errors: ["タイトルは必須です"],
    });
  });

  it("タイトルが100文字超のとき文字数エラーを返す", () => {
    expect(validateCourseInput({ title: "あ".repeat(101) })).toEqual({
      ok: false,
      errors: ["タイトルは100文字以内にしてください"],
    });
  });
});

describe("validateChapterInput", () => {
  it("正常な入力は ok: true を返す", () => {
    expect(
      validateChapterInput({ title: "第1章", youtubeUrl: "https://youtu.be/abc123" })
    ).toEqual({ ok: true, errors: [] });
  });

  it("タイトルが空のとき必須エラーを返す", () => {
    expect(
      validateChapterInput({ title: "", youtubeUrl: "https://youtu.be/abc123" })
    ).toEqual({ ok: false, errors: ["タイトルは必須です"] });
  });

  it("URL が空のとき必須エラーを返す", () => {
    expect(validateChapterInput({ title: "第1章", youtubeUrl: "" })).toEqual({
      ok: false,
      errors: ["YouTube URLは必須です"],
    });
  });

  it("URL が YouTube 以外のとき URL エラーを返す", () => {
    expect(
      validateChapterInput({ title: "第1章", youtubeUrl: "https://vimeo.com/abc" })
    ).toEqual({
      ok: false,
      errors: ["YouTube の URL を入力してください"],
    });
  });

  it("タイトルと URL の両方が空のとき両方のエラーを返す", () => {
    expect(validateChapterInput({ title: "", youtubeUrl: "" })).toEqual({
      ok: false,
      errors: ["タイトルは必須です", "YouTube URLは必須です"],
    });
  });
});
