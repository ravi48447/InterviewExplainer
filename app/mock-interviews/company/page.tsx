'use client';

/**
 * Company Loop Runner — the full multi-round interview experience.
 *
 * Browse 97 real companies (8 loop archetypes), pick level, then run the
 * actual round sequence: coding rounds with camera + live dry-run debate,
 * technical rounds with personas, behavioral rounds with STAR. Rounds chain
 * like a real interview day — each ends with a verdict before the next begins.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Search, Video, VideoOff, ArrowRight, ArrowLeft, Play, Clock,
  Mic, Code2, MessageSquare, Brain, Trophy, Loader2, ShieldCheck, Swords,
  CheckCircle2, X, ChevronRight, Flame, Crown, Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Round {
  index: number; label: string; minutes: number; mode: string;
  tier: number; persona: string; camera: string; note?: string; toughness: number;
}
interface Loop {
  companyId: string; companyName: string; archetypeName: string;
  vetted?: { confidence: string; sourceLabel: string; reviewedAt: string; source: string } | null;
  level: string; toughness: number; note: string; totalMinutes: number; rounds: Round[];
}
interface Company {
  id: string; name: string; archetypeName: string; toughness: number;
  levels: string[]; note: string; roundCount: { fresher: number; intermediate: number };
}

const TOUGH_LABEL = (t: number) =>
  t >= 1.3 ? 'Brutal' : t >= 1.15 ? 'Hard' : t >= 1.0 ? 'Standard' : 'Approachable';

const MODE_ICON: Record<string, any> = { coding: Code2, technical: Brain, behavioral: MessageSquare, mixed: Swords };

/** Deterministic brand mark: two-letter monogram on a stable per-company hue.
 *  No scraped/fake logos — a letterform chip is honest and never broken. */
function companyMark(name: string) {
  const letters = name.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  const mono = (letters.length >= 2 ? letters[0][0] + letters[1][0] : name.slice(0, 2)).toUpperCase();
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const hues = [212, 262, 291, 340, 16, 38, 150, 180, 205, 260];
  const hue = hues[hash % hues.length];
  return { mono, hue };
}

const ARCHETYPE_ICON: Record<string, any> = {
  'Big Tech SWE Loop': Building2,
  'Backend Service Loop': Code2,
  'Product Engineering Loop': MessageSquare,
  'Hardware/Embedded Loop': Brain,
};

/** Round blueprint for the detail popup — what each round tests, by archetype. */
function ROUND_BLUEPRINT(archetypeName: string, level: string): { label: string; mode: string; minutes: number; tests: string }[] {
  const lvl = level === 'intermediate' ? 'intermediate' : 'fresher';
  const base: Record<string, { label: string; mode: string; minutes: number; tests: string }[]> = {
    'Big Tech SWE Loop': [
      { label: 'Coding screen', mode: 'coding', minutes: 45, tests: 'DSA problems — code the approach, then defend complexity' },
      { label: 'DSA deep-dive', mode: 'coding', minutes: 45, tests: 'Harder problem with optimization follow-ups and dry-run debate' },
      { label: 'CS fundamentals', mode: 'technical', minutes: 30, tests: 'OS, DBMS, networks — the conceptual base under the code' },
      { label: 'System design', mode: 'technical', minutes: 30, tests: lvl === 'intermediate' ? 'Scalable architecture with trade-off defence' : 'Design thinking at component level' },
      { label: 'Behavioral + values', mode: 'behavioral', minutes: 30, tests: 'STAR stories with metrics — collaboration under pressure' },
    ],
    'Backend Service Loop': [
      { label: 'Language fundamentals', mode: 'technical', minutes: 30, tests: 'Core language mechanics and idioms for the stack' },
      { label: 'Coding round', mode: 'coding', minutes: 45, tests: 'Working code against a service-shaped problem' },
      { label: 'System design', mode: 'technical', minutes: 40, tests: 'APIs, data models, queues — a service that survives load' },
      { label: 'Behavioral', mode: 'behavioral', minutes: 30, tests: 'Ownership stories, conflict handling, metrics' },
    ],
    'Product Engineering Loop': [
      { label: 'DSA screen', mode: 'coding', minutes: 45, tests: 'Algorithms with a product-flavored twist' },
      { label: 'Machine coding', mode: 'coding', minutes: 60, tests: 'Build a working feature end-to-end — code quality graded' },
      { label: 'System design', mode: 'technical', minutes: 40, tests: 'Feature architecture with user-scale trade-offs' },
      { label: 'Hiring manager', mode: 'behavioral', minutes: 30, tests: 'Product thinking and cross-team collaboration stories' },
    ],
    'Hardware/Embedded Loop': [
      { label: 'C/embedded coding', mode: 'coding', minutes: 45, tests: 'Low-level code with memory and constraint awareness' },
      { label: 'Domain depth', mode: 'technical', minutes: 40, tests: 'Architecture, buses, or signal fundamentals for the domain' },
      { label: 'System design', mode: 'technical', minutes: 35, tests: 'Hardware/software boundary decisions' },
      { label: 'Behavioral', mode: 'behavioral', minutes: 25, tests: 'Debugging war stories with outcomes' },
    ],
  };
  return base[archetypeName] ?? [
    { label: 'Technical round', mode: 'technical', minutes: 35, tests: 'Adaptive Q&A with follow-up probes' },
    { label: 'Coding round', mode: 'coding', minutes: 45, tests: 'Real problem with complexity defence' },
    { label: 'Behavioral round', mode: 'behavioral', minutes: 30, tests: 'STAR-tracked storytelling' },
  ];
}

