"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" strokeWidth={1.5} />
      <h2 className="text-xl font-bold text-foreground mb-2">Failed to load dashboard</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Something went wrong while loading your dashboard data. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
      >
        Retry
      </button>
    </div>
  );
}
