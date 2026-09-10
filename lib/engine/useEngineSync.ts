'use client';

/**
 * useEngineSync — bridges client engine state and the per-user server store.
 *
 * - Guests: everything stays in localStorage (free content, full mock experience)
 * - Logged in: pushes local evidence/sessions up, pulls canonical down
 * - Exposes `authed` so pages can show "save across devices" CTAs
 */

import { useEffect, useState, useCallback } from 'react';

export function useEngineSync() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        setAuthed(res.ok);
      } catch {
        setAuthed(false);
      }
    })();
  }, []);

  /** Push local mastery/sessions to the account (call after login or on interval). */
  const pushLocal = useCallback(async () => {
    try {
      const masteryRaw = localStorage.getItem('ie_mastery_v1');
      const sessionsRaw = localStorage.getItem('ie_mock_sessions_v1');
      const body: Record<string, unknown> = {};
      if (masteryRaw) body.mastery = JSON.parse(masteryRaw);
      if (sessionsRaw) body.sessions = JSON.parse(sessionsRaw);
      if (!Object.keys(body).length) return { ok: false };
      const res = await fetch('/api/engine/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return { ok: res.ok };
    } catch {
      return { ok: false };
    }
  }, []);

  /** Pull canonical data down and merge into localStorage. */
  const pullServer = useCallback(async () => {
    try {
      const res = await fetch('/api/engine/sync');
      if (!res.ok) return { ok: false };
      const data = await res.json();
      if (data.mastery) {
        const local = JSON.parse(localStorage.getItem('ie_mastery_v1') ?? '{}');
        const merged = { ...local };
        for (const [id, rec] of Object.entries<any>(data.mastery)) {
          const l = local[id];
          if (!l || (rec.strength ?? 0) > (l.strength ?? 0)) merged[id] = rec;
        }
        localStorage.setItem('ie_mastery_v1', JSON.stringify(merged));
      }
      if (data.sessions?.length) {
        const local = JSON.parse(localStorage.getItem('ie_mock_sessions_v1') ?? '[]');
        const ids = new Set(local.map((s: any) => s.sessionId));
        const merged = [...data.sessions.filter((s: any) => !ids.has(s.sessionId)), ...local].slice(0, 50);
        localStorage.setItem('ie_mock_sessions_v1', JSON.stringify(merged));
      }
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }, []);

  // auto-sync when authed
  useEffect(() => {
    if (authed) {
      pushLocal().then(() => pullServer());
    }
  }, [authed, pushLocal, pullServer]);

  return { authed, pushLocal, pullServer };
}
