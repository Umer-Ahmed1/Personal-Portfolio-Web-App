// app/api/client/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("client_token", "", { maxAge: 0, path: "/" });
  return res;
}