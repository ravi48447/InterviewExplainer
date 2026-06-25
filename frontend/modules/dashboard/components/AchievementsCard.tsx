'use client';

import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Achievement {
  icon: React.ElementType;
  label: string;
  desc: string;
  earned: boolean;
  progress?: number;
}

interface AchievementsCardProps {
  achievements: Achievement[];
  earnedCount: number;
}

export function AchievementsCard({ achievements, earnedCount }: AchievementsCardProps) {
  return (
    <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-primary tracking-tight">Achievements</h2>
        </div>
        <span className="text-[10px] font-bold text-success bg-success/15 border border-success/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider tabular-nums">{earnedCount}/{achievements.length} unlocked</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {achievements.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className={cn(
              "relative flex items-center gap-3.5 p-3.5 rounded-xl border transition-colors duration-200",
              a.earned ? "bg-surface border-default" : "bg-surface/30 border-default opacity-50",
            )}>
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-default",
                a.earned ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
              )}>
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-primary leading-tight">{a.label}</p>
                <p className="text-[11px] text-secondary leading-tight mt-0.5">{a.desc}</p>
                {!a.earned && a.progress !== undefined && a.progress > 0 && (
                  <div className="mt-2 h-1 bg-default rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${a.progress}%` }} />
                  </div>
                )}
              </div>
              {a.earned && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
