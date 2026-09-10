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
import { SessionBeats } from '@/lib/engine/conversation.mjs';

export const dynamic = 'force-dynamic';

function loadLeanIndexForBeats() {
  // warmup pool: rubrics as questions (easy+high-importance filter lives in SessionBeats)
  return { questions: Object.values(loadRubrics()) };
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
    const turnsCompleted = Array.isArray(body?.clientState?.askedIds) ? body.clientState.askedIds.length : 1;
    const gate = gateDecision({ plan: body?.clientState?.plan ?? 'free', turnsCompleted });
    if (gate.gated) {
      return NextResponse.json({
        gated: true,
        gateAt: gate.at,
        upsell: {
          plans: [PLANS.interview_pass, PLANS.interview_pro],
          message: gate.at === 'turn_cap'
            ? 'You have tasted the adaptive interview. Unlock the full experience — every persona, full durations, the panel gauntlet.'
            : 'You have used your free sessions this month. Unlock unlimited mocks with Interview Pass.',
        },
        ave: { score: 0, band: null, coverage: { hit: [], missed: [], ratio: 0 }, signal: 'gated' },
        next: { move: 'gate', rendered: "That's a good place to pause. This concludes the free session.", question: null },
      });
    }

    const isBehavioral = !!body?.isBehavioral || !!rubric?.isBehavioral;
    const ave = verifyTurn(transcript, rubric, {
      isBehavioral,
      meta: body?.meta,
    });

    const elapsedRatio = Number(body?.clientState?.elapsedRatio) || 0.3;
    const beatsResult = beats.processAnswer({ question: rubric, ave, transcript }, elapsedRatio);
    const next = beatsResult.next ?? director.turn({ question: rubric, ave }, { transcript });

    // persona flavor: acknowledgment + interjection based on persona params
    const personaId = typeof body?.clientState?.persona === 'string' ? body.clientState.persona : null;
    if (personaId) {
      const persona = getPersona(personaId);
      const strong = ave.score >= 70;
      const ack = persona.acknowledgments[(turnsCompleted + (strong ? 0 : 1)) % persona.acknowledgments.length];
      const push = !strong && Math.random() < persona.pushback;
      const interject = push ? ' ' + persona.interjections[turnsCompleted % persona.interjections.length] : '';
      next.rendered = `${ack}${interject ? interject + ' ' : ''}${next.rendered}`;
    }

    const publicQ = next.question
      ? {
          id: next.question.id,
          question: next.question.question,
          title: next.question.title,
          difficulty: next.question.difficulty,
          learnUrl: next.question.learnUrl ?? null,
          isProbe: !!next.question.isProbe,
          isStretch: !!next.question.isStretch,
          isPoke: !!next.question.isPoke,
          isTradeoff: !!next.question.isTradeoff,
          isCircleBack: !!next.question.isCircleBack,
          isBehavioral: !!next.question.isBehavioral,
          isCoding: !!next.question.isCoding,
          starterCode: next.question.starterCode ?? null,
          codingLang: next.question.codingLang ?? null,
        }
      : null;

    // STAR analysis for behavioral answers
    const star = isBehavioral ? starAnalysis(transcript) : null;
    // gentle display band (engine score untouched for mastery)
    const band = gentleBand(ave.score);

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
        rendered: next.rendered,
        question: publicQ,
      },
      // study link straight into our Q&A library for the answered question
      learnUrl: rubric?.learnUrl ?? null,
    });
  } catch (e) {
    return NextResponse.json({ error: 'turn_failed', message: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
