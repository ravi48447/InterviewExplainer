/**
 * campaign.mjs — Offer Ready: the 30-day interview campaign.
 *
 * Date-backward, phase-structured plan generation + adaptive re-planning +
 * readiness scoring + certificate data. Consumes every existing mode as the
 * weekly structure. Deterministic; mastery store drives adaptation.
 */

import { getCompanyLoop } from './companies.mjs';

// ---------------- phases ----------------

export const PHASES = {
  FOUNDATION: { id: 'foundation', label: 'Foundation', color: 'emerald', blurb: 'Weak concepts → strength. Daily short drills, DSA basics, redemption auto-queued.' },
  DEPTH: { id: 'depth', label: 'Depth', color: 'blue', blurb: 'Live coding + system design at your gap areas. Calibration coaching begins.' },
  PRESSURE: { id: 'pressure', label: 'Pressure', color: 'amber', blurb: 'Tier 4/5 sessions, rapid drills, peer role-swap. Performance under stress.' },
  REHEARSAL: { id: 'rehearsal', label: 'Rehearsal', color: 'violet', blurb: 'Full company loop + patch session on what broke. Then rest.' },
};

const PHASE_ORDER = ['foundation', 'depth', 'pressure', 'rehearsal'];

function phaseForDay(dayIndex, totalDays) {
  // proportional split with rehearsal always last 2-3 days
  const r = totalDays <= 10 ? 1 : totalDays <= 21 ? 2 : 3;
  const remaining = totalDays - r;
  if (dayIndex >= totalDays - r) return 'rehearsal';
  const p = dayIndex / remaining;
  if (p < 0.35) return 'foundation';
  if (p < 0.7) return 'depth';
  return 'pressure';
}

// ---------------- day generation ----------------

/**
 * Generate a campaign.
 * opts: { interviewDate (ISO), company?, level ('fresher'|'intermediate'),
 *         domains[], minutesPerDay, daysPerWeek, campaignDays (default ~28) }
 */
