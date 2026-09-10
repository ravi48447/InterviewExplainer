/**
 * user-bookmark.ts — Bookmark store (P08-WD, T121..T180).
 *
 * A single bookmark API that transparently uses guest (localStorage) storage
 * when unauthenticated and the server (`/api/bookmarks`) when authenticated.
 * Components call one function regardless of auth state (P08-T121).
 *
 * Client-only (localStorage + fetch).
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getGuestBookmarks,
  isGuestBookmarked,
  toggleGuestBookmark,
} from "@/lib/guest-progress";
import apiClient from "@/lib/api-client";
import type { BookmarkEntry } from "./user-types";

// ─── Server bookmark sync (authenticated) ───────────────────────────────────

export async function fetchBookmarks(): Promise<BookmarkEntry[]> {
  const res = await apiClient.get<BookmarkEntry[]>("/bookmarks");
  return res.data ?? [];
}

export async function addBookmark(questionId: number): Promise<void> {
  await apiClient.post("/bookmarks", { questionId });
}

export async function removeBookmark(questionId: number): Promise<void> {
  await apiClient.delete(`/bookmarks/${questionId}`);
}

// ─── Unified hook: works for guest and authenticated ────────────────────────

export interface UseBookmarks {
  bookmarkIds: number[];
  isBookmarked: (id: number) => boolean;
  toggle: (id: number) => Promise<boolean>;
  ready: boolean;
}

export function useBookmarks(isAuthenticated: boolean): UseBookmarks {
  const [serverIds, setServerIds] = useState<number[]>([]);
  const [guestIds, setGuestIds] = useState<number[]>(() => getGuestBookmarks());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setReady(true);
      return;
    }
    let cancelled = false;
    fetchBookmarks()
      .then((entries) => {
        if (!cancelled) {
          setServerIds(entries.map((e) => e.questionId));
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

  // Keep guest view in sync with localStorage events.
  useEffect(() => {
    if (isAuthenticated) return;
    const onChange = () => setGuestIds(getGuestBookmarks());
    window.addEventListener("ie-guest-change", onChange);
    return () => window.removeEventListener("ie-guest-change", onChange);
  }, [isAuthenticated]);

  const bookmarkIds = isAuthenticated ? serverIds : guestIds;

  const isBookmarked = useCallback(
    (id: number) =>
      isAuthenticated ? serverIds.includes(id) : isGuestBookmarked(id),
    [isAuthenticated, serverIds],
  );

  const toggle = useCallback(
    async (id: number): Promise<boolean> => {
      if (isAuthenticated) {
        const has = serverIds.includes(id);
        if (has) {
          await removeBookmark(id);
          setServerIds((prev) => prev.filter((x) => x !== id));
          return false;
        }
        await addBookmark(id);
        setServerIds((prev) => [...prev, id]);
        return true;
      }
      const next = toggleGuestBookmark(id);
      setGuestIds(getGuestBookmarks());
      return next;
    },
    [isAuthenticated, serverIds],
  );

  return { bookmarkIds, isBookmarked, toggle, ready };
}
