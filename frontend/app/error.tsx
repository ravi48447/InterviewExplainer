"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (e.g. Sentry) when configured
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <AlertTriangle className="w-14 h-14 text-destructive mb-6" strokeWidth={1.5} />
      <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        An unexpected error occurred. This has been logged and we will look into it.
        {error.digest && (
          <span className="block mt-1 text-xs font-mono text-muted-foreground/60">
            Error ID: {error.digest}
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
