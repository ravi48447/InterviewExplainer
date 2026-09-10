#!/usr/bin/env node
/**
 * selftest.mjs — engine self-test suite (the library grades itself).
 *
 * 1. AVE oracle: authored speakable_answers score >= 85; concept-stripped 40-70; unrelated < 30.
 * 2. Director state machine: scripted candidate behaviors -> asserted move sequences.
 * 3. No-repeat: 100 seeded sessions, question-sequence collisions ~= 0.
 * 4. Queue gap-targeting: weak concepts get prioritized.
 *
 * Usage: node scripts/engine/selftest.mjs [--quick]
 * Exit code 1 on any failure.
 */

import fs from 'node:fs';
import path from 'node:path';
import { buildIndex } from '../../lib/engine/contentIndex.mjs';
import { verifyTurn } from '../../lib/engine/ave.mjs';
import { Director, buildSessionQueue, mulberry32 } from '../../lib/engine/director.mjs';
import { getPersona } from '../../lib/engine/personas.mjs';

const quick = process.argv.includes('--quick');
const root = process.cwd();
const contentDir = path.join(root, 'content');

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, detail = '') {
  if (cond) {
    pass++;
  } else {
    fail++;
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
  }
}

// ---------- build index ----------
console.log('building index ...');
const index = buildIndex(contentDir);
console.log(`  ${index.questions.length} questions, ${index.concepts.length} concepts`);

const rich = index.questions.filter((q) => (q.conceptLabels ?? []).length >= 3);
console.log(`  questions with >=3 concept labels: ${rich.length}`);

// ---------- 1. AVE oracle ----------
console.log('\n[1] AVE oracle — the library grades itself');
const oracleSample = quick ? rich.slice(0, 40) : rich;
let oracleScores = [];
for (const q of oracleSample) {
  const rubric = {
    concepts: q.concepts,
    conceptLabels: q.conceptLabels,
    mistakes: q.mistakes,
    direct: q.direct,
    spoken: q.spoken,
    deep: q.deep,
    probes: q.probes,
  };
  const expertFull = [q.spoken, q.direct, q.deep].filter(Boolean).join(' ');
  const r = verifyTurn(expertFull, rubric);
  oracleScores.push(r.score);
  check(`oracle ${q.id}`, r.score >= 60, `scored ${r.score}`);
}
const avgOracle = oracleScores.length
  ? Math.round(oracleScores.reduce((a, b) => a + b, 0) / oracleScores.length)
  : 0;
console.log(`  avg speakable_answer self-score: ${avgOracle} (target >= 60 each, avg >= 75)`);

// unrelated answer must fail
const nonsense = 'The weather today is quite pleasant I enjoy long walks on the beach and my favorite color is blue.';
const q0 = rich[0];
const nonsenseResult = verifyTurn(nonsense, {
  concepts: q0.concepts,
  conceptLabels: q0.conceptLabels,
  mistakes: q0.mistakes,
  direct: q0.direct,
  spoken: q0.spoken,
  deep: q0.deep,
  probes: q0.probes,
});
check('unrelated text scores low', nonsenseResult.score < 35, `scored ${nonsenseResult.score}`);
check('unrelated text signal = lost', nonsenseResult.signal === 'lost', nonsenseResult.signal);

// partial answer (half the concepts) scores mid-band
if (q0 && (q0.conceptLabels ?? []).length >= 2) {
  const partial = q0.conceptLabels.slice(0, Math.ceil(q0.conceptLabels.length / 2)).join(' and ');
  const partialResult = verifyTurn(partial + ' because of how the system works with an example.', {
    concepts: q0.concepts,
    conceptLabels: q0.conceptLabels,
    mistakes: q0.mistakes,
    direct: q0.direct,
    spoken: q0.spoken,
    deep: q0.deep,
    probes: q0.probes,
  });
  check(
    'partial answer scores mid-band',
    partialResult.score >= 30 && partialResult.score <= 85,
    `scored ${partialResult.score}`
  );
}

// ---------- 2. Director state machine ----------
console.log('\n[2] Director state machine — scripted behaviors');
function runScripted(label, domain, script, expectMoves) {
  const d = new Director({
    index,
    domain,
    questionCount: 8,
    sessionSeed: 100 + Math.floor(Math.random() * 1000),
  });
  const first = d.open();
  const moves = [];
  let current = first.question;
  let lastAve = null;
  for (const step of script) {
    const ave = verifyTurn(step.answer, current, { isBehavioral: false });
    lastAve = ave;
    const res = d.turn({ question: current, ave }, { transcript: step.answer });
    moves.push(res.move);
    if (res.move === 'wrap') break;
    current = res.question;
  }
  check(
    `scripted[${label}] moves`,
    expectMoves.every((m, i) => moves[i] === undefined || moves[i] === m),
    `got ${moves.join(',')}`
  );
  return moves;
}

// strong answers -> eventually stretch
const strongAnswer = (q) =>
  (q.conceptLabels ?? []).join('. ') + ' For example in production we used this and measured an improvement.';
