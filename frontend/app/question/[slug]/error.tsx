"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

export default function QuestionError({
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
    <div className="page-container py-12">
      <ErrorState
        title="Failed to load question"
        description="This question could not be loaded. It may have been moved or is temporarily unavailable."
        retryLabel="Retry"
        onRetry={reset}
        icon={AlertTriangle}
        className="min-h-[50vh]"
      />
    </div>
  );
}
