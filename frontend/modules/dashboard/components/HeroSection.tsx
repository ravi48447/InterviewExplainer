'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, GraduationCap, ChevronDown, Target, CheckCircle2, Flame, LogIn, Play } from 'lucide-react';
import { FocusDomainPicker } from '@/components/dashboard/focus-domain-picker';
import { cn } from '@/lib/utils';
import type { ContentDomain } from '@/lib/types/content-domain';

interface HeroSectionProps {
  user: any;
  isGuest: boolean;
  lvl: { level: number; title: string; toNext: number; pct: number };
  switchingDomain: boolean;
  domainMenuOpen: boolean;
  setDomainMenuOpen: (open: boolean) => void;
  domainDisplayName: string | null;
  selectedDomains: any[];
  activeSlug: string | null;
  applyDomain: (slug: string, name: string) => Promise<void>;
  chooseDomain: (domain: ContentDomain) => Promise<void>;
  domainList: ContentDomain[];
  continueHref: string;
  currentStreak: number;
  done: number;
  greeting: () => string;
  fmtExp: (raw: string | null) => string;
  initialsOf: (name?: string | null) => string;
}

export function HeroSection({
  user,
  isGuest,
  lvl,
  switchingDomain,
  domainMenuOpen,
  setDomainMenuOpen,
  domainDisplayName,
  selectedDomains,
  activeSlug,
  applyDomain,
  chooseDomain,
  domainList,
  continueHref,
  currentStreak,
  done,
  greeting,
  fmtExp,
  initialsOf,
}: HeroSectionProps) {
  return (
    <div className="relative bg-foreground dark:bg-background text-primary-foreground dark:text-foreground border-b border-default">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="relative px-6 lg:px-10 xl:px-16 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="relative h-14 w-14 rounded-xl bg-surface border border-default flex items-center justify-center text-base font-semibold tracking-tight text-primary">
                {isGuest ? <Sparkles className="h-5 w-5 text-muted-foreground" /> : initialsOf(user?.name)}
              </div>
            </div>
            <div>
              <p className="text-secondary text-xs font-medium mb-0.5">{greeting()}</p>
              <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-primary">
                {isGuest ? 'Dashboard Preview' : (user?.name ?? 'Welcome Back')}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                {!isGuest && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-default text-[11px] font-medium text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> {lvl.title} · Level {lvl.level}
                  </span>
                )}
                {!isGuest && user?.experienceLevel && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface border border-default text-[11px] font-medium text-secondary">
                    <GraduationCap className="h-3 w-3 text-muted-foreground" /> {fmtExp(user.experienceLevel)}
                  </span>
                )}
                {!isGuest && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDomainMenuOpen(!domainMenuOpen)}
                      disabled={switchingDomain}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-default text-[11px] font-medium text-secondary hover:bg-hover transition-colors disabled:opacity-60"
                    >
                      <Target className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      {switchingDomain ? 'Saving…' : (domainDisplayName ?? 'Set focus domain')}
                      <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", domainMenuOpen && "rotate-180")} aria-hidden="true" />
                    </button>
                    {domainMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setDomainMenuOpen(false)} />
                        <div className="absolute left-0 top-full mt-1.5 z-30 w-[20rem] max-w-[calc(100vw-3rem)] rounded-xl bg-card shadow-xl border border-default p-3 max-h-[70vh] overflow-y-auto">
                          {selectedDomains.length > 0 && (
                            <div className="mb-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Your dashboards</p>
                              <div className="space-y-1">
                                {selectedDomains.map(dom => {
                                  const active = dom.slug === activeSlug;
                                  return (
                                    <button
                                      key={dom.slug}
                                      type="button"
                                      onClick={() => applyDomain(dom.slug, dom.name)}
                                      className={cn(
                                        'flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                                        active
                                          ? 'border-primary bg-surface text-primary font-semibold'
                                          : 'border-default bg-card text-secondary hover:border-primary hover:bg-surface',
                                      )}
                                    >
                                      <span className="truncate">{dom.name}</span>
                                      {active && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            {selectedDomains.length > 0 ? 'Add another path' : 'Choose focus domain'}
                          </p>
                          <FocusDomainPicker
                            valueSlug={activeSlug}
                            domains={domainList.length > 0 ? domainList : undefined}
                            onSelect={chooseDomain}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
                {isGuest && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface border border-default text-[11px] font-medium text-secondary">
                    <Sparkles className="h-3 w-3 text-muted-foreground" /> Preview Mode
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-3 lg:min-w-[280px]">
            {!isGuest && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-default">
                  <Flame className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold tabular-nums text-primary">{currentStreak}</span>
                  <span className="text-[11px] text-muted-foreground">day streak</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-default">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold tabular-nums text-primary">{done.toLocaleString()}</span>
                  <span className="text-[11px] text-muted-foreground">solved</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              {isGuest ? (
                <>
                  <Link href="/signup" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                    Create Free Account
                  </Link>
                  <Link href="/login?redirect=/dashboard" className="px-5 py-2.5 rounded-lg border border-default text-primary font-medium text-sm hover:bg-hover transition-colors flex items-center gap-1.5">
                    <LogIn className="h-3.5 w-3.5" /> Log In
                  </Link>
                </>
              ) : (
                <Link
                  href={continueHref}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Continue Learning
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Level progress bar */}
        {!isGuest && (
          <div className="mt-8 max-w-xl">
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span className="text-secondary font-medium">Level {lvl.level} · {lvl.title}</span>
              <span className="text-muted-foreground">{lvl.toNext} more to Level {lvl.level + 1}</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${Math.max(4, lvl.pct)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