export default function CompanyLoopPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [level, setLevel] = useState<'fresher' | 'intermediate'>('fresher');
  const [search, setSearch] = useState('');
  const [loop, setLoop] = useState<Loop | null>(null);
  const [roundIdx, setRoundIdx] = useState(0);
  const [roundState, setRoundState] = useState<'brief' | 'live' | 'verdict'>('brief');
  const [roundScores, setRoundScores] = useState<Record<number, number>>({});
  const [selfScore, setSelfScore] = useState<number | null>(null);
  // discovery pattern: inspect-first (popup), start-second; progressive reveal
  const [detail, setDetail] = useState<Company | null>(null);
  const [archetypeFilter, setArchetypeFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(12);
  const [allArchetypes, setAllArchetypes] = useState<string[]>([]);

  // camera
  const [camStream, setCamStream] = useState<MediaStream | null>(null);
  const [camReady, setCamReady] = useState(false);
  const camRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/engine/company-loop?level=${level}${search ? `&search=${encodeURIComponent(search)}` : ''}`)
        .then((r) => r.json())
        .then((d) => {
          const list: Company[] = d.companies ?? [];
          setCompanies(list);
          const arch = [...new Set(list.map((c) => c.archetypeName))].sort();
          setAllArchetypes(arch);
        })
        .catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [level, search]);

  useEffect(() => { setVisibleCount(12); }, [level, search, archetypeFilter]);

  const filteredCompanies = (archetypeFilter === 'all'
    ? companies
    : companies.filter((c) => c.archetypeName === archetypeFilter));

  const openLoop = async (companyId: string) => {
    const res = await fetch(`/api/engine/company-loop?company=${companyId}&level=${level}`);
    const data = await res.json();
    if (data.rounds) {
      setLoop(data);
      setRoundIdx(0);
      setRoundState('brief');
      setRoundScores({});
      // persist so a refresh mid-loop doesn't lose the run
      try { (await import('@/lib/engine/persist.mjs')).saveCompanyLoopState({ companyId, level, roundIdx: 0, scores: {}, startedAt: Date.now() }); } catch {}
    }
  };

  // restore an interrupted loop on mount (persists across refreshes)
  useEffect(() => {
    (async () => {
      try {
        const { getCompanyLoopState } = await import('@/lib/engine/persist.mjs');
        const saved = getCompanyLoopState();
        if (!saved?.companyId) return;
        const res = await fetch(`/api/engine/company-loop?company=${saved.companyId}&level=${saved.level}`);
        const data = await res.json();
        if (data.rounds && saved.roundIdx > 0 && saved.roundIdx < data.rounds.length) {
          setLoop(data);
          setLevel(saved.level as 'fresher' | 'intermediate');
          setRoundIdx(saved.roundIdx);
          setRoundScores(saved.scores ?? {});
          setRoundState('brief');
        }
      } catch {}
    })();
  }, []);

  const currentRound = loop?.rounds[roundIdx] ?? null;

  // ---- camera gate for camera-required rounds ----
  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCamStream(s);
      setCamReady(true);
      if (camRef.current) camRef.current.srcObject = s;
    } catch {
      setCamReady(false);
    }
  }, []);
  useEffect(() => {
    if (camRef.current && camStream) camRef.current.srcObject = camStream;
  }, [camStream, roundState]);
  useEffect(() => () => { camStream?.getTracks().forEach((t) => t.stop()); }, [camStream]);

  const roundHref = (r: Round) => {
    const preset = r.minutes <= 20 ? 'quick' : r.minutes <= 35 ? 'standard' : 'deep';
    const domain = loop?.companyId?.includes('java') || loop?.archetypeName?.toLowerCase().includes('big') ? 'java-backend-' + (level === 'fresher' ? 'fresher' : 'intermediate') : 'ruby-backend-' + (level === 'fresher' ? 'fresher' : 'intermediate');
    const params = new URLSearchParams({
      domain,
      mode: r.mode,
      preset,
      tier: String(r.tier),
      persona: r.persona,
      count: String(Math.max(3, Math.round(r.minutes / 8))),
      minutes: String(r.minutes),
      prepared: '1',
    });
    return `/mock-interviews/audio?${params.toString()}`;
  };

  const finishRound = (score: number) => {
    setRoundScores((s) => ({ ...s, [roundIdx]: score }));
    setRoundState('verdict');
    camStream?.getTracks().forEach((t) => t.stop());
    setCamStream(null);
    setCamReady(false);
  };

  const nextRound = () => {
    if (!loop) return;
    if (roundIdx + 1 >= loop.rounds.length) {
      setRoundState('verdict');
      // loop complete — final summary handled by verdict view with all scores
      try { import('@/lib/engine/persist.mjs').then(m => m.clearCompanyLoopState()); } catch {}
    } else {
      setRoundIdx((i) => i + 1);
      setRoundState('brief');
      try { import('@/lib/engine/persist.mjs').then(m => m.saveCompanyLoopState({ companyId: loop.companyId, level, roundIdx: roundIdx + 1, scores: roundScores, startedAt: Date.now() })); } catch {}
    }
  };

  // ================= BROWSE VIEW =================
  if (!loop) {
    return (
      <Shell>
        <header className="text-center space-y-3 pt-4">
          <div className="mx-auto h-16 w-16 rounded-lg bg-primary/10 border border-border flex items-center justify-center">
            <Building2 className="h-7 w-7 text-violet-400" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Company Loop Runner</h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Full multi-round practice loops — modeled on typical big-tech round structures
            (DSA-heavy loops, backend service loops, bar-raisers). Representative practice
            sequences, not any company's confidential process — verify details on their
            official careers pages.
          </p>
        </header>

        {/* level + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['fresher', 'intermediate'] as const).map((l) => (
              <button key={l} onClick={() => setLevel(l)}
                className={cn('px-4 py-2.5 text-sm capitalize flex-1 transition', level === l ? 'bg-primary/15 text-primary' : 'bg-surface text-muted-foreground hover:bg-primary')}>
                {l}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies — 'fintech', 'flipkart', 'HFT'…"
              className="w-full rounded-lg bg-background border border-border pl-9 pr-3 py-2.5 text-sm outline-none focus:border-border/50" />
          </div>
        </div>

        {/* archetype filter — pills, one active */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setArchetypeFilter('all')}
            className={cn('rounded-full border px-3 py-1 text-xs transition-colors',
              archetypeFilter === 'all' ? 'border-foreground/40 bg-muted font-medium text-foreground' : 'border-border bg-surface text-muted-foreground hover:bg-muted')}
          >
            All styles
          </button>
          {allArchetypes.map((a) => (
            <button
              key={a}
              onClick={() => setArchetypeFilter(a)}
              className={cn('rounded-full border px-3 py-1 text-xs transition-colors',
                archetypeFilter === a ? 'border-foreground/40 bg-muted font-medium text-foreground' : 'border-border bg-surface text-muted-foreground hover:bg-muted')}
            >
              {a.replace(' Loop', '')}
            </button>
          ))}
        </div>

        {/* company grid — 3 per row with breathing space; inspect-first cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.slice(0, visibleCount).map((c) => {
            const mark = companyMark(c.name);
            const ArchIcon = ARCHETYPE_ICON[c.archetypeName] ?? Building2;
            return (
              <button
                key={c.id}
                onClick={() => setDetail(c)}
                className="group rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-foreground/25 hover:bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: `hsl(${mark.hue} 45% 94%)`, color: `hsl(${mark.hue} 45% 30%)` }}
                  >
                    {mark.mono}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{c.name}</span>
                      <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                        c.toughness >= 1.3 ? 'bg-rose-500/10 text-rose-600'
                        : c.toughness >= 1.15 ? 'bg-amber-500/10 text-amber-700'
                        : 'bg-emerald-500/10 text-emerald-700')}>
                        {TOUGH_LABEL(c.toughness)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ArchIcon className="h-3 w-3" />
                      <span className="truncate">{c.archetypeName.replace(' Loop', '')}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{c.note}</p>
                <div className="mt-3 flex items-center gap-3 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {c.roundCount[level] ?? c.roundCount.fresher} rounds</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{((c.roundCount[level] ?? 4) * 35)}m</span>
                  <span className="ml-auto flex items-center gap-0.5 font-medium text-foreground/80 group-hover:text-foreground">
                    View rounds <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {filteredCompanies.length > visibleCount && (
          <div className="flex justify-center">
            <button
              onClick={() => setVisibleCount((v) => v + 12)}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Show {Math.min(12, filteredCompanies.length - visibleCount)} more of {filteredCompanies.length}
            </button>
          </div>
        )}

        {filteredCompanies.length === 0 && (
          <div className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
            No companies match this filter — try another style or clear the search.
          </div>
        )}

        {/* ============ detail popup — inspect first, start second ============ */}
        <AnimatePresence>
          {detail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
              onClick={() => setDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.97, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.97, y: 8 }}
                className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-surface shadow-xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label={`${detail.name} interview loop details`}
              >
                {(() => {
                  const mark = companyMark(detail.name);
                  const rounds = detail.roundCount[level] ?? detail.roundCount.fresher;
                  return (
                    <>
                      <div className="flex items-start gap-3 border-b border-border p-5">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-base font-semibold"
                          style={{ backgroundColor: `hsl(${mark.hue} 45% 92%)`, color: `hsl(${mark.hue} 45% 28%)` }}
                        >
                          {mark.mono}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg font-semibold tracking-tight text-foreground">{detail.name}</h2>
                          <div className="text-sm text-muted-foreground">{detail.archetypeName} · {level}</div>
                        </div>
                        <button onClick={() => setDetail(null)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close details">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-4 p-5">
                        <p className="text-sm leading-relaxed text-muted-foreground">{detail.note}</p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-lg border border-border bg-background p-3">
                            <div className="text-lg font-semibold tabular-nums text-foreground">{rounds}</div>
                            <div className="text-[11px] text-muted-foreground">rounds</div>
                          </div>
                          <div className="rounded-lg border border-border bg-background p-3">
                            <div className="text-lg font-semibold tabular-nums text-foreground">~{rounds * 35}m</div>
                            <div className="text-[11px] text-muted-foreground">total time</div>
                          </div>
                          <div className="rounded-lg border border-border bg-background p-3">
                            <div className="text-lg font-semibold text-foreground">{TOUGH_LABEL(detail.toughness)}</div>
                            <div className="text-[11px] text-muted-foreground">pressure</div>
                          </div>
                        </div>
                        <div>
                          <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            What the rounds test
                          </div>
                          <div className="space-y-2">
                            {ROUND_BLUEPRINT(detail.archetypeName, level).map((r, i) => {
                              const Icon = MODE_ICON[r.mode] ?? Brain;
                              return (
                                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-border bg-background p-2.5">
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                                    <Icon className="h-3 w-3 text-foreground" />
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium text-foreground">{r.label}</div>
                                    <div className="text-xs text-muted-foreground">{r.tests}</div>
                                  </div>
                                  <span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground">{r.minutes}m</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <button
                          onClick={() => { openLoop(detail.id); setDetail(null); }}
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          <Play className="h-4 w-4" /> Start {detail.name} loop
                        </button>
                        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                          Representative practice sequence modeled on {detail.archetypeName.replace(' Loop', '')} patterns —
                          verify current processes on the company&apos;s official careers page.
                        </p>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Shell>
    );
  }

  // ================= LOOP RUNNER =================
  const allDone = roundState === 'verdict' && roundIdx + 1 >= loop.rounds.length;
  const totalScore = Object.values(roundScores).length
    ? Math.round(Object.values(roundScores).reduce((a, b) => a + b, 0) / Object.values(roundScores).length)
    : 0;

  return (
    <Shell>
      {/* loop header */}
      <div className="rounded-lg border border-border bg-primary/[0.04] p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-violet-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-bold">
              {loop.companyName} <span className="text-muted-foreground font-normal">· {loop.level}</span>
              {loop.vetted ? (
                <span
                  className="ml-2 align-middle text-[9px] uppercase tracking-wide rounded-full border border-emerald-800/60 bg-emerald-950/40 text-emerald-300 px-2 py-0.5"
                  title={`Vetted against public sources (reviewed ${loop.vetted.reviewedAt}). Source: ${loop.vetted.sourceLabel}`}
                >
                  vetted · {loop.vetted.confidence} confidence
                </span>
              ) : (
                <span
                  className="ml-2 align-middle text-[9px] uppercase tracking-wide rounded-full border border-border bg-surface text-muted-foreground px-2 py-0.5"
                  title="This loop is modeled on the company's archetype — a representative practice sequence, not their confidential process."
                >
                  archetype practice
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {loop.archetypeName} · {loop.rounds.length} rounds · {loop.totalMinutes} min · toughness {loop.toughness.toFixed(2)}
            </div>
            {loop.vetted && (
              <div className="text-[10px] text-muted-foreground">
                Based on: {loop.vetted.sourceLabel} · reviewed {loop.vetted.reviewedAt}
              </div>
            )}
          </div>
          <button onClick={() => { setLoop(null); setRoundScores({}); }} className="text-muted-foreground/80 hover:text-foreground/70"><X className="h-4 w-4" /></button>
        </div>
        {/* round progress */}
        <div className="flex gap-1.5">
          {loop.rounds.map((r, i) => (
            <div key={r.index} className={cn('flex-1 h-1.5 rounded-full transition',
              i < roundIdx ? 'bg-emerald-500' : i === roundIdx ? 'bg-violet-400 animate-pulse' : 'bg-slate-700/50',
              roundScores[i] != null ? '' : '')} />
          ))}
        </div>
        <div className="flex gap-1.5 text-[9px] text-muted-foreground/80 overflow-x-auto">
          {loop.rounds.map((r, i) => (
            <span key={r.index} className={cn('whitespace-nowrap', i === roundIdx && 'text-violet-300')}>
              {r.label.split(' —')[0]}{roundScores[i] != null ? ` (${roundScores[i]})` : ''}
            </span>
          ))}
        </div>
      </div>

      {/* ============ ROUND BRIEF ============ */}
      {roundState === 'brief' && currentRound && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-primary/15 border border-border flex items-center justify-center text-sm font-bold text-muted-foreground">
                {currentRound.index}
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{currentRound.label}</h2>
                <div className="text-xs text-muted-foreground capitalize">
                  {currentRound.minutes} min · {currentRound.mode} · tier {currentRound.tier} · {currentRound.persona} persona
                </div>
              </div>
              {currentRound.camera !== 'off' && (
                <span className={cn('flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg',
                  currentRound.camera === 'required' ? 'bg-primary/15 text-primary' : 'bg-primary text-foreground/70')}>
                  <Camera className="h-3 w-3" /> {currentRound.camera}
                </span>
              )}
            </div>
            {currentRound.note && <p className="text-sm text-muted-foreground">{currentRound.note}</p>}
            <p className="text-[11px] text-muted-foreground/80 italic">{loop.note}</p>
          </div>

          {/* camera gate */}
          {currentRound.camera === 'required' && !camReady ? (
            <div className="rounded-lg border border-border bg-surface p-6 space-y-4 text-center">
              <Video className="h-10 w-10 text-rose-300 mx-auto" />
              <p className="text-sm text-foreground/70">This round runs with camera on — like the real one.</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={startCamera} className="gap-2"><Video className="h-4 w-4" /> Enable camera</Button>
              </div>
              <p className="text-[10px] text-muted-foreground/80">Camera stays on this device. Nothing is recorded or uploaded.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {camStream && (
                <div className="rounded-lg border border-border overflow-hidden aspect-video bg-background relative max-w-md mx-auto">
                  <video ref={camRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] bg-black/50 px-2 py-1 rounded-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" /> live · round {currentRound.index}
                  </span>
                </div>
              )}
              <Button size="lg" className="w-full gap-2" onClick={() => setRoundState('live')}>
                <Play className="h-4 w-4" /> Start round {currentRound.index}: {currentRound.label.split(' —')[0]}
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* ============ ROUND LIVE ============ */}
      {roundState === 'live' && currentRound && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {camStream && (
            <div className="rounded-lg border border-border overflow-hidden aspect-video bg-background relative max-w-md mx-auto">
              <video ref={camRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] bg-black/50 px-2 py-1 rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" /> rec · {currentRound.label.split(' —')[0]}
              </span>
            </div>
          )}
          <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
            <p className="text-sm text-foreground/70">
              Round in progress. The engine runs this exactly like the real thing:
              {currentRound.mode === 'coding'
                ? ' code, then the dry-run — trace your algorithm on a concrete input, defend your complexity.'
                : currentRound.mode === 'behavioral'
                  ? ' STAR-tracked stories. Metrics required.'
                  : ' adaptive questioning at this company\'s bar.'}
            </p>
            <a href={roundHref(currentRound)} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary hover:bg-primary text-primary-foreground py-3 font-medium text-sm transition">
              {React.createElement(MODE_ICON[currentRound.mode] ?? Brain, { className: 'h-4 w-4' })}
              Open round {currentRound.index} engine →
            </a>
            <p className="text-[10px] text-muted-foreground/80 text-center">Return here when the round ends — log your verdict and advance.</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground text-center">
              Self-assessed score — the evaluated engine report will replace this once the round's
              session results are linked. Record honestly; it feeds your loop summary.
            </p>
            <div className="flex gap-2 items-center">
              <label className="text-xs text-muted-foreground shrink-0">Your score (0–100):</label>
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={65}
                className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isNaN(v)) setSelfScore(Math.max(0, Math.min(100, Math.round(v))));
                }}
              />
              <Button variant="outline" className="flex-1 gap-2" onClick={() => finishRound(selfScore ?? 65)}>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Log round result
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============ ROUND VERDICT ============ */}
      {roundState === 'verdict' && !allDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-surface p-6 space-y-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
          <h3 className="font-bold">Round {currentRound?.index} complete</h3>
          <p className="text-sm text-muted-foreground">
            {roundIdx + 1 < loop.rounds.length
              ? `Next up: ${loop.rounds[roundIdx + 1].label}`
              : 'That was the last round.'}
          </p>
          <Button onClick={nextRound} className="gap-2">
            {roundIdx + 1 < loop.rounds.length ? <>Continue to round {roundIdx + 2} <ArrowRight className="h-4 w-4" /></> : 'See the final verdict'}
          </Button>
        </motion.div>
      )}

      {/* ============ FINAL VERDICT ============ */}
      {allDone && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.05] p-6 space-y-4">
            <div className="text-center space-y-2">
              <Trophy className="h-12 w-12 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold">{loop.companyName} loop complete</h2>
              <div className="flex items-end justify-center gap-3">
                <span className={cn('text-4xl font-semibold tabular-nums tracking-tight', totalScore >= 70 ? 'text-emerald-400' : totalScore >= 50 ? 'text-amber-400' : 'text-rose-400')}>
                  {totalScore}
                </span>
                <span className="text-muted-foreground pb-2 text-sm">avg across {Object.keys(roundScores).length} rounds</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {loop.rounds.map((r, i) => (
                <div key={r.index} className="flex items-center gap-3 text-xs bg-surface rounded-lg px-3 py-2">
                  <span className="text-muted-foreground/80">{r.index}.</span>
                  <span className="flex-1 truncate">{r.label}</span>
                  <span className={cn('font-bold', (roundScores[i] ?? 0) >= 70 ? 'text-emerald-400' : 'text-rose-400')}>
                    {roundScores[i] != null ? roundScores[i] : '—'}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2" onClick={() => { setLoop(null); setRoundScores({}); }}>
                <RotateCcwIcon /> Run another company
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={() => openLoop(loop.companyId)}>
                <Flame className="h-4 w-4" /> Re-run this loop
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/80 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Interview-day realism: {loop.rounds.length} sequential rounds, {loop.totalMinutes} minutes total.
            </p>
          </div>
        </motion.div>
      )}
    </Shell>
  );
}

function RotateCcwIcon() {
  return <ArrowLeft className="h-4 w-4" />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-5">{children}</main>
    </div>
  );
}
