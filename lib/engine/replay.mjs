/**
 * replay.mjs — session replay: the timeline of an interview, marked.
 *
 * The #1 industry-wide user request: re-hear the session with "missed edge
 * case HERE" markers. Built from data we already capture (turns, move log,
 * AVE results, timestamps) plus local audio when the browser recorded it.
 *
 * Timeline events: question asked, answer started/ended, verdict per turn,
 * mistake flags, dodges (circle-backs), reactions — positioned on a single
 * scrub-able axis with the transcript synced.
 */

import { tokenize } from './text.mjs';

/**
 * Build a replay timeline from a session's turn records.
 * turns: [{ questionId, question, transcript, move, score, ave?, startedAt?, durationSec? }]
 * moveLog: [{ turn, move, questionId, reason }]
 */
export function buildReplayTimeline(turns, moveLog = []) {
  const events = [];
  let t = 0; // running clock (seconds); falls back to estimated durations

  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    const qDur = 12; // question spoken duration estimate
    const aDur = turn.durationSec ?? estimateSpeech(turn.transcript);

    // question event
    events.push({
      at: t, type: 'question', label: shortQ(turn.question), turn: i + 1,
      move: turn.move ?? 'next',
    });
    t += qDur + 1.5;

    // answer span
    const verdict = turn.ave ?? null;
    events.push({
      at: t, type: 'answer-start', turn: i + 1,
      label: 'your answer',
    });
    t += aDur;

    // verdict event (score + coverage at the end of the answer)
    if (verdict || turn.score != null) {
      const missed = verdict?.coverage?.missed ?? [];
      const hits = verdict?.coverage?.hit ?? [];
      events.push({
        at: t, type: 'verdict', turn: i + 1,
        score: verdict?.score ?? turn.score,
        band: bandFor(verdict?.score ?? turn.score),
        hit: hits, missed,
        mistakeFlags: verdict?.mistakeFlags ?? [],
        signal: verdict?.signal ?? null,
        label: bandFor(verdict?.score ?? turn.score).band,
      });
    }
    t += 2; // interviewer reaction pause

    // mistake flag markers (from AVE)
    if (verdict?.mistakeFlags?.length) {
      for (const flag of verdict.mistakeFlags) {
        events.push({
          at: Math.max(0, t - aDur * 0.6), type: 'mistake', turn: i + 1,
          label: truncate(flag, 60), severity: 'high',
        });
      }
    }

    // circle-back markers (dodged concepts returning)
    const cb = moveLog.find((m) => m.turn === i + 1 && m.move === 'circle_back');
    if (cb) {
      events.push({
        at: t, type: 'callback', turn: i + 1,
        label: 'interviewer returned to a dodged concept',
      });
    }
    t += 3; // inter-question gap
  }

  return {
    totalSeconds: Math.round(t),
    events: events.sort((a, b) => a.at - b.at),
    turns: turns.length,
  };
}

/**
 * Sync the transcript to the timeline: split the answer into word-chunks with
 * per-word timing so a playhead can highlight the current phrase.
 */
export function transcriptWithTiming(transcript, startAt, durationSec) {
  const words = String(transcript ?? '').split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const per = (durationSec ?? estimateSpeech(transcript)) / words.length;
  return words.map((w, i) => ({ w, at: startAt + i * per, i }));
}

/** Replay summary: the after-view stats a user reads before scrubbing. */
export function replaySummary(timeline) {
  const evs = timeline.events ?? [];
  const verdicts = evs.filter((e) => e.type === 'verdict');
  const mistakes = evs.filter((e) => e.type === 'mistake');
  const callbacks = evs.filter((e) => e.type === 'callback');
  const weakest = [...verdicts].sort((a, b) => (a.score ?? 0) - (b.score ?? 0))[0] ?? null;
  return {
    totalSeconds: timeline.totalSeconds,
    turns: timeline.turns,
    avgScore: verdicts.length ? Math.round(verdicts.reduce((a, v) => a + (v.score ?? 0), 0) / verdicts.length) : null,
    bestTurn: verdicts.length ? Math.max(...verdicts.map((v) => v.score ?? 0)) : null,
    weakestTurn: weakest ? { turn: weakest.turn, score: weakest.score, missed: weakest.missed } : null,
    mistakeCount: mistakes.length,
    callbackCount: callbacks.length,
    markers: [
      ...mistakes.map((m) => ({ at: m.at, kind: 'mistake', label: m.label })),
      ...callbacks.map((c) => ({ at: c.at, kind: 'callback', label: c.label })),
    ],
  };
}

function estimateSpeech(text) {
  const words = tokenize(String(text ?? '')).length;
  return Math.max(8, Math.round(words / 2.2)); // ~130 wpm spoken
}

function shortQ(q) {
  const s = String(q ?? '');
  return s.length > 70 ? s.slice(0, 70) + '…' : s;
}

function truncate(s, n) {
  const t = String(s ?? '');
  return t.length > n ? t.slice(0, n) + '…' : t;
}

function bandFor(score) {
  if (score == null) return { band: '—', tone: 'stone' };
  if (score >= 75) return { band: 'Strong', tone: 'olive' };
  if (score >= 55) return { band: 'Solid', tone: 'amber' };
  if (score >= 35) return { band: 'Getting there', tone: 'clay' };
  return { band: 'Needs practice', tone: 'rose' };
}
