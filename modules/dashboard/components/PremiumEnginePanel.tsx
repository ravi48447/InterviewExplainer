'use client';

/**
 * PremiumEnginePanel — the engine-powered dashboard centerpiece (auth required).
 *
 * One panel, four visual systems:
 *   1. Coverage rings: per-domain readiness (importance-weighted, decay-aware)
 *   2. Mastery distribution: weak/learning/strong/mastered bar
 *   3. Prep strategy: focus domains + recommended next actions (computed server-side)
 *   4. Sessions table + trend sparkline
 * Data: /api/engine/analytics. Falls back to a login CTA for guests.
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Flame, Target, Zap, LogIn, Loader2, Mic, Code2, MessageSquare,
  ArrowRight, Trophy, Clock, Brain, Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DEMO_ANALYTICS } from '@/lib/offer-ready/demoEcosystem';

interface Analytics {
  coverage: { domain: string; concepts: number; percent: number; strongConcepts: number; totalTopics: number }[];
  trend: { ts: number; score: number; domain: string | null; mode: string; minutes: number }[];
  distribution: { weak: number; learning: number; strong: number; mastered: number; untouched: number };
  sessions: { sessionId: string; domain: string | null; mode: string; preset: string; presetMinutes: number; overallScore: number; turnsCount: number; savedAt: number }[];
  stats: { streak: number; totalSessions: number; avgScore: number; bestScore: number; minutesPracticed: number; conceptsTouched: number };
  strategy: { focusDomains: { domain: string; percent: number; concepts: number }[]; recommendation: string; nextActions: { domain: string; percent: number; action: string }[] };
  methodology: string;
}

const DOMAIN_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

function Ring({ percent, color, size = 84 }: { percent: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        initial={{ strokeDasharray: `0 ${c}` }}
        animate={{ strokeDasharray: `${dash} ${c}` }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
    </svg>
  );
}

function DemoAnalyticsView() {
  const d = DEMO_ANALYTICS as any;
  const distTotal = d.distribution.weak + d.distribution.learning + d.distribution.strong + d.distribution.mastered + d.distribution.untouched || 1;
  const W = 520, H = 80, PAD = 8;
  const pts = d.trend.length > 1
    ? d.trend.map((s: any, i: number) => [PAD + (i * (W - 2 * PAD)) / (d.trend.length - 1), H - PAD - (s.score / 100) * (H - 2 * PAD)])
    : [];
  const distParts = [
    { k: 'mastered', n: d.distribution.mastered, color: 'bg-[#7d9a6b]' },
    { k: 'strong', n: d.distribution.strong, color: 'bg-[#9db88a]' },
    { k: 'learning', n: d.distribution.learning, color: 'bg-[#7a93ad]' },
    { k: 'weak', n: d.distribution.weak, color: 'bg-[#c08a5a]' },
    { k: 'untouched', n: d.distribution.untouched, color: 'bg-[#3a362e]' },
  ];
  return (
    <div className="space-y-4">
      {/* stat strip */}
      <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-5">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
          {[
            { val: d.stats.streak, label: 'day streak' },
            { val: d.stats.totalSessions, label: 'sessions' },
            { val: d.stats.avgScore, label: 'avg score' },
            { val: d.stats.bestScore, label: 'best' },
            { val: d.stats.minutesPracticed, label: 'min practiced' },
            { val: d.stats.conceptsTouched, label: 'concepts' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] py-3">
              <div className="text-xl font-semibold text-[#f5f1e8]">{s.val}</div>
              <div className="text-[9px] uppercase tracking-[0.15em] text-stone-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* coverage rings */}
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-5 space-y-4">
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500">domain readiness</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {d.coverage.map((c: any, i: number) => (
              <div key={c.domain} className="flex items-center gap-3">
                <div className="relative w-16 h-16">
                  <svg width="64" height="64" className="-rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke={i === 0 ? '#e8a33d' : '#7a93ad'} strokeWidth="5"
                      strokeDasharray={`${(c.percent / 100) * 2 * Math.PI * 26} ${2 * Math.PI * 26}`} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#f5f1e8]">{c.percent}%</span>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium capitalize truncate">{c.domain.replace(/-/g, ' ')}</div>
                  <div className="text-[9px] text-stone-600">{c.strongConcepts}/{c.concepts} concepts</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-stone-600">{d.methodology}</p>
        </div>
        {/* strategy */}
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-5 space-y-4">
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500">prep strategy</div>
          <p className="text-sm text-stone-300 leading-relaxed">{d.strategy.recommendation}</p>
          <div className="space-y-2">
            {d.strategy.nextActions.map((a: any) => (
              <div key={a.domain} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium capitalize truncate">{a.domain.replace(/-/g, ' ')}</div>
                  <div className="text-[10px] text-stone-500">{a.action} · {a.percent}% covered</div>
                </div>
                <a href="/mock-interviews" className="text-[10px] px-2.5 py-1.5 rounded-lg bg-[#e8a33d]/15 border border-[#e8a33d]/30 text-[#e8a33d] shrink-0">drill</a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* distribution */}
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-5 space-y-4">
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500">concept mastery distribution</div>
          <div className="h-6 rounded-sm overflow-hidden flex bg-[#100f0d]">
            {distParts.map((p) => (
              <div key={p.k} className={p.color} style={{ width: `${(p.n / distTotal) * 100}%` }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-stone-500">
            {distParts.map((p) => (
              <span key={p.k} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-sm ${p.color}`} /> {p.k} ({p.n})
              </span>
            ))}
          </div>
        </div>
        {/* trend */}
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-5 space-y-4">
          <div className="text-xs uppercase tracking-[0.18em] text-stone-500">score trend</div>
          {pts.length > 1 && (
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
              <polyline fill="none" stroke="#e8a33d" strokeWidth="2" strokeLinecap="round"
                points={pts.map((p: number[]) => p.join(',')).join(' ')} />
              {pts.map((p: number[], i: number) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={d.trend[i].score >= 60 ? '#e8a33d' : '#c08a5a'} />
              ))}
            </svg>
          )}
          <p className="text-[10px] text-stone-600 italic">Demo data — sign in and this becomes your line.</p>
        </div>
      </div>
    </div>
  );
}

export function PremiumEnginePanel() {
  const [data, setData] = useState<Analytics | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/engine/analytics');
        if (res.status === 401) {
          // demo mode: show the full analytics story with seeded data
          setData(DEMO_ANALYTICS as any);
          setAuthed(false);
          setDemo(true);
          return;
        }
        if (res.ok) {
          setData(await res.json());
          setAuthed(true);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Card className="border-white/10 p-8 flex items-center justify-center text-slate-400 text-sm gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> loading your analytics…
      </Card>
    );
  }

  if (!authed && demo) {
    // demo analytics: full graphs, one slim sign-in strip (no wall)
    const dist = (DEMO_ANALYTICS as any).distribution;
    const distTotal = dist.weak + dist.learning + dist.strong + dist.mastered + dist.untouched || 1;
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#3d4a34] bg-[#161a13] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 text-sm text-[#f5f1e8]">
            Demo analytics — <span className="italic">Aisha&apos;s prep</span>. Sign in free and these harden with your real sessions.
          </div>
          <div className="flex gap-2 shrink-0">
            <a href="/login" className="text-xs px-4 py-2 bg-[#e8a33d] text-[#1a1408] font-semibold">Sign in</a>
            <a href="/dashboard/resume" className="text-xs px-4 py-2 border border-[#3a362e] text-stone-300">Try resume demo</a>
          </div>
        </div>
        <DemoAnalyticsView />
      </div>
    );
  }

  if (!authed) {
    return (
      <Card className="border-blue-500/20 bg-blue-500/[0.04] p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
            <LogIn className="h-6 w-6 text-blue-400" />
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="font-semibold">Your interview analytics live here</h3>
            <p className="text-sm text-slate-400">
              All learning content is free — no account needed. Sign in (basic details only, everything else optional)
              to save your mock scores, streaks, and prep strategy across devices.
            </p>
            <div className="flex gap-2">
              <a href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium">
                <LogIn className="h-4 w-4" /> Sign in
              </a>
              <a href="/signup" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm">
                Create free account
              </a>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const dist = data.distribution;
  const distTotal = dist.weak + dist.learning + dist.strong + dist.mastered + dist.untouched || 1;
  const distParts = [
    { k: 'mastered', n: dist.mastered, color: 'bg-emerald-500' },
    { k: 'strong', n: dist.strong, color: 'bg-green-400' },
    { k: 'learning', n: dist.learning, color: 'bg-blue-400' },
    { k: 'weak', n: dist.weak, color: 'bg-amber-400' },
    { k: 'untouched', n: dist.untouched, color: 'bg-slate-700' },
  ];

  // trend sparkline
  const W = 520, H = 80, PAD = 8;
  const pts = data.trend.length > 1
    ? data.trend.map((s, i) => [PAD + (i * (W - 2 * PAD)) / (data.trend.length - 1), H - PAD - (s.score / 100) * (H - 2 * PAD)])
    : [];

  return (
    <div className="space-y-4">
      {/* ============ TOP: stat strip ============ */}
      <Card className="border-white/10 p-5">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
          {[
            { icon: Flame, val: data.stats.streak, label: 'day streak', color: 'text-amber-400' },
            { icon: Mic, val: data.stats.totalSessions, label: 'sessions', color: 'text-blue-400' },
            { icon: TrendingUp, val: data.stats.avgScore, label: 'avg score', color: 'text-violet-400' },
            { icon: Trophy, val: data.stats.bestScore, label: 'best', color: 'text-emerald-400' },
            { icon: Clock, val: data.stats.minutesPracticed, label: 'min practiced', color: 'text-cyan-400' },
            { icon: Brain, val: data.stats.conceptsTouched, label: 'concepts', color: 'text-rose-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/5 py-3">
              <s.icon className={cn('h-4 w-4 mx-auto mb-1', s.color)} />
              <div className="text-xl font-black">{s.val}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ============ MIDDLE: rings + strategy ============ */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* coverage rings */}
        <Card className="border-white/10 p-5 space-y-4">
          <div className="font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-400" /> Domain readiness
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {data.coverage.map((c, i) => (
              <div key={c.domain} className="flex items-center gap-3">
                <div className="relative">
                  <Ring percent={c.percent} color={DOMAIN_COLORS[i % DOMAIN_COLORS.length]} />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {c.percent}%
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium capitalize truncate">{c.domain.replace(/-/g, ' ')}</div>
                  <div className="text-[10px] text-slate-500">
                    {c.strongConcepts}/{c.concepts} concepts · {c.totalTopics} topics
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500">{data.methodology}</p>
        </Card>

        {/* prep strategy */}
        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/[0.05] to-transparent p-5 space-y-4">
          <div className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" /> Prep strategy
            <span className="ml-auto text-[10px] text-slate-500">computed from your data</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{data.strategy.recommendation}</p>
          <div className="space-y-2">
            {data.strategy.nextActions.map((a) => (
              <div key={a.domain} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium capitalize truncate">{a.domain.replace(/-/g, ' ')}</div>
                  <div className="text-[10px] text-slate-500">{a.action} · {a.percent}% covered</div>
                </div>
                <a
                  href={`/mock-interviews/audio?domain=${a.domain}&preset=quick`}
                  className="text-[11px] px-2.5 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-200 shrink-0"
                >
                  drill
                </a>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ============ BOTTOM: distribution + trend + sessions ============ */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* mastery distribution */}
        <Card className="border-white/10 p-5 space-y-4">
          <div className="font-semibold flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-400" /> Concept mastery distribution
          </div>
          <div className="h-6 rounded-full overflow-hidden flex bg-slate-800">
            {distParts.map((p) => (
              <motion.div
                key={p.k}
                className={p.color}
                initial={{ width: 0 }}
                animate={{ width: `${(p.n / distTotal) * 100}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-400">
            {distParts.map((p) => (
              <span key={p.k} className="flex items-center gap-1.5">
                <span className={cn('h-2.5 w-2.5 rounded-sm', p.color)} /> {p.k} ({p.n})
              </span>
            ))}
          </div>
          {/* resume chip */}
          {data.sessions.length > 0 && (
            <div className="text-[10px] text-slate-500 border-t border-white/5 pt-2">
              Scores decay over 30 days — keep evidence fresh with a mock every few days.
            </div>
          )}
        </Card>

        {/* trend + recent sessions */}
        <Card className="border-white/10 p-5 space-y-4">
          <div className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" /> Score trend
          </div>
          {pts.length > 1 ? (
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
              <polyline
                fill="none" stroke="url(#tg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                points={pts.map((p) => p.join(',')).join(' ')}
              />
              {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="3.5"
                  fill={data.trend[i].score >= 75 ? '#34d399' : data.trend[i].score >= 50 ? '#60a5fa' : '#f87171'} />
              ))}
              <defs>
                <linearGradient id="tg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <p className="text-sm text-slate-400 py-4 text-center">Two sessions unlock the trend line.</p>
          )}

          {/* recent sessions table */}
          {data.sessions.length > 0 && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Recent sessions</div>
              {data.sessions.slice(0, 5).map((s) => (
                <a key={s.sessionId} href={`/mock-interviews/results?session=${s.sessionId}`}
                   className="flex items-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 px-3 py-2 transition">
                  {s.mode === 'coding' ? <Code2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    : s.mode === 'behavioral' ? <MessageSquare className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    : <Mic className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                  <span className="text-xs truncate flex-1 capitalize">{(s.domain ?? 'mixed').replace(/-/g, ' ')} · {s.presetMinutes}m</span>
                  <span className="text-[10px] text-slate-500">{new Date(s.savedAt).toLocaleDateString()}</span>
                  <span className={cn('text-sm font-bold',
                    s.overallScore >= 75 ? 'text-emerald-400' : s.overallScore >= 50 ? 'text-blue-400' : 'text-rose-400')}>
                    {s.overallScore}
                  </span>
                </a>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
