/**
 * application-detail-shell.tsx — Client wrapper for the application detail
 * route (P12-WK, T481..T540). Loads a single application by id.
 */

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchApplications } from "@/lib/opportunity";
import type { Application } from "@/lib/opportunity";
import { ApplicationDetail } from "./application-detail";

const DEMO_USER = "demo-user";

export interface ApplicationDetailShellProps {
  applicationId: string;
}

export function ApplicationDetailShell({ applicationId }: ApplicationDetailShellProps) {
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const apps = await fetchApplications(DEMO_USER);
      if (cancelled) return;
      setApp(apps.find((a) => a.id === applicationId) ?? null);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!app) {
    return (
      <p className="text-center text-sm text-muted-foreground py-24">
        Application not found.
      </p>
    );
  }

  return <ApplicationDetail application={app} />;
}
