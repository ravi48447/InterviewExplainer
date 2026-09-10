/**
 * user-types.ts — Canonical user model (P08-WA..WF, T001..T040).
 *
 * Phase 08 introduces a single, typed user model that replaces the ad-hoc
 * shapes previously spread across context/auth-context and modules/auth.
 *
 * Design rules (P08-T001..T005):
 *  - One User type, one AuthState, one GuestData type. No duplicates.
 *  - Guest (anonymous) is a first-class user state, not a hack.
 *  - Bookmarks + progress are owned by the user layer, not scattered.
 *  - All client-only persistence is namespaced (`ie_*`).
 */

import type { Difficulty } from "@/lib/api";

// ─── Core user identity ──────────────────────────────────────────────────────

export type AuthProvider = "password" | "google" | "github" | "magic";
export type PlanTier = "free" | "pro";
export type ExperienceBand =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT"
  | string;

export interface SelectedDomain {
  slug: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  /** Primary (legacy) domain slug, if set. */
  domainSlug: string | null;
  /** All domains the user has added (switchable dashboards). */
  domains: SelectedDomain[];
  /** Currently active domain slug (for multi-domain switch). */
  activeDomain: string | null;
  experienceLevel: ExperienceBand | null;
  plan: PlanTier;
  targetRole: string | null;
  interviewDate: string | null;
  authProvider?: AuthProvider;
}

// ─── Auth state machine ──────────────────────────────────────────────────────

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "guest"
  | "unauthenticated";

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  /** True while a session-restore request is in flight. */
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  status: "loading",
  user: null,
  isLoading: true,
  error: null,
};

// ─── Auth forms ──────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  experienceBand?: ExperienceBand;
  domains?: Array<{ slug: string; level: string }>;
  [key: string]: unknown;
}

export interface AuthResult {
  user: User;
  token?: string;
}

export type AuthErrorCode =
  | "invalid_credentials"
  | "email_taken"
  | "weak_password"
  | "network"
  | "rate_limited"
  | "unknown";

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AuthError";
    this.code = code;
  }
}

// ─── Bookmarks ───────────────────────────────────────────────────────────────

export interface BookmarkEntry {
  questionId: number;
  slug: string;
  title: string;
  domainSlug: string;
  stackSlug: string;
  difficulty: Difficulty;
  addedAt: string;
}

// ─── Progress ────────────────────────────────────────────────────────────────

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export interface ProgressEntry {
  questionId: number;
  status: ProgressStatus;
  updatedAt: string;
  /** Optional self-rating 1-5 captured on completion. */
  confidence?: number;
}

// ─── Guest (anonymous) data ──────────────────────────────────────────────────

export interface GuestData {
  bookmarks: number[];
  completed: number[];
}
