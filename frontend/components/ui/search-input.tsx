'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

/**
 * SearchInput — standardized search field (P01-T161..T167).
 *
 * Features:
 * - Leading search icon (visual affordance).
 * - Clear button (X) when there is a value and the field is focused/hovered.
 * - Loading state (spinner replaces clear button).
 * - Empty result hint rendered as a lightweight dropdown when `empty` is set.
 * - Optional keyboard shortcut hint (e.g. "⌘K") shown on desktop only.
 * - Mobile: full width, larger touch target via `inputSize` default.
 */
interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  loading?: boolean
  empty?: React.ReactNode
  shortcut?: string
  inputSize?: 'sm' | 'default' | 'lg'
  onClear?: () => void
}

const sizeClasses = {
  sm: 'h-9 text-sm',
  default: 'h-10 text-sm',
  lg: 'h-12 text-base',
} as const

export function SearchInput({
  loading = false,
  empty,
  shortcut,
  inputSize = 'default',
  onClear,
  className,
  value,
  defaultValue,
  onChange,
  ...props
}: SearchInputProps) {
  const [internal, setInternal] = React.useState('')
  const isControlled = value !== undefined
  const currentValue = isControlled ? (value as string) : internal
  const [focused, setFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const showClear = !loading && currentValue.length > 0 && (focused || currentValue.length > 0)
  const showShortcut = !!shortcut && currentValue.length === 0 && !loading

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="searchbox"
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => {
            if (!isControlled) setInternal(e.target.value)
            onChange?.(e)
          }}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
          className={cn(
            'w-full rounded-md border border-input bg-input px-9 text-foreground',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            '[&::-webkit-search-cancel-button]:appearance-none',
            sizeClasses[inputSize],
          )}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Clear search"
            onClick={() => {
              if (!isControlled) setInternal('')
              onClear?.()
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {showShortcut && (
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            {shortcut}
          </kbd>
        )}
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner size="sm" label="Searching" />
          </span>
        )}
      </div>
      {empty && focused && currentValue.length > 0 && (
        <div
          role="status"
          className="absolute z-10 mt-2 w-full rounded-md border border-border bg-popover p-3 text-sm text-muted-foreground shadow-md"
        >
          {empty}
        </div>
      )}
    </div>
  )
}
