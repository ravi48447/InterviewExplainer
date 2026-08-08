import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * ShellLoading — canonical shell loading states (P03-T, T217..T227).
 *
 * Replaces the global "Loading…" spinner (app/loading.tsx) with layout-
 * preserving feedback (T218): the header and main shell stay mounted; only
 * the content area shows a skeleton that matches the expected layout, so
 * the page doesn't visually jump.
 *
 * Avoids full-screen spinners (T222) — the shell frame (header/nav/footer)
 * remains stable during navigation (T223). Reduced motion is honored by
 * using skeleton blocks (which animate via shimmer, not motion) rather than
 * spinning indicators; the shimmer respects prefers-reduced-motion in
 * globals.css (T227).
 */
export function ShellLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading content…</span>
      {/* Breadcrumb placeholder */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-3" />
        <Skeleton className="h-4 w-32" />
      </div>
      {/* Title block */}
      <Skeleton className="mb-3 h-9 w-3/4" />
      <Skeleton className="mb-6 h-4 w-1/2" />
      {/* Content blocks */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className={cn('h-4', i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-5/6' : 'w-2/3')} />
        ))}
      </div>
    </div>
  )
}

/**
 * ShellLoadingMinimal — for islands where a full skeleton is too much.
 * Used by the header search results, dropdown content, etc.
 */
export function ShellLoadingMinimal({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 p-2" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  )
}

/**
 * HeaderLoading — placeholder for the header action area while auth/theme
 * mount-gate. Keeps the header from shifting (T045, T296).
 */
export function HeaderLoading() {
  return <span className="inline-flex h-9 w-9" aria-hidden="true" />
}
