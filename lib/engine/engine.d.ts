/**
 * engine.d.ts — ambient types for the .mjs engine modules.
 * The engine is authored in plain ESM (node-runnable, zero deps); these
 * declarations give TypeScript (and next build) the shapes every route needs.
 */

declare module '*.mjs' {
  const value: any;
  export default value;
}

declare module '@/lib/engine/text.mjs' {
  export function normalize(s: string): string;
  export function tokenize(s: string): string[];
  export function canon(s: string): string;
  export function termFreq(tokens: string[]): Map<string, number>;
  export function stemMatch(a: string, b: string): boolean;
}

declare module '@/lib/engine/contentIndex.mjs' {
  export function buildIndex(dir: string): any;
  export function loadIndex(p: string): Promise<any>;
}

declare module '@/lib/engine/server.mjs' {
  export interface LeanQuestion {
    id: string;
    domain: string;
    module?: string;
    topic?: string;
    question?: string;
    title?: string;
    difficulty?: string;
    importance?: string;
    concepts?: string[];
    conceptLabels?: string[];
    readingMinutes?: number;
    codeExampleLines?: number;
    learnUrl?: string;
  }
  export interface LeanIndex {
    questions: LeanQuestion[];
    byDomain: Record<string, Record<string, string[]>>;
    concepts: { id: string; label: string; topics?: string[]; domains?: string[] }[];
    conceptIndex: { id: string; topics: string[]; label?: string }[];
    crossLinks: Record<string, { to: string; shared: number }[]>;
    domains: string[];
  }
  export interface Rubric {
    id: string; domain: string; module?: string; topic?: string;
    question?: string; title?: string; difficulty?: string;
    concepts?: string[]; conceptLabels?: string[];
    mistakes?: string[]; direct?: string; spoken?: string; deep?: string;
    probes?: { kind: string; id: string; text: string }[];
    tradeoffs?: string[][]; tradeoffColumns?: string[];
    codeExample?: string; learnUrl?: string; codingLang?: string;
    isBehavioral?: boolean; isCoding?: boolean; starterCode?: string;
    question?: string; title?: string; importance?: string; id?: string; domain?: string;
  }
  export function loadRubrics(): Record<string, Rubric>;
  export function loadLeanIndex(): LeanIndex;
  export function getQuestion(id: string): Rubric | null;
  export function reconstructDirector(sessionId: string, body: unknown): Promise<{ ok: true; director: any; rubric: Rubric } | { ok: false; error: string }>;
}

declare module '@/lib/engine/ave.mjs' {
  export interface AveResult {
    score: number;
    coverage: { hit: string[]; missed: string[]; ratio: number };
    depth: number;
    structure: number;
    communication: number | null;
    mistakeFlags: string[];
    signal: 'stronger_than_expected' | 'on_track' | 'shaky' | 'lost' | 'gated';
    suggested: { spoken: string; deep: string; checklist: string[] };
    nextDrills: string[];
  }
  export function verifyTurn(transcript: string, rubric: any, opts?: { isBehavioral?: boolean; meta?: any }): AveResult;
  export function withAliases(tokens: string[]): string[];
}

declare module '@/lib/engine/director.mjs' {
  export class Director {
    constructor(opts: any);
    index: any;
    mode: string;
    interviewMode: string;
    preset: string;
    maxQuestions: number;
    queue: any[];
    state: {
      asked: Set<string>;
      askedList: any[];
      spokenConcepts: Set<string>;
      dodged: any[];
      streak: { strong: number; weak: number };
      turn: number;
      moveLog?: any[];
    };
    open(): { move: string; question: any; rendered: string; moveLog: any[] };
    turn(answerResult: { question: any; ave: any }, transcriptMeta?: { transcript?: string }): { move: string; question: any; rendered: string; moveLog: any[] };
    report(turnResults: any[]): any;
    wrap(reason: string): { move: string; question: null; rendered: string; moveLog: any[] };
  }
  export function buildSessionQueue(opts: any): any[];
  export function mulberry32(seed: number): () => number;
}

declare module '@/lib/engine/skills.mjs' {
  export function buildSkillDictionary(lean: any): { terms: { id: string; label: string; topics: string[] }[]; aliasIndex: Map<string, string> };
  export function matchSkills(text: string, dict: any): { matched: { id: string; label: string; topics: string[] }[]; topicIds: Set<string> };
}

