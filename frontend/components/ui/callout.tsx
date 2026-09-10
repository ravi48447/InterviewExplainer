import * as React from 'react'
import { Info, Lightbulb, AlertTriangle, Code2, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Callout — semantic content admonition (P01-T206..T211).
 *
 * Variants: note, tip, warning, example, takeaway.
 * Each variant maps to a token-driven color + icon. `CalloutTitle` and
 * `CalloutContent` are provided for structured use; free children render
 * inside CalloutContent.
 */
type CalloutVariant = 'note' | 'tip' | 'warning' | 'example' | 'takeaway'

const calloutConfig: Record<
  CalloutVariant,
  { icon: React.ElementType; classes: string; titleClass: string }
> = {
  note: {
    icon: Info,
    classes: 'border-border bg-muted/40',
    titleClass: 'text-foreground',
  },
  tip: {
    icon: Lightbulb,
    classes: 'border-primary/30 bg-primary/5',
    titleClass: 'text-primary',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-warning/40 bg-warning/10',
    titleClass: 'text-warning',
  },
  example: {
    icon: Code2,
    classes: 'border-border bg-surface',
    titleClass: 'text-foreground',
  },
  takeaway: {
    icon: Sparkles,
    classes: 'border-success/30 bg-success/5',
    titleClass: 'text-success',
  },
}

interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: CalloutVariant
  title?: React.ReactNode
}

export function Callout({
  variant = 'note',
  title,
  className,
  children,
  ...props
}: CalloutProps) {
  const config = calloutConfig[variant]
  const Icon = config.icon
  return (
    <div
      role="note"
      className={cn('my-4 flex gap-3 rounded-md border p-4', config.classes, className)}
      {...props}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-1">
        {title && (
          <p className={cn('text-sm font-semibold', config.titleClass)}>{title}</p>
        )}
        {children && <div className="text-sm text-muted-foreground">{children}</div>}
      </div>
    </div>
  )
}
