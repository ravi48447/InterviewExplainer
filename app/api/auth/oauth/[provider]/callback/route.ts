import { NextResponse } from 'next/server';
import { exchangeAndFetchProfile, type OAuthProviderId } from '@/lib/server/oauth';
import { findOrCreateByEmail } from '@/lib/server/user-store';
import { signToken } from '@/lib/server/crypto';
import { attachSession } from '@/lib/server/session';
import { siteUrl } from '@/lib/server/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID = new Set(['google', 'github']);

function readCookie(req: Request, name: string): string | null {
  const cookie = req.headers.get('cookie');
  if (!cookie) return null;
  for (const part of cookie.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export async function GET(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const provider = (await params).provider as OAuthProviderId;
  const base = siteUrl();
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!VALID.has(provider)) return NextResponse.redirect(`${base}/login?error=oauth_unavailable`);

  // Verify CSRF state.
  const expected = readCookie(req, `oauth_state_${provider}`);
  if (!code || !state || !expected || state !== expected) {
    return NextResponse.redirect(`${base}/login?error=oauth_state`);
  }

  const profile = await exchangeAndFetchProfile(provider, code).catch(() => null);
  if (!profile?.email) {
    return NextResponse.redirect(`${base}/login?error=oauth_failed`);
  }

  const user = findOrCreateByEmail(profile.email, profile.name, provider);
  const session = signToken(user.id, user.email);
  const res = attachSession(NextResponse.redirect(`${base}/dashboard`), session);
  res.cookies.set(`oauth_state_${provider}`, '', { path: '/', maxAge: 0 });
  return res;
}
