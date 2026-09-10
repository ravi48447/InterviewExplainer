'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * PrevNextNav — previous/next page navigation pair (P01-T175).
 *
 * Renders two cards (prev, next) used at the bottom of article-style pages.
 * Each card shows a directional chevron, a label, and the target title.
 * Responsive: stacks vertically on mobile, row on sm+.
 */
interface PrevNextItem {
  href: string
  title: string
  label?: string
}

interface PrevNextNavProps extends React.HTMLAttributes<HTMLElement> {
  prev?: PrevNextItem
  next?: PrevNextItem
}

export function PrevNextNav({ prev, next, className, ...props }: PrevNextNavProps) {
  if (!prev && !next) return null
  return (
    <nav aria-label="Pagination" className={cn('grid gap-3 sm:grid-cols-2', className)} {...props}>
      {prev && (
        <Link
          href={prev.href}
          className={cn(
            'group flex flex-col gap-1 rounded-md border border-border bg-card p-4',
            'transition-colors hover:border-border-strong hover:bg-muted/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          )}
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            {prev.label ?? 'Previous'}
          </span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary">
            {prev.title}
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={next.href}
          className={cn(
            'group flex flex-col gap-1 rounded-md border border-border bg-card p-4 text-right',
            'transition-colors hover:border-border-strong hover:bg-muted/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            !prev && 'sm:col-start-2',
          )}
        >
          <span className="inline-flex items-center justify-end gap-1 text-xs font-medium text-muted-foreground">
            {next.label ?? 'Next'}
            <ChevronRight className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  )
}
