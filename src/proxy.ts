import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // auth モジュールを直接インポートせず fetch 経由でセッション確認
  const sessionRes = await fetch(
    new URL("/api/auth/get-session", request.url),
    {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    }
  );

  const session = sessionRes.ok ? await sessionRes.json() : null;

  // 未ログインの場合は /login にリダイレクト
  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // /admin は管理者のみ
  if (pathname.startsWith("/admin")) {
    const role = session.user?.role as string | undefined;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/courses", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/courses/:path*", "/admin/:path*"],
};
