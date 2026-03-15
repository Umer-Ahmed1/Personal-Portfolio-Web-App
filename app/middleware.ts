// middleware.ts  (place at project root, same level as app/)
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes EXCEPT the login page itself
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("admin_token")?.value;

    if (!token || !verifyAdminToken(token)) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};