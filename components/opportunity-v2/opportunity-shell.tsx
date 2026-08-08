/**
 * opportunity-shell.tsx — Discovery dashboard client shell (P12-WB..WF, T041..T320).
 *
 * Owns the discovery list state: career target → filtered opportunities.
 * Composes the opportunity-v2 primitives. Data flows through @/lib/opportunity
 * loaders only (P12-T001).
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { Target, Loader2 } from "lucide-react";
import {
  fetchCareerTarget,
  fetchOpportunities,
} from "@/lib/opportunity";
import type { Opportunity, OpportunityFilter } from "@/lib/opportunity";
import { OpportunityList } from "./opportunity-list";

const DEMO_USER = "demo-user";

export function OpportunityShell() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filter, setFilter] = useState<OpportunityFilter>({});
  const [loading, setLoading] = useState(true);
  const [targetRole, setTargetRole] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const target = await fetchCareerTarget(DEMO_USER);
        if (cancelled) return;
        setTargetRole(target?.role ?? null);
        const result = await fetchOpportunities(DEMO_USER, filter);
        if (cancelled) return;
        setOpportunities(result.opportunities);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch on filter change (debounced via the input's own typing).
  const onFilterChange = useCallback((next: OpportunityFilter) => {
    setFilter(next);
    let cancelled = false;
    (async () => {
      const result = await fetchOpportunities(DEMO_USER, next);
      if (!cancelled) setOpportunities(result.opportunities);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {targetRole && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <p className="text-sm text-foreground">
            Showing opportunities for <span className="font-semibold">{targetRole}</span>
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
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
