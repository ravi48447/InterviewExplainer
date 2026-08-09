/**
 * job-detail.tsx — Opportunity detail view (P12-WF, T181..T260).
 *
 * Renders the full job description, requirements, skills, compensation, and
 * apply / save actions. The parent owns the application state.
 */

"use client";

import { Building2, MapPin, Banknote, Briefcase, Clock, ExternalLink, Bookmark, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import type { Opportunity, WorkMode, SeniorityBand } from "@/lib/opportunity";

export interface JobDetailProps {
  opportunity: Opportunity;
  /** Existing application for this opportunity, if any. */
  appliedStatus?: string | null;
  onApply: () => void;
  onSave: () => void;
  busy?: boolean;
}

const WORK_MODE_LABEL: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

const SENIORITY_LABEL: Record<SeniorityBand, string> = {
  intern: "Intern",
  entry: "Entry-level",
  mid: "Mid-level",
  senior: "Senior",
  staff: "Staff",
  lead: "Lead",
  manager: "Manager",
  director: "Director",
};

export function JobDetail({ opportunity: opp, appliedStatus, onApply, onSave, busy }: JobDetailProps) {
  const posted = new Date(opp.postedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

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
              <Link href="/dashboard/opportunities">Opportunities</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{opp.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="type-display text-2xl font-bold text-foreground">{opp.title}</h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {opp.company}
            </p>
          </div>
          {opp.matchScore != null && (
            <div className="text-center shrink-0 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <span className="text-xs text-muted-foreground block">Match</span>
              <span className="text-xl font-bold text-primary">{opp.matchScore}%</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
          {opp.seniority && (
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {SENIORITY_LABEL[opp.seniority]}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {WORK_MODE_LABEL[opp.workMode]}
            {opp.locations.length > 0 && ` · ${opp.locations.join(", ")}`}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Posted {posted}
          </span>
          {opp.compensation && (
            <span className="flex items-center gap-1.5">
              <Banknote className="h-4 w-4" />₹{opp.compensation.min / 100000}–{opp.compensation.max / 100000}L
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          {appliedStatus ? (
            <Badge variant="success" className="capitalize">
              {appliedStatus}
            </Badge>
          ) : (
            <Button onClick={onApply} disabled={busy} loading={busy}>
              <Send />
              Apply now
            </Button>
          )}
          <Button onClick={onSave} disabled={busy} variant="outline">
            <Bookmark />
            Save
          </Button>
          {opp.applicationUrl && (
            <a
              href={opp.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              External link
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-3">About the role</h2>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{opp.description}</p>
      </div>

      {/* Requirements */}
      {opp.requirements.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">Requirements</h2>
          <ul className="space-y-2">
            {opp.requirements.map((r, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {opp.skills.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {opp.skills.map((s) => (
              <Tag key={s} variant="outline">
                {s}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
