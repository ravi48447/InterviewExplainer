/**
 * POST /api/engine/turn — process one answer, return AVE verdict + next move.
 * Body: { sessionId, questionId, transcript, clientState, meta?{wpm,fillerRatio,typed} }
 *
 * The Director is reconstructed deterministically from clientState (seed + history),
 * so the server stays stateless. Client-authoritative state is acceptable for a
 * practice product (not proctored exams) and keeps the engine serverless-friendly.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyTurn } from '@/lib/engine/ave.mjs';
import { reconstructDirector, loadRubrics } from '@/lib/engine/server.mjs';
import { starAnalysis, verifyCode, gentleBand } from '@/lib/engine/sessionConfig.mjs';
import { gateDecision, PLANS } from '@/lib/engine/gating.mjs';
import { pickDiscussionPoints, evaluateExplanation } from '@/lib/engine/codeDiscuss.mjs';
import { getPersona } from '@/lib/engine/personas.mjs';
import { getUserIdFromRequest } from '@/lib/server/crypto';
import { getUserById } from '@/lib/server/user-store';
import { SessionBeats } from '@/lib/engine/conversation.mjs';
import { recordCompletedMockTurn } from '@/lib/server/mock-session-gate';
import { interviewPrompt } from '@/lib/engine/studioConfig';

export const dynamic = 'force-dynamic';

function loadLeanIndexForBeats() {
  // warmup pool: rubrics as questions (easy+high-importance filter lives in SessionBeats)
  return { questions: Object.values(loadRubrics()) };
}

// Reconstructed questions carry private rubric data, so keep this response
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
    const { sessionId, questionId, transcript } = body ?? {};
    if (!sessionId || !questionId || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }

    const result = await reconstructDirector(sessionId, body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    const { director, rubric } = result;

    // Conversation layer: SessionBeats wraps the Director (opener/warmup/reactions/time/closer)
    const personaId = typeof body?.clientState?.persona === 'string' ? body.clientState.persona : 'skeptic';
    const beats = new SessionBeats({
      persona: getPersona(personaId),
      minutes: Number(body?.clientState?.minutes) || 30,
      seed: Number(body?.clientState?.sessionSeed) || 42,
      director,
      index: loadLeanIndexForBeats(),
    });
    // replay asked-set so beats/director stay in sync across the stateless boundary
    for (const id of body?.clientState?.askedIds ?? []) director.state.asked.add(id);

    // ---- freemium gate: free sessions get N turns, then a clean upsell boundary ----
    const user = getUserById(getUserIdFromRequest(req));
    const plan = user?.plan === 'pro' ? 'interview_pass' : 'free';
    const isBehavioral = !!body?.isBehavioral || !!rubric?.isBehavioral;
    const ave = verifyTurn(transcript, rubric, {
      isBehavioral,
      meta: body?.meta,
    });
    const star = isBehavioral ? starAnalysis(transcript) : null;
    const band = gentleBand(ave.score);
    const gateState = recordCompletedMockTurn(sessionId);
    if (!gateState) {
      return NextResponse.json(
        { error: 'session_expired', message: 'This interview session expired. Return to the studio and start it again.' },
        { status: 409 },
      );
    }
    const turnsCompleted = gateState.turnsCompleted;
    const gate = gateDecision({ plan, turnsCompleted });

    // Score the boundary answer first, then stop before asking another one.
    // A free learner therefore receives receipts for all four completed answers.
    if (gate.gated) {
      return NextResponse.json({
        gated: true,
        gateAt: gate.at,
        upsell: {
          plans: [PLANS.interview_pass, PLANS.interview_pro],
          message: gate.at === 'turn_cap'
            ? 'You completed the free adaptive preview. Unlock the full interview for every persona, duration, and pressure tier.'
            : 'You have used your free sessions this month. Unlock unlimited mocks with Interview Pass.',
        },
        ave: {
          score: ave.score,
          band,
          coverage: ave.coverage,
          depth: ave.depth,
          structure: ave.structure,
          signal: ave.signal,
          mistakeFlags: ave.mistakeFlags,
          star,
        },
        next: { move: 'gate', rendered: "That's a good place to pause. This concludes the free session.", question: null },
        learnUrl: rubric?.learnUrl ?? null,
      });
    }

    const elapsedRatio = Number(body?.clientState?.elapsedRatio) || 0.3;
    const beatsResult = beats.processAnswer({ question: rubric, ave, transcript }, elapsedRatio);
    const next = beatsResult.next ?? director.turn({ question: rubric, ave }, { transcript });

    // persona flavor: acknowledgment + interjection based on persona params
    // (personaId was already resolved above with the 'skeptic' default — reuse it;
    //  re-declaring it here was a same-scope collision that crashed the route.)
    {
      const persona = getPersona(personaId);
      const strong = ave.score >= 70;
      const ack = persona.acknowledgments[(turnsCompleted + (strong ? 0 : 1)) % persona.acknowledgments.length];
      const push = !strong && Math.random() < persona.pushback;
      const interject = push ? ' ' + persona.interjections[turnsCompleted % persona.interjections.length] : '';
      next.rendered = `${ack}${interject ? interject + ' ' : ''}${next.rendered}`;
    }

    const publicQ = publicQuestion(next.question);

    // coding discussion points: ask about THEIR code's logic (not every line)
    let codeDiscussion = null;
    if (body?.lastCode && rubric?.codeExample) {
      const points = pickDiscussionPoints(body.lastCode, rubric, 3);
      if (points.length) {
        codeDiscussion = { points, evaluate: 'explain' };
      }
    }

    return NextResponse.json({
      sessionId,
      codeDiscussion,
      ave: {
        score: ave.score,
        band,
        coverage: ave.coverage,
        depth: ave.depth,
        structure: ave.structure,
        signal: ave.signal,
        mistakeFlags: ave.mistakeFlags,
        star,
      },
      next: {
        move: beatsResult.move ?? next.move,
        reaction: beatsResult.reaction ?? null,
        reason: director.state.moveLog?.[director.state.moveLog.length - 1]?.reason ?? null,
        rendered: publicRendered(next.rendered, next.question),
        question: publicQ,
      },
      // study link straight into our Q&A library for the answered question
      learnUrl: rubric?.learnUrl ?? null,
    });
  } catch (e) {
    return NextResponse.json({ error: 'turn_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
