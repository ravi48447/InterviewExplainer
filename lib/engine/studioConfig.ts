/**
 * User-facing configuration for every mock-interview entry point.
 *
 * Engine ids stay stable while labels, helper copy, and presentation live in
 * one client-safe module. The studio and the compatibility audio route both
 * consume this file so a deep link cannot describe a different session from
 * the one the engine receives.
 */

export type StudioDomainId =
  | 'java-backend-fresher'
  | 'java-backend-intermediate'
  | 'java-fullstack-fresher'
  | 'java-fullstack-intermediate'
  | 'python-backend-fresher'
  | 'go-fresher'
  | 'ruby-backend-fresher'
  | 'frontend-fresher'
  | 'dsa';

export type StudioPresetId = 'quick' | 'standard' | 'deep';
export type StudioModeId = 'mixed' | 'technical' | 'behavioral' | 'coding';
export type StudioPersonaId = 'mentor' | 'skeptic' | 'rapid' | 'architect' | 'detail' | 'silent';

export const STUDIO_DOMAINS: {
  id: StudioDomainId;
  label: string;
  level: string;
  shortLabel: string;
}[] = [
  { id: 'java-backend-fresher', label: 'Java Backend', level: 'Fresher', shortLabel: 'Java' },
  { id: 'java-backend-intermediate', label: 'Java Backend', level: 'Intermediate', shortLabel: 'Java' },
  { id: 'java-fullstack-fresher', label: 'Java Full Stack', level: 'Fresher', shortLabel: 'Java Full Stack' },
  { id: 'java-fullstack-intermediate', label: 'Java Full Stack', level: 'Intermediate', shortLabel: 'Java Full Stack' },
  { id: 'python-backend-fresher', label: 'Python Backend', level: 'Fresher', shortLabel: 'Python' },
  { id: 'go-fresher', label: 'Go Backend', level: 'Fresher', shortLabel: 'Go' },
  { id: 'ruby-backend-fresher', label: 'Ruby Backend', level: 'Fresher', shortLabel: 'Ruby' },
  { id: 'frontend-fresher', label: 'Frontend', level: 'Fresher', shortLabel: 'Frontend' },
  { id: 'dsa', label: 'Data Structures & Algorithms', level: 'All patterns', shortLabel: 'DSA' },
];

export const STUDIO_PRESETS: {
  id: StudioPresetId;
  label: string;
  minutes: number;
  questions: number;
  description: string;
}[] = [
  { id: 'quick', label: 'Quick warm-up', minutes: 15, questions: 5, description: 'A focused confidence-building round' },
  { id: 'standard', label: 'Standard interview', minutes: 30, questions: 10, description: 'Real pacing with adaptive follow-ups' },
  { id: 'deep', label: 'Full interview', minutes: 60, questions: 20, description: 'A complete mixed-depth rehearsal' },
];

export const STUDIO_MODES: {
  id: StudioModeId;
  label: string;
  shortLabel: string;
  description: string;
  cue: string;
}[] = [
  {
    id: 'technical',
    label: 'Technical interview',
    shortLabel: 'Technical',
    description: 'Concepts, mechanisms, examples, and trade-offs',
    cue: 'Start with the basic idea, then use one small example.',
  },
  {
    id: 'coding',
    label: 'Coding / DSA interview',
    shortLabel: 'Coding / DSA',
    description: 'Solve a real problem, then defend the approach',
    cue: 'Clarify the input, explain the approach, then test an edge case.',
  },
  {
    id: 'behavioral',
    label: 'Behavioral interview',
    shortLabel: 'Behavioral',
    description: 'Structured stories with realistic follow-up questions',
    cue: 'Set the context, make your role clear, and finish with the result.',
  },
  {
    id: 'mixed',
    label: 'Full interview mix',
    shortLabel: 'Full mix',
    description: 'Technical, coding, and behavioral questions together',
    cue: 'Think aloud and make the reasoning behind each decision visible.',
  },
];

