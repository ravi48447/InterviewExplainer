/**
 * pipeline-shell.tsx — Application pipeline client shell (P12-WG..WK, T321..T540).
 *
 * Owns the pipeline kanban state: loads applications, groups into columns,
 * and handles status moves via @/lib/opportunity loaders.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchApplications,
  buildPipeline,
  computePipelineStats,
  updateApplicationStatus,
} from "@/lib/opportunity";
import type { Application, ApplicationStatus, PipelineColumn } from "@/lib/opportunity";
import { PipelineKanban } from "./pipeline-kanban";
import { CardSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderKanban } from "lucide-react";

const DEMO_USER = "demo-user";

export function PipelineShell() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [columns, setColumns] = useState<PipelineColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apps = await fetchApplications(DEMO_USER);
      setApplications(apps);
      setColumns(buildPipeline(apps));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load pipeline"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
      <div className="max-w-7xl mx-auto space-y-6" aria-live="polite">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <CardSkeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load your pipeline"
        description={error.message}
        retryLabel="Try again"
        onRetry={load}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6" aria-live="polite">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Active" value={stats.activeCount} />
        <StatCard label="Interviewing" value={stats.interviewing} />
        <StatCard label="Offers" value={stats.offer} />
        <StatCard label="Total" value={stats.total} />
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<FolderKanban />}
          title="No applications yet"
          description="Save or apply to opportunities to populate your pipeline."
          actionText="Browse opportunities"
          onAction={() => (window.location.href = "/dashboard/opportunities")}
        />
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
