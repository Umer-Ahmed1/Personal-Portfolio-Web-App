// app/api/client/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Project } from "@/lib/models/Project";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { clientId, password } = await req.json();

    if (!clientId || !password) {
      return NextResponse.json({ error: "Project ID and password are required." }, { status: 400 });
    }

    await connectDB();

    const project = await Project.findOne({
      clientId: clientId.trim().toUpperCase(),
      passwordPlain: password.trim(),
    }).lean();

    if (!project) {
      return NextResponse.json({ error: "Invalid Project ID or password." }, { status: 401 });
    }

    // Sign a client JWT
    const token = jwt.sign(
      { role: "client", clientId: project.clientId },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ success: true });

    res.cookies.set("client_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Client login error:", msg);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}