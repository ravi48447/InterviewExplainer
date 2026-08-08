/**
 * user-progress.ts — Progress/completion store (P08-WE, T181..T240).
 *
 * Mirrors user-bookmark.ts: guest (localStorage) when unauthenticated,
 * server (`/api/progress`) when authenticated. One unified API for
 * "mark done", "in progress", and "not started" (P08-T181).
 *
 * Client-only.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getGuestCompleted,
  addGuestCompleted,
} from "@/lib/guest-progress";
import apiClient from "@/lib/api-client";
import type { ProgressEntry, ProgressStatus } from "./user-types";

// ─── Server progress sync ────────────────────────────────────────────────────

export async function fetchProgress(): Promise<ProgressEntry[]> {
  const res = await apiClient.get<ProgressEntry[]>("/progress");
  return res.data ?? [];
}

export async function upsertProgress(
  questionId: number,
  status: ProgressStatus,
  confidence?: number,
): Promise<void> {
  await apiClient.post("/progress", { questionId, status, confidence });
}

// ─── Unified hook ────────────────────────────────────────────────────────────

export interface UseProgress {
  completedIds: number[];
  inProgressIds: number[];
  isCompleted: (id: number) => boolean;
  isInProgress: (id: number) => boolean;
  markCompleted: (id: number, confidence?: number) => Promise<void>;
  markInProgress: (id: number) => Promise<void>;
  getStatus: (id: number) => ProgressStatus;
  ready: boolean;
}

export function useProgress(isAuthenticated: boolean): UseProgress {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [guestCompleted, setGuestCompleted] = useState<number[]>(() =>
    getGuestCompleted(),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setReady(true);
      return;
    }
    let cancelled = false;
    fetchProgress()
      .then((rows) => {
        if (!cancelled) {
          setEntries(rows);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) return;
    const onChange = () => setGuestCompleted(getGuestCompleted());
    window.addEventListener("ie-guest-change", onChange);
    return () => window.removeEventListener("ie-guest-change", onChange);
  }, [isAuthenticated]);

  const completedIds = isAuthenticated
    ? entries.filter((e) => e.status === "completed").map((e) => e.questionId)
    : guestCompleted;
  const inProgressIds = isAuthenticated
    ? entries.filter((e) => e.status === "in_progress").map((e) => e.questionId)
    : [];

  const isCompleted = useCallback(
    (id: number) => completedIds.includes(id),
    [completedIds],
  );
  const isInProgress = useCallback(
    (id: number) => inProgressIds.includes(id),
    [inProgressIds],
  );

  const getStatus = useCallback(
    (id: number): ProgressStatus => {
      if (completedIds.includes(id)) return "completed";
      if (inProgressIds.includes(id)) return "in_progress";
      return "not_started";
    },
    [completedIds, inProgressIds],
  );

  const markCompleted = useCallback(
    async (id: number, confidence?: number) => {
      if (isAuthenticated) {
        await upsertProgress(id, "completed", confidence);
        setEntries((prev) => {
          const next = prev.filter((e) => e.questionId !== id);
          return [
            ...next,
            { questionId: id, status: "completed", updatedAt: new Date().toISOString(), confidence },
          ];
        });
      } else {
        addGuestCompleted(id);
        setGuestCompleted(getGuestCompleted());
      }
    },
    [isAuthenticated],
  );

  const markInProgress = useCallback(
    async (id: number) => {
      if (isAuthenticated) {
        await upsertProgress(id, "in_progress");
        setEntries((prev) => {
          const next = prev.filter((e) => e.questionId !== id);
          return [...next, { questionId: id, status: "in_progress", updatedAt: new Date().toISOString() }];
        });
      }
      // Guest mode has no "in progress" — completion is the only guest state.
    },
    [isAuthenticated],
  );

  return {
    completedIds,
    inProgressIds,
    isCompleted,
    isInProgress,
    markCompleted,
    markInProgress,
    getStatus,
    ready,
  };
}
