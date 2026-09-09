/**
 * POST /api/engine/code-explain — evaluate the candidate's explanation of
 * their own code (the code-discussion round after submission).
 * Body: { questionId, pointIndex, answer, lastCode }
 */
import { NextRequest, NextResponse } from 'next/server';
import { pickDiscussionPoints, evaluateExplanation } from '@/lib/engine/codeDiscuss.mjs';
import { gentleBand } from '@/lib/engine/sessionConfig.mjs';
import { loadRubrics } from '@/lib/engine/server.mjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { questionId, pointIndex, answer, lastCode } = body ?? {};
    if (!questionId || typeof answer !== 'string') {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    const rubrics = loadRubrics();
    const rubric = rubrics[questionId];
    if (!rubric) return NextResponse.json({ error: 'unknown_question' }, { status: 404 });

    const points = pickDiscussionPoints(lastCode ?? '', rubric, 3);
    const point = points[Number(pointIndex) || 0];
    if (!point) return NextResponse.json({ error: 'no_discussion_points' }, { status: 400 });

    const ev = evaluateExplanation(answer, point, rubric);
    const nextPoint = points[(Number(pointIndex) || 0) + 1] ?? null;

    return NextResponse.json({
      ...ev,
      band: gentleBand(ev.score),
      pointKind: point.kind,
      nextPoint: nextPoint ? { kind: nextPoint.kind, question: nextPoint.question } : null,
      learnUrl: rubric.learnUrl ?? null,
    });
  } catch (e) {
    return NextResponse.json({ error: 'code_explain_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
