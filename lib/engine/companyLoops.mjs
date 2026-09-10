/**
 * companyLoops.mjs — company-archetype interview loop simulators.
 * Config over the existing Director: question mix, persona rotation, pacing,
 * and a day-before rehearsal scheduler. Interview Pro feature.
 *
 * No new engine — each loop is a parameterized session sequence.
 */

export const COMPANY_LOOPS = {
  amazon: {
    id: 'amazon',
    name: 'Amazon Loop',
    tagline: 'Leadership-principles heavy, bar-raiser energy',
    plan: 'interview_pro',
    rounds: [
      { label: 'Screen', minutes: 15, mode: 'technical', tier: 2, personas: ['skeptic'] },
      { label: 'LP Round 1', minutes: 30, mode: 'behavioral', tier: 3, personas: ['detail'] },
      { label: 'LP Round 2 (Bar Raiser)', minutes: 30, mode: 'behavioral', tier: 4, personas: ['skeptic', 'silent'] },
      { label: 'System Design', minutes: 30, mode: 'technical', tier: 4, personas: ['architect'] },
      { label: 'Coding', minutes: 45, mode: 'coding', tier: 3, personas: ['rapid'] },
    ],
    emphasis: 'Every behavioral answer needs STAR with metrics. "Tell me about a time you disagreed…" will come.',
  },
  google: {
    id: 'google',
    name: 'Google Loop',
    tagline: 'DSA-heavy, collaborative, calm but deep',
    plan: 'interview_pro',
    rounds: [
      { label: 'Phone Screen', minutes: 30, mode: 'coding', tier: 2, personas: ['mentor'] },
      { label: 'Coding 1', minutes: 45, mode: 'coding', tier: 3, personas: ['detail'] },
      { label: 'Coding 2', minutes: 45, mode: 'coding', tier: 4, personas: ['skeptic'] },
      { label: 'System Design', minutes: 45, mode: 'technical', tier: 4, personas: ['architect'] },
      { label: 'Googleyness', minutes: 30, mode: 'behavioral', tier: 2, personas: ['silent'] },
    ],
    emphasis: 'Think out loud the whole time — they grade collaboration as much as correctness.',
  },
  startup: {
    id: 'startup',
    name: 'Startup Pragmatic',
    tagline: 'Fast, practical, build-something energy',
    plan: 'interview_pro',
    rounds: [
      { label: 'Founder Chat', minutes: 20, mode: 'behavioral', tier: 2, personas: ['rapid'] },
      { label: 'Practical Coding', minutes: 45, mode: 'coding', tier: 3, personas: ['rapid'] },
      { label: 'Build Review', minutes: 30, mode: 'technical', tier: 3, personas: ['detail'] },
    ],
    emphasis: 'Ship-mindedness. "What would you build first?" matters more than big-O.',
  },
};

export function getLoop(id) {
  return COMPANY_LOOPS[id] ?? null;
}

/**
 * Day-before rehearsal: given a real interview date, produce a rehearsal
 * schedule ending the day before. Deterministic date math.
 */
export function rehearsalSchedule(loopId, interviewDateIso, dailyMinutes = 90) {
  const loop = getLoop(loopId);
  if (!loop) return null;
  const interview = new Date(interviewDateIso);
  if (isNaN(interview.getTime())) return null;

  // lay rounds into days, walking backward from D-1, respecting daily budget
  const days = [];
  let current = new Date(interview);
  current.setDate(current.getDate() - 1);
  let day = { date: new Date(current), rounds: [], minutes: 0 };
  for (const round of [...loop.rounds].reverse()) {
    if (day.minutes + round.minutes > dailyMinutes) {
      days.unshift(day);
      current.setDate(current.getDate() - 1);
      day = { date: new Date(current), rounds: [], minutes: 0 };
    }
    day.rounds.unshift(round);
    day.minutes += round.minutes;
  }
  days.unshift(day);

  return {
    loopId,
    loopName: loop.name,
    interviewDate: interview.toISOString().slice(0, 10),
    days: days.map((d) => ({
      date: d.date.toISOString().slice(0, 10),
      label: d.date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      rounds: d.rounds,
      minutes: d.minutes,
    })),
    emphasis: loop.emphasis,
    note: 'Each round opens the real engine: same personas, same pressure, same scoring.',
  };
}
