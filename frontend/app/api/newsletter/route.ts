import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/newsletter
 * Accepts { email } and sends a welcome email via Resend.
 * Falls back to a simple acknowledgement if RESEND_API_KEY is not configured.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string | undefined = body?.email;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "hello@interviewexplainer.com";

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: "Welcome to InterviewExplainer",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
              <h2 style="color:#1e293b;">You're on the list!</h2>
              <p style="color:#475569;">
                Thanks for signing up for <strong>InterviewExplainer</strong> updates.
                We'll send you a note when new content, domains, and features go live.
              </p>
              <p style="color:#475569;">
                In the meantime, <a href="https://interviewexplainer.com/domains" style="color:#3b82f6;">browse our free question library</a> — no account needed.
              </p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
              <p style="font-size:12px;color:#94a3b8;">
                InterviewExplainer &bull; You subscribed at interviewexplainer.com
              </p>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Resend error:", err);
        return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Newsletter API error:", err);
      return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
    }
  }

  // No API key configured — log and return success (development mode)
  console.log(`[Newsletter] New subscriber (no email sent — RESEND_API_KEY not set): ${email}`);
  return NextResponse.json({ success: true });
}
