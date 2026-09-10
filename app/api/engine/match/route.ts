/**
 * /api/engine/match — peer matching queue.
 *
 *   POST { action: 'join', userId, name, domain, level, role, timezone, language }
 *        -> { matched: true, matchId, match } | { queued: true, position }
 *   POST { action: 'check', userId }  -> poll for match (call every ~3s)
 *   POST { action: 'leave', userId }
 *   GET  -> queue stats (for the landing UI)
 *   POST { action: 'feedback', movesUsed, rubricTicks, ... } -> interviewer score
 *
 * Auth: userId from the session token when present (logged-in users); the
 * queue itself is plan-gated (live rooms are an Interview Pass feature).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import {
  joinQueue, checkMatch, leaveQueue, scoreInterviewer, queueStats,
} from '@/lib/engine/matching.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(queueStats());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    const uid = getUserIdFromRequest(req) ?? String(body?.userId ?? '');

    if (action === 'join') {
      if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
      const res = joinQueue({ ...body, userId: uid });
      return NextResponse.json(res, { status: res.error ? 400 : 200 });
    }
    if (action === 'check') {
      if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
      return NextResponse.json(checkMatch(uid));
    }
    if (action === 'leave') {
      leaveQueue(uid || String(body?.userId ?? ''));
      return NextResponse.json({ left: true });
    }
    if (action === 'feedback') {
      return NextResponse.json(scoreInterviewer(body ?? {}));
    }
    return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'match_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
