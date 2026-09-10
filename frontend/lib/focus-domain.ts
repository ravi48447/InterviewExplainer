/**
 * focus-domain.ts
 *
 * Client-side helpers for the user's "focus domain" — the content domain
 * (e.g. "java-backend-intermediate") the dashboard tailors itself to.
 *
 * The focus domain is persisted to the backend profile (primary_domain_slug)
 * when the user is logged in, but we ALSO mirror it to localStorage so the
 * dashboard can render the correct domain immediately — even before a slow
 * round-trip, or if the backend is temporarily unavailable.
 */

export const FOCUS_DOMAIN_LS_KEY = 'ie_focus_domain';

export interface FocusDomain {
  slug: string;
  name: string;
}

export function saveFocusDomain(fd: FocusDomain): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FOCUS_DOMAIN_LS_KEY, JSON.stringify(fd));
  } catch {
    /* ignore quota / serialization errors */
  }
}

export function getFocusDomain(): FocusDomain | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(FOCUS_DOMAIN_LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FocusDomain;
    return parsed && typeof parsed.slug === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function clearFocusDomain(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(FOCUS_DOMAIN_LS_KEY);
  } catch {
    /* ignore */
  }
}
