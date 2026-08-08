/**
 * opportunity-list.tsx — Discovery list with filters (P12-WB..WF, T041..T260).
 *
 * Renders the filter bar + opportunity card grid. The parent owns the data
 * loading; this component receives opportunities and a filter change callback.
 */

"use client";

import { useMemo } from "react";
import { Search, SlidersHorizontal, Inbox } from "lucide-react";
import type { Opportunity, OpportunityFilter, WorkMode, SeniorityBand } from "@/lib/opportunity";
import { OpportunityCard } from "./opportunity-card";

export interface OpportunityListProps {
  opportunities: Opportunity[];
  filter: OpportunityFilter;
  onFilterChange: (filter: OpportunityFilter) => void;
  onOpen: (opp: Opportunity) => void;
  loading?: boolean;
}

const WORK_MODES: WorkMode[] = ["remote", "hybrid", "onsite"];
const SENIORITY: SeniorityBand[] = ["intern", "entry", "mid", "senior", "staff", "lead", "manager", "director"];

export function OpportunityList({
  opportunities,
  filter,
  onFilterChange,
  onOpen,
  loading,
}: OpportunityListProps) {
  const detailHref = useMemo(
    () => (opp: Opportunity) => `/dashboard/opportunities/${opp.id}`,
    [],
  );

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={filter.query ?? ""}
            onChange={(e) => onFilterChange({ ...filter, query: e.target.value })}
            placeholder="Search roles, companies, skills…"
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={filter.seniority ?? ""}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                seniority: (e.target.value || undefined) as SeniorityBand | undefined,
              })
            }
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Any level</option>
            {SENIORITY.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filter.workMode ?? ""}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                workMode: (e.target.value || undefined) as WorkMode | undefined,
              })
            }
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Any mode</option>
            {WORK_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={filter.remoteOnly ?? false}
              onChange={(e) => onFilterChange({ ...filter, remoteOnly: e.target.checked })}
              className="rounded border-border"
            />
            Remote only
          </label>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center text-sm text-muted-foreground py-12">Loading opportunities…</p>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No opportunities found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your filters or updating your career target.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              href={detailHref(opp)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
