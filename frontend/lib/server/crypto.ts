/**
 * Self-contained auth crypto — no external dependencies.
 *
 * Uses Node's built-in `crypto` for password hashing (scrypt) and for signing
 * stateless session tokens (HMAC-SHA256). This lets the whole auth stack run
 * inside Next.js route handlers without a separate Java/Postgres backend.
 *
 * Server-only. Never import from a client component.
 */
import crypto from 'crypto';

const SECRET =
  process.env.AUTH_SECRET ||
  process.env.JWT_SECRET ||
  'ie_dev_only_secret_change_me_in_production_2026';

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

/** Name of the httpOnly session cookie that mirrors the bearer token. */
export const SESSION_COOKIE = 'ie_session';

/** A URL-safe random token (for magic links, password resets, OAuth state). */
export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/** SHA-256 hash (hex) — used to store reset/magic tokens without keeping them in the clear. */
export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// ─── Passwords ────────────────────────────────────────────────────────────

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const [salt, derived] = (stored || '').split(':');
  if (!salt || !derived) return false;
  const check = crypto.scryptSync(plain, salt, 64).toString('hex');
  // Constant-time compare to avoid timing attacks.
  const a = Buffer.from(derived, 'hex');
  const b = Buffer.from(check, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ─── Tokens (compact, signed, stateless) ────────────────────────────────────

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

interface TokenPayload {
  uid: string;
  email: string;
  iat: number;
  exp: number;
}

export function signToken(uid: string, email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = { uid, email, iat: now, exp: now + TOKEN_TTL_SECONDS };
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyToken(token: string | null | undefined): TokenPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as TokenPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Read a cookie value from the raw Cookie header. */
function readCookie(req: Request, name: string): string | null {
  const cookie = req.headers.get('cookie');
  if (!cookie) return null;
  for (const part of cookie.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

/**
 * Resolve the authenticated user id from a request — preferring the httpOnly
 * session cookie (safer) and falling back to the Authorization: Bearer header
 * (used by the existing axios client).
 */
export function getUserIdFromRequest(req: Request): string | null {
  const cookieToken = readCookie(req, SESSION_COOKIE);
  const cookiePayload = verifyToken(cookieToken);
  if (cookiePayload?.uid) return cookiePayload.uid;

  const header = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  const payload = verifyToken(match ? match[1] : header);
  return payload?.uid ?? null;
}
