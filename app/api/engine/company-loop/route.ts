/**
 * /api/engine/company-loop — company loop catalog + concrete loops.
 *   GET ?archetype=&level=&search=   -> browse companies (open)
 *   GET ?company=google&level=intermediate -> the concrete round sequence
 *   POST { company, level, dryRun: { code, questionId } } -> dry-run challenges
 *   POST { dryRunAnswer, challenge, questionId } -> evaluate + debate counter
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  browseCompanies, getCompanyLoop, ARCHETYPE_LIST,
} from '@/lib/engine/companies.mjs';
import {
  pickDryRunChallenges, evaluateDryRunAnswer, debateCounter,
} from '@/lib/engine/dryRun.mjs';
import { loadRubrics } from '@/lib/engine/server.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const company = url.searchParams.get('company');
  if (company) {
    const loop = getCompanyLoop(company, url.searchParams.get('level') ?? 'fresher');
    if (!loop) return NextResponse.json({ error: 'unknown_company' }, { status: 404 });
    return NextResponse.json(loop);
  }
  const archetype = url.searchParams.get('archetype') ?? undefined;
  const level = url.searchParams.get('level') ?? undefined;
  const search = url.searchParams.get('search') ?? undefined;
  return NextResponse.json({
    companies: browseCompanies({ archetype, level, search }),
    archetypes: ARCHETYPE_LIST,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // dry-run challenge generation for a submitted solution
    if (body?.dryRun?.code) {
      const rubrics = loadRubrics();
      const rubric = rubrics[String(body.dryRun.questionId ?? '')];
      if (!rubric) return NextResponse.json({ error: 'unknown_question' }, { status: 404 });
      const challenges = pickDryRunChallenges(body.dryRun.code, rubric, 3);
      return NextResponse.json({ challenges });
    }

    // dry-run answer evaluation + debate
    if (body?.dryRunAnswer) {
      const result = evaluateDryRunAnswer(body.dryRunAnswer, body.challenge ?? {});
      const debate = debateCounter(body.dryRunAnswer, body.challenge ?? {}, result);
      return NextResponse.json({ ...result, debate });
    }

    return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'company_loop_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
