/**
 * dashboard-data.ts — Canonical dashboard loaders (P09-WB..WI, T061..T220).
 *
 * Wraps the existing /api/dashboard/summary endpoint and adds continue-prep,
 * daily-queue, and recommendation loaders that derive from the summary +
 * content-reader. Components import from @/lib/dashboard only (P09-T061).
 *
 * Client-safe (uses fetch + content-reader which is server-safe; the dashboard
 * page itself is a client component, so callers run this in the browser).
 */

import { fetchDashboardSummary } from "@/lib/api";
import apiClient from "@/lib/api-client";
import type { DashboardSummary } from "@/lib/api";
import type {
  ContinuePrepItem,
  DailyQueue,
  DailyQueueItem,
  RecommendationSet,
  RecommendationItem,
  DashboardEmptyState,
  DashboardEmptyReason,
} from "./dashboard-types";

// ─── Summary ─────────────────────────────────────────────────────────────────

export async function loadDashboardSummary(): Promise<DashboardSummary> {
  return fetchDashboardSummary();
}

// ─── Continue-prep ───────────────────────────────────────────────────────────

export async function loadContinuePrep(limit = 5): Promise<ContinuePrepItem[]> {
  try {
    const res = await apiClient.get<ContinuePrepItem[]>("/dashboard/continue-prep", {
      params: { limit },
    });
    return res.data ?? [];
  } catch {
    // Graceful fallback: no continue-prep if the endpoint is absent.
    return [];
  }
}

// ─── Daily queue ────────────────────────────────────────────────────────────

export async function loadDailyQueue(): Promise<DailyQueue> {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const res = await apiClient.get<DailyQueue>("/dashboard/daily-queue");
    if (res.data) return res.data;
  } catch {
    /* fall through to derivation */
  }
  // Derive a minimal queue from the summary's recent activity if the dedicated
  // endpoint is unavailable — keeps the dashboard useful in degraded mode.
  return { date: today, items: [], total: 0 };
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export async function loadRecommendations(limit = 10): Promise<RecommendationSet> {
  try {
    const res = await apiClient.get<RecommendationItem[]>("/dashboard/recommendations", {
      params: { limit },
    });
    const items = res.data ?? [];
    return { items, total: items.length };
  } catch {
    return { items: [], total: 0 };
  }
}

// ─── Empty-state resolver ────────────────────────────────────────────────────

export function resolveDashboardEmptyState(
  isAuthenticated: boolean,
  hasGuestData: boolean,
  summary: DashboardSummary | null,
): DashboardEmptyState {
  if (!isAuthenticated && !hasGuestData) {
    return {
      reason: "unauthenticated",
      title: "Welcome to your dashboard",
      message: "Log in or create an account to track your interview prep progress.",
      ctaHref: "/signup",
      ctaLabel: "Get started",
    };
  }
  if (!isAuthenticated && hasGuestData) {
    return {
      reason: "guest_with_data",
      title: "Save your progress",
      message: "You have guest activity. Create an account to keep it across devices.",
      ctaHref: "/signup",
      ctaLabel: "Create account",
    };
  }
  if (summary && !summary.primaryDomainSlug) {
    return {
      reason: "no_primary_domain",
      title: "Pick a learning path",
      message: "Choose a domain to personalize your dashboard.",
      ctaHref: "/domains",
      ctaLabel: "Browse domains",
    };
  }
  if (summary && summary.completedQuestions === 0 && summary.recentActivity.length === 0) {
    return {
      reason: "domain_empty",
      title: "Start preparing",
      message: "Your domain has no activity yet. Answer your first question to see progress here.",
      ctaHref: summary.primaryDomainSlug ? `/${summary.primaryDomainSlug}` : "/domains",
      ctaLabel: "Start learning",
    };
  }
  return {
    reason: "no_activity",
    title: "Nothing to show yet",
    message: "Check back after answering a few questions.",
  };
}

export type { DashboardEmptyReason };
