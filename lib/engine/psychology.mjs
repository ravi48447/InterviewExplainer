/**
 * psychology.mjs — calibration tracking + redemption scheduler.
 *
 * Calibration: candidates predict their band before answering; we compare
 * prediction vs actual over sessions and surface the bias ("you under-rate
 * your behavioral answers by a full band").
 *
 * Redemption: failed concepts re-appear at spaced intervals (different topic
 * carrier, different persona) until mastered. Facing the exact thing you
 * failed — and winning — is what builds durable self-efficacy.
 */

// ---------------- calibration ----------------

/**
 * Record one prediction-vs-actual pair.
 * store: array of { predicted: 1-5, actual: 0-100, ts }
 */
export function recordPrediction(store, predictedBand, actualScore) {
  const predictedNum = { '1': 20, '2': 40, '3': 60, '4': 80, '5': 95 }[String(predictedBand)] ?? 60;
  const entry = { predicted: predictedNum, actual: actualScore, ts: Date.now() };
  return [...(store ?? []), entry].slice(-100);
}

/**
 * Calibration analysis. Positive bias = overconfident, negative = underconfident.
 */
export function calibrationAnalysis(store) {
  const s = (store ?? []).slice(-20);
  if (s.length < 3) {
    return { ready: false, n: s.length, bias: 0, note: 'Answer with predictions on 3+ questions to unlock calibration insights.' };
  }
  const diffs = s.map((e) => e.predicted - e.actual);
  const bias = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
  const recent = diffs.slice(-5);
  const recentBias = Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);

  let note;
  if (bias >= 15) note = 'You consistently OVER-predict — you think answers went better than they scored. Slow down and check the key points before submitting.';
  else if (bias <= -15) note = 'You consistently UNDER-predict — your answers score better than you expect. Trust your knowledge more; you know more than you think.';
  else if (Math.abs(recentBias) < 10) note = 'Well calibrated recently — your gut matches your performance. That\'s interview-ready self-awareness.';
  else note = 'Calibration varies by question — note which topics skew your confidence.';

  return {
    ready: true,
    n: s.length,
    bias,                       // avg (predicted - actual)
    recentBias,
    direction: bias > 10 ? 'overconfident' : bias < -10 ? 'underconfident' : 'calibrated',
    note,
  };
}

// ---------------- redemption loop ----------------

const REDEMPTION_INTERVALS_DAYS = [2, 5, 12]; // spaced re-encounters

/**
 * Queue a failed concept for redemption.
 * queue: array of { conceptId, label, dueAt, attempts, originTopic, originSession }
 */
export function queueRedemption(queue, conceptId, label, originTopic) {
  const existing = (queue ?? []).find((q) => q.conceptId === conceptId);
  if (existing) return queue; // already scheduled
  return [
    ...(queue ?? []),
    {
      conceptId,
      label,
      dueAt: Date.now() + REDEMPTION_INTERVALS_DAYS[0] * 86400000,
      attempts: 0,
      originTopic: originTopic ?? null,
      maxAttempts: 3,
    },
  ];
}

/**
 * Advance a redemption entry after a re-encounter (pass/fail).
 */
export function advanceRedemption(queue, conceptId, passed) {
  return (queue ?? [])
    .map((q) => {
      if (q.conceptId !== conceptId) return q;
      if (passed) return { ...q, masteredAt: Date.now(), attempts: q.attempts + 1 };
      const next = REDEMPTION_INTERVALS_DAYS[Math.min(q.attempts + 1, REDEMPTION_INTERVALS_DAYS.length - 1)];
      return {
        ...q,
        attempts: q.attempts + 1,
        dueAt: Date.now() + next * 86400000,
      };
    })
    .filter((q) => !passed || Date.now() - (q.masteredAt ?? 0) < 1000); // passed entries drop out next pass
}

/**
 * Redemption concepts due now (for seeding the next session).
 */
export function dueRedemptions(queue, now = Date.now()) {
  return (queue ?? []).filter((q) => !q.masteredAt && q.attempts < q.maxAttempts && q.dueAt <= now);
}

/**
 * Pick topic carriers for redemption: same concept, DIFFERENT topic phrasing.
 */
export function redemptionCarriers(conceptId, leanIndex, excludeTopicId) {
  const entry = (leanIndex.conceptIndex ?? []).find((c) => c.id === conceptId);
  if (!entry) return [];
  return (entry.topics ?? []).filter((t) => t !== excludeTopicId);
}

// ---------------- rituals (pre/post session psychology) ----------------

export const PRE_SESSION_RITUAL = {
  breath: {
    title: 'Box breathing · 60 seconds',
    pattern: [
      { phase: 'Inhale', seconds: 4, hint: 'through your nose' },
      { phase: 'Hold', seconds: 4, hint: 'gently' },
      { phase: 'Exhale', seconds: 4, hint: 'slowly' },
      { phase: 'Hold', seconds: 4, hint: 'empty' },
    ],
    cycles: 4,
    note: 'Regulates the physiological stress response before you start.',
  },
  reappraisal: {
    lines: [
      "You're not nervous. You're ready — and excited.",
      'Your body is preparing you to perform. That energy is fuel.',
      'You have prepared. This is a rehearsal, not a judgment.',
    ],
    note: 'Anxiety-reappraisal: naming arousal as readiness measurably outperforms trying to calm down.',
  },
};

export const WIN_JOURNAL_SEEDS = [
  'handled pushback without losing composure',
  'explained a trade-off clearly',
  'recovered after a shaky start',
  'caught their own mistake and corrected it',
  'kept the answer structured under time pressure',
];
