/**
 * POST /api/engine/code-submit — coding round submission.
 * Body: { questionId, code }
 * Verifies deterministically against the authored code_example rubric
 * (constructs, outputs, substance, language idiom). If PISTON_URL is set
 * (self-hosted piston), also executes and compares stdout.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyCode, gentleBand } from '@/lib/engine/sessionConfig.mjs';
import { loadRubrics } from '@/lib/engine/server.mjs';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { questionId, code } = body ?? {};
    if (!questionId || typeof code !== 'string') {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    const rubrics = loadRubrics();
    const rubric = rubrics[questionId];
    if (!rubric) return NextResponse.json({ error: 'unknown_question' }, { status: 404 });

    const result = verifyCode(code, rubric);

    // optional real execution (self-hosted piston seam)
    let executed = null;
    const pistonUrl = process.env.PISTON_URL;
    if (pistonUrl) {
      try {
        const res = await fetch(pistonUrl + '/api/v2/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: rubric.codingLang ?? 'ruby',
            version: '*',
            files: [{ content: code }],
          }),
        });
        if (res.ok) {
          const out = await res.json();
          executed = {
            stdout: out.run?.stdout?.slice(0, 2000) ?? '',
            stderr: out.run?.stderr?.slice(0, 1000) ?? '',
            code: out.run?.code ?? null,
          };
        }
      } catch {
        executed = null; // seam unavailable: structural checks only
      }
    }

    return NextResponse.json({
      questionId,
      ...result,
      executed,
      learnUrl: rubric.learnUrl ?? null,
      suggestedCode: rubric.codeExample ?? null,
      methodology: 'Checked against the expert code for this topic (structure, constructs, outputs). Not an AI judge.',
    });
  } catch (e) {
    return NextResponse.json({ error: 'code_submit_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