declare module '@/lib/engine/resume.mjs' {
  export function readiness(domain: string, conceptIds: string[], evidence: Record<string, number>): { domain: string; conceptCount: number; covered: number; partial: number; missing: number; ratio: number; score: number } | null;
  export function hygieneCheck(text: string): { score: number; checks: { id: string; label: string; ok: boolean; detail: string }[] };
}

declare module '@/lib/engine/sessionConfig.mjs' {
  export function gentleBand(score: number): { band: string; tone: string; line: string };
  export function hardBand(score: number): { band: string; line: string; strict: boolean };
  export function sessionFreshness(questions: any[], askedHistory: Iterable<string> | null | undefined, conceptHistory?: string[]): { questionCount: number; freshQuestions: number; freshRatio: number; newConcepts: number; label: string };
  export function starAnalysis(answer: string): { have: string[]; missing: string[]; ratio: number; probe: string | null; structureScore: number };
  export function rubricPreview(question: any): { checklist: string[]; fullCount: number; weights: { part: string; weight: string; detail: string }[]; honesty: string };
  export function verifyCode(code: string, rubric: any, fetchImpl?: any): { score: number; checks: any[]; passed: number; total: number; band: any };
}

declare module '@/lib/engine/parse.mjs' {
  export function parseResumeFile(buf: Buffer): { text: string; method: string; words: number; alphaRatio: number; confidence: string } | null;
}

declare module '@/lib/engine/mastery.mjs' {
  export function recordEvidence(conceptIds: string[], type: string, meta?: any): void;
  export function coverageOf(conceptIds: string[]): { ratio: number; weak: string[]; strong: string[]; perConcept: Record<string, number> };
  export function nextBestAction(domainConcepts: Record<string, string[]>): { domain: string; kind: string; score: number; concepts: string[]; cta: string } | null;
}

declare module '@/lib/engine/persist.mjs' {
  export function saveSessionRecord(record: any): void;
  export function getSessionRecords(): any[];
  export function getSessionRecord(id: string): any;
  export function streakInfo(): { days: number; lastDate: number | null };
  export function scoreTrend(limit?: number): any[];
  export function getProfile(): any;
  export function saveProfile(patch: any): any;
  export function getLatestResumeAnalysis(): any;
  export function syncToServer(): Promise<{ ok: boolean }>;
  export function syncFromServer(): Promise<{ ok: boolean }>;
  export function saveFullReport(sessionId: string, report: any): any;
  export function getFullReport(sessionId: string): any;
  export function saveCompanyLoopState(state: any): void;
  export function getCompanyLoopState(): any;
  export function clearCompanyLoopState(): void;
}

declare module '@/lib/engine/personas.mjs' {
  export interface Persona {
    id: string; name: string; title: string;
    voice: { rate: number; pitch: number };
    style: string; pushback: number;
    interruptRambleAt: number; silenceNudgeAt: number;
    moveWeights: Record<string, number>;
    acknowledgments: string[]; interjections: string[];
    color: string;
  }
  export function getPersona(id: string): Persona;
  export const PERSONA_LIST: { id: string; name: string; title: string; style: string; color: string }[];
  export function getTier(n: number): { id: number; label: string; persona: string; perQuestionSeconds: number | null; [k: string]: any };
}

declare module '@/lib/engine/psychology.mjs' {
  export function calibrationAnalysis(store: any[]): { ready: boolean; n: number; bias: number; recentBias?: number; direction?: string; note: string };
}

declare module '@/lib/engine/gating.mjs' {
  export const PLANS: Record<string, {
    id: string; name: string; priceInr: number; tagline: string;
    limits: Record<string, unknown> | null;
    features?: string[];
  }>;
  export function gateDecision(state: { plan?: string; turnsCompleted?: number; sessionsThisMonth?: number }): { gated: boolean; at?: string; usedRatio: number };
  export function tierAllowed(planId: string, tier: number): boolean;
  export function personaAllowed(planId: string, personaId: string): boolean;
  export function minutesAllowed(planId: string, minutes: number): boolean;
  export function modeAllowed(planId: string, mode: string): boolean;
}

