/**
 * application-detail.tsx — Single application timeline view (P12-WK, T481..T540).
 *
 * Renders the application status header + event timeline (status transitions
 * with timestamps and notes).
 */

import { History, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Application, ApplicationStatus } from "@/lib/opportunity";
import { STATUS_LABEL } from "@/lib/opportunity";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export interface ApplicationDetailProps {
  application: Application;
}

/** Map application status to semantic badge variant (C4 — color tokens). */
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

export function ApplicationDetail({ application: app }: ApplicationDetailProps) {
  const events = [...app.events].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/pipeline">Pipeline</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{app.opportunityId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="type-display text-2xl font-bold text-foreground">
              {app.opportunityId}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Applied {new Date(app.appliedAt).toLocaleDateString()}
            </p>
          </div>
          <Badge variant={STATUS_VARIANT[app.status]} className="capitalize">
            {STATUS_LABEL[app.status]}
          </Badge>
        </div>
        {app.note && (
          <p className="text-sm text-muted-foreground mt-3 italic">&ldquo;{app.note}&rdquo;</p>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-bold text-foreground">Timeline</h2>
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground" role="status">
            No events yet.
          </p>
        ) : (
          <ol className="relative border-l-2 border-border ml-3 space-y-5" aria-live="polite">
            {events.map((evt) => (
              <li key={evt.id} className="pl-5 relative">
                <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_VARIANT[evt.status]} className="capitalize">
                    {STATUS_LABEL[evt.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {new Date(evt.occurredAt).toLocaleString()}
                  </span>
                </div>
                {evt.note && (
                  <p className="text-xs text-muted-foreground mt-1">{evt.note}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
