'use client';

import React from 'react';
import { BarChart3, BookOpen, Compass } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StackItem {
  name: string;
  solved: number;
  total: number;
  pct: number;
}

interface ProgressSectionProps {
  stacks: StackItem[];
  continueHref: string;
}

export function ProgressSection({ stacks, continueHref }: ProgressSectionProps) {
  return (
    <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-primary tracking-tight">Stack Progress</h2>
        </div>
        {stacks.length > 0 && (
          <span className="text-[10px] font-bold text-secondary bg-surface border border-default px-2.5 py-0.5 rounded-full uppercase tracking-wider">{stacks.length} active</span>
        )}
      </div>

      {stacks.length > 0 ? (
        <div className="space-y-4 flex-1">
          {stacks.map((s, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-primary">{s.name}</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-muted-foreground tabular-nums">{s.solved}/{s.total}</span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md tabular-nums uppercase tracking-wider",
                    s.pct >= 70 ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20" :
                    s.pct >= 40 ? "text-amber-500 bg-amber-500/10 border border-amber-500/20" :
                    "text-blue-500 bg-blue-500/10 border border-blue-500/20",
                  )}>{s.pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-surface border border-default rounded-full overflow-hidden"
                role="progressbar" aria-valuenow={s.pct} aria-valuemin={0} aria-valuemax={100}
                aria-label={`${s.name}: ${s.pct}% complete, ${s.solved} of ${s.total} solved`}>
                <div className={cn(
                  "h-full rounded-full transition-all duration-750",
                  s.pct >= 70 ? "bg-emerald-500" :
                  s.pct >= 40 ? "bg-amber-500" :
                  "bg-primary",
                )} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <BookOpen className="h-8 w-8 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-bold text-primary mb-1">No stacks started</p>
          <p className="text-xs text-secondary mb-4">Select a domain to begin tracking your progress.</p>
          <Link href="/domains" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
            <Compass className="h-3.5 w-3.5" /> Browse Paths
          </Link>
        </div>
      )}
    </Card>
  );
}
