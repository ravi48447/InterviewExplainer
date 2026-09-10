"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function HistoryError({
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
        title="Failed to load history"
        description="Something went wrong while loading your interview history. Please try again."
        retryLabel="Retry"
        onRetry={reset}
        className="max-w-md"
      />
    </div>
  );
}
