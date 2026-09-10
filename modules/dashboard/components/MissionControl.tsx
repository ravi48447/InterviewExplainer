'use client';
/**
 * MissionControl.tsx — the interview-prep dashboard, rebuilt as a compact
 * mission-control screen. Everything answers: am I ready, what's next, and
 * what evidence backs that?
 *
 * 1. Active target + interview date
 * 2. One next best action — with its reason
 * 3. Readiness with the receipt (n sessions, m concepts spoken)
 * 4. Recent sessions + resume state
 * 5. Competency gap map
 * 6. Campaign tasks (Offer Ready)
 */

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Target, ArrowRight, TrendingUp, Calendar, Mic, FileText, Zap,
  Flame, ChevronRight, Sparkles, Trophy, Clock, AlertTriangle, CheckCircle2,
} from 'lucide-react';

interface SessionRecord {
  sessionId: string; domain: string; mode?: string; preset?: string;
  overallScore?: number; turnsCount?: number;
  weakConcepts?: string[]; at?: number;
}
interface Profile {
  targetDomains?: string[]; interviewDate?: string; displayName?: string;
}

export function MissionControl() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [coverage, setCoverage] = useState<{ domain: string; covered: number; total: number }[]>([]);
  const [nba, setNba] = useState<{ domain: string; kind: string; cta: string; concepts: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { getSessionRecords, getProfile, streakInfo } = await import('@/lib/engine/persist.mjs');
        const { coverageOf, nextBestAction } = await import('@/lib/engine/mastery.mjs');
        const recs = getSessionRecords();
        const prof = getProfile();
        setSessions(recs);
        setProfile(prof);

        // coverage across the user's target domains (or defaults)
        const domains = prof?.targetDomains?.length
          ? prof.targetDomains
          : ['ruby-backend-fresher', 'java-backend-fresher', 'frontend-fresher', 'dsa'];
        // concept universe from the coverage API
        const cov: { domain: string; covered: number; total: number }[] = [];
        for (const d of domains.slice(0, 5)) {
          try {
            const res = await fetch('/api/engine/coverage', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ domain: d }),
            });
            if (res.ok) {
              const data = await res.json();
              const total = data.concepts?.length ?? 0;
              const { coverageOf: co } = await import('@/lib/engine/mastery.mjs');
              const cc = co(data.concepts ?? []);
              cov.push({ domain: d, covered: cc.ratio ? Math.round(cc.ratio * total) : 0, total });
            }
          } catch {}
        }
        setCoverage(cov);
        const map = Object.fromEntries(cov.map((c) => [c.domain, Array(c.total).fill(0).map((_, i) => `c${i}`)]));
        const action = nextBestAction(map);
        if (action) setNba(action);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const streak = useMemo(() => {
    // consecutive-day streak from session timestamps
    const days = new Set(sessions.map((s) => new Date(s.at ?? Date.now()).toDateString()));
    let n = 0;
    const d = new Date();
    while (days.has(d.toDateString())) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }, [sessions]);

  const avg = useMemo(
    () => sessions.length ? Math.round(sessions.reduce((a, s) => a + (s.overallScore ?? 0), 0) / sessions.length) : null,
    [sessions]
  );
  const readiness = useMemo(() => {
    if (!coverage.length) return null;
    const covered = coverage.reduce((a, c) => a + c.covered, 0);
    const total = coverage.reduce((a, c) => a + c.total, 0);
    return total ? Math.round((covered / total) * 100) : 0;
  }, [coverage]);

  const interviewDate = profile?.interviewDate;
  const daysTo = interviewDate ? Math.ceil((new Date(interviewDate).getTime() - Date.now()) / 86400000) : null;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4 animate-pulse">
        {[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-2xl bg-[#141311] border border-[#26241f]" />)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* ============ target bar ============ */}
      <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-stone-500">
              <Target className="h-3 w-3" /> Active target
            </div>
            <h2 className="text-lg font-black mt-1">
              {profile?.targetDomains?.[0]?.replace(/-/g, ' ') ?? 'Pick your target to focus everything'}
            </h2>
            {daysTo != null && (
              <div className={`text-xs mt-0.5 flex items-center gap-1 ${daysTo <= 7 ? 'text-amber-400' : 'text-stone-400'}`}>
                <Calendar className="h-3 w-3" />
                {daysTo > 0 ? `${daysTo} days to interview` : 'Interview day'} · {interviewDate}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Link href="/mock-interviews" className="text-xs rounded-xl border border-[#26241f] bg-[#100f0d] px-3 py-2 hover:border-[#3d3a33] flex items-center gap-1.5 text-stone-300">
              <Mic className="h-3.5 w-3.5" /> New mock
            </Link>
            <Link href="/offer-ready/start" className="text-xs rounded-xl bg-[#e8a33d] text-[#1a1408] font-bold px-3 py-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Plan campaign
            </Link>
          </div>
        </div>
      </div>

      {/* ============ next best action ============ */}
      {nba ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#e8a33d]/40 bg-[#1c1810] p-5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#e8a33d] mb-2">
            <Zap className="h-3 w-3" /> Next best action
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold">{nba.cta}</div>
              <div className="text-xs text-stone-400 mt-1">
                {nba.domain.replace(/-/g, ' ')} · weakest: {nba.concepts?.slice(0, 3).join(', ') || 'coverage gaps'}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-[#e8a33d] shrink-0 mt-1" />
          </div>
        </motion.div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-stone-500 mb-2">
            <Zap className="h-3 w-3" /> Start here
          </div>
          <div className="font-bold">Run your first mock — 15 minutes</div>
          <div className="text-xs text-stone-400 mt-1">
            One session calibrates the engine: your weak concepts become your plan.
          </div>
          <Link href="/mock-interviews" className="mt-3 inline-flex items-center gap-1.5 text-xs bg-[#e8a33d] text-[#1a1408] font-bold px-3 py-2 rounded-lg">
            Enter the interview room <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : null}

      {/* ============ readiness + stats grid ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Readiness"
          value={readiness != null ? `${readiness}%` : '—'}
          sub={coverage.length ? `${coverage.reduce((a, c) => a + c.covered, 0)} concepts evidenced` : 'run a mock to seed'}
          icon={<Trophy className="h-4 w-4 text-[#e8a33d]" />}
        />
        <StatCard
          label="Sessions"
          value={String(sessions.length)}
          sub={avg != null ? `avg score ${avg}` : 'no scores yet'}
          icon={<Mic className="h-4 w-4 text-[#a3c291]" />}
        />
        <StatCard
          label="Streak"
          value={`${streak}d`}
          sub={streak > 0 ? 'keep it alive' : 'start today'}
          icon={<Flame className="h-4 w-4 text-orange-400" />}
        />
        <StatCard
          label="Resume"
          value={sessions.length ? 'on file' : 'none'}
          sub="claims seed your gaps"
          icon={<FileText className="h-4 w-4 text-[#9ab8d4]" />}
        />
      </div>

      {/* ============ competency gap map ============ */}
      {coverage.length > 0 && (
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-4">
          <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-3">Competency coverage</div>
          <div className="space-y-2.5">
            {coverage.map((c) => {
              const pct = c.total ? Math.round((c.covered / c.total) * 100) : 0;
              return (
                <div key={c.domain} className="flex items-center gap-3">
                  <div className="text-[11px] w-40 shrink-0 text-stone-400 truncate">
                    {c.domain.replace(/-/g, ' ')}
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-[#0f0e0c] overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${pct >= 60 ? 'bg-emerald-500' : pct >= 30 ? 'bg-[#e8a33d]' : 'bg-rose-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="text-[11px] w-16 text-right text-stone-500 font-mono">{c.covered}/{c.total}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ recent sessions ============ */}
      {sessions.length > 0 && (
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] uppercase tracking-wider text-stone-500">Recent sessions</div>
            <Link href="/mock-interviews/history" className="text-[10px] text-stone-500 hover:text-stone-300 flex items-center gap-1">
              history <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1f1e1b]">
            {sessions.slice(0, 4).reverse().map((s) => (
              <div key={s.sessionId} className="py-2.5 flex items-center gap-3">
                <ScoreBadge score={s.overallScore ?? 0} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{s.domain?.replace(/-/g, ' ')}</div>
                  <div className="text-[10px] text-stone-500">
                    {s.turnsCount ?? '?'} questions · {s.mode ?? 'technical'} · {s.at ? new Date(s.at).toLocaleDateString() : ''}
                  </div>
                </div>
                {s.weakConcepts?.length ? (
                  <div className="hidden sm:flex gap-1">
                    {s.weakConcepts.slice(0, 2).map((w) => (
                      <span key={w} className="text-[9px] rounded-full border border-rose-900/50 text-rose-300 px-2 py-0.5 truncate max-w-28">
                        {w.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-stone-500">{label}</span>
        {icon}
      </div>
      <div className="text-xl font-black mt-1.5">{value}</div>
      <div className="text-[10px] text-stone-500 mt-0.5">{sub}</div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 70 ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300'
    : score >= 40 ? 'border-[#4d3a28] bg-[#1a1510] text-[#d4a778]'
    : 'border-rose-900/60 bg-rose-950/40 text-rose-300';
  return <span className={`text-xs font-black rounded-lg border px-2 py-1 shrink-0 ${tone}`}>{score}</span>;
}

export default MissionControl;
