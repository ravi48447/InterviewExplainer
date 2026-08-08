/**
 * pipeline-shell.tsx — Application pipeline client shell (P12-WG..WK, T321..T540).
 *
 * Owns the pipeline kanban state: loads applications, groups into columns,
 * and handles status moves via @/lib/opportunity loaders.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchApplications,
  buildPipeline,
  computePipelineStats,
  updateApplicationStatus,
} from "@/lib/opportunity";
import type { Application, ApplicationStatus, PipelineColumn } from "@/lib/opportunity";
import { PipelineKanban } from "./pipeline-kanban";

const DEMO_USER = "demo-user";

export function PipelineShell() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [columns, setColumns] = useState<PipelineColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const apps = await fetchApplications(DEMO_USER);
        if (cancelled) return;
        setApplications(apps);
        setColumns(buildPipeline(apps));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMove = useCallback(
    async (applicationId: string, toStatus: ApplicationStatus) => {
      // Optimistic update.
      setApplications((prev) => {
        const next = prev.map((a) =>
          a.id === applicationId ? { ...a, status: toStatus } : a,
        );
        setColumns(buildPipeline(next));
        return next;
      });
      await updateApplicationStatus(applicationId, toStatus);
    },
    [],
  );

  const stats = computePipelineStats(applications);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Active" value={stats.activeCount} />
        <StatCard label="Interviewing" value={stats.interviewing} />
        <StatCard label="Offers" value={stats.offer} />
        <StatCard label="Total" value={stats.total} />
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm font-medium text-foreground">No applications yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Save or apply to opportunities to populate your pipeline.
          </p>
        </div>
      ) : (
        <PipelineKanban columns={columns} onMove={handleMove} />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
