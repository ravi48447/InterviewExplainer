/**
 * Minimal transactional email via Resend's REST API.
 *
 * If `RESEND_API_KEY` is unset (e.g. local dev), emails are logged to the
 * server console instead of being sent — so magic-link / password-reset flows
 * are still fully testable without any third-party setup.
 *
 * Server-only.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL || 'InterviewExplainer <onboarding@resend.dev>';

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  /** Plain-text fallback (also used for the dev console log). */
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<{ ok: boolean }> {
  if (!RESEND_API_KEY) {
    // eslint-disable-next-line no-console
    console.log(
      `\n📧 [email:dev] (no RESEND_API_KEY — logging instead of sending)\n` +
      `   to:      ${to}\n` +
      `   subject: ${subject}\n` +
      `   ${text}\n`,
    );
    return { ok: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to, subject, html, text }),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error('[email] Resend error:', res.status, await res.text().catch(() => ''));
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] send failed:', err);
    return { ok: false };
  }
}

/** Wrap body content in a simple branded HTML shell. */
export function emailShell(heading: string, body: string, ctaText: string, ctaUrl: string): string {
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a">
    <h1 style="font-size:20px;font-weight:800;margin:0 0 12px">${heading}</h1>
    <p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 20px">${body}</p>
    <a href="${ctaUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px">${ctaText}</a>
    <p style="font-size:12px;color:#94a3b8;margin:24px 0 0">If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>
  </div>`;
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}
