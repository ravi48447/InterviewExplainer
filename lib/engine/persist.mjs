/**
 * persist.mjs — user data persistence (guest-first, server-synced).
 *
 * localStorage is the source of truth for guests; on login the store syncs
 * to /api/auth/me-style endpoints (server seam documented). Sessions keep
 * their full reports so history/trends survive tab close.
 */

const K = {
  profile: 'ie_user_profile_v1',
  sessions: 'ie_mock_sessions_v1',
  resume: 'ie_resume_latest_v1',
  mastery: 'ie_mastery_v1',
  companyLoop: 'ie_company_loop_v1',
  reports: 'ie_mock_reports_v1',
};

function rd(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function wr(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ---------------- profile ----------------
export function getProfile() {
  return rd(K.profile, { name: null, email: null, targetRole: null, focusDomains: [], createdAt: null });
}

export function saveProfile(patch) {
  const p = { ...getProfile(), ...patch, updatedAt: Date.now() };
  wr(K.profile, p);
  return p;
}

// ---------------- mock sessions (history + trends) ----------------
const MAX_SESSIONS = 50;

export function saveSessionRecord(record) {
  const all = rd(K.sessions, []).filter((session) => session.sessionId !== record.sessionId);
  all.unshift({ ...record, savedAt: Date.now() });
  wr(K.sessions, all.slice(0, MAX_SESSIONS));
  return record;
}

export function getSessionRecords() {
  return rd(K.sessions, []);
}

export function getSessionRecord(sessionId) {
  return rd(K.sessions, []).find((s) => s.sessionId === sessionId) ?? null;
}

// ---------------- full session reports (survive tab close) ----------------
const MAX_REPORTS = 12;

export function saveFullReport(sessionId, report) {
  const all = rd(K.reports, {});
  all[sessionId] = { report, savedAt: Date.now() };
  // keep the newest MAX_REPORTS by insertion order
  const keys = Object.keys(all);
  if (keys.length > MAX_REPORTS) {
    for (const k of keys.slice(0, keys.length - MAX_REPORTS)) delete all[k];
  }
  wr(K.reports, all);
  return report;
}

export function getFullReport(sessionId) {
  return rd(K.reports, {})[sessionId]?.report ?? null;
}

// ---------------- company loop state (persists across refreshes) ----------------
/** One active company loop at a time: { companyId, level, roundIdx, scores, startedAt, vetted } */
export function saveCompanyLoopState(state) {
  wr(K.companyLoop, { ...state, updatedAt: Date.now() });
  return state;
}

export function getCompanyLoopState() {
  return rd(K.companyLoop, null);
}

export function clearCompanyLoopState() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(K.companyLoop);
}

/** Trend data: [{ ts, score, domain, mode }] oldest→newest */
export function scoreTrend(limit = 20) {
  return rd(K.sessions, [])
    .slice(0, limit)
    .reverse()
    .map((s) => ({ ts: s.savedAt, score: s.overallScore, domain: s.domain, mode: s.mode, minutes: s.presetMinutes }));
}

export function streakInfo() {
  const sessions = rd(K.sessions, []);
  if (!sessions.length) return { days: 0, lastDate: null };
  const days = new Set(sessions.map((s) => new Date(s.savedAt).toDateString()));
  let streak = 0;
  const d = new Date();
  // today or yesterday starts the streak
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  if (!days.has(d.toDateString())) return { days: 0, lastDate: sessions[0].savedAt };
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return { days: streak, lastDate: sessions[0].savedAt };
}

// ---------------- resume ----------------
export function saveResumeAnalysis(analysis) {
  wr(K.resume, { ...analysis, savedAt: Date.now() });
}

export function getLatestResumeAnalysis() {
  return rd(K.resume, null);
}

export function resumeHistory() {
  // store just readiness snapshots for versions/trends
  return rd(K.resume, null)?.history ?? [];
}

// ---------------- merge on login (server seam) ----------------
/**
 * Push local state to the server account. The app already has auth routes;
 * this targets a generic sync endpoint (seam: wire to the Java backend's
 * user system when live). Best-effort, never blocks the UI.
 */
export async function syncToServer() {
  if (typeof window === 'undefined') return { ok: false };
  const payload = {
    profile: getProfile(),
    sessions: getSessionRecords().slice(0, 20),
    mastery: rd(K.mastery, {}),
  };
  try {
    const res = await fetch('/api/engine/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false, offline: true };
  }
}

/** Pull server state and merge (max-strength wins for mastery). */
export async function syncFromServer() {
  if (typeof window === 'undefined') return { ok: false };
  try {
    const res = await fetch('/api/engine/sync');
    if (!res.ok) return { ok: false };
    const server = await res.json();
    if (server.mastery) {
      const local = rd(K.mastery, {});
      const merged = { ...local };
      for (const [id, rec] of Object.entries(server.mastery)) {
        const l = local[id];
        if (!l || rec.strength > (l.strength ?? 0)) merged[id] = rec;
      }
      wr(K.mastery, merged);
    }
    if (server.sessions?.length) {
      const localIds = new Set(rd(K.sessions, []).map((s) => s.sessionId));
      const newOnes = server.sessions.filter((s) => !localIds.has(s.sessionId));
      if (newOnes.length) wr(K.sessions, [...newOnes, ...rd(K.sessions, [])].slice(0, MAX_SESSIONS));
    }
    return { ok: true };
  } catch {
    return { ok: false, offline: true };
  }
}
