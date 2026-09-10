/**
 * Server-side OAuth helpers for Google & GitHub.
 *
 * Builds authorize URLs, exchanges the auth code for a token, and fetches the
 * user's email + name. Returns null/throws gracefully when a provider isn't
 * configured so the rest of auth keeps working.
 *
 * Server-only.
 */
import { siteUrl } from './email';

export type OAuthProviderId = 'google' | 'github';

interface ProviderConfig {
  clientId?: string;
  clientSecret?: string;
  authUrl: string;
  tokenUrl: string;
  scope: string;
}

function config(provider: OAuthProviderId): ProviderConfig {
  if (provider === 'google') {
    return {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scope: 'openid email profile',
    };
  }
  return {
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'read:user user:email',
  };
}

export function redirectUri(provider: OAuthProviderId): string {
  return `${siteUrl()}/api/auth/oauth/${provider}/callback`;
}

export function isConfigured(provider: OAuthProviderId): boolean {
  const c = config(provider);
  return !!c.clientId && !!c.clientSecret;
}

export function buildAuthorizeUrl(provider: OAuthProviderId, state: string): string {
  const c = config(provider);
  const params = new URLSearchParams({
    client_id: c.clientId ?? '',
    redirect_uri: redirectUri(provider),
    scope: c.scope,
    state,
    response_type: 'code',
  });
  if (provider === 'google') {
    params.set('access_type', 'online');
    params.set('prompt', 'select_account');
  }
  return `${c.authUrl}?${params.toString()}`;
}

export interface OAuthProfile {
  email: string;
  name: string;
}

export async function exchangeAndFetchProfile(
  provider: OAuthProviderId,
  code: string,
): Promise<OAuthProfile | null> {
  const c = config(provider);
  if (!c.clientId || !c.clientSecret) return null;

  // 1) Exchange the code for an access token.
  const tokenRes = await fetch(c.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: c.clientId,
      client_secret: c.clientSecret,
      code,
      redirect_uri: redirectUri(provider),
      grant_type: 'authorization_code',
    }).toString(),
  });
  if (!tokenRes.ok) return null;
  const tokenJson = await tokenRes.json().catch(() => null);
  const accessToken: string | undefined = tokenJson?.access_token;
  if (!accessToken) return null;

  // 2) Fetch the profile.
  if (provider === 'google') {
    const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const p = await res.json();
    if (!p?.email) return null;
    return { email: p.email, name: p.name || p.given_name || '' };
  }

  // GitHub: profile + (possibly private) primary email.
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
  });
  if (!userRes.ok) return null;
  const profile = await userRes.json();
  let email: string | undefined = profile?.email;
  if (!email) {
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
    });
    if (emailsRes.ok) {
      const emails = await emailsRes.json();
      const primary = Array.isArray(emails)
        ? emails.find((e: any) => e.primary && e.verified) ?? emails.find((e: any) => e.verified)
        : null;
      email = primary?.email;
    }
  }
  if (!email) return null;
  return { email, name: profile?.name || profile?.login || '' };
}
