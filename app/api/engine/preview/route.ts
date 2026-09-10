/**
 * GET /api/engine/preview
 *
 * Builds the same deterministic opening question as the real session route,
 * without creating or persisting a session. The studio uses this to show a
 * truthful room preview and then forwards the seed into the live room so the
 * question the learner saw is the question they receive.
 */
import { NextRequest, NextResponse } from 'next/server';
import { Director } from '@/lib/engine/director.mjs';
import { getQuestion, loadLeanIndex } from '@/lib/engine/server.mjs';
import { getPersona } from '@/lib/engine/personas.mjs';
import { rubricPreview } from '@/lib/engine/sessionConfig.mjs';
import { SessionBeats } from '@/lib/engine/conversation.mjs';
import { interviewPrompt } from '@/lib/engine/studioConfig';

export const dynamic = 'force-dynamic';

const PRESET_MINUTES: Record<string, number> = {
  quick: 15,
  standard: 30,
  deep: 60,
};

function clampInteger(value: string | null, fallback: number, min: number, max: number) {
  if (value === null || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(Math.max(Math.round(parsed), min), max) : fallback;
}

function publicPreviewQuestion(question: any) {
  return {
    id: question.id,
    question: interviewPrompt(question.question),
    title: question.title,
    difficulty: question.difficulty,
    module: question.module ?? null,
    topic: question.topic ?? null,
    learnUrl: question.learnUrl ?? null,
    concepts: question.concepts ?? [],
    conceptLabels: question.conceptLabels ?? [],
    isBehavioral: !!question.isBehavioral,
    isCoding: !!question.isCoding,
  };
}

function publicRendered(rendered: unknown, question: any): string {
  const raw = String(question?.question ?? '');
  return raw ? String(rendered ?? '').replace(raw, interviewPrompt(raw)) : String(rendered ?? '');
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const domain = params.get('domain') || 'java-backend-fresher';
    const preset = PRESET_MINUTES[params.get('preset') || ''] ? params.get('preset')! : 'standard';
    const modeParam = params.get('mode');
    const mode = ['mixed', 'technical', 'behavioral', 'coding'].includes(modeParam || '')
      ? modeParam!
      : 'technical';
    const personaId = params.get('persona') || 'skeptic';
    const persona = getPersona(personaId);
    const tier = clampInteger(params.get('tier'), 2, 1, 5);
    const questionCount = clampInteger(params.get('count'), preset === 'quick' ? 5 : preset === 'deep' ? 20 : 10, 3, 24);
    const sessionSeed = clampInteger(params.get('seed'), 41721, 1, 999999);
    const minutes = clampInteger(params.get('minutes'), PRESET_MINUTES[preset], 5, 90);
    const targetConcepts = (params.get('concepts') || '')
      .split(',')
      .map((concept) => concept.trim())
      .filter(Boolean)
      .slice(0, 8);

    const index = loadLeanIndex();
    const enriched = {
      ...index,
      questions: index.questions
        .filter((question: any) => {
          if (mode === 'coding') return question.domain === 'dsa';
          if (mode === 'behavioral') return question.domain !== 'dsa';
          if (mode === 'mixed') return true;
          return question.domain === domain;
        })
        .map((question: any) => ({ question, rubric: getQuestion(question.id) }))
        .filter(({ rubric }: any) => !!rubric)
        .map(({ question, rubric }: any) => ({ ...question, ...rubric })),
    };

    const director = new Director({
      index: enriched,
      domain,
      questionCount,
      sessionSeed,
      interviewMode: mode,
      targetConcepts: targetConcepts.length ? targetConcepts : undefined,
      preset,
      persona,
      tier,
    });
    const beats = new SessionBeats({
      persona,
      minutes,
      seed: sessionSeed,
      director,
      index: enriched,
    });
    const first = beats.warmupQuestion();

    if (!first?.question) {
      return NextResponse.json({ error: 'no_questions_for_domain' }, { status: 404 });
    }

    return NextResponse.json(
      {
        domain,
        preset,
        mode,
        tier,
        persona: {
          id: persona.id,
          name: persona.name,
          title: persona.title,
          style: persona.style,
        },
        sessionSeed,
        rendered: publicRendered(first.rendered, first.question),
        question: publicPreviewQuestion(first.question),
        rubric: rubricPreview(first.question),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'preview_failed',
        message: String((error as Error)?.message ?? error),
      },
      { status: 500 },
    );
  }
}
