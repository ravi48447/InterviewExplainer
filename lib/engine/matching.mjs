/**
 * matching.mjs — peer matching queue (role-swap interviews).
 *
 * Philosophy: real humans + real stakes is the last mile of realism. Users
 * take BOTH seats — being the interviewer is itself interview training (you
 * internalize what good answers look like from the other side of the table).
 *
 * Matching signals: domain, target level, timezone window, language.
 * Interviewer quality score: probe variety + rubric usage + pacing (from
 * move logs we already capture).
 *
 * In-memory queue (single instance). Redis swap is the documented seam for
 * multi-instance — the module interface doesn't change.
 */

// ---------------- queue ----------------

/** @type {Map<string, PendingEntry>} */
const queue = new Map(); // userId -> entry
/** @type {Map<string, MatchResult>} */
const active = new Map(); // matchId -> result

let nextId = 1;

/**
 * Join the matching queue.
 * entry: { userId, name, domain, level (fresher|intermediate|senior),
 *          role: 'either' | 'interviewer' | 'candidate',
 *          timezone: string, language: 'en' etc, plan, joinedAt }
 */
export function joinQueue(entry) {
  const e = {
    matchId: null,
    userId: String(entry.userId ?? ''),
    name: String(entry.name ?? 'Anonymous'),
    domain: String(entry.domain ?? 'ruby-backend-fresher'),
    level: ['fresher', 'intermediate', 'senior'].includes(entry.level) ? entry.level : 'fresher',
    role: ['either', 'interviewer', 'candidate'].includes(entry.role) ? entry.role : 'either',
    timezone: String(entry.timezone ?? 'Asia/Kolkata'),
    language: String(entry.language ?? 'en'),
    plan: String(entry.plan ?? 'free'),
    joinedAt: Date.now(),
  };
  if (!e.userId) return { error: 'user_id_required' };

  // try immediate match first
  const m = tryMatch(e);
  if (m) return { matched: true, ...m };

  queue.set(e.userId, e);
  return { matched: false, queued: true, position: queue.size, entry: e };
}

/** Poll for a match (or leave timeout to the caller). */
export function checkMatch(userId) {
  const e = queue.get(String(userId));
  if (!e) return { queued: false };
  const m = tryMatch(e);
  if (m) return { matched: true, ...m };
  return { queued: true, position: [...queue.keys()].indexOf(String(userId)) + 1, waitSeconds: Math.round((Date.now() - e.joinedAt) / 1000) };
}

/** Leave the queue. */
export function leaveQueue(userId) {
  queue.delete(String(userId));
  return { left: true };
}

// ---------------- matching logic ----------------

const DOMAIN_WEIGHT = 3;
const LEVEL_WEIGHT = 2;
const TZ_WEIGHT = 1;

function scorePair(a, b) {
  if (a.userId === b.userId) return -1;
  // role compatibility: either matches anything; interviewer+candidate ok; same fixed role not
  const roleOk =
    a.role === 'either' || b.role === 'either'
      ? true
      : (a.role === 'interviewer' && b.role === 'candidate') || (a.role === 'candidate' && b.role === 'interviewer');
  if (!roleOk) return -1;
  let s = 0;
  if (a.domain === b.domain) s += DOMAIN_WEIGHT;
  if (a.level === b.level) s += LEVEL_WEIGHT;
  if (sameTzBand(a.timezone, b.timezone)) s += TZ_WEIGHT;
  // prefer comparable levels (no fresher-vs-senior gaps > 1 step)
  const levelDist = Math.abs(['fresher', 'intermediate', 'senior'].indexOf(a.level) - ['fresher', 'intermediate', 'senior'].indexOf(b.level));
  if (levelDist > 1) s -= 4;
  return s;
}

function sameTzBand(tz1, tz2) {
  // rough band by offset hours (deterministic from the tz string via a small map)
  const band = (tz) => {
    const h = { 'Asia/Kolkata': 5.5, 'Asia/Singapore': 8, 'Asia/Tokyo': 9, 'Europe/London': 0, 'Europe/Berlin': 1, 'America/New_York': -5, 'America/Los_Angeles': -8 }[tz];
    return h == null ? null : Math.floor(h / 6);
  };
  const b1 = band(tz1);
  const b2 = band(tz2);
  if (b1 == null || b2 == null) return true; // unknown -> compatible
  return b1 === b2;
}

