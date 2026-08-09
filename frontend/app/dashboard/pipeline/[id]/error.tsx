"use client";

import { ErrorState } from "@/components/ui/error-state";

/**
 * Application detail route error boundary (P12-WK, C2/C11).
 * Renders ErrorState with a reset action so the user can retry without a
 * full navigation.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-container py-12">
      <ErrorState
        title="Couldn't load this application"
        description={error.message || "An unexpected error occurred."}
        retryLabel="Try again"
        onRetry={reset}
      />
    </main>
  );
}
