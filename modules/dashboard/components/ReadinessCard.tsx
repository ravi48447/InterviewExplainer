'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Medal, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReadinessCardProps {
  value: number;
  done: number;
  stacksLength: number;
  completionPct: number;
  nextBadge: { label: string } | null;
}

function useCountUp(target: number, duration = 1000): number {
  const [val, setVal] = useState(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReduced.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    }
    if (prefersReduced.current || target <= 0) { setVal(target); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return val;
}

function ReadinessGauge({ value, size = 120, strokeWidth = 10 }: { value: number; size?: number; strokeWidth?: number }) {
  const display = useCountUp(value, 1100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const gradId = 'gauge-grad-radial';
  const tier = value >= 70 ? 'Strong' : value >= 40 ? 'Building' : value > 0 ? 'Getting Started' : 'Not Started';
  const colors = value >= 70
    ? { from: 'hsl(var(--success))', to: 'hsl(var(--success) / 0.7)', text: 'text-success' }
    : value >= 40
      ? { from: 'hsl(var(--warning))', to: 'hsl(var(--warning) / 0.7)', text: 'text-warning' }
      : { from: 'hsl(var(--primary))', to: 'hsl(var(--primary) / 0.7)', text: 'text-primary' };

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Interview readiness ${value} percent — ${tier}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" className="text-surface" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius}
          stroke={`url(#${gradId})`} strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-500 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-primary tabular-nums">{display}<span className="text-xs font-semibold">%</span></span>
        <span className={cn("text-[9px] font-bold tracking-wider uppercase mt-0.5", colors.text)}>{tier}</span>
      </div>
    </div>
  );
}

export function ReadinessCard({
  value,
  done,
  stacksLength,
  completionPct,
  nextBadge,
}: ReadinessCardProps) {
  return (
    <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/40 to-transparent" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-primary tracking-tight">Interview Readiness</h2>
        </div>
      </div>
      <div className="flex flex-col items-center flex-1 justify-center">
        <ReadinessGauge value={value} />
        <div className="grid grid-cols-3 gap-2 w-full mt-5">
          {[
            { n: done, l: 'Solved' },
            { n: stacksLength, l: 'Stacks' },
            { n: `${completionPct}%`, l: 'Done' },
          ].map(s => (
            <div key={s.l} className="text-center p-2 rounded-xl bg-surface border border-default">
              <p className="text-sm font-bold text-primary leading-none tabular-nums">{s.n}</p>
              <p className="text-[10px] font-medium text-muted-foreground mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
      {nextBadge && (
        <div className="mt-4 pt-3 flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-default">
          <Medal className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <p className="text-[11px] text-muted-foreground">
            Next badge: <span className="font-semibold text-primary">{nextBadge.label}</span>
          </p>
        </div>
      )}
    </Card>
  );
}
