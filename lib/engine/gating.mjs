/**
 * gating.mjs — the freemium gate: how much interview is free, what's premium.
 *
 * Philosophy (user's mandate): content is free forever; the mock is the
 * premium product. Users taste several turns of the full experience — then
 * the full interview (panel gauntlet, full duration, all personas, live
 * rooms, full reports) requires a plan.
 *
 * The gate is enforced server-side (session/turn routes) AND surfaced
 * client-side (progress ring → paywall card). Never mid-question — always at
 * a clean boundary so the experience never feels broken.
 */

// ---------------- plan definitions ----------------
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    priceInr: 0,
    tagline: 'Taste the real thing',
    limits: {
      freeTurnsPerSession: 4,          // ~4 answers free, then the gate
      freeSessionsPerMonth: 6,
      tiers: [1, 2],                   // warm-up + standard pressure
      personas: ['mentor', 'skeptic'],
      modes: ['technical', 'behavioral'],
      maxMinutes: 30,
      liveRooms: false,
      fullReport: false,               // summary only
      panelGauntlet: false,
    },
  },
  interview_pass: {
    id: 'interview_pass',
    name: 'Interview Pass',
    priceInr: 499,
    tagline: 'The full real interview, unlocked',
    limits: null, // unlimited within fair use
    features: [
      'Unlimited adaptive mocks — all durations (15/30/60 min)',
      'All 7 interviewer personas + all 5 pressure tiers',
      'Panel gauntlet (the real-loop simulation)',
      'Coding rounds with the code-discussion interviewer',
      'Full reports: receipts, expert answers, move-log replay',
      'Redemption loop + calibration coaching',
      'Live 1:1 peer rooms with Director-assist',
    ],
  },
  interview_pro: {
    id: 'interview_pro',
    name: 'Interview Pro',
    priceInr: 1499,
    tagline: 'Everything + live loops, for the final push',
    limits: null,
    features: [
      'Everything in Interview Pass',
      'Company-loop simulators (Amazon LP / Google DSA / startup)',
      'Schedule a full rehearsal the day before your real interview',
      'Priority peer matching',
      'Win journal + shareable debriefs',
    ],
  },
};

export function planOf(planId) {
  return PLANS[planId] ?? PLANS.free;
}

// ---------------- the gate decision ----------------
/**
 * Should the session be gated now?
 * state: { turnsCompleted, plan, sessionsThisMonth }
 * Returns { gated: bool, at: 'session_cap' | 'turn_cap', usedRatio }
 */
export function gateDecision(state) {
  const plan = planOf(state.plan ?? 'free');
  if (!plan.limits) return { gated: false, usedRatio: 0 }; // premium: never gated

  const turnCap = plan.limits.freeTurnsPerSession;
  const sessionCap = plan.limits.freeSessionsPerMonth;
  const usedRatio = Math.min(1, (state.turnsCompleted ?? 0) / turnCap);

  if ((state.turnsCompleted ?? 0) >= turnCap) {
    return { gated: true, at: 'turn_cap', usedRatio: 1, plan };
  }
  if ((state.sessionsThisMonth ?? 0) >= sessionCap) {
    return { gated: true, at: 'session_cap', usedRatio: 1, plan };
  }
  return { gated: false, usedRatio, plan };
}

/**
 * Feature access check — used by session config validation.
 */
export function canAccess(planId, feature) {
  const plan = planOf(planId);
  if (!plan.limits) return true; // premium plans: all features
  switch (feature) {
    case 'tier': return true; // checked separately with tier param
    case 'liveRooms': return !!plan.limits.liveRooms;
    case 'panelGauntlet': return !!plan.limits.panelGauntlet;
    case 'fullReport': return !!plan.limits.fullReport;
    default: return true;
  }
}

export function tierAllowed(planId, tier) {
  const plan = planOf(planId);
  if (!plan.limits) return true;
  return (plan.limits.tiers ?? []).includes(Number(tier));
}

export function personaAllowed(planId, personaId) {
  const plan = planOf(planId);
  if (!plan.limits) return true;
  return (plan.limits.personas ?? []).includes(personaId);
}

export function minutesAllowed(planId, minutes) {
  const plan = planOf(planId);
  if (!plan.limits) return true;
  return minutes <= (plan.limits.maxMinutes ?? 30);
}

export function modeAllowed(planId, mode) {
  const plan = planOf(planId);
  if (!plan.limits) return true;
  return (plan.limits.modes ?? []).includes(mode);
}
