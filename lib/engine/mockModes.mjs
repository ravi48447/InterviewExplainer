/**
 * mockModes.mjs — the Mock Interview feature menu.
 *
 * One product, every convenience: quick, rapid, DSA, live-coding (with dry-run
 * debate), system design, full mock, and company loops. Each mode is a
 * pre-resolved engine configuration (mode/duration/tier/persona/domain
 * defaults + params) so the UI is a menu and the engine needs no new brain.
 *
 * Internal question selection stays the Director's job (gap-ranked,
 * adaptive); this registry only shapes the session.
 */

export const MOCK_MODES = [
  {
    id: 'quick',
    name: 'Quick Mock',
    tagline: '15 min · 5 questions · one weak area',
    icon: 'zap',
    gradient: 'from-blue-500 to-cyan-400',
    minutes: 15, questionCount: 5, engineMode: 'technical', tier: 1, persona: 'mentor',
    description: 'Warm-up or targeted drill. The engine picks your weakest concepts.',
    plan: 'free',
    params: { weaknessPriority: true },
  },
  {
    id: 'rapid',
    name: 'Rapid Fire',
    tagline: '10 min · many questions · fast pace',
    icon: 'flame',
    gradient: 'from-orange-500 to-red-400',
    minutes: 10, questionCount: 12, engineMode: 'technical', tier: 3, persona: 'rapid',
    description: 'Raj\'s rapid-fire round: short questions, instant follow-ups, no time to ramble. Trains crispness.',
    plan: 'free',
    params: { perQuestionSeconds: 45, interrupt: true },
  },
  {
    id: 'dsa',
    name: 'DSA Mock',
    tagline: '45 min · algorithms · complexity debate',
    icon: 'binary',
    gradient: 'from-violet-500 to-purple-400',
    minutes: 45, questionCount: 6, engineMode: 'coding', tier: 2, persona: 'skeptic',
    description: 'Data structures & algorithms round: code, then defend complexity. Dry-run debate included.',
    plan: 'free',
    params: { codingFirst: true },
  },
  {
    id: 'live-coding',
    name: 'Live Coding Round',
    tagline: '45 min · camera on · write + defend',
    icon: 'code',
    gradient: 'from-emerald-500 to-teal-400',
    minutes: 45, questionCount: 4, engineMode: 'coding', tier: 3, persona: 'detail',
    description: 'The real coding interview: camera on, expert problem, code it, then the dry-run gauntlet — trace, complexity, edge cases.',
    plan: 'interview_pass',
    params: { camera: 'required', dryRun: true, codeDiscussion: true },
  },
  {
    id: 'system-design',
    name: 'System Design Mock',
    tagline: '45 min · architecture · trade-off gauntlet',
    icon: 'layers',
    gradient: 'from-indigo-500 to-blue-400',
    minutes: 45, questionCount: 5, engineMode: 'technical', tier: 4, persona: 'architect',
    description: 'Sofia\'s architecture round: scale questions, capacity math, every answer meets "at what scale?"',
    plan: 'interview_pass',
    params: { designFocus: true },
  },
  {
    id: 'behavioral',
    name: 'Behavioral Mock',
    tagline: '30 min · STAR stories · pushback',
    icon: 'message',
    gradient: 'from-rose-500 to-pink-400',
    minutes: 30, questionCount: 6, engineMode: 'behavioral', tier: 3, persona: 'skeptic',
    description: 'Leadership-principles energy: every story probed for metrics, your specific role, and what you\'d change.',
    plan: 'free',
    params: { starTracking: true },
  },
  {
    id: 'full',
    name: 'Full Mock Interview',
    tagline: '60 min · 20 questions · everything mixed',
    icon: 'brain',
    gradient: 'from-amber-500 to-orange-400',
    minutes: 60, questionCount: 20, engineMode: 'mixed', tier: 3, persona: 'skeptic',
    description: 'The complete interview: technical + coding + behavioral mixed, adapting to you the whole way.',
    plan: 'interview_pass',
    params: {},
  },
  {
    id: 'warmup',
    name: 'Pre-Interview Warm-Up',
    tagline: '5 min · calm · zero scoring · morning-of',
    icon: 'flame',
    gradient: 'from-amber-500 to-orange-400',
    minutes: 5, questionCount: 3, engineMode: 'technical', tier: 1, persona: 'mentor',
    description: 'For the morning of the real thing: breathing, three easy questions from your win areas, and your win journal. No scores, no pressure — just rhythm.',
    plan: 'free',
    params: { warmupRitual: true, noScoring: true, winJournal: true, easyOnly: true },
  },
  {
    id: 'company',
    name: 'Company Loop',
    tagline: 'Real companies · 3-5 sequential rounds',
    icon: 'building',
    gradient: 'from-amber-500 to-red-400',
    minutes: 0, questionCount: 0, engineMode: 'mixed', tier: 3, persona: 'panelist',
    description: 'Pick from 97 companies — Google to DE Shaw to TCS. The actual round sequence at your level, camera rounds included.',
    plan: 'interview_pro',
    params: { runner: '/mock-interviews/company' },
    isLink: true,
    href: '/mock-interviews/company',
  },
];

export function getMockMode(id) {
  return MOCK_MODES.find((m) => m.id === id) ?? MOCK_MODES[0];
}

/** Resolve a mode into engine params (the audio page consumes this via URL). */
export function modeToParams(id, domain) {
  const m = getMockMode(id);
  if (m.isLink) return { href: m.href };
  const preset = m.minutes <= 15 ? 'quick' : m.minutes <= 35 ? 'standard' : 'deep';
  return {
    href: `/mock-interviews/audio?mode=${m.engineMode}&preset=${preset}&tier=${m.tier}&persona=${m.persona}&domain=${domain}&count=${m.questionCount}`,
    params: m.params,
  };
}
