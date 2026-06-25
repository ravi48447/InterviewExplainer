'use client';

import React from 'react';
import { Layers, Brain, Compass, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KnowledgeCardProps {
  totalConcepts: number;
  activeTracks: number;
  domainsCount: number;
  completionPct: number;
}

export function KnowledgeCard({
  totalConcepts,
  activeTracks,
  domainsCount,
  completionPct,
}: KnowledgeCardProps) {
  const knowledge = [
    { icon: Brain, label: 'Concepts', val: totalConcepts.toLocaleString(), cls: 'text-primary' },
    { icon: Layers, label: 'Tracks', val: `${activeTracks}`, cls: 'text-primary' },
    { icon: Compass, label: 'Domains', val: `${domainsCount}`, cls: 'text-primary' },
    { icon: Target, label: 'Completion', val: `${completionPct}%`, cls: 'text-primary' },
  ];

  return (
    <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-[13px] font-bold text-primary tracking-tight">Knowledge Base</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {knowledge.map(k => (
          <div key={k.label} className="flex flex-col justify-center p-3.5 rounded-xl bg-surface border border-default">
            <div className="w-8 h-8 rounded-lg bg-card border border-default flex items-center justify-center mb-2">
              <k.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-lg font-bold text-primary leading-none tabular-nums">{k.val}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{k.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
