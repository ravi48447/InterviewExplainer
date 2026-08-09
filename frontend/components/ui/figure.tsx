import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Figure — diagram/media container with caption (P01-T214..T216).
 *
 * Wraps an image, diagram, or media element with an optional caption.
 * Use for any non-text visual content that needs a label.
 */
interface FigureProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: React.ReactNode
}

export function Figure({ caption, className, children, ...props }: FigureProps) {
  return (
    <figure
      className={cn('my-4 flex flex-col gap-2', className)}
      {...props}
    >
      <div className="overflow-hidden rounded-md border border-border bg-surface">
        {children}
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  )
}