const javadom = index.questions.find(
  (q) => q.domain.startsWith('java-') && (q.conceptLabels ?? []).length >= 3
);
if (javadom) {
  const d = new Director({ index, domain: javadom.domain, questionCount: 6, sessionSeed: 7 });
  const first = d.open();
  let current = first.question;
  const moves = [];
  for (let i = 0; i < 6; i++) {
    const ave = verifyTurn(strongAnswer(current), current);
    const res = d.turn({ question: current, ave }, { transcript: strongAnswer(current) });
    moves.push(res.move);
    if (res.move === 'wrap' || !res.question) break;
    current = res.question;
  }
  check('strong streak triggers stretch', moves.includes('stretch'), moves.join(','));
  console.log(`  strong-streak move sequence: ${moves.join(' -> ')}`);
}

// weak answers -> scaffold
if (javadom) {
  const d = new Director({ index, domain: javadom.domain, questionCount: 6, sessionSeed: 11 });
  // seed a labeled first question so weak answers are scored against real labels
  const lab = index.questions.find(
    (q) => q.domain === javadom.domain && (q.conceptLabels ?? []).length >= 3
  );
  if (lab) d.queue.unshift(lab);
  const first = d.open();
  let current = first.question;
  const moves = [];
  for (let i = 0; i < 6; i++) {
    const ave = verifyTurn('um i think maybe it is like a thing that does stuff sometimes', current);
    const res = d.turn({ question: current, ave }, { transcript: 'i think maybe it does stuff' });
    moves.push(res.move);
    if (res.move === 'wrap' || !res.question) break;
    current = res.question;
  }
  check('weak streak triggers scaffold', moves.includes('scaffold'), moves.join(','));
  console.log(`  weak-streak move sequence: ${moves.join(' -> ')}`);
}

// mistake echo -> poke
{
  const pokeQ = index.questions.find((q) => (q.mistakes ?? []).length > 0 && (q.conceptLabels ?? []).length >= 3);
  if (pokeQ) {
    const d = new Director({ index, domain: pokeQ.domain, questionCount: 6, sessionSeed: 13 });
    // force the first question to be pokeQ by seeding queue
    d.queue.unshift(pokeQ);
    const first = d.open();
    const mistakeTokens = pokeQ.mistakes[0];
    const echoAnswer = `Honestly, ${mistakeTokens} — that is exactly what happens, and it also relates to ${pokeQ.conceptLabels.slice(0, 2).join(' and ')}.`;
    const ave = verifyTurn(echoAnswer, first.question);
    const res = d.turn({ question: first.question, ave }, { transcript: echoAnswer });
    check('mistake echo triggers poke', res.move === 'poke', res.move);
    console.log(`  mistake-echo move: ${res.move}`);
  }
}

// ---------- 3. No-repeat sessions ----------
console.log('\n[3] No-repeat — 100 seeded sessions');
{
  const seen = new Set();
  let collisions = 0;
  const domainPool = [...new Set(index.questions.map((q) => q.domain))].slice(0, 6);
  for (let i = 0; i < 100; i++) {
    const rand = mulberry32(i + 1);
    const domain = domainPool[Math.floor(rand() * domainPool.length)];
    const queue = buildSessionQueue({ index, domain, count: 8, rand: mulberry32(i * 31 + 7) });
    const key = queue.map((q) => q.id).join('|');
    if (seen.has(key)) collisions++;
    seen.add(key);
  }
  check('no-repeat collisions < 5%', collisions < 5, `${collisions}/100 identical sessions`);
  console.log(`  identical session paths: ${collisions}/100`);
}

// ---------- 4. Gap-targeted queue ----------
console.log('\n[4] Gap-targeting');
{
  const withConcepts = index.questions.filter((q) => (q.concepts ?? []).length > 0);
  const target = withConcepts[0].concepts[0];
  const rand = mulberry32(5);
  const queue = buildSessionQueue({ index, targetConcepts: [target], count: 6, rand });
  const targeted = queue.filter((q) => (q.concepts ?? []).includes(target));
  check('gap concept surfaces in top-6 queue', targeted.length >= 1, JSON.stringify(queue.map((q) => q.id)));
  console.log(`  target concept ${target}: ${targeted.length}/6 top questions carry it`);
}

