"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

export default function DomainError({
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
        title="Failed to load domain"
        description="This domain could not be loaded. It may have been moved or is temporarily unavailable."
        retryLabel="Retry"
        onRetry={reset}
        icon={AlertTriangle}
        className="min-h-[50vh]"
      />
      <div className="mt-4 text-center">
        <Link
          href="/domains"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          Browse all domains
        </Link>
      </div>
    </div>
  );
}
