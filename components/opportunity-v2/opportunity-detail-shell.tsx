/**
 * opportunity-detail-shell.tsx — Client wrapper for the opportunity detail
 * route (P12-WF, T181..T260). Owns apply/save actions against @/lib/opportunity.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchOpportunity,
  createApplication,
  saveOpportunity,
} from "@/lib/opportunity";
import type { Opportunity } from "@/lib/opportunity";
import { JobDetail } from "./job-detail";
import { CardSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";

const DEMO_USER = "demo-user";

export interface OpportunityDetailShellProps {
  opportunityId: string;
}

export function OpportunityDetailShell({ opportunityId }: OpportunityDetailShellProps) {
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOpportunity(opportunityId);
      setOpp(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load opportunity"));
    } finally {
      setLoading(false);
    }
  }, [opportunityId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApply = useCallback(async () => {
    if (!opp) return;
    setBusy(true);
    try {
      const app = await createApplication(DEMO_USER, opp.id);
      if (app) setStatus(app.status);
    } finally {
      setBusy(false);
    }
  }, [opp]);

  const handleSave = useCallback(async () => {
    if (!opp) return;
    setBusy(true);
    try {
      const app = await saveOpportunity(DEMO_USER, opp.id);
      if (app) setStatus(app.status);
    } finally {
      setBusy(false);
    }
  }, [opp]);

  if (loading) {
    return (
      <div className="space-y-4" aria-live="polite">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load this opportunity"
        description={error.message}
        retryLabel="Try again"
        onRetry={load}
      />
    );
  }

  if (!opp) {
    return (
      <EmptyState
        icon={<FileText />}
        title="Opportunity no longer available"
        description="This opportunity may have been removed or expired."
        actionText="Browse opportunities"
        onAction={() => (window.location.href = "/dashboard/opportunities")}
      />
    );
  }

  return (
    <JobDetail
      opportunity={opp}
      appliedStatus={status}
      onApply={handleApply}
      onSave={handleSave}
      busy={busy}
    />
  );
}
