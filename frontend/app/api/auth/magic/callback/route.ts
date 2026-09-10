import { NextResponse } from 'next/server';
import { consumeAuthToken, getUserById } from '@/lib/server/user-store';
import { signToken } from '@/lib/server/crypto';
import { attachSession } from '@/lib/server/session';
import { siteUrl } from '@/lib/server/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  const base = siteUrl();

  const uid = token ? consumeAuthToken(token, 'magic') : null;
  const user = getUserById(uid);

  if (!user) {
    return NextResponse.redirect(`${base}/login?error=link_expired`);
  }

  const session = signToken(user.id, user.email);
  // Cookie session means the client restores via /auth/me automatically.
  return attachSession(NextResponse.redirect(`${base}/dashboard`), session);
}
