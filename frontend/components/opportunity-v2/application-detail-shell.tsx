/**
 * application-detail-shell.tsx — Client wrapper for the application detail
 * route (P12-WK, T481..T540). Loads a single application by id.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchApplications } from "@/lib/opportunity";
import type { Application } from "@/lib/opportunity";
import { ApplicationDetail } from "./application-detail";
import { CardSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";

const DEMO_USER = "demo-user";

export interface ApplicationDetailShellProps {
  applicationId: string;
}

export function ApplicationDetailShell({ applicationId }: ApplicationDetailShellProps) {
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apps = await fetchApplications(DEMO_USER);
      setApp(apps.find((a) => a.id === applicationId) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load application"));
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-4" aria-live="polite">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load this application"
        description={error.message}
        retryLabel="Try again"
        onRetry={load}
      />
    );
  }

  if (!app) {
    return (
      <EmptyState
        icon={<FileText />}
        title="Application not found"
        description="This application may have been removed or the link is invalid."
        actionText="Back to pipeline"
        onAction={() => (window.location.href = "/dashboard/pipeline")}
      />
    );
  }

  return <ApplicationDetail application={app} />;
}
