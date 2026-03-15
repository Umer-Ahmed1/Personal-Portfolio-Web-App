// app/api/client/project/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Project } from "@/lib/models/Project";
import jwt from "jsonwebtoken";

function getClientToken(req: NextRequest): string | null {
  return req.cookies.get("client_token")?.value ?? null;
}

export async function GET(req: NextRequest) {
  try {
    const token = getClientToken(req);
    if (!token) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Verify JWT and extract clientId
    let clientId: string;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        role: string;
        clientId: string;
      };
      if (payload.role !== "client") throw new Error("Invalid role");
      clientId = payload.clientId;
    } catch {
      return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
    }

    await connectDB();

    const project = await Project.findOne({ clientId }).lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    // Strip sensitive fields before sending to client
    const { passwordPlain: _, ...safeProject } = project as typeof project & { passwordPlain: string };

    return NextResponse.json(safeProject);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Client project fetch error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}