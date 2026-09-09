/**
 * sessionConfig.mjs — session presets, gentle-score bands, behavioral STAR
 * tracking, and the coding-round verifier. All deterministic, content-grounded.
 */

// ---------------- session presets (duration -> question budget) ----------------
// ---------------- hard mode (user-facing "grade me harder") ----------------
export const HARD_MODE = {
  tier: 5,
  persona: 'skeptic',
  strictBands: {
    // strict display bands: no softening — users who ask for brutal get brutal
    strong: (s) => s >= 85,
    solid: (s) => s >= 65,
    shaky: (s) => s >= 40,
  },
  line: (s) =>
    s >= 85 ? 'Interviewer-level. This would pass a real bar.'
    : s >= 65 ? 'Passable, not impressive. A real interviewer would push once more.'
    : s >= 40 ? 'This fails a real bar. The expert answer below shows what was expected.'
    : 'This fails badly. Stop, read the expert answer, try again.',
  note: 'Hard mode: strict scoring, tier-5 pressure, skeptic persona, no gentle framing.',
};

export function hardBand(score) {
  return {
    band: score >= 85 ? 'Passes' : score >= 65 ? 'Borderline' : score >= 40 ? 'Fails' : 'Fails badly',
    line: HARD_MODE.line(score),
    strict: true,
  };
}

export const SESSION_PRESETS = {
  quick: { label: 'Quick warm-up', minutes: 15, questions: 5, description: '5 questions · one focused area' },
  standard: { label: 'Standard mock', minutes: 30, questions: 10, description: '10 questions · mixed depth with follow-ups' },
  deep: { label: 'Full interview', minutes: 60, questions: 20, description: '20 questions · broad coverage, coding round included' },
};

export function presetFor(key) {
  return SESSION_PRESETS[key] ?? SESSION_PRESETS.standard;
}

// ---------------- gentle scoring: display bands, not harsh numbers ----------------
/**
 * The engine score is strict concept-coverage. Users see a gentler, more
 * honest framing: a band + one encouraging line + what to do next.
 * (Engine scores stay untouched for the mastery store.)
 */
export function gentleBand(score) {
  if (score >= 75) return { band: 'Strong', tone: 'emerald', line: 'Interviewer-level answer. Keep this crisp delivery.' };
  if (score >= 55) return { band: 'Solid', tone: 'blue', line: 'Good answer — a couple of expert points would sharpen it.' };
  if (score >= 35) return { band: 'Getting there', tone: 'amber', line: 'Right direction. You missed some core ideas the expert covers — see them below.' };
  return { band: 'Needs practice', tone: 'rose', line: "Don't worry — everyone starts here. Read the expert answer, then try again." };
}

// ---------------- session freshness (the anti-recycle signal) ----------------
/**
 * Session DNA: how fresh this session's questions were vs the user's history.
 * askedHistory: Set/array of questionIds seen in prior sessions.
 */
export function sessionFreshness(questions, askedHistory, conceptHistory = []) {
  const seen = new Set(askedHistory ?? []);
  const conceptSeen = new Set(conceptHistory ?? []);
  const fresh = questions.filter((q) => !seen.has(q.id));
  const newConcepts = questions.flatMap((q) => (q.concepts ?? []).filter((c) => !conceptSeen.has(c)));
  return {
    questionCount: questions.length,
    freshQuestions: fresh.length,
    freshRatio: questions.length ? +(fresh.length / questions.length).toFixed(2) : 0,
    newConcepts: [...new Set(newConcepts)].length,
    label:
      fresh.length === questions.length ? 'All new — you have never seen these questions.'
      : fresh.length >= questions.length * 0.7 ? 'Mostly new — different paths through familiar ground.'
      : fresh.length > 0 ? 'Mixed — some repeats by design (redemption).'
      : 'All seen before — redemption focus on your weak spots.',
  };
}

// ---------------- behavioral: STAR tracking ----------------
const STAR_PARTS = [
  { part: 'S', name: 'Situation', test: /\b(when i|at my|last year|in my|during|we had|my team|the project|at work)\b/i },
  { part: 'T', name: 'Task', test: /\b(i was asked|my task|my role|responsible for|i had to|i owned|goal was|needed to)\b/i },
  { part: 'A', name: 'Action', test: /\b(i led|i built|i implemented|i designed|i wrote|i migrated|i decided|i pushed|i argued|i proposed|i automated)\b/i },
  { part: 'R', name: 'Result', test: /\b(result|impact|reduced|improved|increased|decreased|shipped|saved|grew|percent|%|faster|later|after)\b/i },
];

/**
 * STAR analysis of a behavioral answer. Returns missing parts + probe text.
 */
export function starAnalysis(answer) {
  const t = String(answer ?? '');
  const have = [];
  const missing = [];
  for (const p of STAR_PARTS) {
    if (p.test.test(t)) have.push(p.name);
    else missing.push(p.name);
  }
  const probes = {
    Situation: 'Give me the context — where was this, what was going on?',
    Task: 'What were YOU responsible for in that?',
    Action: 'What did you specifically do? Walk me through your actions.',
    Result: 'How did it end? Can you quantify the impact?',
  };
  return {
    have,
    missing,
    ratio: have.length / 4,
    probe: missing.length ? probes[missing[0]] : null,
    structureScore: have.length / 4,
  };
}

export const BEHAVIORAL_PROBE_BANK = {
  followResult: 'What was the result? Numbers if you have them.',
  followOwn: "And what was YOUR specific role in that? Say 'I', not 'we'.",
  followDepth: 'What was the hardest part of that, and how did you handle it?',
  followAlt: 'What would you do differently if you ran it again?',
  followConflict: 'Was there disagreement? How did you resolve it?',
};

