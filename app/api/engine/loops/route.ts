/**
 * /api/engine/loops — company-loop simulators + rehearsal schedules.
 *   GET                      -> loop catalog (no auth)
 *   POST { loopId, interviewDate } -> rehearsal schedule (plan-gated Pro)
 */
import { NextRequest, NextResponse } from 'next/server';
import { COMPANY_LOOPS, rehearsalSchedule } from '@/lib/engine/companyLoops.mjs';
import { getUserIdFromRequest } from '@/lib/server/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    loops: Object.values(COMPANY_LOOPS).map((l) => ({
      id: l.id, name: l.name, tagline: l.tagline,
      rounds: l.rounds.map((r) => ({ label: r.label, minutes: r.minutes, mode: r.mode })),
      emphasis: l.emphasis,
      plan: l.plan,
    })),
  });
}

export async function POST(req: NextRequest) {
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const sched = rehearsalSchedule(String(body?.loopId ?? ''), String(body?.interviewDate ?? ''));
  if (!sched) return NextResponse.json({ error: 'bad_loop_or_date' }, { status: 400 });
  return NextResponse.json(sched);
}
