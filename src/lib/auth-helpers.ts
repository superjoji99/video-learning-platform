import type { Session } from "./auth";

export function isAdmin(session: Session | null): boolean {
  if (!session) return false;
  const role = (session.user as { role?: string }).role;
  return role === "admin";
}
