import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * TableWrapper — responsive table scroll + caption affordance (P01-T212..T216).
 *
 * Tables often overflow on narrow viewports. This wrapper provides:
 * - Horizontal scroll with a visible scrollbar affordance.
 * - Optional `caption` rendered visually-hidden for AT.
 * - A `.table-v2` class hook for scoped styling of the inner <table>.
 */
interface TableWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: React.ReactNode
}

export function TableWrapper({ caption, className, children, ...props }: TableWrapperProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-md border border-border bg-card',
        '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-border',
        className,
      )}
      {...props}
    >
      {caption && <span className="sr-only">{caption}</span>}
      <table className="table-v2 w-full caption-bottom text-sm">{children}</table>
    </div>
  )
}
