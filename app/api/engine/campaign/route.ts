/**
 * /api/engine/campaign — Offer Ready campaign lifecycle.
 *   POST { action: 'create', interviewDate, company, level, domains, minutesPerDay, daysPerWeek, campaignDays? }
 *   POST { action: 'dayComplete', campaignId, dayDate, sessionResult }
 *   POST { action: 'replan', campaignId }
 *   POST { action: 'certificate', campaignId }
 *   GET  ?id=  -> campaign state (+today computed)
 *   GET  ?preview=1 -> 3-day free preview
 * Auth: required for create/dayComplete (per-user persistence). Preview is open.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { readEngine, saveCampaignToStore, getCampaignFromStore, updateCampaignInStore } from '@/lib/server/engine-store';
import {
  generateCampaign, replanUpcomingDays, completeDay, certificateData, computeReadiness,
} from '@/lib/engine/campaign.mjs';
import { loadLeanIndex } from '@/lib/engine/server.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (url.searchParams.get('preview')) {
    // free preview: 3 days, no persistence
    const in7 = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
    const c = generateCampaign({ interviewDate: in7, level: 'fresher', domains: ['ruby-backend-fresher'], minutesPerDay: 30, daysPerWeek: 5, campaignDays: 3 });
    return NextResponse.json({ preview: true, campaign: { ...c, days: c.days.slice(0, 3) } });
  }
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  const campaign = getCampaignFromStore(uid, id ?? '');
  if (!campaign) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  // compute today + live readiness inputs + GRAPH DATA (session scores, phase stats)
  const todayIso = new Date().toISOString().slice(0, 10);
  const today = campaign.days.find((d: any) => d.date === todayIso) ?? null;
  const engine = readEngine(uid);
  const recentSessions = engine.sessions.slice(0, 10);
  const recentTrend = recentSessions.length ? Math.round(recentSessions.reduce((a: number, s: any) => a + (s.overallScore ?? 0), 0) / recentSessions.length) : 0;
  const readiness = computeReadiness({ coverageRatio: 0, recentTrend, calibrationBias: 0, rehearsalBest: null });

  // ---- graph payloads ----
  // 1) readiness arc over the campaign (from readinessHistory, oldest→newest)
  const arc = (campaign.readinessHistory ?? []).map((r: any) => ({ ts: r.ts, value: r.value }));
  // 2) per-session scores (recent 10, oldest→newest for a left-to-right strip)
  const sessionScores = [...recentSessions].reverse().map((s: any) => ({
    ts: s.savedAt, score: s.overallScore ?? 0, mode: s.mode ?? 'technical',
    minutes: s.presetMinutes ?? 0,
  }));
  // 3) phase progress stats
  const phaseStats = ['foundation', 'depth', 'pressure', 'rehearsal'].map((p) => {
    const days = campaign.days.filter((d: any) => d.phase === p);
    return {
      phase: p,
      total: days.length,
      done: days.filter((d: any) => d.status === 'completed').length,
      missed: days.filter((d: any) => d.status === 'missed').length,
    };
  });
  // 4) day-status timeline (for a calendar-ish strip)
  const dayTimeline = campaign.days.map((d: any) => ({
    date: d.date, phase: d.phase, dayType: d.dayType, status: d.status,
  }));

  return NextResponse.json({
    campaign, today, readiness,
    graphs: { arc, sessionScores, phaseStats, dayTimeline },
    stats: {
      totalSessions: engine.sessions.length,
      minutesPracticed: (engine.sessions ?? []).reduce((a: number, s: any) => a + (s.presetMinutes ?? 0), 0),
      bestScore: engine.sessions.length ? Math.max(...engine.sessions.map((s: any) => s.overallScore ?? 0)) : 0,
      avgScore: engine.sessions.length ? Math.round(engine.sessions.reduce((a: number, s: any) => a + (s.overallScore ?? 0), 0) / engine.sessions.length) : 0,
    },
  });
}

export async function POST(req: NextRequest) {
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const action = body?.action;

  try {
    if (action === 'create') {
      const c = generateCampaign({
        interviewDate: body?.interviewDate,
        company: body?.company ?? undefined,
        level: body?.level,
        domains: Array.isArray(body?.domains) ? body.domains : undefined,
        minutesPerDay: body?.minutesPerDay,
        daysPerWeek: body?.daysPerWeek,
        campaignDays: body?.campaignDays,
      }, readEngine(uid).mastery ?? {});
      saveCampaignToStore(uid, c);
      return NextResponse.json({ ok: true, campaign: c });
    }

    if (action === 'dayComplete') {
      const campaign = getCampaignFromStore(uid, String(body?.campaignId ?? ''));
      if (!campaign) return NextResponse.json({ error: 'not_found' }, { status: 404 });
      const engine = readEngine(uid);
      const recent = engine.sessions.slice(0, 7);
      const recentTrend = recent.length ? Math.round(recent.reduce((a: number, s: any) => a + (s.overallScore ?? 0), 0) / recent.length) : 0;
      const readiness = completeDay(campaign, String(body?.dayDate ?? ''), {
        coverageRatio: body?.sessionResult?.coverageRatio ?? 0,
        recentTrend,
        calibrationBias: body?.sessionResult?.calibrationBias ?? 0,
        rehearsalBest: body?.sessionResult?.rehearsalBest ?? null,
      });
      updateCampaignInStore(uid, campaign);
      // adaptive: replan future days with fresh mastery
      replanUpcomingDays(campaign, engine.mastery ?? {}, null);
      updateCampaignInStore(uid, campaign);
      return NextResponse.json({ ok: true, readiness, campaign });
    }

    if (action === 'replan') {
      const campaign = getCampaignFromStore(uid, String(body?.campaignId ?? ''));
      if (!campaign) return NextResponse.json({ error: 'not_found' }, { status: 404 });
      const res = replanUpcomingDays(campaign, readEngine(uid).mastery ?? {}, null);
      updateCampaignInStore(uid, campaign);
      return NextResponse.json({ ok: true, changed: res.changed, campaign });
    }

    if (action === 'certificate') {
      const campaign = getCampaignFromStore(uid, String(body?.campaignId ?? ''));
      if (!campaign) return NextResponse.json({ error: 'not_found' }, { status: 404 });
      const lastR = campaign.readinessHistory?.[campaign.readinessHistory.length - 1]?.value ?? 0;
      return NextResponse.json(certificateData(campaign, lastR));
    }

    return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'campaign_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
