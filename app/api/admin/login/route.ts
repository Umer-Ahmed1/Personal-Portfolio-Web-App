// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, signAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = signAdminToken();
    const res   = NextResponse.json({ success: true });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure:   process.env.NODE_ENV === "production",
      maxAge:   60 * 60 * 12, // 12 hours
      path:     "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}