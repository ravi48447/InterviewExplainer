'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Loader2, LogIn, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * HeaderUserActions — canonical auth-aware header actions (P03-T107..T123).
 *
 * Consolidates the duplicate user menu that lived in the monolithic
 * SiteHeader. Three render states, designed so the header never shifts:
 *
 *   loading  → reserved icon-sized placeholder (T116, T117, T045)
 *   anon     → "Log in" ghost + "Sign up" outline (T109, T110)
 *   auth     → avatar dropdown: Dashboard / Account / Profile / Log out (T112..T115)
 *
 * The public shell renders even when auth is unknown/slow (T118). No user
 * data is fetched for anonymous public visitors (T120). A failed auth
 * check can't break the shell (T123) — we just render the anon state.
 *
 * Anonymous CTA links are crawlable `<Link>` anchors (Z056, T110).
 */
export function HeaderUserActions() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Stable reserved space so the header doesn't jump when auth resolves.
  if (loading) {
    return (
      <span
        className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground/50"
        aria-label="Checking sign-in state"
        aria-hidden="true"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center">
        <Button asChild variant="primary" size="sm" className="h-9 px-4 text-sm font-medium shadow-sm">
          <Link href="/login">
            Sign in
          </Link>
        </Button>
      </div>
    )
  }

  const initials = (user.name || user.email || 'U')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  const onLogout = () => {
    setOpen(false)
    logout()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          aria-label={`Account menu for ${user.name || user.email}`}
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          <span className="block text-sm font-medium text-foreground">{user.name || 'Account'}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { setOpen(false); router.push('/dashboard') }} className="cursor-pointer">
          <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden="true" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setOpen(false); router.push('/account') }} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setOpen(false); router.push('/profile') }} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Compact variant for auth/dashboard shells where space is tighter — keeps
 * the avatar only, no anon CTAs. Lets a variant compose without re-fetching.
 */
export function HeaderUserActionsCompact() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  if (loading) return <span className="inline-flex h-9 w-9" aria-hidden="true" />
  if (!user) {
    return (
      <Button asChild variant="ghost" size="icon" className="h-9 w-9" aria-label="Log in">
        <Link href="/login"><LogIn className="h-[1.15rem] w-[1.15rem]" /></Link>
      </Button>
    )
  }

  const initials = (user.name || user.email || 'U')
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map((p) => p[0]?.toUpperCase()).join('')

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label={`Account menu for ${user.name || user.email}`}>
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          <span className="block text-sm font-medium">{user.name || 'Account'}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { setOpen(false); router.push('/dashboard') }} className="cursor-pointer">
          <LayoutDashboard className="mr-2 h-4 w-4" />Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setOpen(false); router.push('/account') }} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setOpen(false); router.push('/profile') }} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { setOpen(false); logout() }} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
