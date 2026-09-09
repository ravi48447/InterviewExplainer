/**
 * /api/engine/sync — per-user engine data sync (auth required).
 *
 * POST { mastery?, sessions?, profile? }  -> merge into the user's engine store
 * GET                                      -> full engine data (mastery, sessions, resume)
 *
 * Guests get 401 — the client keeps working from localStorage; on login the
 * client pushes its local state up here (merge), then pulls canonical.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import {
  readEngine, mergeMastery, mergeSessions, saveProfile,
} from '@/lib/server/engine-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  return NextResponse.json(readEngine(uid));
}

export async function POST(req: NextRequest) {
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  let data = readEngine(uid);
  if (body?.mastery) data = mergeMastery(uid, body.mastery);
  if (body?.sessions) data = mergeSessions(uid, body.sessions);
  if (body?.profile) data = saveProfile(uid, body.profile);
  return NextResponse.json({ ok: true, ...data });
}
