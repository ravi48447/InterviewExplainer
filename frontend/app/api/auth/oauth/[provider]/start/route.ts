import { NextResponse } from 'next/server';
import { buildAuthorizeUrl, isConfigured, type OAuthProviderId } from '@/lib/server/oauth';
import { randomToken } from '@/lib/server/crypto';
import { siteUrl } from '@/lib/server/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID = new Set(['google', 'github']);

export async function GET(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const provider = (await params).provider as OAuthProviderId;
  const base = siteUrl();

  if (!VALID.has(provider) || !isConfigured(provider)) {
    return NextResponse.redirect(`${base}/login?error=oauth_unavailable`);
  }

  // CSRF protection: random state stored in a short-lived cookie and echoed back.
  const state = randomToken(16);
  const res = NextResponse.redirect(buildAuthorizeUrl(provider, state));
  res.cookies.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  });
  return res;
}
