import * as React from 'react'

import { cn } from '@/lib/utils'

interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  /** Optional actions rendered on the trailing side (buttons, links). */
  actions?: React.ReactNode
  /** Heading level for the title (semantic, defaults to h2). */
  as?: 'h1' | 'h2' | 'h3' | 'h4'
}

/**
 * SectionHeader — canonical section heading pattern (P01-T136).
 *
 * Standardizes the title + optional description + optional actions row at the
 * top of a content section. Keeps heading semantics (one per section),
 * consistent spacing, and a clean trailing-actions slot so routes stop
 * hand-rolling `<div className="flex justify-between mb-4">` everywhere.
 */
export function SectionHeader({
  title,
  description,
  actions,
  as: Heading = 'h2',
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}
      {...props}
    >
      <div className="space-y-1">
        <Heading className="type-section text-foreground">{title}</Heading>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
