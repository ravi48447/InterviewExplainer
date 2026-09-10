/**
 * personas.mjs — Interviewer Persona System + Pressure Ladder.
 *
 * A persona is a deterministic parameter set over the Director: voice (TTS
 * rate/pitch), transition flavor, pushback frequency, silence tolerance,
 * interruption threshold. Personas + tiers make the SAME engine feel like
 * seven different interviewers at five pressure levels.
 *
 * No LLM — every persona is config + the authored content library.
 */

// ---------------- the personas ----------------
export const PERSONAS = {
  mentor: {
    id: 'mentor',
    name: 'Meera Iyer',
    title: 'Friendly Mentor · Staff Engineer',
    voice: { rate: 0.92, pitch: 1.05 },
    style: 'warm, encouraging, patient',
    pushback: 0.1,            // rarely challenges
    interruptRambleAt: 999,   // never interrupts
    silenceNudgeAt: 12,       // generous silence tolerance (seconds)
    moveWeights: { probe: 1, stretch: 0.7, poke: 0.15, tradeoff: 0.5, scaffold: 1.4 },
    acknowledgments: ['Good thinking.', 'Nice, that helps.', 'I follow — keep going.'],
    interjections: ['Take your time.', "That's a fair start.", "I've seen that work."],
    color: 'emerald',
  },
  skeptic: {
    id: 'skeptic',
    name: 'David Chen',
    title: 'The Skeptic · Principal Engineer',
    voice: { rate: 1.0, pitch: 0.92 },
    style: 'neutral, challenging, evidence-driven',
    pushback: 0.7,
    interruptRambleAt: 45,
    silenceNudgeAt: 6,
    moveWeights: { probe: 1.3, stretch: 1.2, poke: 1.5, tradeoff: 1.2, scaffold: 0.6 },
    acknowledgments: ['Hm.', 'Okay…', "I'll accept that for now.", 'Convince me.'],
    interjections: ["I'm not sure I buy that.", 'That sounds hand-wavy.', 'Show me why that holds.'],
    color: 'amber',
  },
  rapid: {
    id: 'rapid',
    name: 'Raj Malhotra',
    title: 'Rapid-Fire Sysadmin · SRE Lead',
    voice: { rate: 1.18, pitch: 1.0 },
    style: 'fast, crisp, no patience for rambling',
    pushback: 0.4,
    interruptRambleAt: 30,
    silenceNudgeAt: 4,
    moveWeights: { probe: 1.5, stretch: 1.0, poke: 0.8, tradeoff: 1.3, scaffold: 0.7 },
    acknowledgments: ['Okay.', 'Next?', 'Got it — moving.', 'Yep.'],
    interjections: ['Shorter, please.', 'The core? Core of it.', 'Bullet points, go.'],
    color: 'cyan',
  },
  detail: {
    id: 'detail',
    name: 'Dr. Anika Rao',
    title: 'Detail Obsessive · Domain Expert',
    voice: { rate: 0.88, pitch: 1.08 },
    style: 'drills one level deeper than comfortable',
    pushback: 0.5,
    interruptRambleAt: 60,
    silenceNudgeAt: 8,
    moveWeights: { probe: 1.8, stretch: 1.3, poke: 0.9, tradeoff: 0.9, scaffold: 1.0 },
    acknowledgments: ['Interesting.', 'Define that for me.', 'Go on…', "Hmm, that's one reading."],
    interjections: ['Be precise.', 'What exactly happens there?', "I want the exact mechanism."],
    color: 'violet',
  },
  architect: {
    id: 'architect',
    name: 'Sofia Almeida',
    title: 'Senior Architect · Systems',
    voice: { rate: 0.95, pitch: 0.98 },
    style: 'every answer meets "at what scale?"',
    pushback: 0.55,
    interruptRambleAt: 50,
    silenceNudgeAt: 7,
    moveWeights: { probe: 1.2, stretch: 1.5, poke: 0.9, tradeoff: 1.8, scaffold: 0.8 },
    acknowledgments: ['At small scale, sure.', 'Reasonable.', "Trade-offs noted.", 'And at 100x?'],
    interjections: ['At what scale?', 'What breaks first?', 'And when traffic 10x-es?'],
    color: 'blue',
  },
  silent: {
    id: 'silent',
    name: 'Ken Watanabe',
    title: 'The Silent Thinker · Director of Eng',
    voice: { rate: 0.85, pitch: 0.9 },
    style: 'long pauses, minimal acknowledgment — reads you',
    pushback: 0.35,
    interruptRambleAt: 90,
    silenceNudgeAt: 15,
    moveWeights: { probe: 1.0, stretch: 1.0, poke: 0.7, tradeoff: 1.0, scaffold: 0.9 },
    acknowledgments: ['…', '(nods slowly)', '(writes something down)', 'Hm.'],
    interjections: ['(long pause)', '(waits, watching you)', '…Continue, if you like.'],
    color: 'slate',
  },
  panelist: {
    id: 'panelist',
    name: 'Alex Turner',
    title: 'Distracted Panelist · Partner Team',
    voice: { rate: 1.08, pitch: 1.02 },
    style: 'interrupts, re-asks, changes topic mid-thought',
    pushback: 0.6,
    interruptRambleAt: 35,
    silenceNudgeAt: 5,
    moveWeights: { probe: 0.9, stretch: 0.8, poke: 0.9, tradeoff: 0.7, pivot: 1.8, scaffold: 0.8 },
    acknowledgments: ['Mm.', 'Sorry, say that again?', 'Right, right.', '(checking phone) Hm?'],
    interjections: ['Oh — actually, before that:', 'Sorry, different question:', 'Wait, go back.'],
    color: 'rose',
  },
};

