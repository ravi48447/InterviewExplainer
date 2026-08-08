'use client';

import React from 'react';
import { Lightbulb, BarChart3, AlertTriangle, Target, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WeakArea {
  label: string;
  mastery: number;
  description: string;
}

interface DifficultyBreakdown {
  easy: number;
  medium: number;
  hard: number;
}

interface InsightsCardProps {
  isGuest: boolean;
  weakAreas: WeakArea[];
  difficulty: DifficultyBreakdown;
  completionPct: number;
  domainDisplayName: string | null;
  continueHref: string;
}

export function InsightsCard({
  isGuest,
  weakAreas,
  difficulty,
  completionPct,
  domainDisplayName,
  continueHref,
}: InsightsCardProps) {
  const diffTotal = difficulty.easy + difficulty.medium + difficulty.hard;
  const easy = difficulty.easy;
  const med = difficulty.medium;
  const hard = difficulty.hard;
  const ePct = diffTotal > 0 ? Math.round((easy / diffTotal) * 100) : 0;
  const mPct = diffTotal > 0 ? Math.round((med / diffTotal) * 100) : 0;
  const hPct = diffTotal > 0 ? 100 - ePct - mPct : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
      {/* Today's Focus Card */}
      <Card className="flex flex-col bg-card border border-default p-5 shadow-sm rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-primary tracking-tight">Today&apos;s Focus</h2>
        </div>
        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isGuest
              ? 'Sign in to get a personalised study plan based on your progress.'
              : <>You&apos;re <span className="font-semibold text-primary">{completionPct}%</span> through <span className="font-semibold text-primary">{domainDisplayName ?? 'your path'}</span>. Keep the momentum going!</>}
          </p>
          {!isGuest && weakAreas.length > 0 && (
            <div className="flex items-start gap-2.5 p-3.5 bg-surface border border-default rounded-xl mt-auto">
              <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Recommended: brush up on <span className="font-semibold text-primary">{weakAreas[0].label}</span> today.
              </p>
            </div>
          )}
        </div>
        <Link
          href={isGuest ? '/signup' : continueHref}
          className="mt-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          {isGuest ? 'Get Started Free' : 'Continue Learning'} <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>

      {/* Smart Insights Card */}
      <Card className="flex flex-col bg-card border border-default p-5 shadow-sm rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-primary tracking-tight">Smart Insights</h2>
        </div>
        {!isGuest && weakAreas.length > 0 ? (
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {weakAreas.slice(0, 2).map((area, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3.5 bg-surface border border-default rounded-xl">
                <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold text-primary">Strengthen {area.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <Lightbulb className="h-7 w-7 text-muted-foreground mb-3" aria-hidden="true" />
            <p className="text-xs text-muted-foreground max-w-[220px] mx-auto leading-relaxed">
              {isGuest ? 'Sign up and complete questions for personalised study recommendations.' : 'Complete more questions for AI-powered insights.'}
            </p>
            {isGuest && (
              <Link href="/signup" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                Get started free <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}
      </Card>

      {/* Difficulty Breakdown Card */}
      <Card className="flex flex-col bg-card border border-default p-5 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-[13px] font-bold text-primary tracking-tight">Difficulty Breakdown</h2>
          </div>
          {diffTotal > 0 && (
            <span className="text-[10px] font-bold text-muted-foreground bg-surface border border-default px-2.5 py-0.5 rounded-full uppercase tracking-wider tabular-nums">{diffTotal} solved</span>
          )}
        </div>
        {diffTotal > 0 ? (
          <div className="flex flex-col flex-1 justify-center">
            <div className="h-3.5 rounded-full overflow-hidden flex mb-4 bg-surface border border-default/50">
              <div className="bg-emerald-500 dark:bg-emerald-800 transition-all duration-750" style={{ width: `${ePct}%` }} />
              <div className="bg-amber-500 dark:bg-amber-800 transition-all duration-750" style={{ width: `${mPct}%` }} />
              <div className="bg-destructive transition-all duration-750" style={{ width: `${hPct}%` }} />
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Easy', count: easy, pct: ePct, dot: 'bg-emerald-500 dark:bg-emerald-800' },
                { label: 'Medium', count: med, pct: mPct, dot: 'bg-amber-500 dark:bg-amber-800' },
                { label: 'Hard', count: hard, pct: hPct, dot: 'bg-destructive' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", r.dot)} />
                    <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary tabular-nums">{r.count}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">({r.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <BarChart3 className="h-7 w-7 mx-auto mb-2 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">Solve questions to see difficulty distribution.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
