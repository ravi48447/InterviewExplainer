/**
 * codeDiscuss.mjs — the "better than human" coding-round interviewer.
 *
 * After you submit code, it doesn't ask about every line — it picks the 2-3
 * MOST INTERESTING things about YOUR solution and asks you to explain the
 * logic: the key construct, a potential failure mode, a scale question, or a
 * missed optimization — all derived from the authored expert code + your diff
 * against it. Deterministic, content-grounded.
 */

import { tokenize } from './text.mjs';

/**
 * Analyze a submitted solution vs the expert example.
 * Returns discussion points ranked by "interviewer interest".
 */
export function analyzeCodeDiscussion(submittedCode, rubric) {
  const src = String(submittedCode ?? '');
  const expert = String(rubric?.codeExample ?? '');
  const points = [];

  // 1) KEY CONSTRUCT used — ask WHY it's the right tool
  const expertCalls = [...new Set((expert.match(/[A-Za-z_][\w.]*\s*\(/g) ?? []).map((c) => c.replace(/\s*\($/, '')))];
  const keyCalls = expertCalls.filter((c) => c.includes('.')).slice(0, 5);
  const usedCalls = keyCalls.filter((c) => src.includes(c.split('.').pop().replace(/\($/, '')));
  if (usedCalls.length) {
    points.push({
      kind: 'construct',
      weight: 9,
      question: `You used ${fmtList(usedCalls.slice(0, 2))} — walk me through WHY that's the right approach here, not just what it does.`,
    });
  }

  // 2) MISSING construct — the expert had it, you didn't
  const missing = keyCalls.filter((c) => !src.includes(c.split('.').pop().replace(/\($/, '')));
  if (missing.length) {
    points.push({
      kind: 'gap',
      weight: 8,
      question: `Your solution doesn't use ${fmtList(missing.slice(0, 2))}. What problem would that solve — and does your version handle it?`,
    });
  }

  // 3) EDGE/FAILURE mode — from common_mistakes on the topic
  const mistake = (rubric?.mistakes ?? [])[0];
  if (mistake) {
    points.push({
      kind: 'failure',
      weight: 7,
      question: `Where does your code break if ${lowerFirst(truncate(mistake, 80))}? Walk me through the failure.`,
    });
  }

  // 4) SCALE — from tradeoffs table if present
  const row = (rubric?.tradeoffs ?? [])[0];
  if (row) {
    points.push({
      kind: 'scale',
      weight: 6,
      question: `If ${row[0] ?? 'the input'} grows 100x, what happens to your solution first? What would you change?`,
    });
  }

  // 5) COMPLEXITY — if the code has loops (always a fair question)
  if (/for |while |\.each|forEach|range\(/.test(src)) {
    points.push({
      kind: 'complexity',
      weight: 5,
      question: 'What\'s the time complexity of your solution — and where does most of the time go?',
    });
  }

  // 6) NAMING/STRUCTURE — only if code is long enough to matter
  const lines = src.split('\n').filter((l) => l.trim()).length;
  if (lines >= 8) {
    points.push({
      kind: 'structure',
      weight: 3,
      question: 'If a teammate had to modify this next month, what would trip them up first?',
    });
  }

  return points.sort((a, b) => b.weight - a.weight);
}

/** Pick the top-N discussion points (the interviewer asks 2-3, not all). */
export function pickDiscussionPoints(submittedCode, rubric, count = 3) {
  return analyzeCodeDiscussion(submittedCode, rubric).slice(0, count);
}

/**
 * Evaluate the code EXPLANATION answer (vs just the code).
 * Checks: did they address the construct/scale/failure asked about?
 */
export function evaluateExplanation(answer, point, rubric) {
  const tokens = new Set(tokenize(answer));
  const ptTokens = tokenize(point.question).filter((t) => t.length > 3);
  const topicTokens = tokenize(rubric?.spoken ?? rubric?.direct ?? '').filter((t) => t.length > 3);

  const addressed = ptTokens.filter((t) => tokens.has(t)).length / Math.max(ptTokens.length, 1);
  const grounded = topicTokens.filter((t) => tokens.has(t)).length / Math.max(topicTokens.length * 0.1, 1);
  const words = tokenize(answer).length;

  let score = 0;
  score += Math.min(50, addressed * 120);       // did they answer what was asked
  score += Math.min(35, grounded * 8);            // did they ground it in the right concepts
  score += Math.min(15, (words / 60) * 15);       // some substance
  score = Math.round(Math.min(100, score));

  return {
    score,
    addressed: +(addressed.toFixed(2)),
    grounded: +(grounded.toFixed(2)),
    followUp:
      score < 40
        ? "Try again — what's the actual mechanism, not the name of the tool?"
        : score < 70
          ? 'Closer. Now the "why" behind that choice?'
          : null,
  };
}

function fmtList(items) {
  if (items.length === 1) return items[0];
  return `${items[0]} and ${items[1]}`;
}
function lowerFirst(s) {
  return String(s).charAt(0).toLowerCase() + String(s).slice(1);
}
function truncate(s, n) {
  const t = String(s ?? '');
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t;
}
