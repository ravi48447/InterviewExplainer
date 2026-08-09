/**
 * opportunity-shell.tsx — Discovery dashboard client shell (P12-WB..WF, T041..T320).
 *
 * Owns the discovery list state: career target → filtered opportunities.
 * Composes the opportunity-v2 primitives. Data flows through @/lib/opportunity
 * loaders only (P12-T001).
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { Target } from "lucide-react";
import {
  fetchCareerTarget,
  fetchOpportunities,
} from "@/lib/opportunity";
import type { Opportunity, OpportunityFilter } from "@/lib/opportunity";
import { OpportunityList } from "./opportunity-list";
import { ListSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

const DEMO_USER = "demo-user";

export function OpportunityShell() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filter, setFilter] = useState<OpportunityFilter>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [targetRole, setTargetRole] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const target = await fetchCareerTarget(DEMO_USER);
      setTargetRole(target?.role ?? null);
      const result = await fetchOpportunities(DEMO_USER, {});
      setOpportunities(result.opportunities);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load opportunities"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Re-fetch on filter change (debounced via the input's own typing).
  const onFilterChange = useCallback((next: OpportunityFilter) => {
    setFilter(next);
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchOpportunities(DEMO_USER, next);
        if (!cancelled) setOpportunities(result.opportunities);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error("Failed to load opportunities"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6" aria-live="polite">
      {targetRole && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="text-sm text-foreground">
            Showing opportunities for <span className="font-semibold">{targetRole}</span>
          </p>
        </div>
      )}

      {loading ? (
        <ListSkeleton rows={5} />
      ) : error ? (
        <ErrorState
          title="Couldn't load opportunities"
          description={error.message}
          retryLabel="Try again"
          onRetry={load}
        />
      ) : (
        <OpportunityList
          opportunities={opportunities}
          filter={filter}
          onFilterChange={onFilterChange}
          onOpen={() => {}}
        />
      )}
    </div>
  );
}
