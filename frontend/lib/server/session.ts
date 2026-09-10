/**
 * Session cookie helpers.
 *
 * We issue an httpOnly, SameSite cookie that mirrors the signed bearer token so
 * server route handlers can authenticate requests without the token ever being
 * readable by client-side JS (mitigating XSS token theft). The bearer token is
 * still returned in the JSON body for backward-compatibility with the existing
 * axios client.
 *
 * Server-only.
 */
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from './crypto';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function attachSession(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: THIRTY_DAYS,
  });
  return res;
}

export function clearSession(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}
