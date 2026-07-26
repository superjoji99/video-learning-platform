import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({ headers: request.headers });

  // 未ログインの場合は /login にリダイレクト
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // /admin は管理者のみ
  if (pathname.startsWith("/admin")) {
    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/courses", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/courses/:path*", "/admin/:path*"],
};
