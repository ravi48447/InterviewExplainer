'use client';

/**
 * Mock Hub — the feature menu for the Mock Interview product.
 * Editorial premium: warm charcoal, serif display, hairline rules.
 * Mode configs live in lib/engine/mockModes.mjs.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, Flame, Binary, Code2, Layers, MessageSquare, Brain, Building2,
  ArrowRight, Users, Radio, Check, Sparkles, Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPE, SHELL, Ambient, PHASE_STYLE, CTA, CTA_QUIET, RULE } from '@/lib/offer-ready/design';
import { FirstVisitTour } from '@/components/onboarding/FirstVisitTour';

interface MockMode {
  id: string; name: string; tagline: string; icon: string;
  minutes: number; description: string;
  plan: string; isLink?: boolean; href?: string;
}

const ICONS: Record<string, any> = {
  zap: Zap, flame: Flame, binary: Binary, code: Code2, layers: Layers,
  message: MessageSquare, brain: Brain, building: Building2,
};

const DOMAINS = [
  'ruby-backend-fresher', 'ruby-backend-intermediate', 'go-fresher', 'go-intermediate',
  'java-backend-fresher', 'java-backend-intermediate', 'java-fullstack-fresher',
  'java-fullstack-intermediate', 'python-backend-fresher', 'frontend-fresher',
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function MockHubPage() {
  const [modes, setModes] = useState<MockMode[]>([]);
  const [domain, setDomain] = useState('ruby-backend-fresher');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    import('@/lib/engine/mockModes.mjs').then((m) => setModes(m.MOCK_MODES));
  }, []);

  const startMode = async (m: MockMode) => {
    setBusy(true);
    try {
      const { modeToParams } = await import('@/lib/engine/mockModes.mjs');
      const { href } = modeToParams(m.id, domain);
      location.href = href;
    } catch {
      setBusy(false);
    }
  };

  return (
    <div className={SHELL}>
      <Ambient />
      <FirstVisitTour />
      <main className="relative max-w-3xl mx-auto px-5 sm:px-6 py-14 space-y-12">

        {/* header */}
        <header className="space-y-6">
          <div className={TYPE.eyebrow}>Mock Interview</div>
          <h1 className={`${TYPE.displayLg} text-foreground`}>
            Pick your<br /><span className="italic text-primary">round.</span>
          </h1>
          <p className={`${TYPE.lead} max-w-md text-[15px]`}>
            Every kind of interview practice in one place. The interviewer adapts
            every turn — and every answer links back to your prep.
          </p>
        </header>

        {/* domain selector — underline style */}
        <section className="space-y-3">
          <div className={TYPE.eyebrow}>domain</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            {DOMAINS.map((d) => (
              <button key={d} onClick={() => setDomain(d)}
                className={cn(
                  'text-[13px] py-0.5 border-b transition-colors capitalize',
                  domain === d ? 'text-primary border-border' : 'text-stone-500 border-transparent hover:text-stone-300'
                )}>
                {d.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </section>

        {/* the mode list — editorial rows, not cards */}
        <section className={`${RULE} pt-2`}>
          <div className="divide-y divide-border">
            {modes.map((m, i) => {
              const Icon = ICONS[m.icon] ?? Brain;
              const locked = m.plan !== 'free';
              return (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4, ease: EASE }}
                  onClick={() => !busy && startMode(m)}
                  className="group w-full text-left grid grid-cols-[2.75rem_1fr_auto] gap-5 items-baseline py-6"
                >
                  <div className="flex items-center justify-center">
                    <Icon className={cn('h-5 w-5', locked ? 'text-stone-600' : 'text-primary')} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-2.5">
                      <h2 className={`${TYPE.h2} text-foreground`}>{m.name}</h2>
                      <span className="text-[11px] text-stone-600">{m.tagline.split('·')[0].trim()}</span>
                      {locked && (
                        <span className="text-[9px] uppercase tracking-widest text-primary border border-border px-1.5 py-0.5">
                          {m.plan === 'interview_pro' ? 'pro' : 'pass'}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-stone-500 leading-relaxed">{m.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-stone-600 tabular-nums">{m.minutes > 0 ? `${m.minutes}m` : '—'}</span>
                    <ArrowRight className="h-4 w-4 text-stone-700 group-hover:text-primary transition-colors" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* sample verdict — see feedback quality first */}
        <section className={`${RULE} pt-8`}>
          <Link href="/mock-interviews/results?session=demo" className="group grid grid-cols-[2.75rem_1fr_auto] gap-5 items-baseline py-4">
            <div className="flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className={`${TYPE.h2} text-foreground`}>See a sample verdict first</h3>
              <p className="text-[13px] text-stone-500">
                A finished session's full report — receipts, expert answers, why each question followed yours.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-stone-700 group-hover:text-muted-foreground transition-colors" />
          </Link>
        </section>

        {/* people surfaces — peer + live rooms */}
        <section className={`${RULE} pt-8 space-y-8`}>
          <div className={TYPE.eyebrow}>with real people</div>
          <div className="divide-y divide-border">
            <Link href="/mock-interviews/peer" className="group grid grid-cols-[2.75rem_1fr_auto] gap-5 items-baseline py-5">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <h3 className={`${TYPE.h2} text-foreground`}>Peer Practice</h3>
                <p className="text-[13px] text-stone-500">Role-swap with a real person — both seats train you.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-700 group-hover:text-muted-foreground transition-colors" />
            </Link>
            <Link href="/mock-interviews/live" className="group grid grid-cols-[2.75rem_1fr_auto] gap-5 items-baseline py-5">
              <Radio className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <h3 className={`${TYPE.h2} text-foreground`}>Live 1:1 Room</h3>
                <p className="text-[13px] text-stone-500">Direct-link room with Director-assist for the interviewer.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-700 group-hover:text-muted-foreground transition-colors" />
            </Link>
          </div>
        </section>

        {/* footer note */}
        <p className={`${RULE} pt-6 text-[12px] text-stone-600 italic`}>
          Free: quick · rapid · DSA · behavioral. Pass unlocks live-coding, system design, full mock. Pro adds company loops.
        </p>
      </main>
    </div>
  );
}
