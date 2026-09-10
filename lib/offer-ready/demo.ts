/**
 * offer-ready/demo.ts — demo-mode data for the campaign dashboard.
 *
 * When the user isn't logged in (or has no real data), the dashboard renders
 * with realistic seeded data so the page shows its purpose. As real data
 * arrives, each piece swaps out — real evidence always wins.
 */

// deterministic PRNG so the demo is stable across reloads
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 2 | t)) ^ 0;
    return (t >>> 0) / 4294967296;
  };
}

export interface DemoGraphs {
  arc: { ts: number; value: number }[];
  sessionScores: { ts: number; score: number; mode: string; minutes: number }[];
  phaseStats: { phase: string; total: number; done: number; missed: number }[];
  dayTimeline: { date: string; phase: string; dayType: string; status: string }[];
}

/** A realistic 28-day demo campaign, mid-flight (day 14): arc rising 38→61. */
export function demoCampaign() {
  const rand = mulberry(4242);
  const interview = new Date(Date.now() + 14 * 86400000); // 14 days out

  // days: phase by index (28 days, proportional like the real generator)
  const phaseOf = (i: number) =>
    i >= 25 ? 'rehearsal' : i >= 17 ? 'pressure' : i < 9 ? 'foundation' : 'depth';
  const typeOf = (i: number) => {
    const p = phaseOf(i);
    if (i === 27) return 'dress_rehearsal';
    const wk = new Date(Date.now() - (13 - i) * 86400000).getDay();
    if (wk === 0) return 'rest';
    if (p === 'foundation') return i % 3 === 0 ? 'drill' : i % 3 === 1 ? 'dsa' : 'redemption';
    if (p === 'depth') return i % 3 === 0 ? 'live-coding' : i % 3 === 1 ? 'system-design' : 'behavioral';
    return i % 4 === 0 ? 'adversarial' : i % 4 === 1 ? 'rapid' : i % 4 === 2 ? 'peer' : 'full-mock';
  };

  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(interview);
    d.setDate(d.getDate() - (27 - i));
    const past = d.getTime() < Date.now();
    return {
      date: d.toISOString().slice(0, 10),
      index: i,
      phase: phaseOf(i),
      dayType: typeOf(i),
      title: titleFor(typeOf(i)),
      oneThing: oneThingFor(typeOf(i)),
      sessionSpecs: [{ mode: modeFor(typeOf(i)), minutes: typeOf(i) === 'rest' ? 10 : 30 }],
      estMinutes: typeOf(i) === 'rest' ? 10 : 30,
      status: past ? (rand() > 0.15 ? 'completed' : 'missed') : 'planned',
    };
  });

  // readiness arc: 14 completed days, rising with realistic noise
  const arc: { ts: number; value: number }[] = [];
  let v = 38;
  for (let i = 0; i < 14; i++) {
    v += (i % 4 === 3 ? -2 : 3) + rand() * 3; // dips are real
    arc.push({ ts: Date.now() - (13 - i) * 86400000, value: Math.min(62, Math.round(v)) });
  }

  // recent session scores
  const modes = ['technical', 'coding', 'technical', 'behavioral', 'coding', 'technical', 'rapid', 'technical', 'coding', 'behavioral'];
  const sessionScores = modes.map((m, i) => ({
    ts: Date.now() - (9 - i) * 86400000 * 0.7,
    score: Math.round(45 + i * 2.2 + rand() * 20),
    mode: m,
    minutes: [15, 30, 45, 30, 45, 30, 10, 15, 45, 30][i],
  }));

  const phaseStats = ['foundation', 'depth', 'pressure', 'rehearsal'].map((p) => {
    const ds = days.filter((d) => d.phase === p);
    return { phase: p, total: ds.length, done: ds.filter((d) => d.status === 'completed').length, missed: ds.filter((d) => d.status === 'missed').length };
  });

  return {
    campaign: {
      id: 'demo',
      createdAt: Date.now() - 14 * 86400000,
      interviewDate: interview.toISOString().slice(0, 10),
      company: 'demo-company',
      companyName: 'Amazon (demo)',
      level: 'intermediate',
      domains: ['ruby-backend-fresher'],
      minutesPerDay: 30,
      daysPerWeek: 5,
      days,
      completedSessions: 12,
      readinessHistory: arc,
      status: 'active',
      currentPhase: 'depth',
    },
    graphs: { arc, sessionScores, phaseStats, dayTimeline: days.map((d) => ({ date: d.date, phase: d.phase, dayType: d.dayType, status: d.status })) } as DemoGraphs,
    stats: {
      totalSessions: 12,
      minutesPracticed: 348,
      bestScore: 78,
      avgScore: 58,
    },
    readiness: { value: 61 },
    isDemo: true,
  };
}

function titleFor(t: string) {
  return ({
    drill: 'Weakness drill', dsa: 'DSA practice', redemption: 'Redemption round',
    'live-coding': 'Live coding round', 'system-design': 'System design',
    behavioral: 'Behavioral depth', adversarial: 'Adversarial round', rapid: 'Rapid fire',
    peer: 'Peer role-swap', 'full-mock': 'Full mock', 'company-loop': 'Company loop run',
    dress_rehearsal: 'Dress rehearsal — the full loop', rest: 'Recovery day',
  } as Record<string, string>)[t] ?? 'Practice';
}
function oneThingFor(t: string) {
  return ({
    drill: 'Redeem: connection pooling', dsa: 'One problem + complexity defense',
    redemption: 'Face it again: indexes under load', 'live-coding': 'Code with camera on, defend the dry-run',
    'system-design': 'One architecture problem at scale', behavioral: 'STAR stories with metrics',
    adversarial: 'Tier-4 skeptic — hold your ground', rapid: 'Crispness under time pressure',
    peer: 'Interview someone — learn from the other chair', 'full-mock': 'Complete mixed interview',
    'company-loop': 'Full loop — find what breaks', dress_rehearsal: 'The complete loop at your real interview time',
    rest: 'Light review only. Recovery consolidates.',
  } as Record<string, string>)[t] ?? 'One focused session';
}
function modeFor(t: string) {
  return ({ 'live-coding': 'live-coding', 'system-design': 'system-design', behavioral: 'behavioral', rapid: 'rapid', peer: 'peer', 'company-loop': 'company-loop', 'dress_rehearsal': 'company-loop' } as Record<string, string>)[t] ?? 'quick';
}
