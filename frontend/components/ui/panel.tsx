import * as React from 'react'

import { cn } from '@/lib/utils'

interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Visual emphasis. `default` = subtle surface; `elevated` = raised. */
  variant?: 'default' | 'elevated'
  /** Optional title shown in the panel header row. */
  title?: React.ReactNode
  /** Optional description shown under the title. */
  description?: React.ReactNode
  /** Optional actions rendered on the trailing side of the header. */
  actions?: React.ReactNode
}

/**
 * Panel — canonical application panel (P01-T135).
 *
 * Separates application/utility panels (sidebar tools, inspector regions,
 * settings groups) from generic content cards. A panel has a flatter, more
 * utilitarian look than a card: a subtle surface, a header row with an
 * optional title/description/actions slot, and no decorative hover. Use
 * Card for content surfaces and Panel for chrome surfaces.
 */
export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant = 'default', title, description, actions, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border',
        variant === 'elevated'
          ? 'bg-surface-elevated border-border shadow-sm'
          : 'bg-surface border-border',
        className,
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 border-b border-border p-4">
          <div className="space-y-1">
            {title && (
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  ),
)
Panel.displayName = 'Panel'
