/**
 * Anonymous (guest) activity stored locally.
 *
 * Lets visitors bookmark questions and mark progress WITHOUT an account so they
 * can invest in the product before committing. On login/signup this data is
 * merged into their server account (see auth-context + /api/auth/*), then cleared.
 *
 * Client-only (localStorage).
 */

const BM_KEY = 'ie_guest_bookmarks';
const DONE_KEY = 'ie_guest_completed';

function readNums(key: string): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((n) => Number.isFinite(n)) : [];
  } catch {
    return [];
  }
}

function writeNums(key: string, vals: number[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify([...new Set(vals)]));
    window.dispatchEvent(new Event('ie-guest-change'));
  } catch {
    /* ignore quota errors */
  }
}

// ─── Bookmarks ──────────────────────────────────────────────────────────────

export const getGuestBookmarks = (): number[] => readNums(BM_KEY);

export const isGuestBookmarked = (id: number): boolean => readNums(BM_KEY).includes(id);

export function toggleGuestBookmark(id: number): boolean {
  const list = readNums(BM_KEY);
  const has = list.includes(id);
  writeNums(BM_KEY, has ? list.filter((x) => x !== id) : [...list, id]);
  return !has; // new bookmarked state
}

// ─── Completed ────────────────────────────────────────────────────────────────

export const getGuestCompleted = (): number[] => readNums(DONE_KEY);

export function addGuestCompleted(id: number): void {
  const list = readNums(DONE_KEY);
  if (!list.includes(id)) writeNums(DONE_KEY, [...list, id]);
}

// ─── Merge lifecycle ──────────────────────────────────────────────────────────

export interface GuestData {
  bookmarks: number[];
  completed: number[];
}

export function getGuestData(): GuestData {
  return { bookmarks: readNums(BM_KEY), completed: readNums(DONE_KEY) };
}

export function hasGuestData(): boolean {
  return readNums(BM_KEY).length > 0 || readNums(DONE_KEY).length > 0;
}

export function clearGuestData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(BM_KEY);
    localStorage.removeItem(DONE_KEY);
    window.dispatchEvent(new Event('ie-guest-change'));
  } catch {
    /* ignore */
  }
}
