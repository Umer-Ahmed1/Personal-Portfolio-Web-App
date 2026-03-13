import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, subject, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // ── Email to UMER only ────────────────────────────────────────────────────
    // replyTo is set to the user's email so clicking Reply in Gmail
    // goes directly to them — no separate email to user needed for contact.
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: `"${firstName} ${lastName}" <${email}>`,
      subject: `[Portfolio] ${subject} — from ${firstName} ${lastName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#B42A2A;padding:24px 32px;">
            <h1 style="color:white;margin:0;font-size:20px;">New Contact Message</h1>
          </div>
          <div style="background:#1a1a1a;padding:32px;color:#eeeeee;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#888;width:140px;">Name</td>
                <td style="padding:8px 0;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;">Email</td>
                <td style="padding:8px 0;">
                  <a href="mailto:${email}" style="color:#e63030;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding:8px 0;color:#888;">Phone</td>
                <td style="padding:8px 0;">${phone}</td>
              </tr>` : ""}
              <tr>
                <td style="padding:8px 0;color:#888;">Subject</td>
                <td style="padding:8px 0;">${subject}</td>
              </tr>
            </table>
            <hr style="border-color:#333;margin:24px 0;" />
            <p style="color:#888;margin:0 0 8px 0;">Message</p>
            <p style="white-space:pre-wrap;margin:0;line-height:1.7;color:#eeeeee;">${message}</p>
          </div>
          <div style="background:#111;padding:16px 32px;color:#555;font-size:12px;">
            Hit Reply to respond directly to ${firstName} at ${email}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}