/** Attempt to match an entry against everyone queued. */
function tryMatch(e) {
  let best = null;
  let bestScore = -1;
  for (const [uid, other] of queue) {
    if (uid === e.userId) continue;
    const s = scorePair(e, other);
    if (s > bestScore) { bestScore = s; best = other; }
  }
  // accept any compatible match after 30s, else require score >= 3
  const waited = Date.now() - (e.joinedAt ?? Date.now());
  if (best && (bestScore >= 3 || (waited > 30000 && bestScore >= 0))) {
    queue.delete(e.userId);
    queue.delete(best.userId);
    const matchId = `m${nextId++}`;
    // role assignment: one interviewer, one candidate — earlier joiner gets
    // their preferred seat, the other takes the opposite (that's the role-swap
    // design: 'either' users are flexible)
    const a = (e.joinedAt ?? 0) <= (best.joinedAt ?? 0) ? e : best;
    const b = a === e ? best : e;
    let hostRole;
    let guestRole;
    if (a.role === 'interviewer') { hostRole = 'interviewer'; guestRole = 'candidate'; }
    else if (a.role === 'candidate') { hostRole = 'candidate'; guestRole = 'interviewer'; }
    else if (b.role === 'interviewer') { hostRole = 'candidate'; guestRole = 'interviewer'; }
    else if (b.role === 'candidate') { hostRole = 'interviewer'; guestRole = 'candidate'; }
    else { hostRole = 'interviewer'; guestRole = 'candidate'; } // both flexible: default
    const result = {
      matchId,
      host: { userId: a.userId, name: a.name, role: hostRole },
      guest: { userId: b.userId, name: b.name, role: guestRole },
      domain: e.domain,
      score: bestScore,
      createdAt: Date.now(),
    };
    active.set(matchId, result);
    return { matchId, match: result };
  }
  return null;
}

// ---------------- interviewer quality scoring ----------------

/**
 * Score an interviewer's conduct from their session move log + rubric usage.
 * Inputs (from the live console + engine):
 *   movesUsed: { probe: n, stretch: n, poke: n, tradeoff: n, scaffold: n, pivot: n }
 *   rubricTicks: number of concepts ticked during the session
 *   questionsAsked: total questions
 *   interruptions: times they cut the candidate off
 *   avgAnswerTimeSec: average time between question and their next action
 */
export function scoreInterviewer({ movesUsed, rubricTicks, questionsAsked, interruptions, avgAnswerTimeSec }) {
  const m = movesUsed ?? {};
  const variety = new Set(['probe', 'stretch', 'poke', 'tradeoff', 'scaffold', 'pivot'].filter((k) => (m[k] ?? 0) > 0)).size;
  const probesUsed = (m.probe ?? 0) + (m.stretch ?? 0);
  const depth = questionsAsked ? probesUsed / questionsAsked : 0;

  let score = 40; // base for showing up and running a real session
  score += Math.min(25, variety * 4);            // variety of interviewer moves
  score += Math.min(20, depth * 40);              // follow-up depth
  score += Math.min(10, (rubricTicks ?? 0));     // engaged with the rubric
  score -= Math.min(15, (interruptions ?? 0) * 5);
  if (avgAnswerTimeSec != null) {
    if (avgAnswerTimeSec < 30) score -= 8;       // rushed the candidate
    else if (avgAnswerTimeSec > 90) score -= 4;  // disengaged
    else score += 5;
  }
  score = Math.max(0, Math.min(100, Math.round(score)));

  const feedback =
    score >= 80 ? 'Excellent interviewer — varied probing, good pacing, used the rubric.'
    : score >= 60 ? 'Good session. Try more follow-up probes to dig into answers.'
    : score >= 40 ? 'Decent. Use the Director suggestions more — they make you a sharper interviewer.'
    : 'Rushed. Give the candidate room to think; ask one follow-up before moving on.';

  return { score, feedback, variety, depth: +(depth.toFixed(2)) };
}

/** Queue stats for UI (wait times, pool size by domain). */
export function queueStats() {
  const byDomain = {};
  for (const e of queue.values()) byDomain[e.domain] = (byDomain[e.domain] ?? 0) + 1;
  const waitMs = [...queue.values()].map((e) => Date.now() - e.joinedAt);
  return {
    waiting: queue.size,
    byDomain,
    avgWaitSeconds: waitMs.length ? Math.round(waitMs.reduce((a, b) => a + b, 0) / waitMs.length / 1000) : 0,
    activeMatches: active.size,
  };
}

/** test hook */
export function _reset() {
  queue.clear();
  active.clear();
}
