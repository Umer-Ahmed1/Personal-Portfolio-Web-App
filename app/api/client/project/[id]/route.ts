// app/api/admin/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Project } from "@/lib/models/Project";
import { verifyAdminToken, getAdminToken } from "@/lib/auth";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

// PUT /api/admin/projects/[id]
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = getAdminToken(req);
  if (!token || !verifyAdminToken(token)) return unauthorized();

  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    console.log("PUT project id:", id, "body:", JSON.stringify(body).slice(0, 100));

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json({ error: `Project ${id} not found.` }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("PUT project error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/projects/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = getAdminToken(req);
  if (!token || !verifyAdminToken(token)) return unauthorized();

  try {
    await connectDB();
    const { id } = await context.params;

    console.log("DELETE project id:", id);

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: `Project ${id} not found.` }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("DELETE project error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}