export const STUDIO_PERSONAS: {
  id: StudioPersonaId;
  name: string;
  role: string;
  style: string;
  roomDescription: string;
  voice: { rate: number; pitch: number };
  tier: number;
  plan: 'free' | 'interview_pass';
  previewLine: string;
}[] = [
  {
    id: 'mentor',
    name: 'Aisha',
    role: 'Senior Engineer',
    style: 'Warm but thorough',
    roomDescription: 'Gives you space to think, then asks for one level more detail.',
    voice: { rate: 0.96, pitch: 1.05 },
    tier: 1,
    plan: 'free',
    previewLine: 'Take your time. Start with the basic idea, then show me a concrete example.',
  },
  {
    id: 'skeptic',
    name: 'Marcus',
    role: 'Staff Engineer',
    style: 'Skeptical and direct',
    roomDescription: 'Challenges vague claims and follows up when the reasoning is unclear.',
    voice: { rate: 0.98, pitch: 0.92 },
    tier: 2,
    plan: 'free',
    previewLine: 'I will challenge vague claims, so make the reasoning behind your answer clear.',
  },
  {
    id: 'rapid',
    name: 'Priya',
    role: 'Hiring Manager',
    style: 'Fast and interrupting',
    roomDescription: 'Keeps the pace high and asks you to reach the point quickly.',
    voice: { rate: 1.12, pitch: 1 },
    tier: 3,
    plan: 'interview_pass',
    previewLine: 'Keep the answer crisp. I may stop you and ask for the core point.',
  },
  {
    id: 'architect',
    name: 'Dana',
    role: 'Principal Architect',
    style: 'Systems-scale thinking',
    roomDescription: 'Tests assumptions, scale limits, and architecture trade-offs.',
    voice: { rate: 0.92, pitch: 0.95 },
    tier: 4,
    plan: 'interview_pass',
    previewLine: 'Explain the design, then tell me what changes when the traffic grows by one hundred times.',
  },
  {
    id: 'detail',
    name: 'Elena',
    role: 'Tech Lead',
    style: 'Depth over breadth',
    roomDescription: 'Stays on one topic until the mechanism and boundaries are precise.',
    voice: { rate: 0.94, pitch: 1.1 },
    tier: 4,
    plan: 'interview_pass',
    previewLine: 'Be precise about what happens internally and where the explanation stops being true.',
  },
  {
    id: 'silent',
    name: 'The Panel',
    role: 'Silent Judge',
    style: 'Minimal reactions',
    roomDescription: 'Uses long pauses and gives very little reassurance while you answer.',
    voice: { rate: 1, pitch: 1 },
    tier: 5,
    plan: 'interview_pass',
    previewLine: 'You may begin when you are ready.',
  },
];

export const MODE_BLUEPRINTS: Record<
  StudioModeId,
  { label: string; description: string }[]
> = {
  technical: [
    { label: 'Foundation', description: 'Define the idea in plain language' },
    { label: 'Mechanism', description: 'Explain what happens internally' },
    { label: 'Example', description: 'Make it concrete with one case' },
    { label: 'Follow-ups', description: 'Defend limits and trade-offs' },
  ],
  coding: [
    { label: 'Clarify', description: 'Confirm inputs, output, and constraints' },
    { label: 'Approach', description: 'Compare options before coding' },
    { label: 'Implement', description: 'Write and explain the solution' },
    { label: 'Defend', description: 'Dry-run, test, and analyse complexity' },
  ],
  behavioral: [
    { label: 'Context', description: 'Set up the situation without rambling' },
    { label: 'Ownership', description: 'Make your responsibility clear' },
    { label: 'Action', description: 'Explain the decisions you made' },
    { label: 'Result', description: 'Close with impact and learning' },
  ],
  mixed: [
    { label: 'Technical', description: 'Explain core concepts clearly' },
    { label: 'Coding', description: 'Solve and defend one problem' },
    { label: 'Behavioral', description: 'Show ownership through a story' },
    { label: 'Follow-ups', description: 'Handle pressure and topic shifts' },
  ],
};

export function getStudioDomain(id: string | null | undefined) {
  return STUDIO_DOMAINS.find((item) => item.id === id) ?? STUDIO_DOMAINS[0];
}

export function getStudioPreset(id: string | null | undefined) {
  return STUDIO_PRESETS.find((item) => item.id === id) ?? STUDIO_PRESETS[1];
}

export function getStudioMode(id: string | null | undefined) {
  return STUDIO_MODES.find((item) => item.id === id) ?? STUDIO_MODES[0];
}

export function getStudioPersona(id: string | null | undefined) {
  return STUDIO_PERSONAS.find((item) => item.id === id) ?? STUDIO_PERSONAS[1];
}

/**
 * Some legacy source records append a one-sentence answer after the actual
 * question. Keep genuine multi-part questions, but do not read the answer to
 * the candidate as part of the prompt.
 */
export function interviewPrompt(value: unknown): string {
  const text = String(value ?? '').trim();
  const questionEnd = text.indexOf('?');
  if (questionEnd < 0) return text;
  const remainder = text.slice(questionEnd + 1).trim();
  if (!remainder) return text;
  const beginsAnotherQuestion = /^(what|why|how|when|where|which|who|can|could|would|do|does|did|is|are|have|has|should|walk|describe|explain|compare|tell)\b/i.test(remainder);
  return beginsAnotherQuestion ? text : text.slice(0, questionEnd + 1);
}
