/**
 * server.mjs — server-side loaders for the interview engine.
 * Reads prebuilt artifacts from data/: rubrics + lean index.
 * Deterministic Director reconstruction from client-reported session state.
 */

import fs from 'node:fs';
import path from 'node:path';
import { Director } from './director.mjs';
import { getPersona } from './personas.mjs';

const ROOT = process.cwd();
let _rubrics = null;
let _leanIndex = null;
let _dsaRubrics = null;

export function loadRubrics() {
  if (!_rubrics) {
    _rubrics = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'content-rubrics.json'), 'utf8'));
  }
  return _rubrics;
}

export function loadLeanIndex() {
  if (!_leanIndex) {
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'content-index-lean.json'), 'utf8'));
    // Director needs question objects with probes for probe moves; hybrid: lean questions
    // for queue-building, rubric looked up by id when a turn needs internals.
    _leanIndex = j;
  }
  return _leanIndex;
}

/**
 * The lean index lacks probes/tradeoffs (rubric internals). The Director's
 * probe/poke/tradeoff moves need them, so we merge: lean question + rubric fields
 * for the questions the session will actually touch. To keep memory sane we merge
 * lazily per question id on demand.
 */
const _merged = new Map();
export function getQuestion(id) {
  if (_merged.has(id)) return _merged.get(id);
  const rubrics = loadRubrics();
  let r = rubrics[id];
  if (!r && String(id).startsWith('dsa/')) {
    if (!_dsaRubrics) {
      try {
        const full = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'content-index.json'), 'utf8'));
        _dsaRubrics = Object.fromEntries(
          (full.questions ?? []).filter((question) => question.isDsaProblem).map((question) => [question.id, question]),
        );
      } catch {
        _dsaRubrics = {};
      }
    }
    r = _dsaRubrics[id];
    if (r) r = { ...r, learnUrl: `/dsa/problem/${r.topic ?? String(id).split('/').pop()}` };
  }
  if (!r) return null;
  _merged.set(id, r);
  return r;
}

/**
 * Reconstruct a Director from client-reported session state, deterministically.
 * clientState: { sessionSeed, domain, questionCount, targetConcepts, askedIds[],
 *                usedProbeIds[], dodged[], moveLog[], transcriptHistory }
 *
 * Trust model: the client drives state, server recomputes moves + scores.
 * This is a practice product (not proctored exams) — client-authoritative state
 * is acceptable and keeps the engine serverless-friendly.
 */
export async function reconstructDirector(sessionId, body) {
  const lean = loadLeanIndex();
  const cs = body?.clientState ?? body ?? {};
  const seed = Number(cs.sessionSeed);
  if (!Number.isFinite(seed)) return { ok: false, error: 'missing_session_seed' };

  // rebuild the index the Director sees: lean + on-demand rubric enrichment
  const domain = typeof cs.domain === 'string' ? cs.domain : undefined;
  const interviewMode = ['mixed', 'behavioral', 'technical', 'coding'].includes(cs.mode)
    ? cs.mode
    : 'mixed';
  const candidates = lean.questions.filter((question) => {
    if (interviewMode === 'coding') return question.domain === 'dsa';
    if (interviewMode === 'behavioral') return question.domain !== 'dsa';
    if (interviewMode === 'mixed') return true;
    return !domain || question.domain === domain;
  });
  const enriched = { ...lean, questions: candidates };
  // Director reads question.probes/tradeoffs/mistakes at turn time via the rubric object
  // passed in; but buildSessionQueue needs only id/importance/concepts/domain. To make
  // probe moves work we patch lean questions with rubric fields for all in askedIds.
  const patch = (q) => {
    const r = getQuestion(q.id);
    return r ? { ...q, ...r } : q;
  };
  // Only rubric-backed questions may enter a scored interview. The learning
  // index also contains navigation/shell prompts that are useful on topic
  // pages but cannot produce an AVE receipt.
  enriched.questions = enriched.questions.filter((q) => !!getQuestion(q.id)).map(patch);

  const preset = ['quick', 'standard', 'deep'].includes(cs.preset)
    ? cs.preset
    : 'standard';
  const tier = Math.min(Math.max(Number(cs.tier) || 2, 1), 5);
  const persona = getPersona(typeof cs.persona === 'string' ? cs.persona : undefined);

  const director = new Director({
    index: enriched,
    domain,
    questionCount: Number(cs.questionCount) || 8,
    sessionSeed: seed,
    targetConcepts: Array.isArray(cs.targetConcepts) ? cs.targetConcepts : undefined,
    interviewMode,
    preset,
    persona,
    tier,
  });

  // replay the client-reported history to restore streaks/dodged/usedProbes
  const history = Array.isArray(cs.moveLog) ? cs.moveLog : [];
  for (const h of history) {
    if (h?.move) director.state.moveLog ??= [];
  }
  // restore asked set + used probes + dodged from explicit fields
  for (const id of cs.askedIds ?? []) director.state.asked.add(id);
  for (const pid of cs.usedProbeIds ?? []) director.usedProbeIds.add(pid);
  for (const d of cs.dodged ?? []) {
    director.state.dodged.push({
      concepts: d.concepts ?? [],
      questionId: d.questionId ?? null,
      addedAt: Number(d.addedAt) || 0,
    });
  }
  // restore streak approximations from last signals
  const signals = Array.isArray(cs.recentSignals) ? cs.recentSignals : [];
  let strong = 0;
  let weak = 0;
  for (const s of signals) {
    if (s === 'stronger_than_expected') { strong++; weak = 0; }
    else if (s === 'shaky' || s === 'lost') { weak++; strong = 0; }
    else { strong = 0; weak = 0; }
  }
  director.state.streak = { strong, weak };
  director.state.turn = history.length;
  director.state.askedList = (cs.askedIds ?? []).map((id) => getQuestion(id)).filter(Boolean);

  // shift the queue past already-asked ids so 'next' doesn't repeat
  director.queue = director.queue.filter((q) => !director.state.asked.has(q.id));

  const questionId = body?.questionId;
  const rubric = getQuestion(questionId);
  if (!rubric) return { ok: false, error: 'unknown_question' };

  return { ok: true, director, rubric };
}
