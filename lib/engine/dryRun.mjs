/**
 * dryRun.mjs — algorithm dry-run + debate engine for live coding rounds.
 *
 * The most real part of a real coding interview: the interviewer makes you
 * trace YOUR algorithm on a concrete input ("walk me through arr=[8,3,9,1]"),
 * then challenges steps ("why is step 3 O(n) and not O(n²)?").
 *
 * Deterministic: builds trace prompts from the expert code + the candidate's
 * own submission, challenges from complexity/edge/optimization angles found
 * in the topic's content (mistakes, tradeoffs, to_stand_out).
 */

import { tokenize } from './text.mjs';

/**
 * Generate a dry-run prompt set for a submitted solution.
 * Returns ordered challenges: trace → complexity → edge → optimization.
 */
export function dryRunChallenges(submittedCode, rubric, seed = 0) {
  const src = String(submittedCode ?? '');
  const challenges = [];

  // 1) TRACE: find the loop construct and demand a concrete walkthrough
  const loopKind =
    /for\s*\(|while\s*\(|\.each/.test(src) ? 'loop' :
    /\.map\(|\.select\(|\.filter\(/.test(src) ? 'iterator-chain' :
    /recursion|self\./i.test(src) ? 'recursion' : null;
  if (loopKind) {
    const inputs = {
      loop: "the array [8, 3, 9, 1]",
      'iterator-chain': 'the list [\"b\", \"a\", \"c\"]',
      recursion: 'the input n = 4',
    };
    challenges.push({
      kind: 'trace',
      weight: 10,
      question: `Take ${inputs[loopKind] ?? 'a small concrete input'} and walk me through your ${loopKind === 'recursion' ? 'recursion — every call' : loopKind} step by step. What's the state after each step?`,
      expects: ['state-after-each-step', 'specific-values'],
    });
  }

  // 2) COMPLEXITY: time, then space, then "why"
  if (/for\s*\(|while\s*\(|\.each|\.map\(/.test(src)) {
    const nested = new RegExp(/for[\s\S]{0,200}for\s*\(/).test(src);
    challenges.push({
      kind: 'complexity',
      weight: 9,
      question: nested
        ? 'Your loops nest. What\'s the time complexity — and can you show me why with a concrete n?'
        : "What's the time complexity of your solution, and where does most of the time go?",
      expects: ['big-o', 'justification'],
    });
    if (/new |push|append|\.map|Array\./.test(src)) {
      challenges.push({
        kind: 'space',
        weight: 6,
        question: 'And space complexity? What are you allocating in the worst case?',
        expects: ['big-o-space', 'allocation-source'],
      });
    }
  }

  // 3) EDGE: from the topic's authored mistakes (the classic failure modes)
  const mistake = (rubric?.mistakes ?? [])[0];
  if (mistake) {
    challenges.push({
      kind: 'edge',
      weight: 8,
      question: `Now the ugly inputs. ${edgeIntro(mistake)} Walk me through what your code does there.`,
      expects: ['edge-case-handling'],
    });
  }

  // 4) OPTIMIZATION: from tradeoffs / to_stand_out if authored
  const stretch = (rubric?.probes ?? []).find((p) => p.kind === 'stretch');
  if (stretch) {
    challenges.push({
      kind: 'optimize',
      weight: 7,
      question: `Suppose this needs to run 100x faster at scale. ${firstSentence(stretch.text)} — how would you start?`,
      expects: ['approach-shift', 'tradeoff-awareness'],
    });
  }

  // 5) ALTERNATIVE: compare with another way
  const row = (rubric?.tradeoffs ?? [])[0];
  if (row) {
    challenges.push({
      kind: 'alternative',
      weight: 5,
      question: `Could you have solved this with ${row[0] ?? 'a different approach'} instead? When would that be the better call?`,
      expects: ['comparison', 'judgment'],
    });
  }

  return challenges.sort((a, b) => b.weight - a.weight).map((c, i) => ({ ...c, id: `dr-${i}` }));
}

/** Pick the top N challenges for one round (interviewer asks 2-3, not five). */
export function pickDryRunChallenges(code, rubric, count = 3, seed = 0) {
  return dryRunChallenges(code, rubric, seed).slice(0, count);
}

/**
 * Evaluate a dry-run/explanation answer. A good trace answer contains:
 * specific values ("after step 2, i=3"), step markers ("first/then/next"),
 * and the final result. Deterministic heuristics, no model.
 */
export function evaluateDryRunAnswer(answer, challenge) {
  const t = String(answer ?? '');
  const tokens = new Set(tokenize(t));
  const words = t.trim().split(/\s+/).filter(Boolean).length;

  const signals = {
    concreteValues: /\b\d+\b/.test(t) || /\[.*\]/.test(t) || /\bn\s*=\s*\d/.test(t),
    stepMarkers: /\b(first|then|next|after|step|iteration|second|finally|now)\b/i.test(t),
    statesCorrect: /\b(i|j|result|output|sum|count|max|min)\s*(=|is|becomes)\s*\w+/i.test(t),
    complexityClaim: /\b(o\(|omega|theta|linear|quadratic|log|constant|n\s*log)\b/i.test(t),
    hedging: /\b(maybe|probably|i guess|not sure|something like)\b/i.test(t),
  };

  let score = 0;
  if (signals.concreteValues) score += 25;
  if (signals.stepMarkers) score += 20;
  if (signals.statesCorrect) score += 25;
  if (challenge.kind === 'complexity' && signals.complexityClaim) score += 20;
  if (challenge.kind === 'trace' && signals.concreteValues && signals.stepMarkers) score += 10; // a real trace
  if (signals.hedging) score -= 10;
  if (words < 8) score -= 15; // too thin to be a walkthrough
  score = Math.max(0, Math.min(100, Math.round(score + (words >= 40 ? 10 : 0))));

  const followUp =
    score >= 75 ? null :
    score >= 45 ? (challenge.kind === 'trace'
      ? 'More concrete — give me the actual values at each step, not the idea of them.'
      : 'Closer. Commit to a claim and defend it.')
    : (challenge.kind === 'trace'
      ? "I need the actual walkthrough — numbers, states, one step at a time."
      : "That's a dodge. Take a position and walk me through it.");

  return { score, signals, followUp };
}

/** After the candidate explains: the interviewer may counter once (debate). */
export function debateCounter(answer, challenge, evalResult) {
  if (evalResult.score >= 75) {
    return { counter: null, move: 'accept' }; // solid: no need to fight
  }
  if (evalResult.score >= 45) {
    return {
      counter: challenge.kind === 'complexity'
        ? "Hmm — show me. Count the operations for n=4 in YOUR code, right now."
        : challenge.kind === 'edge'
          ? "You're hand-waving the ugly case. What EXACTLY happens — line by line?"
          : "I follow the words, but where's the proof? Walk the actual example.",
      move: 'push',
    };
  }
  return {
    counter: "Let's be honest — that's not a walkthrough. Would you like to take it again from step one, or should we move on?",
    move: 'reset-or-move',
  };
}

function edgeIntro(mistake) {
  const m = String(mistake ?? '').replace(/\s+/g, ' ').trim();
  const short = m.length > 90 ? m.slice(0, 90) + '…' : m;
  return `A classic failure here is: "${short}".`;
}
function firstSentence(s) {
  return String(s ?? '').split(/(?<=[.!?])\s/)[0] ?? '';
}
