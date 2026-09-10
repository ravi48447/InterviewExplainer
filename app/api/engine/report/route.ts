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
import { getQuestion } from '@/lib/engine/server.mjs';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { saveSession, recordEvidence } from '@/lib/server/engine-store';
import { completeMockSession } from '@/lib/server/mock-session-gate';
import { interviewPrompt } from '@/lib/engine/studioConfig';

export const dynamic = 'force-dynamic';

function conceptIdsForLabels(rubric: any, labels: unknown): string[] {
  if (!Array.isArray(labels)) return [];
  const conceptLabels = Array.isArray(rubric?.conceptLabels) ? rubric.conceptLabels : [];
  const conceptIds = Array.isArray(rubric?.concepts) ? rubric.concepts : [];

  return labels.map((label) => {
    const value = String(label);
    const index = conceptLabels.findIndex(
      (candidate: unknown) => String(candidate).toLowerCase() === value.toLowerCase(),
    );
    return index >= 0 && conceptIds[index] ? String(conceptIds[index]) : value;
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const turns = Array.isArray(body?.turns) ? body.turns : [];
    if (!turns.length) return NextResponse.json({ error: 'no_turns' }, { status: 400 });

    const perQuestion = [];
    const conceptAgg = new Map();

    for (const t of turns) {
      const rubric = getQuestion(t.questionId);
      if (!rubric) continue;
      const transcript = String(t.transcript ?? '');
      const isBehavioral = !!t.isBehavioral || body?.clientState?.mode === 'behavioral' || !!rubric?.isBehavioral;
      const ave = verifyTurn(transcript, rubric, { isBehavioral, meta: t.meta });
      const hasConceptChecklist = Array.isArray(rubric?.conceptLabels) && rubric.conceptLabels.length > 0;
      const visibleHits = hasConceptChecklist ? (ave.coverage.hit ?? []) : [];
      const visibleMisses = hasConceptChecklist ? (ave.coverage.missed ?? []) : [];
      const hitIds = conceptIdsForLabels(rubric, visibleHits);
      const missedIds = conceptIdsForLabels(rubric, visibleMisses);
      for (const [index, label] of visibleHits.entries()) {
        const id = hitIds[index] ?? String(label);
        conceptAgg.set(id, { hit: (conceptAgg.get(id)?.hit ?? 0) + 1, label: String(label) });
      }
      for (const [index, label] of visibleMisses.entries()) {
        const id = missedIds[index] ?? String(label);
        if (!conceptAgg.has(id)) conceptAgg.set(id, { hit: 0, label: String(label) });
      }
      perQuestion.push({
        questionId: t.questionId,
        question: interviewPrompt(rubric.question),
        title: rubric.title,
        transcript,
        isBehavioral,
        move: t.move ?? null,
        score: ave.score,
        coverage: {
          ...ave.coverage,
          hit: visibleHits,
          missed: visibleMisses,
          hitIds,
          missedIds,
          basis: hasConceptChecklist ? 'concept-checklist' : 'expert-answer-alignment',
        },
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
        const coveredConceptIds = new Set<string>();
        for (const p of perQuestion) {
          for (const id of p.coverage?.hitIds ?? []) coveredConceptIds.add(String(id));
        }
        if (coveredConceptIds.size) recordEvidence(uid, [...coveredConceptIds], 'spoken');
      } catch {}
    }

    completeMockSession(String(body?.sessionId ?? ''));

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
