import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success:
          'border-transparent bg-success/15 text-success border border-success/30',
        warning:
          'border-transparent bg-warning/15 text-warning border border-warning/30',
        info:
          'border-transparent bg-info/15 text-info border border-info/30',
        premium:
          'border-transparent bg-gradient-to-r from-primary/20 via-indigo-500/20 to-purple-600/20 text-indigo-400 border border-primary/30',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
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
  dot?: boolean
  dotClassName?: string
}

function Badge({ className, variant, dot = false, dotClassName, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-current animate-pulse",
            dotClassName
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
