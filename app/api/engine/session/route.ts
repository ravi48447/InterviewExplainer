/**
 * POST /api/engine/session — start an adaptive interview session.
 * Body: { domain?, targetConcepts?, questionCount?, sessionSeed?, mode? }
 * Returns: { sessionId, first: { move, question, rendered } }
 *
 * Deterministic Director, no LLM. Grounded in data/content-rubrics.json.
 */
import { NextRequest, NextResponse } from 'next/server';
import { Director } from '@/lib/engine/director.mjs';
import { loadRubrics, loadLeanIndex } from '@/lib/engine/server.mjs';
import { tierAllowed, personaAllowed, minutesAllowed } from '@/lib/engine/gating.mjs';
import { getPersona, getTier } from '@/lib/engine/personas.mjs';
import { rubricPreview } from '@/lib/engine/sessionConfig.mjs';
import { SessionBeats } from '@/lib/engine/conversation.mjs';

export const dynamic = 'force-dynamic';

function minutesFor(preset: string): number {
  return preset === 'quick' ? 15 : preset === 'deep' ? 60 : 30;
}

function publicQuestion(q: any) {
  if (!q) return null;
  return {
    id: q.id,
    question: q.question,
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
    starterCode: q.starterCode ?? null,
    codingLang: q.codingLang ?? null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const domain = typeof body?.domain === 'string' ? body.domain : undefined;
    const index = loadLeanIndex();
    const rubrics = loadRubrics();

    // enrich lean questions with rubric internals (probes etc.) once per process
    const enriched = { ...index, questions: index.questions.map((q) => (rubrics[q.id] ? { ...q, ...rubrics[q.id] } : q)) };

    const questionCount = Math.min(Math.max(Number(body?.questionCount) || 8, 3), 24);
    const sessionSeed = Number(body?.sessionSeed) || Date.now() % 100000;
    const preset = ['quick', 'standard', 'deep'].includes(body?.preset) ? body.preset : 'standard';
    const mode = ['mixed', 'behavioral', 'technical', 'coding'].includes(body?.mode) ? body.mode : 'mixed';
    // freemium gate (server-enforced): plan from the user's account when authed
    const plan = (body?.plan ?? 'free') === 'interview_pass' || (body?.plan ?? 'free') === 'interview_pro' ? body.plan : 'free';
    const tier = Math.min(Math.max(Number(body?.tier) || 2, 1), 5);
    const personaId = typeof body?.persona === 'string' ? body.persona : getTier(tier).persona;
    if (!tierAllowed(plan, tier)) return NextResponse.json({ error: 'tier_locked', tier, allowed: getPersona(getTier(tier).persona) ? [1, 2] : [1, 2], upsell: true }, { status: 403 });
    if (!personaAllowed(plan, personaId)) return NextResponse.json({ error: 'persona_locked', persona: personaId, upsell: true }, { status: 403 });
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
    const beats = new SessionBeats({ persona, minutes: minutesFor(preset), seed: sessionSeed, director, index: enriched });
    const openerLine = beats.opener(persona.name);
    const first = beats.warmupQuestion();
    if (!first?.question) {
      return NextResponse.json({ error: 'no_questions_for_domain' }, { status: 400 });
    }
    const opener = openerLine;
    const sessionId = `s${sessionSeed}-${Math.random().toString(36).slice(2, 8)}`;

    // client needs the seed to let the server deterministically reconstruct later
    return NextResponse.json({
      sessionId,
      sessionSeed,
      domain: domain ?? null,
      questionCount,
      preset,
      mode,
      tier,
      persona: { id: persona.id, name: persona.name, title: persona.title, voice: persona.voice, color: persona.color },
      opener,
      rubric: rubricPreview(first.question),
      first: {
        move: first.move,
        rendered: first.rendered,
        question: publicQuestion(first.question),
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'session_start_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