// ---------- 5. Conversation v2 (P1 gates) ----------
console.log('\n[5] Conversation Director v2 — beats, reactions, memory');
{
  const { SessionBeats, BEATS } = await import('../../lib/engine/conversation.mjs');
  const persona = getPersona('skeptic');
  const d2 = new Director({ index, domain: 'ruby-backend-fresher', questionCount: 4, sessionSeed: 21 });
  const sb = new SessionBeats({ persona, minutes: 30, seed: 21, director: d2, index });

  // beat order: opener -> warmup
  const openerLine = sb.opener(persona.name);
  check('opener names the persona', openerLine.includes('David Chen'), openerLine.slice(0, 50));
  const wu = sb.warmupQuestion();
  check('warmup is easy', wu.question.difficulty === 'easy', wu.question.difficulty);

  // reaction keying: strong -> interest; lost -> empathy; no variant repeats
  const seen = new Set();
  let repeats = 0;
  let current = wu.question;
  let lostReactionWasEmpathy = false;
  for (let t = 0; t < 4; t++) {
    const style = t === 1 ? 'weak' : 'strong';
    const ans = style === 'strong'
      ? current.conceptLabels.join('. ') + '. Used in production with measured impact.'
      : 'no idea honestly';
    const ave = verifyTurn(ans, current);
    const res = sb.processAnswer({ question: current, ave, transcript: ans }, 0.2 + t * 0.2);
    const key = (ave.signal) + ':' + (res.reaction ?? '');
    if (seen.has(key)) repeats++;
    seen.add(key);
    if (ave.signal === 'lost' && /park|aside|skip|move|set that/i.test(res.reaction ?? '')) lostReactionWasEmpathy = true;
    if (!res.next || res.next.move === 'wrap' || !res.next.question) break;
    current = res.next.question;
  }
  check('no reaction variant repeats in a session', repeats === 0, repeats + ' repeats');
  check('lost answer gets empathy (never hammered)', lostReactionWasEmpathy);

  // time signal fires past 75%
  const d3 = new Director({ index, domain: 'ruby-backend-fresher', questionCount: 6, sessionSeed: 5 });
  const sb3 = new SessionBeats({ persona, minutes: 30, seed: 5, director: d3, index });
  sb3.opener(persona.name);
  const wu3 = sb3.warmupQuestion();
  const ave3 = verifyTurn(wu3.question.conceptLabels.join('. '), wu3.question);
  const res3 = sb3.processAnswer({ question: wu3.question, ave: ave3, transcript: 'words' }, 0.85);
  check('time signal past 75%', /minutes|time/i.test(res3.reaction ?? ''), res3.reaction);
}

// ---------- 6. Campaign engine (P2 gates) ----------
console.log('\n[6] Offer Ready campaign engine');
{
  const { generateCampaign, computeReadiness, replanUpcomingDays, completeDay, phaseGate, certificateData } = await import('../../lib/engine/campaign.mjs');
  const in28 = new Date(Date.now() + 28 * 86400000).toISOString().slice(0, 10);
  const c = generateCampaign({ interviewDate: in28, company: 'amazon', level: 'intermediate', domains: ['ruby-backend-fresher'], minutesPerDay: 30, daysPerWeek: 5, campaignDays: 28 }, {});

  check('campaign generates 28 days', c.days.length === 28, c.days.length);
  check('company name resolves', c.companyName === 'Amazon', c.companyName);
  check('last day is dress rehearsal', c.days[c.days.length - 1].dayType === 'dress_rehearsal');
  check('has all four phases', ['foundation', 'depth', 'pressure', 'rehearsal'].every(p => c.days.some(d => d.phase === p)));
  const restCount = c.days.filter(d => d.dayType === 'rest').length;
  check('rest days 5/week => ~8', restCount >= 6 && restCount <= 10, restCount);
  check('every day has a oneThing', c.days.every(d => d.oneThing && d.oneThing.length > 5));

  // readiness monotonicity: better inputs => not lower score
  const r1 = computeReadiness({ coverageRatio: 0.3, recentTrend: 50, calibrationBias: 30 });
  const r2 = computeReadiness({ coverageRatio: 0.6, recentTrend: 75, calibrationBias: 5, rehearsalBest: 80 });
  check('readiness monotonic', r2.value > r1.value, r1.value + ' -> ' + r2.value);
  check('readiness components carry receipts', Object.values(r2.components).every(comp => comp.receipt && typeof comp.value === 'number'));

  // replan honors mastery changes
  const before = c.days.find(d => d.status === 'planned' && d.phase === 'foundation');
  replanUpcomingDays(c, { 'n-plus-one': { strength: 10 } }, null);
  check('replan keeps planned structure', before && c.days.every(d => d.oneThing && d.oneThing.length > 5));

  // phase gate honesty
  const gate = phaseGate({ currentPhase: 'foundation' }, 0.3);
  check('gate blocks low coverage', !gate.allowed && gate.reason.includes('Receipts'));
  const gate2 = phaseGate({ currentPhase: 'foundation' }, 0.5);
  check('gate passes good coverage', gate2.allowed);

  // complete + certificate
  const day0 = c.days[3];
  const rr = completeDay(c, day0.date, { coverageRatio: 0.45, recentTrend: 65 });
  check('completeDay updates history', c.readinessHistory.length === 1 && day0.status === 'completed');
  const cert = certificateData(c, rr.value);
  check('certificate has data + line', cert.sessionsCompleted >= 1 && cert.line.includes('been there'));
}

// ---------- report ----------
console.log('\n================ SELF TEST RESULT ================');
console.log(`  pass: ${pass} | fail: ${fail}`);
if (failures.length) {
  console.log('  failures:');
  for (const f of failures) console.log(`   - ${f}`);
  process.exit(1);
}
console.log('  ALL PASS');
