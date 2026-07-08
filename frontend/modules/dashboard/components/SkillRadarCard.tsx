'use client';

import React from 'react';
import { Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';

const SkillRadar = dynamic(
  () => import('@/components/dashboard/skill-radar').then(m => m.SkillRadar),
  { ssr: false, loading: () => <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground">Loading chart…</div> },
);

interface SkillRadarCardProps {
  radar: any[];
}

export function SkillRadarCard({ radar }: SkillRadarCardProps) {
  return (
    <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-primary tracking-tight">Skill Distribution</h2>
        </div>
      </div>
      {radar.length > 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[220px]">
          <div className="w-full h-full max-w-[280px]" role="img"
            aria-label={`Skill distribution: ${radar.map(r => `${r.subject} ${r.score}%`).join(', ')}`}>
            <SkillRadar data={radar} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
          <Brain className="h-8 w-8 text-muted-foreground mb-3" aria-hidden="true" />
          <p className="text-xs text-muted-foreground text-center">Complete questions across stacks to build your skill map.</p>
        </div>
      )}
    </Card>
  );
}
