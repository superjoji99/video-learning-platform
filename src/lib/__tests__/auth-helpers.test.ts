import { describe, expect, it } from "vitest";
import { isAdmin } from "../auth-helpers";
import type { Session } from "../auth";

describe("isAdmin", () => {
  it("role が admin のとき true を返す", () => {
    const session = { user: { role: "admin" } } as unknown as Session;
    expect(isAdmin(session)).toBe(true);
  });

  it("role が user のとき false を返す", () => {
    const session = { user: { role: "user" } } as unknown as Session;
    expect(isAdmin(session)).toBe(false);
  });

  it("セッションが null のとき false を返す", () => {
    expect(isAdmin(null)).toBe(false);
  });

  it("role が未定義のとき false を返す", () => {
    const session = { user: {} } as unknown as Session;
    expect(isAdmin(session)).toBe(false);
  });
});