// ---------------- rubric preview (pre-session transparency) ----------------
/**
 * What the user will be graded against — shown BEFORE the session starts.
 * Directly answers the #1 fairness complaint (opaque scoring). The user sees
 * the exact concept checklist + how scoring works; nothing hidden.
 */
export function rubricPreview(question) {
  const labels = question?.conceptLabels ?? [];
  return {
    checklist: labels.slice(0, 6),
    fullCount: labels.length,
    weights: [
      { part: 'Concept coverage', weight: '50%', detail: 'which expert points you hit' },
      { part: 'Depth', weight: '20%', detail: 'elaboration + example, not just names' },
      { part: 'Structure', weight: '15%', detail: 'built like an answer, not a list' },
      { part: 'Communication', weight: '15%', detail: 'pacing + filler (voice only)' },
    ],
    honesty: 'Scored against the expert answer written for this topic. Not an AI judge — every point is checkable below.',
  };
}

// ---------------- coding round: deterministic verifier ----------------
/**
 * Verify code against an authored code_example rubric. No execution
 * (public Piston is whitelist-only) — structural + pattern checks:
 *   1) required constructs (extracted from the example: identifiers + calls)
 *   2) forbidden patterns (common mistakes that would show in code)
 *   3) expected-output assertions where the example shows literal outputs
 * If PISTON_URL is configured (self-hosted), we POST and compare real output.
 */
export function verifyCode(code, rubric, fetchImpl) {
  const src = String(code ?? '');
  const checks = [];

  // 1) required constructs from the authored example
  const example = String(rubric?.codeExample ?? '');
  if (example) {
    const calls = [...new Set((example.match(/[A-Za-z_][\w.]*\s*\(/g) ?? []).map((c) => c.replace(/\s*\($/, '')))];
    const keyCalls = calls.filter((c) => c.includes('.')).slice(0, 4);
    if (keyCalls.length) {
      const found = keyCalls.filter((c) => src.includes(c.split('.').pop()));
      checks.push({
        id: 'constructs',
        label: `Uses the right building blocks (${keyCalls.join(', ')})`,
        ok: found.length >= Math.ceil(keyCalls.length * 0.5),
        detail: `${found.length}/${keyCalls.length} detected`,
      });
    }
    // 2) expected outputs: literal strings/numbers printed in the example
    const outputs = [...new Set((example.match(/(?:puts|print|console\.log|System\.out)\s*\(?\s*["'`]([^"'`]{3,30})["'`]/g) ?? []))];
    if (outputs.length) {
      const expected = outputs.map((o) => o.match(/["'`]([^"'`]+)["'`]$/)?.[1]).filter(Boolean);
      checks.push({
        id: 'output',
        label: 'Produces the expected values',
        ok: expected.some((e) => src.includes(e)),
        detail: expected.length ? `expect something like: ${expected.slice(0, 2).join(', ')}` : 'literal outputs',
      });
    }
  }

  // 3) size sanity: not a stub, not pasted garbage
  const lines = src.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#')).length;
  checks.push({
    id: 'substance',
    label: 'Has real substance (3+ lines of logic)',
    ok: lines >= 3,
    detail: `${lines} lines`,
  });

  // 4) language sanity — infer from the expert example's own syntax
  const ex = example || '';
  const lang = /\bdef\b|\bend\b|puts |\bdo \|/.test(ex) ? 'ruby'
    : /\bfunc\b|\bpackage\b/.test(ex) ? 'go'
    : /\bpublic static void main\b|System\.out/.test(ex) ? 'java'
    : /\bdef \w+\(.*\):|\bimport \w+$|print\(/.test(ex) ? 'python'
    : /console\.log|=>|function /.test(ex) ? 'javascript'
    : null;
  if (lang === 'ruby') checks.push({ id: 'lang', label: 'Looks like Ruby (def/end, do-blocks, puts)', ok: /\bdef\b|\bend\b|puts|\.each/.test(src), detail: 'ruby idiom' });
  else if (lang === 'go') checks.push({ id: 'lang', label: 'Looks like Go (func/package)', ok: /\bfunc\b|\bpackage\b/.test(src), detail: 'go idiom' });
  else if (lang === 'java') checks.push({ id: 'lang', label: 'Looks like Java (class/main/System.out)', ok: /\bclass\b|System\.out|public/.test(src), detail: 'java idiom' });
  else if (lang === 'python') checks.push({ id: 'lang', label: 'Looks like Python (def:/print)', ok: /\bdef \w+\s*\(|print\(/.test(src), detail: 'python idiom' });
  else if (lang === 'javascript') checks.push({ id: 'lang', label: 'Looks like JavaScript (const/function/=>)', ok: /\bconst\b|\blet\b|=>|console\.log/.test(src), detail: 'js idiom' });

  const passed = checks.filter((c) => c.ok).length;
  const score = Math.round((passed / Math.max(checks.length, 1)) * 100);
  return { score, checks, passed, total: checks.length, band: gentleBand(score) };
}

/** Pick a coding question: topics that carry a code_example with substance. */
export function pickCodingQuestion(index, domain, avoidIds = [], rand = Math.random) {
  const cands = (index.questions ?? []).filter(
    (q) => q.domain === domain && (q.codeExampleLines ?? 0) >= 4 && !avoidIds.includes(q.id)
  );
  if (!cands.length) return null;
  return cands[Math.floor(rand() * cands.length)];
}
