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

export default function CompanyLoopPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [level, setLevel] = useState<'fresher' | 'intermediate'>('fresher');
  const [search, setSearch] = useState('');
  const [loop, setLoop] = useState<Loop | null>(null);
  const [roundIdx, setRoundIdx] = useState(0);
  const [roundState, setRoundState] = useState<'brief' | 'live' | 'verdict'>('brief');
  const [roundScores, setRoundScores] = useState<Record<number, number>>({});
  const [selfScore, setSelfScore] = useState<number | null>(null);

  // camera
  const [camStream, setCamStream] = useState<MediaStream | null>(null);
  const [camReady, setCamReady] = useState(false);
  const camRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/engine/company-loop?level=${level}${search ? `&search=${encodeURIComponent(search)}` : ''}`)
        .then((r) => r.json())
        .then((d) => setCompanies(d.companies ?? []))
        .catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [level, search]);

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
    const mode = r.mode === 'mixed' ? 'technical' : r.mode;
    const domain = loop?.companyId?.includes('java') || loop?.archetypeName?.toLowerCase().includes('big') ? 'java-backend-' + (level === 'fresher' ? 'fresher' : 'intermediate') : 'ruby-backend-' + (level === 'fresher' ? 'fresher' : 'intermediate');
    return `/mock-interviews/audio?mode=${mode}&preset=${preset}&tier=${r.tier}&domain=${domain}&count=${Math.max(3, Math.round(r.minutes / 8))}`;
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
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 border border-border flex items-center justify-center">
            <Building2 className="h-7 w-7 text-violet-400" />
          </div>
          <h1 className="text-2xl font-black">Company Loop Runner</h1>
          <p className="text-sm text-stone-400 max-w-xl mx-auto">
            Full multi-round practice loops — modeled on typical big-tech round structures
            (DSA-heavy loops, backend service loops, bar-raisers). Representative practice
            sequences, not any company's confidential process — verify details on their
            official careers pages.
          </p>
        </header>

        {/* level + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-xl border border-border overflow-hidden">
            {(['fresher', 'intermediate'] as const).map((l) => (
              <button key={l} onClick={() => setLevel(l)}
                className={cn('px-4 py-2.5 text-sm capitalize flex-1 transition', level === l ? 'bg-primary/15 text-primary' : 'bg-surface text-stone-400 hover:bg-primary')}>
                {l}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies — 'fintech', 'flipkart', 'HFT'…"
              className="w-full rounded-xl bg-background border border-border pl-9 pr-3 py-2.5 text-sm outline-none focus:border-border/50" />
          </div>
        </div>

        {/* company grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <button key={c.id} onClick={() => openLoop(c.id)}
              className="rounded-2xl border border-border bg-surface hover:bg-primary hover:border-violet-400/40 p-4 text-left space-y-2 transition group">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm">{c.name}</span>
                <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0',
                  c.toughness >= 1.3 ? 'bg-rose-500/20 text-rose-300' :
                  c.toughness >= 1.15 ? 'bg-primary/20 text-primary' :
                  c.toughness >= 1.0 ? 'bg-primary/10 text-primary' : 'bg-primary/15 text-primary')}>
                  {TOUGH_LABEL(c.toughness)}
                </span>
              </div>
              <div className="text-[11px] text-stone-400">{c.archetypeName}</div>
              <div className="text-[11px] text-stone-600 leading-snug">{c.note}</div>
              <div className="flex items-center gap-3 text-[10px] text-stone-600 pt-1">
                <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {c.roundCount[level] ?? c.roundCount.fresher} rounds</span>
                <span className="ml-auto flex items-center gap-1 text-violet-300/70 group-hover:text-violet-300">
                  run the loop <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
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
      <div className="rounded-2xl border border-border bg-primary/[0.04] p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-violet-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-bold">
              {loop.companyName} <span className="text-stone-400 font-normal">· {loop.level}</span>
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
            <div className="text-[11px] text-stone-400">
              {loop.archetypeName} · {loop.rounds.length} rounds · {loop.totalMinutes} min · toughness {loop.toughness.toFixed(2)}
            </div>
            {loop.vetted && (
              <div className="text-[10px] text-stone-500">
                Based on: {loop.vetted.sourceLabel} · reviewed {loop.vetted.reviewedAt}
              </div>
            )}
          </div>
          <button onClick={() => { setLoop(null); setRoundScores({}); }} className="text-stone-600 hover:text-stone-300"><X className="h-4 w-4" /></button>
        </div>
        {/* round progress */}
        <div className="flex gap-1.5">
          {loop.rounds.map((r, i) => (
            <div key={r.index} className={cn('flex-1 h-1.5 rounded-full transition',
              i < roundIdx ? 'bg-emerald-500' : i === roundIdx ? 'bg-violet-400 animate-pulse' : 'bg-slate-700/50',
              roundScores[i] != null ? '' : '')} />
          ))}
        </div>
        <div className="flex gap-1.5 text-[9px] text-stone-600 overflow-x-auto">
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
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-primary/15 border border-border flex items-center justify-center text-sm font-bold text-muted-foreground">
                {currentRound.index}
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{currentRound.label}</h2>
                <div className="text-xs text-stone-400 capitalize">
                  {currentRound.minutes} min · {currentRound.mode} · tier {currentRound.tier} · {currentRound.persona} persona
                </div>
              </div>
              {currentRound.camera !== 'off' && (
                <span className={cn('flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg',
                  currentRound.camera === 'required' ? 'bg-primary/15 text-primary' : 'bg-primary text-stone-300')}>
                  <Camera className="h-3 w-3" /> {currentRound.camera}
                </span>
              )}
            </div>
            {currentRound.note && <p className="text-sm text-stone-400">{currentRound.note}</p>}
            <p className="text-[11px] text-stone-600 italic">{loop.note}</p>
          </div>

          {/* camera gate */}
          {currentRound.camera === 'required' && !camReady ? (
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 text-center">
              <Video className="h-10 w-10 text-rose-300 mx-auto" />
              <p className="text-sm text-stone-300">This round runs with camera on — like the real one.</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={startCamera} className="gap-2"><Video className="h-4 w-4" /> Enable camera</Button>
              </div>
              <p className="text-[10px] text-stone-600">Camera stays on this device. Nothing is recorded or uploaded.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {camStream && (
                <div className="rounded-2xl border border-border overflow-hidden aspect-video bg-background relative max-w-md mx-auto">
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
            <div className="rounded-2xl border border-border overflow-hidden aspect-video bg-background relative max-w-md mx-auto">
              <video ref={camRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] bg-black/50 px-2 py-1 rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" /> rec · {currentRound.label.split(' —')[0]}
              </span>
            </div>
          )}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
            <p className="text-sm text-stone-300">
              Round in progress. The engine runs this exactly like the real thing:
              {currentRound.mode === 'coding'
                ? ' code, then the dry-run — trace your algorithm on a concrete input, defend your complexity.'
                : currentRound.mode === 'behavioral'
                  ? ' STAR-tracked stories. Metrics required.'
                  : ' adaptive questioning at this company\'s bar.'}
            </p>
            <a href={roundHref(currentRound)} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary hover:bg-primary text-primary-foreground py-3 font-medium text-sm transition">
              {React.createElement(MODE_ICON[currentRound.mode] ?? Brain, { className: 'h-4 w-4' })}
              Open round {currentRound.index} engine →
            </a>
            <p className="text-[10px] text-stone-600 text-center">Return here when the round ends — log your verdict and advance.</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-stone-500 text-center">
              Self-assessed score — the evaluated engine report will replace this once the round's
              session results are linked. Record honestly; it feeds your loop summary.
            </p>
            <div className="flex gap-2 items-center">
              <label className="text-xs text-stone-400 shrink-0">Your score (0–100):</label>
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={65}
                className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-stone-200"
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
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-surface p-6 space-y-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
          <h3 className="font-bold">Round {currentRound?.index} complete</h3>
          <p className="text-sm text-stone-400">
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
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-6 space-y-4">
            <div className="text-center space-y-2">
              <Trophy className="h-12 w-12 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold">{loop.companyName} loop complete</h2>
              <div className="flex items-end justify-center gap-3">
                <span className={cn('text-5xl font-black', totalScore >= 70 ? 'text-emerald-400' : totalScore >= 50 ? 'text-amber-400' : 'text-rose-400')}>
                  {totalScore}
                </span>
                <span className="text-stone-400 pb-2 text-sm">avg across {Object.keys(roundScores).length} rounds</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {loop.rounds.map((r, i) => (
                <div key={r.index} className="flex items-center gap-3 text-xs bg-surface rounded-lg px-3 py-2">
                  <span className="text-stone-600">{r.index}.</span>
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
            <p className="text-[10px] text-stone-600 text-center flex items-center justify-center gap-1">
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
