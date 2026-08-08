'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'

/**
 * ShellError — canonical route-level error boundary content (P03-U, T228..T237).
 *
 * Used by route `error.tsx` files. Hierarchy (T228):
 *   recoverable  → route error (this) — shows recovery actions, keeps shell
 *   unrecoverable → root error (RootShellError) — full-page fallback
 *
 * Recovery actions (T230): "Try again" (reset) + "Go home". Avoids exposing
 * internal details (T231): the digest is shown only in development. Preserves
 * nav during errors (T232) — this renders inside the shell's main, so the
 * header/footer stay mounted. Distinguishes error vs not-found (T233): the
 * 404 page is a separate component with its own messaging.
 *
 * Temporary vs missing (T234): if `temporary` is true, the copy emphasizes
 * "this is temporary, try again"; otherwise it acknowledges a problem.
 */
export function ShellError({
  error,
  reset,
  temporary = true,
}: {
  error: Error & { digest?: string }
  reset: () => void
  temporary?: boolean
}) {
  useEffect(() => {
    // Log to the error reporter without exposing details to the user (T231).
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="sr-only">Error</h1>
      <ErrorState
        icon={AlertTriangle}
        title={temporary ? 'Something went wrong' : 'This page hit a problem'}
        description={
          temporary
            ? 'A temporary error occurred while loading this page. Please try again — the rest of the site is unaffected.'
            : 'We hit an unexpected problem loading this page. Our team has been notified. You can try again or head back home.'
        }
        retryLabel="Try again"
        onRetry={reset}
        className="border-dashed"
      />

      {process.env.NODE_ENV === 'development' && error.digest && (
        <p className="mt-3 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground text-center">
          digest: {error.digest}
        </p>
      )}

      <div className="mt-4 flex items-center justify-center">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  )
}

/**
 * RootShellError — canonical root-level error fallback (P03-U, T237).
 *
 * Used by the root `app/error.tsx` when the shell itself can't render. Full-
 * page (no header/footer, since they may also have failed) but still offers
 * recovery. This is the "unrecoverable" tier of the error hierarchy.
 * Keeps minimal layout deps — ErrorState is a self-contained div, no shell
 * or provider required.
 */
export function RootShellError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Root shell error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen items-center justify-center px-4">
          <ErrorState
            icon={AlertTriangle}
            title="The site hit a problem"
            description="Something went wrong on our end. Please try again in a moment."
            retryLabel="Try again"
            onRetry={reset}
            className="max-w-md"
          />
        </div>
      </body>
    </html>
  )
}
