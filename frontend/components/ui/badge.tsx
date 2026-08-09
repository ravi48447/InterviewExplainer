import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Badge — canonical V2 badge primitive (P01-T141).
 *
 * Restrained semantic badges. Variants map to real status semantics
 * (T143) and difficulty semantics (T142) — no arbitrary category colors
 * (T147). A neutral metadata variant (T144) covers low-emphasis labels.
 * The dot indicator is opt-in for live/status badges.
 *
 * For content tags (keyword/topic labels, not status), use the Tag
 * component instead (T145) — it is deliberately lower-emphasis.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        // T144 — neutral metadata: low-emphasis label.
        default: 'border-border bg-muted text-muted-foreground',
        // T143 — status: success.
        success: 'border-success/20 bg-success/10 text-success',
        // T143 — status: warning.
        warning: 'border-warning/20 bg-warning/10 text-warning',
        // T143 — status: error / destructive.
        destructive: 'border-destructive/20 bg-destructive/10 text-destructive',
        // T143 — status: info.
        info: 'border-info/20 bg-info/10 text-info',
        // T142 — difficulty: easy.
        'difficulty-easy':
          'border-difficulty-easy/20 bg-difficulty-easy/10 text-difficulty-easy',
        // T142 — difficulty: medium.
        'difficulty-medium':
          'border-difficulty-medium/20 bg-difficulty-medium/10 text-difficulty-medium',
        // T142 — difficulty: hard.
        'difficulty-hard':
          'border-difficulty-hard/20 bg-difficulty-hard/10 text-difficulty-hard',
        // Primary accent badge — use sparingly (T146).
        primary: 'border-transparent bg-primary text-primary-foreground',
        // Outline — low-emphasis with foreground text.
        outline: 'border-border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a leading status dot (use for live/active states). */
  dot?: boolean
  dotClassName?: string
}

function Badge({ className, variant, dot = false, dotClassName, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full bg-current',
            dotClassName,
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
