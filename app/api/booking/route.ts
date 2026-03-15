import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, date, time, timezone } = await req.json();

    if (!name || !email || !date || !time) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

      + `&to=${encodeURIComponent(email)}`
      + `&su=${encodeURIComponent(`Meeting Link — ${date} at ${time}`)}`
      + `&body=${encodeURIComponent(
          `Hi ${name},\n\nHere is your meeting link for our call on ${date} at ${time} (${timezone}):\n\n[PASTE LINK HERE]\n\nSee you then!\n\nUmer Ahmed`
        )}`;

    // ── Email to UMER ─────────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Portfolio Bookings" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `[Booking] ${name} — ${date} at ${time}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#B42A2A;padding:24px 32px;">
            <h1 style="color:white;margin:0;font-size:20px;">New Demo Call Booking</h1>
          </div>
          <div style="background:#1a1a1a;padding:32px;color:#eeeeee;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#888;width:120px;">Name</td>
                <td style="padding:8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;">Email</td>
                <td style="padding:8px 0;">
                  <a href="mailto:${email}" style="color:#e63030;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;">Date</td>
                <td style="padding:8px 0;">${date}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;">Time</td>
                <td style="padding:8px 0;">${time}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#888;">Timezone</td>
                <td style="padding:8px 0;">${timezone}</td>
              </tr>
            </table>
            <hr style="border-color:#333;margin:28px 0;" />
            <p style="color:#888;font-size:13px;margin:0 0 16px;">
              When you have a meeting link ready, email it to <a href="mailto:${email}" style="color:#e63030;">${email}</a>:
            </p>
          
          </div>
          <div style="background:#111;padding:16px 32px;color:#555;font-size:12px;">
            Sent from your portfolio booking form
          </div>
        </div>
      `,
    });

    // ── Email to USER ─────────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Umer Ahmed" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Your call request is received, ${name}!`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#B42A2A;padding:24px 32px;">
            <h1 style="color:white;margin:0;font-size:20px;">Call Request Received!</h1>
          </div>
          <div style="background:#1a1a1a;padding:32px;color:#eeeeee;line-height:1.8;">
            <p style="margin:0 0 16px;">Hi ${name},</p>
            <p style="margin:0 0 16px;">
              Thanks for booking a demo call! Your slot has been noted and
              I'll confirm it shortly.
            </p>
            <div style="background:#222;border-left:3px solid #B42A2A;padding:16px 20px;margin:20px 0;border-radius:0 4px 4px 0;">
              <p style="margin:4px 0;color:#888;font-size:13px;">YOUR BOOKING DETAILS</p>
              <p style="margin:8px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin:4px 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin:4px 0;"><strong>Timezone:</strong> ${timezone}</p>
            </div>
            <p style="margin:0 0 16px;">
              You will receive a <strong>separate email with the meeting link</strong>
              once the call is confirmed. Please check your inbox (and spam folder just in case).
            </p>
            <p style="margin:0;color:#888;font-size:13px;">
              If you need to reschedule or have questions, just reply to this email.
            </p>
            <p style="margin-top:28px;margin-bottom:0;">
              Talk soon,<br/>
              <strong style="color:#e63030;">Umer Ahmed</strong>
            </p>
          </div>
          <div style="background:#111;padding:16px 32px;color:#555;font-size:12px;">
            This is an automated confirmation from umerahmed.com
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking email error:", err);
    return NextResponse.json({ error: "Failed to send booking email." }, { status: 500 });
  }
}