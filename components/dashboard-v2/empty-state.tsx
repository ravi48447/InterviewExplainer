/**
 * empty-state.tsx — Dashboard empty/unauthenticated state (P09-WJ, T221..T240).
 *
 * Renders a friendly, action-oriented empty state based on the reason
 * resolved by resolveDashboardEmptyState.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DashboardEmptyState } from "@/lib/dashboard";

export interface EmptyStateProps {
  state: DashboardEmptyState;
}

export function EmptyState({ state }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">{state.title}</h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">{state.message}</p>
      {state.ctaHref && state.ctaLabel && (
        <Link
          href={state.ctaHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90"
        >
          {state.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