export function generateCampaign(opts, masterySnapshot = {}) {
  const interview = new Date(opts.interviewDate);
  if (isNaN(interview.getTime())) throw new Error('bad_interview_date');
  const level = opts.level === 'intermediate' ? 'intermediate' : 'fresher';
  const domains = (opts.domains?.length ? opts.domains : ['ruby-backend-fresher']).slice(0, 3);
  const minutesPerDay = [15, 30, 45, 60].includes(Number(opts.minutesPerDay)) ? Number(opts.minutesPerDay) : 30;
  const daysPerWeek = [3, 4, 5, 6].includes(Number(opts.daysPerWeek)) ? Number(opts.daysPerWeek) : 5;

  // backward from interview date (D-1), skipping nothing (rest days are explicit)
  const totalDays = Math.min(Math.max(Number(opts.campaignDays) || inferDays(interview), 7), 45);
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(interview);
    date.setDate(date.getDate() - (totalDays - i));
    const isDMinus1 = i === totalDays - 1;
    const phase = phaseForDay(i, totalDays);
    const dayOfWeek = date.getDay();
    // weekly rest: honor daysPerWeek (5 -> weekend off, 6 -> sunday off, 3/4 -> spread rest)
    let activeDay = true;
    if (daysPerWeek === 5 && (dayOfWeek === 0 || dayOfWeek === 6)) activeDay = false;
    else if (daysPerWeek === 6 && dayOfWeek === 0) activeDay = false;
    else if (daysPerWeek === 3 && dayOfWeek % 2 === 0) activeDay = false; // mon/wed/fri
    else if (daysPerWeek === 4 && (dayOfWeek === 0 || dayOfWeek === 3)) activeDay = false;

    let dayType = 'drill';
    let title = '';
    let oneThing = '';
    let sessionSpecs = [];

    if (isDMinus1) {
      dayType = 'dress_rehearsal';
      title = 'Dress rehearsal — the full loop';
      oneThing = 'Run the complete company loop at your real interview time-of-day. Then sleep.';
      sessionSpecs = [{ mode: 'company-loop', company: opts.company, level, minutes: 180 }];
    } else if (!activeDay) {
      dayType = 'rest';
      title = 'Recovery day';
      oneThing = pickRestThing(masterySnapshot, i);
      sessionSpecs = [{ mode: 'review', minutes: 10 }];
    } else {
      const spec = daySpecForPhase(phase, { minutesPerDay, level, domains, masterySnapshot, seed: i, company: opts.company });
      dayType = spec.dayType;
      title = spec.title;
      oneThing = spec.oneThing;
      sessionSpecs = spec.sessionSpecs;
    }

    days.push({
      date: date.toISOString().slice(0, 10),
      index: i,
      phase,
      dayType,
      title,
      oneThing,
      sessionSpecs,
      estMinutes: sessionSpecs.reduce((a, s) => a + (s.minutes ?? 0), 0),
      status: date < today ? 'missed' : 'planned',
    });
  }

  return {
    id: `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
    interviewDate: interview.toISOString().slice(0, 10),
    company: opts.company ?? null,
    companyName: opts.company ? getCompanyLoop(opts.company, level)?.companyName ?? null : null,
    level,
    domains,
    minutesPerDay,
    daysPerWeek,
    days,
    completedSessions: 0,
    readinessHistory: [],
    status: 'active',
  };
}

function inferDays(interview) {
  const days = Math.ceil((interview.getTime() - Date.now()) / 86400000);
  return Math.min(Math.max(days, 7), 45);
}

/** what a phase-day contains */
function daySpecForPhase(phase, ctx) {
  const { minutesPerDay, level, domains, masterySnapshot, seed, company } = ctx;
  const weakest = weakestConcepts(masterySnapshot, domains, 3);

  if (phase === 'foundation') {
    // alternate: weakness drill / DSA / redemption
    const kind = seed % 3;
    if (kind === 0) return {
      dayType: 'drill', title: 'Weakness drill',
      oneThing: weakest.length ? `Redeem: ${weakest[0].label}` : 'One focused quick mock',
      sessionSpecs: [{ mode: 'quick', domain: domains[0], minutes: Math.min(minutesPerDay, 15) + 10 }],
    };
    if (kind === 1) return {
      dayType: 'dsa', title: 'DSA practice',
      oneThing: 'One DSA problem + complexity defense',
      sessionSpecs: [{ mode: 'dsa', domain: domains[0], minutes: Math.max(30, minutesPerDay) }],
    };
    return {
      dayType: 'redemption', title: 'Redemption round',
      oneThing: weakest[1] ? `Face it again: ${weakest[1].label}` : 'Re-attempt last session misses',
      sessionSpecs: [{ mode: 'quick', weaknessPriority: true, minutes: Math.min(minutesPerDay, 20) }],
    };
  }

  if (phase === 'depth') {
    const kind = seed % 3;
    if (kind === 0) return {
      dayType: 'live-coding', title: 'Live coding round',
      oneThing: 'Code with camera on, then defend the dry-run',
      sessionSpecs: [{ mode: 'live-coding', domain: domains[0], minutes: Math.max(45, minutesPerDay) }],
    };
    if (kind === 1) return {
      dayType: 'system-design', title: 'System design',
      oneThing: 'One architecture problem at scale',
      sessionSpecs: [{ mode: 'system-design', domain: domains[0], minutes: Math.max(45, minutesPerDay) }],
    };
    return {
      dayType: 'behavioral', title: 'Behavioral depth',
      oneThing: 'STAR stories with metrics — get challenged',
      sessionSpecs: [{ mode: 'behavioral', minutes: Math.min(30, minutesPerDay) + 10 }],
    };
  }

  if (phase === 'pressure') {
    const kind = seed % 4;
    if (kind === 0) return {
      dayType: 'adversarial', title: 'Adversarial round',
      oneThing: 'Tier-4 skeptic — hold your ground',
      sessionSpecs: [{ mode: 'full', tier: 4, minutes: Math.max(30, minutesPerDay) }],
    };
    if (kind === 1) return {
      dayType: 'rapid', title: 'Rapid fire',
      oneThing: 'Crispness under time pressure',
      sessionSpecs: [{ mode: 'rapid', minutes: 15 }],
    };
    if (kind === 2) return {
      dayType: 'peer', title: 'Peer role-swap',
      oneThing: 'Interview someone else — learn from the other chair',
      sessionSpecs: [{ mode: 'peer', minutes: 30 }],
    };
    return {
      dayType: 'full-mock', title: 'Full mock',
      oneThing: 'Complete mixed interview, tier 3',
      sessionSpecs: [{ mode: 'full', tier: 3, minutes: Math.max(45, minutesPerDay) }],
    };
  }

  // rehearsal phase (non-dress days)
  return {
    dayType: 'company-loop', title: 'Company loop run',
    oneThing: company ? `Full ${company} loop — find what breaks` : 'Full generic loop at your level',
    sessionSpecs: [{ mode: 'company-loop', company, level, minutes: 120 }],
  };
}

function weakestConcepts(mastery, domains, count) {
  const entries = Object.entries(mastery ?? {})
    .filter(([, rec]) => typeof rec === 'object' && rec !== null)
    .map(([id, rec]) => ({ id, label: id.replace(/-/g, ' '), strength: rec.strength ?? 0, lastAt: rec.lastAt ?? 0 }))
    .sort((a, b) => a.strength - b.strength);
  return entries.slice(0, count);
}

function pickRestThing(mastery, seed) {
  const things = [
    'Light review only — skim your last report, no testing. Recovery consolidates.',
    'Rest. Seriously — spacing beats cramming. Optionally re-read one expert answer.',
    'Read your win journal from past sessions. Confidence is trainable too.',
    'Off day. If you must: 10 minutes of flashcard-style concept recall, nothing scored.',
  ];
  return things[seed % things.length];
}

// ---------------- readiness ----------------

/**
 * Campaign readiness: 0-100 with receipts.
 * inputs: coverageRatio (analytics), recentTrend (last-7d avg score),
 *         calibrationBias (psychology), rehearsalBest (best loop score)
 */
export function computeReadiness({ coverageRatio = 0, recentTrend = 0, calibrationBias = 0, rehearsalBest = null }) {
  const coverage = Math.max(0, Math.min(1, coverageRatio));
  const trend = Math.max(0, Math.min(1, recentTrend / 100));
  const calibration = Math.max(0, Math.min(1, 1 - Math.abs(calibrationBias) / 50));
  const rehearsal = rehearsalBest == null ? 0 : Math.max(0, Math.min(1, rehearsalBest / 100));

  const value = Math.round(
    (0.4 * coverage + 0.3 * trend + 0.2 * calibration + 0.1 * rehearsal) * 100
  );
  return {
    value,
    components: {
      coverage: { weight: 0.4, value: Math.round(coverage * 100), receipt: 'importance-weighted concept evidence (decayed)' },
      trend: { weight: 0.3, value: Math.round(trend * 100), receipt: 'last 7 days session average' },
      calibration: { weight: 0.2, value: Math.round(calibration * 100), receipt: 'prediction accuracy across sessions' },
      rehearsal: { weight: 0.1, value: Math.round(rehearsal * 100), receipt: rehearsalBest == null ? 'no full loop run yet' : `best loop: ${rehearsalBest}` },
    },
  };
}

// ---------------- adaptive re-planning ----------------

/**
 * After a day completes: recompute upcoming day specs given fresh mastery.
 * Mutates campaign.days (only future planned days).
 */
export function replanUpcomingDays(campaign, masterySnapshot, todayIso) {
  const today = todayIso ?? new Date().toISOString().slice(0, 10);
  let changed = 0;
  for (const day of campaign.days) {
    if (day.status !== 'planned' || day.date <= today) continue;
    if (day.dayType === 'dress_rehearsal' || day.dayType === 'rest') continue;
    const phase = day.phase;
    const spec = daySpecForPhase(phase, {
      minutesPerDay: campaign.minutesPerDay,
      level: campaign.level,
      domains: campaign.domains,
      masterySnapshot,
      seed: day.index,
      company: campaign.company,
    });
    if (spec.oneThing !== day.oneThing || spec.dayType !== day.dayType) changed++;
    Object.assign(day, { dayType: spec.dayType, title: spec.title, oneThing: spec.oneThing, sessionSpecs: spec.sessionSpecs });
  }
  return { changed };
}

/**
 * Phase gate: can the user progress to the next phase?
 * Honest gate on foundation coverage.
 */
export function phaseGate(campaign, coverageRatio) {
  const nextPhase = (p) => PHASE_ORDER[Math.min(PHASE_ORDER.indexOf(p) + 1, PHASE_ORDER.length - 1)];
  const current = campaign.currentPhase ?? 'foundation';
  if (current === 'foundation' && coverageRatio < 0.35) {
    return { allowed: false, next: 'depth', reason: `Foundation coverage is ${Math.round(coverageRatio * 100)}% — extend foundation a couple days before pressure work. Receipts: importance-weighted concept evidence.` };
  }
  return { allowed: true, next: nextPhase(current) };
}

/** Mark a day complete; update campaign stats + readiness. */
export function completeDay(campaign, dayDate, sessionResult = {}) {
  const day = campaign.days.find((d) => d.date === dayDate);
  if (day) day.status = 'completed';
  campaign.completedSessions += 1;
  const readiness = computeReadiness({
    coverageRatio: sessionResult.coverageRatio ?? 0,
    recentTrend: sessionResult.recentTrend ?? sessionResult.score ?? 0,
    calibrationBias: sessionResult.calibrationBias ?? 0,
    rehearsalBest: sessionResult.rehearsalBest ?? null,
  });
  campaign.readinessHistory.push({ ts: Date.now(), value: readiness.value });
  campaign.currentPhase = day?.phase ?? campaign.currentPhase;
  return readiness;
}

// ---------------- certificate ----------------

export function certificateData(campaign, finalReadiness) {
  const conceptsTouched = campaign.readinessHistory.length;
  const daysDone = campaign.days.filter((d) => d.status === 'completed').length;
  const loopsRun = campaign.days.filter((d) => d.dayType === 'company-loop' || d.dayType === 'dress_rehearsal').filter((d) => d.status === 'completed').length;
  return {
    campaignId: campaign.id,
    company: campaign.companyName ?? 'Your target role',
    interviewDate: campaign.interviewDate,
    level: campaign.level,
    daysCompleted: daysDone,
    sessionsCompleted: campaign.completedSessions,
    loopsRun,
    finalReadiness,
    readinessArc: campaign.readinessHistory.map((r) => r.value),
    line: `You've completed ${campaign.completedSessions} sessions and ${loopsRun} full loop${loopsRun === 1 ? '' : 's'}. Walk in like you've been there — because you have.`,
    issuedAt: new Date().toISOString(),
  };
}
