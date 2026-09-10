import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Skeleton — loading placeholder (P01-T187, T188).
 *
 * Base shimmer block. Use the preset composites (TextSkeleton /
 * CardSkeleton / ListSkeleton) for common patterns rather than
 * hand-rolling repeated skeletons.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

/**
 * TextSkeleton — multi-line text placeholder (P01-T188).
 */
function TextSkeleton({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
}

/**
 * CardSkeleton — card-shaped placeholder (P01-T188).
 */
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-md border border-border bg-card p-4', className)} aria-hidden="true">
      <Skeleton className="mb-3 h-4 w-1/3" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

/**
 * ListSkeleton — repeating list placeholder (P01-T188).
 */
function ListSkeleton({
  rows = 4,
  className,
}: {
  rows?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-3', className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export { Skeleton, TextSkeleton, CardSkeleton, ListSkeleton }
