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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { ListSkeleton } from "@/components/ui/skeleton";

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
        <Input
          type="text"
          value={filter.query ?? ""}
          onChange={(e) => onFilterChange({ ...filter, query: e.target.value })}
          placeholder="Search roles, companies, skills…"
          leftIcon={<Search />}
          aria-label="Search opportunities"
        />
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Select
            value={filter.seniority ?? "all"}
            onValueChange={(v) =>
              onFilterChange({
                ...filter,
                seniority: v === "all" ? undefined : (v as SeniorityBand),
              })
            }
          >
            <SelectTrigger className="h-8 w-auto text-xs" aria-label="Filter by seniority">
              <SelectValue placeholder="Any level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any level</SelectItem>
              {SENIORITY.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.workMode ?? "all"}
            onValueChange={(v) =>
              onFilterChange({
                ...filter,
                workMode: v === "all" ? undefined : (v as WorkMode),
              })
            }
          >
            <SelectTrigger className="h-8 w-auto text-xs" aria-label="Filter by work mode">
              <SelectValue placeholder="Any mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any mode</SelectItem>
              {WORK_MODES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <ListSkeleton rows={4} />
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon={<Inbox />}
          title="No opportunities found"
          description="Try adjusting your filters or updating your career target."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2" aria-live="polite">
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
