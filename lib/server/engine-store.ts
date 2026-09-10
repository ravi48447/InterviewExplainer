/**
 * engine-store.ts — per-user engine data (server-side).
 *
 * Same file-backed pattern as user-store: one JSON per user under .data/engine/.
 * Holds mastery evidence, mock session records, latest resume analysis and an
 * optional profile. The Java backend (user_profiles / user_activity_log /
 * user_streaks tables) is the production swap — same shapes.
 *
 * Server-only.
 */
import fs from 'fs';
import path from 'path';

export interface MasteryRecord {
  strength: number;
  best: 'claimed' | 'studied' | 'spoken' | null;
  lastAt: number;
  hits: number;
}

export interface SessionRecord {
  sessionId: string;
  domain: string | null;
  mode: string;
  preset: string;
  presetMinutes: number;
  overallScore: number;
  turnsCount: number;
  weakConcepts: string[];
  savedAt: number;
}

export interface EngineData {
  profile: { targetRole?: string; experience?: string; focusDomains?: string[] };
  mastery: Record<string, MasteryRecord>;
  sessions: SessionRecord[];
  resume: { savedAt?: number; skills?: string[]; readiness?: unknown; gaps?: unknown[] } | null;
  campaigns?: any[];
}

const DATA_DIR = path.join(process.cwd(), '.data', 'engine');

function fileFor(uid: string) {
  return path.join(DATA_DIR, `${uid}.json`);
}

export function readEngine(uid: string): EngineData {
  try {
    const raw = fs.readFileSync(fileFor(uid), 'utf8');
    return JSON.parse(raw) as EngineData;
  } catch {
    return { profile: {}, mastery: {}, sessions: [], resume: null };
  }
}

function writeEngine(uid: string, data: EngineData) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(fileFor(uid), JSON.stringify(data, null, 2));
}

const EVIDENCE_GAIN = { claimed: 10, studied: 15, spoken: 35 } as const;
const HALF_LIFE_DAYS = 30;

function decayFactor(lastAt: number, now = Date.now()) {
  if (!lastAt) return 1;
  return Math.pow(0.5, (now - lastAt) / 86400000 / HALF_LIFE_DAYS);
}

export function recordEvidence(uid: string, conceptIds: string[], type: keyof typeof EVIDENCE_GAIN) {
  const data = readEngine(uid);
  const now = Date.now();
  for (const id of conceptIds ?? []) {
    const rec = data.mastery[id] ?? { strength: 0, best: null, lastAt: 0, hits: 0 };
    const decayed = rec.strength * decayFactor(rec.lastAt, now);
    rec.strength = Math.min(100, decayed + (EVIDENCE_GAIN[type] ?? 10));
    const rank = { spoken: 3, studied: 2, claimed: 1 } as const;
    if ((rank[type] ?? 0) > ({ spoken: 3, studied: 2, claimed: 1, null: 0 } as any)[rec.best ?? 'null']) rec.best = type;
    rec.lastAt = now;
    rec.hits += 1;
    data.mastery[id] = rec;
  }
  writeEngine(uid, data);
  return data;
}

export function saveSession(uid: string, record: SessionRecord) {
  const data = readEngine(uid);
  const i = data.sessions.findIndex((s) => s.sessionId === record.sessionId);
  if (i >= 0) data.sessions[i] = { ...data.sessions[i], ...record };
  else data.sessions.unshift({ ...record, savedAt: Date.now() });
  data.sessions = data.sessions.slice(0, 100);
  writeEngine(uid, data);
  return data;
}

export function saveResume(uid: string, analysis: EngineData['resume']) {
  const data = readEngine(uid);
  data.resume = { ...analysis, savedAt: Date.now() };
  writeEngine(uid, data);
  return data;
}

export function saveProfile(uid: string, patch: Partial<EngineData['profile']>) {
  const data = readEngine(uid);
  data.profile = { ...data.profile, ...patch };
  writeEngine(uid, data);
  return data;
}

/** merge client mastery (max strength wins) — used by /api/engine/sync */
export function mergeMastery(uid: string, clientMastery: Record<string, MasteryRecord>) {
  const data = readEngine(uid);
  for (const [id, rec] of Object.entries(clientMastery ?? {})) {
    const cur = data.mastery[id];
    if (!cur || (rec.strength ?? 0) > (cur.strength ?? 0)) data.mastery[id] = rec;
  }
  writeEngine(uid, data);
  return data;
}

export function mergeSessions(uid: string, sessions: SessionRecord[]) {
  const data = readEngine(uid);
  const ids = new Set(data.sessions.map((s) => s.sessionId));
  for (const s of sessions ?? []) {
    if (!ids.has(s.sessionId)) data.sessions.push(s);
  }
  data.sessions.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
  data.sessions = data.sessions.slice(0, 100);
  writeEngine(uid, data);
  return data;
}

// ---------------- campaigns (Offer Ready) ----------------

export function getCampaigns(uid: string): any[] {
  return readEngine(uid).campaigns ?? [];
}

export function saveCampaignToStore(uid: string, campaign: any): void {
  const data = readEngine(uid);
  data.campaigns = data.campaigns ?? [];
  const i = data.campaigns.findIndex((c: any) => c.id === campaign.id);
  if (i >= 0) data.campaigns[i] = campaign;
  else data.campaigns.unshift(campaign);
  data.campaigns = data.campaigns.slice(0, 5);
  writeEngine(uid, data);
}

export function getCampaignFromStore(uid: string, campaignId: string): any | null {
  return (readEngine(uid).campaigns ?? []).find((c: any) => c.id === campaignId) ?? null;
}

export function updateCampaignInStore(uid: string, campaign: any): void {
  saveCampaignToStore(uid, campaign);
}
