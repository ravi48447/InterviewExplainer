'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * ThemeToggle — canonical theme control (P03-T124..T131).
 *
 * One placement (header action island). Cycles light/dark/system so the
 * toggle supports all three modes (T126, T127, T128). Mount-gated to avoid
 * theme flash (T130). Accessible label (T129).
 *
 * Why a dropdown (not a single button): `next-themes` resolves `system` into
 * light/dark at runtime, so exposing all three choices is clearer than a
 * binary toggle that hides the "system" option.
 */

type ThemeChoice = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Mount gate prevents a flash of the wrong icon + hydration mismatch.
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Reserve stable dimensions so the header doesn't shift (T045, T296).
    return <span className="inline-flex h-9 w-9 touch-target-lg" aria-hidden="true" />
  }

  const current = (theme as ThemeChoice) ?? 'system'
  const Icon = resolvedTheme === 'dark' ? Moon : Sun

  const choices: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 touch-target-lg text-muted-foreground hover:text-foreground"
          aria-label={`Switch theme. Current: ${current}`}
        >
          <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {choices.map((c) => (
          <DropdownMenuItem
            key={c.value}
            onClick={() => setTheme(c.value)}
            aria-checked={current === c.value}
            className={cn('cursor-pointer flex items-center gap-2', current === c.value && 'font-semibold')}
          >
            <c.icon className="h-4 w-4" aria-hidden="true" />
            <span>{c.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
