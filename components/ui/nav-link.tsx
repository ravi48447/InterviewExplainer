'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

/**
 * NavLink — standardized navigation link with active state (P01-T168..T171).
 *
 * Uses Next Link under the hood. Renders an active style when `active` is
 * true OR when the href matches the current pathname (via `usePathname`,
 * resolved when `active` is undefined and `matchPath` is true).
 */
interface NavLinkProps
  extends Omit<React.ComponentProps<typeof Link>, 'className'> {
  active?: boolean
  matchPath?: boolean
  variant?: 'default' | 'compact' | 'sidebar'
  className?: string
}

import { usePathname } from 'next/navigation'

export function NavLink({
  active,
  matchPath = true,
  variant = 'default',
  className,
  href,
  children,
  ...props
}: NavLinkProps) {
  const pathname = usePathname()
  const hrefStr = typeof href === 'string' ? href : (href?.pathname ?? '')
  const isActive = active ?? (matchPath ? pathname === hrefStr : false)

  const variantClasses = {
    default: 'px-3 py-2 text-sm font-medium rounded-md',
    compact: 'px-2 py-1 text-sm rounded-md',
    sidebar: 'px-3 py-2 text-sm font-medium rounded-md w-full',
  } as const

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex items-center gap-2 transition-colors',
        variantClasses[variant],
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
