/**
 * POST /api/engine/report — post-session report.
 * Body: { sessionId, clientState, turns: [{ questionId, transcript, move }] }
 *
 * Recomputes AVE per turn server-side (trust but verify), merges into the
 * session rollup with suggested answers + drills. The suggested improved
 * answer comes from the authored content (speakable_answer + key checklist),
 * NOT a model.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyTurn } from '@/lib/engine/ave.mjs';
import { loadRubrics } from '@/lib/engine/server.mjs';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { saveSession, recordEvidence } from '@/lib/server/engine-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const turns = Array.isArray(body?.turns) ? body.turns : [];
    if (!turns.length) return NextResponse.json({ error: 'no_turns' }, { status: 400 });

    const rubrics = loadRubrics();
    const perQuestion = [];
    const conceptAgg = new Map();

    for (const t of turns) {
      const rubric = rubrics[t.questionId];
      if (!rubric) continue;
      const ave = verifyTurn(String(t.transcript ?? ''), rubric, { isBehavioral: false });
      for (const h of ave.coverage.hit ?? []) {
        const k = h;
        conceptAgg.set(k, { hit: (conceptAgg.get(k)?.hit ?? 0) + 1, label: h });
      }
      for (const m of ave.coverage.missed ?? []) {
        if (!conceptAgg.has(m)) conceptAgg.set(m, { hit: 0, label: m });
      }
      perQuestion.push({
        questionId: t.questionId,
        question: rubric.question,
        title: rubric.title,
        move: t.move ?? null,
        score: ave.score,
        coverage: ave.coverage,
        mistakeFlags: ave.mistakeFlags,
        suggested: {
          spoken: ave.suggested.spoken,
          checklist: ave.suggested.checklist,
        },
        nextDrills: ave.nextDrills,
      });
    }

    const scores = perQuestion.map((p) => p.score);
    const overall = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const strongConcepts = [...conceptAgg.entries()].filter(([, v]) => v.hit > 0).map(([k, v]) => ({ id: k, label: v.label, hits: v.hit }));
    const weakConcepts = [...conceptAgg.entries()].filter(([, v]) => v.hit === 0).map(([k, v]) => ({ id: k, label: v.label }));

    // per-user persistence when logged in (guests: client-side only)
    const uid = getUserIdFromRequest(req);
    if (uid) {
      try {
        saveSession(uid, {
          sessionId: String(body?.sessionId ?? `anon-${Date.now()}`),
          domain: typeof body?.clientState?.domain === 'string' ? body.clientState.domain : null,
          mode: String(body?.clientState?.mode ?? 'technical'),
          preset: String(body?.clientState?.preset ?? 'standard'),
          presetMinutes: Number(body?.clientState?.presetMinutes) || 30,
          overallScore: overall,
          turnsCount: perQuestion.length,
          weakConcepts: weakConcepts.map((c) => c.label).slice(0, 10),
          savedAt: Date.now(),
        });
        // spoken evidence for covered concepts
        const hitIds = new Set<string>();
        for (const p of perQuestion) for (const h of p.coverage?.hit ?? []) hitIds.add(String(h));
        if (hitIds.size) recordEvidence(uid, [...hitIds], 'spoken');
      } catch {}
    }

    return NextResponse.json({
      sessionId: body?.sessionId ?? null,
      overallScore: overall,
      turnsCount: perQuestion.length,
      perQuestion,
      strongConcepts,
      weakConcepts,
      moveLog: Array.isArray(body?.clientState?.moveLog) ? body.clientState.moveLog : [],
      // framing: honest about what this measures
      methodology: 'Scored against the expert answer authored for this topic (concept coverage, depth, structure). Not an AI judge.',
    });
  } catch (e) {
    return NextResponse.json({ error: 'report_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
