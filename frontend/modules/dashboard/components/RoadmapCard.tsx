'use client';

import React from 'react';
import { Flag, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Milestone {
  n: number;
  label: string;
}

interface RoadmapCardProps {
  milestones: Milestone[];
  done: number;
  roadmapFill: number;
  currentMilestoneIdx: number;
}

export function RoadmapCard({
  milestones,
  done,
  roadmapFill,
  currentMilestoneIdx,
}: RoadmapCardProps) {
  return (
    <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-primary tracking-tight">Your Roadmap</h2>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground bg-surface border border-default px-2.5 py-0.5 rounded-full uppercase tracking-wider tabular-nums">{done} solved</span>
      </div>

      <div className="relative pt-4 pb-2 px-1 flex-1 flex flex-col justify-center">
        <div className="absolute left-6 right-6 top-[28px] h-1 bg-surface border-t border-b border-default rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${roadmapFill}%` }} />
        </div>
        <div className="relative flex items-start justify-between">
          {milestones.map((m, i) => {
            const reached = done >= m.n;
            const current = i === currentMilestoneIdx;
            return (
              <div key={m.n} className="relative z-10 flex flex-col items-center gap-2.5 w-16">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  reached ? "border-primary bg-primary text-primary-foreground shadow-sm" :
                  current ? "border-primary bg-card text-primary ring-4 ring-primary/20" :
                  "border-default bg-card text-muted-foreground",
                )}>
                  {reached ? <CheckCircle2 className="h-4.5 w-4.5" /> : <span className="text-xs font-semibold tabular-nums">{m.n}</span>}
                </div>
                <div className="text-center">
                  <p className={cn("text-[10px] font-bold leading-tight uppercase tracking-wider",
                    reached ? "text-primary" : current ? "text-primary" : "text-muted-foreground")}>{m.label}</p>
                  <p className="text-[9px] text-muted-foreground tabular-nums mt-0.5">{m.n} Q</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
