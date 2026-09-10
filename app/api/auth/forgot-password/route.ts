import { NextResponse } from 'next/server';
import { getUserByEmail, createAuthToken } from '@/lib/server/user-store';
import { sendEmail, emailShell, siteUrl } from '@/lib/server/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) ?? {};

  // Always return a generic success so we never reveal which emails are registered.
  const generic = NextResponse.json({
    ok: true,
    message: 'If an account exists for that email, a reset link is on its way.',
  });

  if (!email || typeof email !== 'string') return generic;

  const user = getUserByEmail(email);
  if (!user) return generic;

  const token = createAuthToken(user.id, 'reset');
  const url = `${siteUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your InterviewExplainer password',
    text: `Reset your password: ${url}`,
    html: emailShell(
      'Reset your password',
      'Click the button below to choose a new password for your InterviewExplainer account.',
      'Reset Password',
      url,
    ),
  });

  return generic;
}
