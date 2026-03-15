// app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Project } from "@/lib/models/Project";
import { verifyAdminToken, getAdminToken, generateClientId, generateClientPassword } from "@/lib/auth";
import nodemailer from "nodemailer";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

// GET /api/admin/projects
export async function GET(req: NextRequest) {
  const token = getAdminToken(req);
  if (!token || !verifyAdminToken(token)) return unauthorized();

  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(projects);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("GET projects error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/admin/projects
export async function POST(req: NextRequest) {
  const token = getAdminToken(req);
  if (!token || !verifyAdminToken(token)) return unauthorized();

  try {
    // ── 1. Connect DB ─────────────────────────────────────────────────────────
    await connectDB();

    // ── 2. Parse body ─────────────────────────────────────────────────────────
    const body = await req.json();
    const { projectName, clientName, clientEmail, startDate, expectedDate, overallStatus, modules } = body;

    if (!projectName || !clientName || !clientEmail || !startDate || !expectedDate) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // ── 3. Generate credentials ───────────────────────────────────────────────
    let clientId = generateClientId();
    while (await Project.exists({ clientId })) {
      clientId = generateClientId();
    }
    const passwordPlain = generateClientPassword();

    // ── 4. Save to MongoDB ────────────────────────────────────────────────────
    const project = await Project.create({
      clientId,
      passwordPlain,
      projectName,
      clientName,
      clientEmail,
      startDate,
      expectedDate,
      overallStatus: overallStatus || "Not Started",
      modules: modules || [],
    });

    // ── 5. Send email (non-blocking — don't fail the whole request if email fails) ──
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"Umer Ahmed" <${process.env.GMAIL_USER}>`,
        to: clientEmail,
        subject: `Your project portal access — ${projectName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#B42A2A;padding:24px 32px;">
              <h1 style="color:white;margin:0;font-size:20px;">Your Project Portal is Ready</h1>
            </div>
            <div style="background:#1a1a1a;padding:32px;color:#eeeeee;line-height:1.8;">
              <p>Hi ${clientName},</p>
              <p>Your project <strong>${projectName}</strong> has been set up.
                 Use the credentials below to log in and track progress.</p>
              <div style="background:#222;border:1px solid #333;padding:24px;margin:24px 0;border-radius:4px;">
                <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Login URL</p>
                <a href="${appUrl}/status" style="color:#e63030;font-size:15px;">${appUrl}/status</a>
                <p style="margin:20px 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Project ID</p>
                <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:2px;color:white;">${clientId}</p>
                <p style="margin:20px 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Password</p>
                <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:2px;color:white;">${passwordPlain}</p>
              </div>
              <p style="color:#888;font-size:13px;">Keep these safe. Contact me if you lose access.</p>
              <p style="margin-top:24px;">Best,<br/><strong style="color:#e63030;">Umer Ahmed</strong></p>
            </div>
            <div style="background:#111;padding:16px 32px;color:#555;font-size:12px;">
              Expected completion: ${expectedDate}
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      // Log but don't fail — project is already saved, credentials shown on screen
      console.warn("Email send failed (project still created):", emailErr instanceof Error ? emailErr.message : emailErr);
    }

    // ── 6. Return credentials to frontend ─────────────────────────────────────
    return NextResponse.json({ success: true, clientId, passwordPlain, project }, { status: 201 });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Create project error:", msg);
    // Return actual error so you can debug in browser
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}