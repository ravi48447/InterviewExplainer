/**
 * Server-owned turn counters for active mock interviews.
 *
 * The adaptive Director can accept client-reported practice state, but paid
 * access limits must not. Keeping this small counter on the server prevents a
 * browser from resetting its completed-turn count to bypass the free boundary.
 * Production can replace this process store with Redis without changing the
 * session/turn API contract.
 */

type ActiveMockSession = {
  turnsCompleted: number;
  createdAt: number;
  touchedAt: number;
};

type MockGateGlobal = typeof globalThis & {
  __ieActiveMockSessions?: Map<string, ActiveMockSession>;
};

const ACTIVE_TTL_MS = 2 * 60 * 60 * 1000;
const gateGlobal = globalThis as MockGateGlobal;
const sessions = gateGlobal.__ieActiveMockSessions ?? new Map<string, ActiveMockSession>();
gateGlobal.__ieActiveMockSessions = sessions;

function pruneExpired(now = Date.now()) {
  for (const [sessionId, session] of sessions) {
    if (now - session.touchedAt > ACTIVE_TTL_MS) sessions.delete(sessionId);
  }
}

export function registerMockSession(sessionId: string) {
  const now = Date.now();
  pruneExpired(now);
  sessions.set(sessionId, { turnsCompleted: 0, createdAt: now, touchedAt: now });
}

export function recordCompletedMockTurn(sessionId: string): ActiveMockSession | null {
  const now = Date.now();
  pruneExpired(now);
  const session = sessions.get(sessionId);
  if (!session) return null;
  session.turnsCompleted += 1;
  session.touchedAt = now;
  return { ...session };
}

export function completeMockSession(sessionId: string) {
  sessions.delete(sessionId);
}
