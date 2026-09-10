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
    // free preview: 3 days, no persistence — but it must represent the
    // wizard's actual selections (date, level, domains, capacity), not a
    // hardcoded default target.
    const wizardDate = url.searchParams.get('interviewDate');
    const wizardLevel = url.searchParams.get('level') === 'intermediate' ? 'intermediate' : 'fresher';
    const wizardDomains = (url.searchParams.get('domains') ?? '')
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
    const wizardMinutes = Math.min(Math.max(Number(url.searchParams.get('minutesPerDay')) || 0, 0), 240);
    const wizardDays = Math.min(Math.max(Number(url.searchParams.get('daysPerWeek')) || 0, 0), 7);
    const in7 = wizardDate && /^\d{4}-\d{2}-\d{2}$/.test(wizardDate)
      ? wizardDate
      : new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
    const domains = wizardDomains.length ? wizardDomains : ['ruby-backend-fresher'];
    const minutesPerDay = wizardMinutes || 30;
    const daysPerWeek = wizardDays || 5;
    const c = generateCampaign({ interviewDate: in7, level: wizardLevel, domains, minutesPerDay, daysPerWeek, campaignDays: 3 });
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
      // COMPLETION GATE: a day completes only against a REAL session record
      // created for that day — a referenced attempt, not a button. Find the
      // most recent session stored on/after the day's date.
      const dayDate = String(body?.dayDate ?? '');
      const dayStart = new Date(`${dayDate}T00:00:00`).getTime();
      const session = (engine.sessions ?? []).find(
        (s: any) => typeof s.savedAt === 'number' && s.savedAt >= dayStart && (s.overallScore ?? -1) >= 0
      );
      if (!session) {
        return NextResponse.json(
          { error: 'no_attempt_evidence', dayDate },
          { status: 400 }
        );
      }
      const recent = engine.sessions.slice(0, 7);
      const recentTrend = recent.length ? Math.round(recent.reduce((a: number, s: any) => a + (s.overallScore ?? 0), 0) / recent.length) : 0;
      const readiness = completeDay(campaign, dayDate, {
        coverageRatio: (session as any).coverageRatio ?? 0,
        recentTrend,
        calibrationBias: (session as any).calibrationBias ?? 0,
        rehearsalBest: (session as any).rehearsalBest ?? null,
      });
      updateCampaignInStore(uid, campaign);
      // adaptive: replan future days with fresh mastery
      replanUpcomingDays(campaign, engine.mastery ?? {}, null);
      updateCampaignInStore(uid, campaign);
      return NextResponse.json({ ok: true, readiness, campaign, completedFrom: session.sessionId });
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
      // CERTIFICATE GATE: the certificate represents a COMPLETED campaign.
      // Requirements (explicit, checkable):
      //   1. The interview date has arrived or passed, OR >=90% of days completed
      //   2. At least one full company-loop / dress-rehearsal run completed
      //   3. At least 10 evaluated sessions recorded
      const daysDone = campaign.days.filter((d: any) => d.status === 'completed').length;
      const daysTotal = campaign.days.length || 1;
      const datePassed = new Date(campaign.interviewDate).getTime() <= Date.now();
      const loopsRun = campaign.days
        .filter((d: any) => d.dayType === 'company-loop' || d.dayType === 'dress_rehearsal')
        .filter((d: any) => d.status === 'completed').length;
      const sessions = campaign.completedSessions ?? 0;
      const unmet: string[] = [];
      if (!datePassed && daysDone / daysTotal < 0.9) unmet.push('campaign not yet complete (90% of days or interview date)');
      if (loopsRun < 1) unmet.push('no completed company-loop or dress-rehearsal run');
      if (sessions < 10) unmet.push(`only ${sessions} evaluated sessions (need 10)`);
      if (unmet.length) {
        return NextResponse.json(
          { error: 'certificate_requirements_unmet', unmet },
          { status: 403 }
        );
      }
      const lastR = campaign.readinessHistory?.[campaign.readinessHistory.length - 1]?.value ?? 0;
      return NextResponse.json(certificateData(campaign, lastR));
    }

    return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'campaign_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
