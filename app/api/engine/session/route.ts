/**
 * POST /api/engine/session — start an adaptive interview session.
 * Body: { domain?, targetConcepts?, questionCount?, sessionSeed?, mode? }
 * Returns: { sessionId, first: { move, question, rendered } }
 *
 * Deterministic Director, no LLM. Grounded in data/content-rubrics.json.
 */
import { NextRequest, NextResponse } from 'next/server';
import { Director } from '@/lib/engine/director.mjs';
import { getQuestion, loadLeanIndex } from '@/lib/engine/server.mjs';
import { tierAllowed, personaAllowed, minutesAllowed, modeAllowed } from '@/lib/engine/gating.mjs';
import { getPersona, getTier } from '@/lib/engine/personas.mjs';
import { rubricPreview } from '@/lib/engine/sessionConfig.mjs';
import { SessionBeats } from '@/lib/engine/conversation.mjs';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { getUserById } from '@/lib/server/user-store';
import { registerMockSession } from '@/lib/server/mock-session-gate';
import { interviewPrompt } from '@/lib/engine/studioConfig';

export const dynamic = 'force-dynamic';

function minutesFor(preset: string): number {
  return preset === 'quick' ? 15 : preset === 'deep' ? 60 : 30;
}

// Questions are enriched with private rubric data above, so keep this response
// serializer as an explicit allowlist of fields the interview room can render.
function publicStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function publicExamples(value: unknown): Array<{ input: string; output: string }> {
  if (!Array.isArray(value)) return [];
  return value.flatMap((example) => {
    if (!example || typeof example !== 'object') return [];
    const { input, output } = example as { input?: unknown; output?: unknown };
    if (typeof input !== 'string' || typeof output !== 'string') return [];
    return [{ input, output }];
  });
}

function publicConstraints(value: unknown): string | null {
  if (typeof value === 'string') return value;
  const constraints = publicStringList(value);
  return constraints.length ? constraints.join('\n') : null;
}

function publicQuestion(q: any) {
  if (!q) return null;
  return {
    id: q.id,
    question: interviewPrompt(q.question),
    title: q.title,
    difficulty: q.difficulty,
    learnUrl: q.learnUrl ?? null,
    isProbe: !!q.isProbe,
    isStretch: !!q.isStretch,
    isPoke: !!q.isPoke,
    isTradeoff: !!q.isTradeoff,
    isCircleBack: !!q.isCircleBack,
    isBehavioral: !!q.isBehavioral,
    isCoding: !!q.isCoding,
    concepts: publicStringList(q.concepts),
    conceptLabels: publicStringList(q.conceptLabels),
    examples: publicExamples(q.examples),
    constraints: publicConstraints(q.constraints),
    starterCode: typeof q.starterCode === 'string' ? q.starterCode : null,
    codingLang: typeof q.codingLang === 'string' ? q.codingLang : null,
  };
}

function publicRendered(rendered: unknown, question: any): string {
  const raw = String(question?.question ?? '');
  return raw ? String(rendered ?? '').replace(raw, interviewPrompt(raw)) : String(rendered ?? '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const domain = typeof body?.domain === 'string' ? body.domain : undefined;
    const mode = ['mixed', 'behavioral', 'technical', 'coding'].includes(body?.mode) ? body.mode : 'mixed';
    const index = loadLeanIndex();
    // Enrich only the selected domain. This keeps navigation-only shell
    // questions out while allowing DSA rubrics to load lazily from its full index.
    const enriched = {
      ...index,
      questions: index.questions
        .filter((q) => {
          if (mode === 'coding') return q.domain === 'dsa';
          if (mode === 'behavioral') return q.domain !== 'dsa';
          if (mode === 'mixed') return true;
          return !domain || q.domain === domain;
        })
        .map((q) => ({ q, rubric: getQuestion(q.id) }))
        .filter(({ rubric }) => !!rubric)
        .map(({ q, rubric }) => ({ ...q, ...rubric })),
    };

    const questionCount = Math.min(Math.max(Number(body?.questionCount) || 8, 3), 24);
    const sessionSeed = Number(body?.sessionSeed) || Date.now() % 100000;
    const preset = ['quick', 'standard', 'deep'].includes(body?.preset) ? body.preset : 'standard';
    const requestedMinutes = Number(body?.minutes);
    const minutes = Number.isFinite(requestedMinutes)
      ? Math.min(Math.max(Math.round(requestedMinutes), 5), 90)
      : minutesFor(preset);
    // Entitlements come from the authenticated account, never a client body.
    const user = getUserById(getUserIdFromRequest(req));
    const plan = user?.plan === 'pro' ? 'interview_pass' : 'free';
    const tier = Math.min(Math.max(Number(body?.tier) || 2, 1), 5);
    const personaId = typeof body?.persona === 'string' ? body.persona : getTier(tier).persona;
    if (!tierAllowed(plan, tier)) return NextResponse.json({ error: 'tier_locked', tier, allowed: getPersona(getTier(tier).persona) ? [1, 2] : [1, 2], upsell: true }, { status: 403 });
    if (!personaAllowed(plan, personaId)) return NextResponse.json({ error: 'persona_locked', persona: personaId, upsell: true }, { status: 403 });
    if (!minutesAllowed(plan, minutes)) return NextResponse.json({ error: 'duration_locked', minutes, upsell: true }, { status: 403 });
    if (!modeAllowed(plan, mode)) return NextResponse.json({ error: 'mode_locked', mode, upsell: true }, { status: 403 });
    const persona = getPersona(personaId);

    const director = new Director({
      index: enriched,
      domain,
      questionCount,
      sessionSeed,
      targetConcepts: Array.isArray(body?.targetConcepts) ? body.targetConcepts : undefined,
      mode: body?.clientMode === 'live-assist' ? 'live-assist' : 'solo',
      interviewMode: mode,
      preset,
      persona,
      tier,
    });

    // Conversation layer: the session opens like a human one
    const beats = new SessionBeats({ persona, minutes, seed: sessionSeed, director, index: enriched });
    const openerLine = beats.opener(persona.name);
    const first = beats.warmupQuestion();
    if (!first?.question) {
      return NextResponse.json({ error: 'no_questions_for_domain' }, { status: 400 });
    }
    const opener = openerLine;
    const sessionId = `s${sessionSeed}-${Math.random().toString(36).slice(2, 8)}`;
    registerMockSession(sessionId);

    // client needs the seed to let the server deterministically reconstruct later
    return NextResponse.json({
      sessionId,
      sessionSeed,
      domain: domain ?? null,
      questionCount,
      preset,
      minutes,
      mode,
      tier,
      persona: { id: persona.id, name: persona.name, title: persona.title, voice: persona.voice, color: persona.color },
      opener,
      rubric: rubricPreview(first.question),
      first: {
        move: first.move,
        rendered: publicRendered(first.rendered, first.question),
        question: publicQuestion(first.question),
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'session_start_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
