'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:py-24">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {temporary ? 'Something went wrong' : 'This page hit a problem'}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {temporary
          ? 'A temporary error occurred while loading this page. Please try again — the rest of the site is unaffected.'
          : 'We hit an unexpected problem loading this page. Our team has been notified. You can try again or head back home.'}
      </p>

      {process.env.NODE_ENV === 'development' && error.digest && (
        <p className="mt-3 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
          digest: {error.digest}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={reset} size="default">
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
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
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            The site hit a problem
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Something went wrong on our end. Please try again in a moment.
          </p>
          <button
            onClick={reset}
            className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
