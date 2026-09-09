'use client';

/**
 * NextBestActionCard — the loop's steering wheel on the dashboard.
 * Reads the concept mastery store (guest-first), computes the single most
 * valuable next move using the same gap-ranking brain the Director uses,
 * and offers executable CTAs (never dead-end text).
 */

import React, { useState, useEffect } from 'react';
import { Mic, BookOpen, ArrowRight, Loader2, Zap, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DomainConcepts {
  domain: string;
  conceptIds: string[];
}

export function NextBestActionCard() {
  const [nba, setNba] = useState<{
    domain: string;
    kind: string;
    cta: string;
    concepts: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // fetch the domain->concepts map from the engine coverage service
        const domains = [
          'ruby-backend-fresher',
          'go-fresher',
          'java-backend-fresher',
          'java-backend-intermediate',
          'java-fullstack-fresher',
          'python-backend-fresher',
          'frontend-fresher',
        ];
        const domainConcepts: DomainConcepts[] = [];
        for (const d of domains.slice(0, 4)) {
          // server tells us concepts per domain; we score against local mastery evidence
          const res = await fetch('/api/engine/coverage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: d }),
          });
          if (res.ok) {
            const data = await res.json();
            // coverage route returns readiness but needs evidence client-side;
            // for the NBA card we just need the concept list — derive from readiness call
            domainConcepts.push({ domain: d, conceptIds: data.concepts ?? [] });
          }
        }
        // local mastery: score concepts and pick the weakest domain with >=3 weak
        const { coverageOf, nextBestAction } = await import('@/lib/engine/mastery.mjs');
        const map = Object.fromEntries(domainConcepts.map((dc) => [dc.domain, dc.conceptIds]));
        const n = nextBestAction(map);
        setNba(n);
      } catch {
        setNba(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const href =
    nba?.kind === 'weakness-drill'
      ? `/mock-interviews/audio?domain=${nba.domain}&count=6`
      : nba
        ? `/mock-interviews/audio?domain=${nba.domain}`
        : '/mock-interviews';

  return (
    <Card className={cn('relative overflow-hidden border-white/10')}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-transparent to-transparent" />
      <div className="relative p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Zap className="h-4 w-4 text-blue-400" />
          Next best action
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
            <Loader2 className="h-4 w-4 animate-spin" /> finding your highest-leverage move…
          </div>
        ) : nba ? (
          <>
            <p className="text-lg font-medium leading-snug">{nba.cta}</p>
            <div className="flex flex-wrap gap-2 items-center">
              <a href={href} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition">
                <Mic className="h-4 w-4" /> Start targeted mock
              </a>
              <a href={`/dashboard/resume`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm">
                <BookOpen className="h-4 w-4" /> Analyze resume
              </a>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              {nba.concepts?.length > 0
                ? `targets ${nba.concepts.length} weak concepts: ${nba.concepts.slice(0, 3).join(', ')}…`
                : 'breadth session across your domain'}
            </p>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">No evidence yet — start anywhere, the graph fills in.</p>
            <div className="flex gap-2">
              <a href="/mock-interviews" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm">
                <Mic className="h-4 w-4" /> Try a mock interview
              </a>
              <a href="/dashboard/resume" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm">
                <BookOpen className="h-4 w-4" /> Analyze resume
              </a>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