declare module '@/lib/engine/codeDiscuss.mjs' {
  export function pickDiscussionPoints(code: string, rubric: any, count?: number): { kind: string; weight: number; question: string }[];
  export function evaluateExplanation(answer: string, point: any, rubric: any): { score: number; addressed: number; grounded: number; followUp: string | null };
}

declare module '@/lib/engine/matching.mjs' {
  export function joinQueue(entry: any): any;
  export function checkMatch(userId: string): any;
  export function leaveQueue(userId: string): any;
  export function scoreInterviewer(data: any): { score: number; feedback: string; variety: number; depth: number };
  export function queueStats(): { waiting: number; byDomain: Record<string, number>; avgWaitSeconds: number; activeMatches: number };
}

declare module '@/lib/engine/companyLoops.mjs' {
  export const COMPANY_LOOPS: Record<string, {
    id: string; name: string; tagline: string; plan: string;
    rounds: { label: string; minutes: number; mode: string; tier: number; personas: string[] }[];
    emphasis: string;
  }>;
  export function getLoop(id: string): any;
  export function rehearsalSchedule(loopId: string, date: string, dailyMinutes?: number): any;
}

declare module '@/lib/engine/companies.mjs' {
  export interface CompanyLoopRound {
    index: number; label: string; minutes: number; mode: string;
    tier: number; persona: string; camera: string; note?: string;
    toughness: number; company: string;
  }
  export interface CompanyLoop {
    companyId: string; companyName: string; archetypeName: string;
    level: string; toughness: number; note: string;
    totalMinutes: number; rounds: CompanyLoopRound[];
  }
  export const COMPANY_LIST: { id: string; name: string; archetype: string; archetypeName: string; toughness: number; levels: string[]; note: string; roundCount: { fresher: number; intermediate: number } }[];
  export function getCompanyLoop(companyId: string, level: string): CompanyLoop | null;
  export function browseCompanies(opts?: { archetype?: string; level?: string; search?: string; limit?: number }): any[];
  export const ARCHETYPE_LIST: { id: string; name: string; description: string; levels: string[] }[];
}

declare module '@/lib/engine/dryRun.mjs' {
  export interface DryRunChallenge {
    id: string; kind: string; weight: number; question: string; expects: string[];
  }
  export function pickDryRunChallenges(code: string, rubric: any, count?: number, seed?: number): DryRunChallenge[];
  export function evaluateDryRunAnswer(answer: string, challenge: any): { score: number; signals: Record<string, boolean>; followUp: string | null };
  export function debateCounter(answer: string, challenge: any, evalResult: any): { counter: string | null; move: string };
}

declare module '@/lib/engine/mockModes.mjs' {
  export interface MockModeDef {
    id: string; name: string; tagline: string; icon: string; gradient: string;
    minutes: number; questionCount: number; engineMode: string; tier: number;
    persona: string; description: string; plan: string;
    params: Record<string, unknown>; isLink?: boolean; href?: string;
  }
  export const MOCK_MODES: MockModeDef[];
  export function getMockMode(id: string): MockModeDef;
  export function modeToParams(id: string, domain: string): { href: string; params?: Record<string, unknown> };
}

declare module '@/lib/engine/campaign.mjs' {
  export interface CampaignDay {
    date: string; index: number; phase: string; dayType: string;
    title: string; oneThing: string; sessionSpecs: any[];
    estMinutes: number; status: string;
  }
  export interface Campaign {
    id: string; createdAt: number; interviewDate: string;
    company: string | null; companyName: string | null;
    level: string; domains: string[]; minutesPerDay: number; daysPerWeek: number;
    days: CampaignDay[]; completedSessions: number;
    readinessHistory: { ts: number; value: number }[]; status: string;
    currentPhase?: string;
  }
  export function generateCampaign(opts: any, mastery?: any): Campaign;
  export function computeReadiness(input: any): { value: number; components: Record<string, { weight: number; value: number; receipt: string }> };
  export function replanUpcomingDays(campaign: any, mastery: any, todayIso?: string | null): { changed: number };
  export function completeDay(campaign: any, dayDate: string, sessionResult?: any): any;
  export function phaseGate(campaign: any, coverageRatio: number): { allowed: boolean; next?: string; reason?: string };
  export function certificateData(campaign: any, finalReadiness: number): any;
  export const PHASES: Record<string, { id: string; label: string; color: string; blurb: string }>;
}
