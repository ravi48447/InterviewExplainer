/**
 * dashboard-types.ts — Canonical dashboard model (P09-WA..WK, T001..T060).
 *
 * Phase 09 introduces a single typed dashboard surface that replaces the
 * ad-hoc shapes in modules/dashboard + the inline types in app/dashboard.
 * Re-exports the existing DashboardSummary/StackPerformance/etc. so there
 * is one import path (P09-T005).
 */

import type {
  DashboardSummary,
  StackPerformance,
  WeakArea,
  RecentActivityItem,
  RadarData,
  DailyActivity,
  DifficultyBreakdown,
} from "@/lib/api";

// Re-export so consumers import everything from @/lib/dashboard.
export type {
  DashboardSummary,
  StackPerformance,
  WeakArea,
  RecentActivityItem,
  RadarData,
  DailyActivity,
  DifficultyBreakdown,
};

// ─── Continue-prep (resume where you left off) ───────────────────────────────

export interface ContinuePrepItem {
  questionId: number;
  slug: string;
  title: string;
  domainSlug: string;
  stackSlug: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedReadTime: number;
  /** Progress 0..1; null if not started. */
  progress: number | null;
  lastVisited: string | null;
}

// ─── Daily queue (recommended for today) ─────────────────────────────────────

export interface DailyQueueItem {
  questionId: number;
  slug: string;
  title: string;
  domainSlug: string;
  stackSlug: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedReadTime: number;
  /** Why this is recommended (reasoning label). */
  reason: string;
}

export interface DailyQueue {
  date: string;
  items: DailyQueueItem[];
  total: number;
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export type RecommendationReason =
  | "weak_area"
  | "next_in_track"
  | "spaced_repetition"
  | "trending"
  | "difficulty_step";

export interface RecommendationItem {
  questionId: number;
  slug: string;
  title: string;
  domainSlug: string;
  stackSlug: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedReadTime: number;
  reason: RecommendationReason;
  reasonLabel: string;
}

export interface RecommendationSet {
  items: RecommendationItem[];
  total: number;
}

// ─── Empty-state reasons (P09-WJ) ─────────────────────────────────────────────

export type DashboardEmptyReason =
  | "unauthenticated"
  | "guest_with_data"
  | "guest_empty"
  | "no_primary_domain"
  | "domain_empty"
  | "no_activity";

export interface DashboardEmptyState {
  reason: DashboardEmptyReason;
  title: string;
  message: string;
  ctaHref?: string;
  ctaLabel?: string;
}
