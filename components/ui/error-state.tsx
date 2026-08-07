import * as React from 'react'
import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * ErrorState — full-region error placeholder (P01-T189).
 *
 * Used when a region/section fails to load (not a full-page crash — use
 * error boundaries for those). Provides icon, title, description, and an
 * optional retry action.
 */
interface ErrorStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  retryLabel?: string
  onRetry?: () => void
  icon?: React.ElementType
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading this content.',
  retryLabel,
  onRetry,
  icon: Icon = AlertCircle,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-md border border-border bg-card p-8 text-center',
        className,
      )}
      {...props}
    >
      <Icon className="h-10 w-10 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          {retryLabel ?? 'Try again'}
        </Button>
      )}
    </div>
  )
}
