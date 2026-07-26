import { describe, expect, it } from "vitest";
import { extractYoutubeId, isValidYoutubeUrl } from "../youtube";

describe("extractYoutubeId", () => {
  it("通常の watch URL から ID を抽出する", () => {
    expect(extractYoutubeId("https://www.youtube.com/watch?v=abc123")).toBe("abc123");
  });

  it("短縮 URL（youtu.be）から ID を抽出する", () => {
    expect(extractYoutubeId("https://youtu.be/abc123")).toBe("abc123");
  });

  it("埋め込み URL から ID を抽出する", () => {
    expect(extractYoutubeId("https://www.youtube.com/embed/abc123")).toBe("abc123");
  });

  it("クエリパラメータ付き URL から ID を抽出する", () => {
    expect(extractYoutubeId("https://www.youtube.com/watch?v=abc123&t=30s")).toBe("abc123");
  });

  it("YouTube 以外の URL は null を返す", () => {
    expect(extractYoutubeId("https://example.com/video")).toBeNull();
  });

  it("空文字は null を返す", () => {
    expect(extractYoutubeId("")).toBeNull();
  });

  it("不正な文字列は null を返す", () => {
    expect(extractYoutubeId("not a url")).toBeNull();
  });
});

describe("isValidYoutubeUrl", () => {
  it("有効な watch URL は true を返す", () => {
    expect(isValidYoutubeUrl("https://www.youtube.com/watch?v=abc123")).toBe(true);
  });

  it("有効な短縮 URL は true を返す", () => {
    expect(isValidYoutubeUrl("https://youtu.be/abc123")).toBe(true);
  });

  it("YouTube 以外の URL は false を返す", () => {
    expect(isValidYoutubeUrl("https://vimeo.com/abc")).toBe(false);
  });

  it("空文字は false を返す", () => {
    expect(isValidYoutubeUrl("")).toBe(false);
  });
});
