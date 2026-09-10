/**
 * GET /api/engine/analytics — the premium dashboard's data feed (auth required).
 *
 * Returns everything the dashboard renders in one call:
 *   coverage: per-domain concept-coverage (importance-weighted, decay-aware)
 *   trend: score-over-time series
 *   distribution: mastery distribution buckets (weak/learning/strong/mastered)
 *   sessions: recent session records
 *   strategy: computed prep strategy (focus areas + recommended sessions)
 *   stats: streak, totals, best/avg
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { readEngine } from '@/lib/server/engine-store';
import { loadLeanIndex } from '@/lib/engine/server.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function decayFactor(lastAt: number, now = Date.now()) {
  if (!lastAt) return 1;
  return Math.pow(0.5, (now - lastAt) / 86400000 / 30);
}

interface LeanQuestion {
  id: string; domain: string; module?: string; topic?: string;
  importance?: string; concepts?: string[]; question?: string;
}
interface LeanIndex {
  questions: LeanQuestion[];
  domains?: string[];
}

export async function GET(req: NextRequest) {
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: 'auth_required' }, { status: 401 });

  const data = readEngine(uid);
  const lean = loadLeanIndex() as LeanIndex;

  // --- coverage per domain (importance-weighted) ---
  const coverage = [];
  for (const domain of lean.domains ?? []) {
    const qs = lean.questions.filter((q) => q.domain === domain);
    const conceptScore = new Map<string, number>();
    const conceptMax = new Map<string, number>();
    for (const q of qs) {
      const w = q.importance === 'high' ? 3 : q.importance === 'low' ? 1 : 2;
      for (const c of q.concepts ?? []) {
        conceptMax.set(c, (conceptMax.get(c) ?? 0) + w);
        const rec = data.mastery[c];
        if (rec) {
          const s = rec.strength * decayFactor(rec.lastAt);
          conceptScore.set(c, (conceptScore.get(c) ?? 0) + w * Math.min(1, s / 60));
        }
      }
    }
    let got = 0, max = 0;
    for (const [c, m] of conceptMax) { max += m; got += conceptScore.get(c) ?? 0; }
    const strong = [...conceptMax.keys()].filter((c) => (data.mastery[c]?.strength ?? 0) >= 60).length;
    coverage.push({
      domain,
      concepts: conceptMax.size,
      ratio: max ? +(got / max).toFixed(3) : 0,
      percent: max ? Math.round((got / max) * 100) : 0,
      strongConcepts: strong,
      totalTopics: qs.length,
    });
  }

  // --- trend (oldest → newest) ---
  const trend = [...data.sessions]
    .sort((a, b) => (a.savedAt ?? 0) - (b.savedAt ?? 0))
    .slice(-20)
    .map((s) => ({ ts: s.savedAt, score: s.overallScore, domain: s.domain, mode: s.mode, minutes: s.presetMinutes }));

  // --- distribution buckets ---
  const buckets = { weak: 0, learning: 0, strong: 0, mastered: 0 };
  const seen = new Set();
  for (const domain of lean.domains ?? []) {
    for (const q of lean.questions.filter((q) => q.domain === domain)) {
      for (const c of q.concepts ?? []) {
        if (seen.has(c)) continue;
        seen.add(c);
        const rec = data.mastery[c];
        const s = rec ? rec.strength * decayFactor(rec.lastAt) : 0;
        if (s >= 75) buckets.mastered++;
        else if (s >= 50) buckets.strong++;
        else if (s > 20) buckets.learning++;
        else if (s > 0) buckets.weak++;
      }
    }
  }

  // --- streak + stats ---
  const days = new Set((data.sessions ?? []).map((s) => new Date(s.savedAt).toDateString()));
  let streak = 0;
  const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  if (days.has(d.toDateString())) {
    while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
  }
  const scores = (data.sessions ?? []).map((s) => s.overallScore);
  const stats = {
    streak,
    totalSessions: data.sessions?.length ?? 0,
    avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    bestScore: scores.length ? Math.max(...scores) : 0,
    minutesPracticed: (data.sessions ?? []).reduce((a, s) => a + (s.presetMinutes ?? 0), 0),
    conceptsTouched: Object.keys(data.mastery ?? {}).length,
  };

  // --- prep strategy: weakest domains → recommended sessions ---
  const ranked = [...coverage].sort((a, b) => a.percent - b.percent).filter((c) => c.concepts > 0);
  const strategy = {
    focusDomains: ranked.slice(0, 3).map((c) => ({ domain: c.domain, percent: c.percent, concepts: c.concepts })),
    recommendation: ranked.length
      ? `Your weakest area is ${ranked[0].domain.replace(/-/g, ' ')} (${ranked[0].percent}% covered). A 15-minute targeted mock today moves it fastest.`
      : 'Run your first mock or resume analysis — the strategy builds itself from your data.',
    nextActions: ranked.slice(0, 3).map((c) => ({
      domain: c.domain,
      percent: c.percent,
      action: c.percent < 25 ? 'Study the fundamentals, then drill' : c.percent < 60 ? 'Targeted weakness drill' : 'Maintain with a broad mock',
    })),
  };

  return NextResponse.json({
    coverage,
    trend,
    distribution: { ...buckets, untouched: Math.max(0, seen.size - buckets.weak - buckets.learning - buckets.strong - buckets.mastered) },
    sessions: (data.sessions ?? []).slice(0, 10),
    stats,
    strategy,
    resume: data.resume ? { savedAt: data.resume.savedAt, skills: data.resume.skills?.length ?? 0 } : null,
    methodology: 'Coverage = importance-weighted concept evidence (spoken > studied > claimed), decaying over 30 days.',
  });
}
