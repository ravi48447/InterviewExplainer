"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] px-6">
      <ErrorState
        title="Failed to load dashboard"
        description="Something went wrong while loading your dashboard data. Please try again."
        retryLabel="Retry"
        onRetry={reset}
        className="max-w-md"
      />
    </div>
  );
}