export const DEFAULT_PERSONA = 'mentor';

export function getPersona(id) {
  return PERSONAS[id] ?? PERSONAS[DEFAULT_PERSONA];
}

export const PERSONA_LIST = Object.values(PERSONAS).map((p) => ({
  id: p.id, name: p.name, title: p.title, style: p.style, color: p.color,
}));

// ---------------- the pressure ladder ----------------
export const PRESSURE_TIERS = {
  1: {
    id: 1, label: 'Warm-up', persona: 'mentor',
    perQuestionSeconds: null, // no timer
    timerFraming: null,
    interrupt: false, silenceNudges: true, hostilePushback: false,
    description: 'No clock, friendly interviewer. Get comfortable producing answers.',
  },
  2: {
    id: 2, label: 'Standard', persona: 'skeptic',
    perQuestionSeconds: 180,
    timerFraming: 'soft',
    interrupt: true, silenceNudges: true, hostilePushback: false,
    description: 'Real pacing with a clock and a neutral challenger.',
  },
  3: {
    id: 3, label: 'Time pressure', persona: 'rapid',
    perQuestionSeconds: 120,
    timerFraming: 'explicit', // "20 minutes left for the rest"
    interrupt: true, silenceNudges: true, hostilePushback: true,
    description: 'Tight clock, fast pace, pushback. Learn to perform under pressure.',
  },
  4: {
    id: 4, label: 'Adversarial', persona: 'detail',
    perQuestionSeconds: 150,
    timerFraming: 'explicit',
    interrupt: true, silenceNudges: true, hostilePushback: true,
    description: 'A skeptic who drills deeper than comfortable and challenges claims.',
  },
  5: {
    id: 5, label: 'Panel gauntlet', persona: 'panelist',
    perQuestionSeconds: 90,
    timerFraming: 'explicit',
    interrupt: true, silenceNudges: true, hostilePushback: true,
    description: 'Rapid context-switching panel style. The full real-loop feeling.',
  },
};

export function getTier(n) {
  return PRESSURE_TIERS[Math.min(Math.max(Number(n) || 2, 1), 5)];
}

// ---------------- ramble/interruption detection ----------------
/**
 * Should the persona interrupt this in-progress answer?
 * Deterministic: word count vs persona threshold + ramble index.
 */
export function shouldInterrupt(persona, wordsSoFar, conceptHitsSoFar, secondsElapsed) {
  if (!persona || persona.interruptRambleAt === 999) return null;
  const words = wordsSoFar ?? 0;
  const hits = conceptHitsSoFar ?? 0;
  // rambling = lots of words, few concepts
  const ramble = words > 60 && hits === 0;
  const tooLong = words > persona.interruptRambleAt * 3; // ~3 words/sec threshold
  if (ramble || tooLong) {
    const lines = [
      "Let me stop you there — the core of my question was: {refocus}",
      "Okay — I have enough context. Let's refocus: {refocus}",
      "Hold on. What's the ONE key point? {refocus}",
    ];
    return { line: lines[words % lines.length], urgency: ramble ? 'ramble' : 'length' };
  }
  return null;
}

/** Escalating silence prompts. */
export function silenceNudge(persona, seconds) {
  if (seconds < persona.silenceNudgeAt) return null;
  if (seconds < persona.silenceNudgeAt * 2) return 'Take your time.';
  if (seconds < persona.silenceNudgeAt * 3) return 'Still there? We can come back to this one.';
  return "Let's move on — we'll circle back to this.";
}
