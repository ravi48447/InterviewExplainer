/**
 * server.mjs — server-side loaders for the interview engine.
 * Reads prebuilt artifacts from data/: rubrics + lean index.
 * Deterministic Director reconstruction from client-reported session state.
 */

import fs from 'node:fs';
import path from 'node:path';
import { Director } from './director.mjs';

const ROOT = process.cwd();
let _rubrics = null;
let _leanIndex = null;

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
  const r = rubrics[id];
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
  const rubrics = loadRubrics();
  const cs = body?.clientState ?? body ?? {};
  const seed = Number(cs.sessionSeed);
  if (!Number.isFinite(seed)) return { ok: false, error: 'missing_session_seed' };

  // rebuild the index the Director sees: lean + on-demand rubric enrichment
  const enriched = { ...lean, questions: lean.questions };
  // Director reads question.probes/tradeoffs/mistakes at turn time via the rubric object
  // passed in; but buildSessionQueue needs only id/importance/concepts/domain. To make
  // probe moves work we patch lean questions with rubric fields for all in askedIds.
  const patch = (q) => {
    const r = rubrics[q.id];
    return r ? { ...q, ...r } : q;
  };
  enriched.questions = enriched.questions.map(patch);

  const director = new Director({
    index: enriched,
    domain: typeof cs.domain === 'string' ? cs.domain : undefined,
    questionCount: Number(cs.questionCount) || 8,
    sessionSeed: seed,
    targetConcepts: Array.isArray(cs.targetConcepts) ? cs.targetConcepts : undefined,
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
  director.state.askedList = (cs.askedIds ?? []).map((id) => rubrics[id]).filter(Boolean);

  // shift the queue past already-asked ids so 'next' doesn't repeat
  director.queue = director.queue.filter((q) => !director.state.asked.has(q.id));

  const questionId = body?.questionId;
  const rubric = rubrics[questionId];
  if (!rubric) return { ok: false, error: 'unknown_question' };

  return { ok: true, director, rubric };
}
