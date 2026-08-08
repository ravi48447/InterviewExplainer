/**
 * dashboard-shell.tsx — Canonical dashboard page architecture (P09-WK, T241..T280).
 *
 * Orchestrates loading the summary + continue-prep + daily queue +
 * recommendations, and handles auth/guest/empty states. Composes the Phase 09
 * canonical sections (ContinuePrep, DailyPrep, Recommendations, EmptyState)
 * and a lightweight summary header. The richer modular cards
 * (SkillRadarCard, ActivityHeatmapCard, etc.) remain composed by the legacy
 * app/dashboard/page.tsx glue; this shell focuses on the canonical data
 * flow and the new prep/recommendation surfaces (P09-T241).
 *
 * Client component — loads data on mount.
 */

"use client";

import { useEffect, useState } from "react";
import {
  loadDashboardSummary,
  loadContinuePrep,
  loadDailyQueue,
  loadRecommendations,
  resolveDashboardEmptyState,
} from "@/lib/dashboard";
import type {
  DashboardSummary,
  ContinuePrepItem,
  DailyQueue,
  RecommendationSet,
  DashboardEmptyState,
} from "@/lib/dashboard";
import { useUserState, useGuestData } from "@/lib/user";
import { CardSkeleton, ListSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { ContinuePrep } from "./continue-prep";
import { DailyPrep } from "./daily-prep";
import { Recommendations } from "./recommendations";
import { EmptyState } from "./empty-state";

function formatMinutes(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m";
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export function DashboardShell() {
  const { user, status, ready } = useUserState();
  const { hasGuest } = useGuestData();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [continuePrep, setContinuePrep] = useState<ContinuePrepItem[]>([]);
  const [dailyQueue, setDailyQueue] = useState<DailyQueue | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    if (!ready) return;
    if (status === "unauthenticated" && !hasGuest) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    Promise.all([
      loadDashboardSummary().catch(() => null),
      loadContinuePrep().catch(() => []),
      loadDailyQueue().catch(() => null),
      loadRecommendations().catch(() => ({ items: [], total: 0 })),
    ]).then(([s, cp, dq, rec]) => {
      if (cancelled) return;
      setSummary(s);
      setContinuePrep(cp);
      setDailyQueue(dq);
      setRecommendations(rec);
      setLoading(false);
      // If the core summary failed to load, surface an error state so the
      // user can retry rather than silently rendering an empty dashboard.
      if (s === null) setLoadError(true);
    });
    return () => {
      cancelled = true;
    };
  }, [ready, status, hasGuest, retryNonce]);

  const isAuthenticated = status === "authenticated";
  const emptyState: DashboardEmptyState | null =
    summary && !loading
      ? resolveDashboardEmptyState(isAuthenticated, hasGuest, summary)
      : null;

  const showEmpty =
    !loading &&
    emptyState &&
    (emptyState.reason === "unauthenticated" ||
      emptyState.reason === "guest_with_data" ||
      emptyState.reason === "guest_empty" ||
      emptyState.reason === "no_primary_domain" ||
      emptyState.reason === "domain_empty");

  if (loading) {
    return (
      <div className="page-container py-12">
        <div className="max-w-5xl mx-auto space-y-6" aria-busy="true" aria-live="polite">
          <CardSkeleton className="h-28 rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <CardSkeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <ListSkeleton rows={4} className="rounded-lg border border-border bg-card p-4" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page-container py-16">
        <div className="max-w-2xl mx-auto">
          <ErrorState
            title="Dashboard unavailable"
            description="We couldn't load your dashboard right now. Please try again."
            retryLabel="Try again"
            onRetry={() => setRetryNonce((n) => n + 1)}
          />
        </div>
      </div>
    );
  }

  if (showEmpty && emptyState) {
    return (
      <div className="page-container py-16">
        <div className="max-w-2xl mx-auto">
          <EmptyState state={emptyState} />
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="page-container py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Summary header */}
        <header className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="type-display text-2xl font-bold text-foreground">
                {user?.name ? `Welcome back, ${user.name}` : "Dashboard"}
              </h1>
              {summary.primaryDomainName && (
                <p className="text-sm text-muted-foreground mt-1">
                  Primary domain: {summary.primaryDomainName}
                </p>
              )}
            </div>
            {summary.experienceLevel && (
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {summary.experienceLevel}
              </span>
            )}
          </div>
        </header>

        {/* Quick stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          aria-live="polite"
          aria-label="Dashboard summary statistics"
        >
          {[
            { label: "Completed", value: summary.completedQuestions },
            { label: "Streak", value: `${summary.currentStreak}d` },
            { label: "Bookmarks", value: summary.bookmarksCount },
            { label: "Time", value: formatMinutes(summary.totalTimeSpent) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Canonical Phase 09 sections */}
        <ContinuePrep items={continuePrep} />
        {dailyQueue && <DailyPrep queue={dailyQueue} />}
        {recommendations && <Recommendations set={recommendations} />}

        {/* Recent activity (from summary) */}
        {summary.recentActivity.length > 0 && (
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Recent activity</h2>
            <ul className="space-y-2">
              {summary.recentActivity.slice(0, 8).map((a, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-foreground line-clamp-1">{a.title}</p>
                    {a.detail && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{a.detail}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{a.date}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
