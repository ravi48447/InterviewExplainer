/**
 * opportunity-detail-shell.tsx — Client wrapper for the opportunity detail
 * route (P12-WF, T181..T260). Owns apply/save actions against @/lib/opportunity.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchOpportunity,
  createApplication,
  saveOpportunity,
} from "@/lib/opportunity";
import type { Opportunity } from "@/lib/opportunity";
import { JobDetail } from "./job-detail";

const DEMO_USER = "demo-user";

export interface OpportunityDetailShellProps {
  opportunityId: string;
}

export function OpportunityDetailShell({ opportunityId }: OpportunityDetailShellProps) {
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await fetchOpportunity(opportunityId);
      if (!cancelled) {
        setOpp(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [opportunityId]);

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
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!opp) {
    return (
      <p className="text-center text-sm text-muted-foreground py-24">
        This opportunity is no longer available.
      </p>
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
