'use client';

import React from 'react';
import { CheckCircle2, Flame, Clock, Timer, BarChart3, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsGridProps {
  done: number;
  total: number;
  currentStreak: number;
  totalTimeSpent: number;
  stacksCount: number;
  domainsCount: number;
  bookmarksCount: number;
  fmtTime: (s: number) => string;
  fmtAvg: (total: number, count: number) => string;
}

export function StatsGrid({
  done,
  total,
  currentStreak,
  totalTimeSpent,
  stacksCount,
  domainsCount,
  bookmarksCount,
  fmtTime,
  fmtAvg,
}: StatsGridProps) {
  const stats = [
    { label: 'Questions Solved', val: done.toLocaleString(), sub: `of ${total.toLocaleString()}`, icon: CheckCircle2 },
    { label: 'Current Streak', val: `${currentStreak}`, sub: `day${currentStreak === 1 ? '' : 's'}`, icon: Flame },
    { label: 'Study Time', val: fmtTime(totalTimeSpent), sub: 'total invested', icon: Clock },
    { label: 'Avg. per Question', val: fmtAvg(totalTimeSpent, done), sub: 'avg read time', icon: Timer },
    { label: 'Active Stacks', val: `${stacksCount}`, sub: `of ${domainsCount} domains`, icon: BarChart3 },
    { label: 'Bookmarks', val: `${bookmarksCount}`, sub: 'saved for review', icon: Bookmark },
  ];

  return (
    <div className="px-6 lg:px-10 xl:px-16 -mt-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {stats.map((m, i) => (
          <div
            key={m.label}
            className={cn(
              "group bg-card rounded-xl border border-default p-4 shadow-sm",
              "transition-all duration-200 hover:border-primary animate-fade-in-up",
              `anim-delay-${Math.min(6, i + 1)}`,
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none">{m.label}</p>
              <m.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-primary tracking-tight leading-none tabular-nums">{m.val}</p>
            <p className="text-[11px] text-secondary mt-1.5 leading-none">{m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
