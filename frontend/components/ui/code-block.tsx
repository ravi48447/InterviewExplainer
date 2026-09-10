'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * CodeBlock — standardized code container with header + copy (P01-T200..T205).
 *
 * Features:
 * - Optional header strip: language label + filename + copy button.
 * - Copy-to-clipboard with a transient "Copied" state (2s).
 * - Horizontal overflow scroll with visible scroll affordance.
 * - `CodeInline` export for inline code within prose.
 *
 * Note: syntax highlighting is intentionally NOT bundled here to avoid a
 * heavy dependency. Apply highlighting at the page level by passing an
 * already-highlighted React node as children (e.g. via a rehype plugin).
 */
interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  language?: string
  filename?: string
  showCopy?: boolean
  showLineNumbers?: boolean
}

export function CodeBlock({
  language,
  filename,
  showCopy = true,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const codeRef = React.useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    const text = codeRef.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable; no-op
    }
  }

  const hasHeader = language || filename || showCopy
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border bg-surface shadow-sm',
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
          <span className="font-mono text-xs text-muted-foreground">
            {filename ?? language ?? 'code'}
          </span>
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy code'}
              className="inline-flex items-center gap-1 rounded-sm px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <pre
        ref={codeRef}
        className={cn(
          'overflow-x-auto p-4 text-sm leading-relaxed',
          'font-mono text-foreground',
          '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-border',
        )}
      >
        {children}
      </pre>
    </div>
  )
}

export function CodeInline({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground',
        className,
      )}
      {...props}
    />
  )
}
