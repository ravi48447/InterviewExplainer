/**
 * pipeline-kanban.tsx — Application pipeline kanban (P12-WG..WK, T321..T540).
 *
 * Renders applications grouped by status into ordered columns. Each card shows
 * the role/company and links to the detail. Supports dragging a status update
 * via the per-card dropdown (graceful on touch).
 */

"use client";

import Link from "next/link";
import { Briefcase, ChevronRight } from "lucide-react";
import type { Application, ApplicationStatus, PipelineColumn } from "@/lib/opportunity";
import { STATUS_LABEL } from "@/lib/opportunity";

export interface PipelineKanbanProps {
  columns: PipelineColumn[];
  onMove: (applicationId: string, toStatus: ApplicationStatus) => void;
}

export function PipelineKanban({ columns, onMove }: PipelineKanbanProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
      {columns.map((col) => (
        <div key={col.status} className="rounded-xl border border-border bg-muted/20 p-3 min-w-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              {col.label}
            </h3>
            <span className="text-xs font-semibold text-muted-foreground rounded-full bg-card border border-border px-2 py-0.5">
              {col.applications.length}
            </span>
          </div>
          <div className="space-y-2">
            {col.applications.map((app) => (
              <PipelineCard key={app.id} application={app} onMove={onMove} />
            ))}
            {col.applications.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">Empty</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function PipelineCard({
  application: app,
  onMove,
}: {
  application: Application;
  onMove: (applicationId: string, toStatus: ApplicationStatus) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 group">
      <Link
        href={`/dashboard/pipeline/${app.id}`}
        className="block min-w-0"
      >
        <p className="text-sm font-semibold text-foreground truncate">
          {app.opportunityId}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          {new Date(app.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </p>
      </Link>
      <div className="mt-2">
        <select
          value={app.status}
          onChange={(e) => onMove(app.id, e.target.value as ApplicationStatus)}
          className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-label="Move application"
        >
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute" />
    </div>
  );
}
