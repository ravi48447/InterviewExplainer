import { NextResponse } from 'next/server';
import { findOrCreateByEmail, createAuthToken } from '@/lib/server/user-store';
import { sendEmail, emailShell, siteUrl } from '@/lib/server/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Passwordless sign-in. Creates the account on first use, then emails a
 * one-time link to `/api/auth/magic/callback`.
 */
export async function POST(req: Request) {
  const { email, name } = (await req.json().catch(() => ({}))) ?? {};

  const generic = NextResponse.json({
    ok: true,
    message: 'Check your inbox — we sent you a secure sign-in link.',
  });

  if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
  }

  const user = findOrCreateByEmail(email, name || '', 'magic');
  const token = createAuthToken(user.id, 'magic');
  const url = `${siteUrl()}/api/auth/magic/callback?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: user.email,
    subject: 'Your InterviewExplainer sign-in link',
    text: `Sign in: ${url}`,
    html: emailShell(
      'Sign in to InterviewExplainer',
      'Click the button below to securely sign in. No password needed.',
      'Sign In',
      url,
    ),
  });

  return generic;
}
