/**
 * pipeline-kanban.tsx — Application pipeline kanban (P12-WG..WK, T321..T540).
 *
 * Renders applications grouped by status into ordered columns. Each card shows
 * the role/company and links to the detail. Supports dragging a status update
 * via the per-card dropdown (graceful on touch).
 */

"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import type { Application, ApplicationStatus, PipelineColumn } from "@/lib/opportunity";
import { STATUS_LABEL } from "@/lib/opportunity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export interface PipelineKanbanProps {
  columns: PipelineColumn[];
  onMove: (applicationId: string, toStatus: ApplicationStatus) => void;
}

/** Map pipeline status to semantic badge variant (C4 — color tokens). */
const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "success" | "warning" | "destructive" | "primary" | "info"
> = {
  saved: "default",
  applied: "info",
  screening: "info",
  interviewing: "warning",
  offer: "success",
  rejected: "destructive",
  withdrawn: "default",
};

export function PipelineKanban({ columns, onMove }: PipelineKanbanProps) {
  return (
    <div
      className="grid gap-3 md:grid-cols-4 xl:grid-cols-7"
      aria-live="polite"
      aria-label="Application pipeline board"
    >
      {columns.map((col) => (
        <div key={col.status} className="rounded-xl border border-border bg-muted/20 p-3 min-w-0">
          <div className="sticky top-0 z-[var(--z-sticky)] flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              {col.label}
            </h3>
            <Badge variant={STATUS_VARIANT[col.status]} className="text-xs">
              {col.applications.length}
            </Badge>
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
    <div className="rounded-lg border border-border bg-card p-3 transition-colors duration-200 ease-out hover:border-primary/40">
      <Link
        href={`/dashboard/pipeline/${app.id}`}
        className="block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      >
        <p className="text-sm font-semibold text-foreground truncate">
          {app.opportunityId}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          <Briefcase className="h-3 w-3" aria-hidden="true" />
          {new Date(app.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </p>
      </Link>
      <div className="mt-2">
        <Select
          value={app.status}
          onValueChange={(v) => onMove(app.id, v as ApplicationStatus)}
        >
          <SelectTrigger
            className="h-8 w-full text-xs touch-target"
            aria-label={`Move ${app.opportunityId} to a new stage`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
