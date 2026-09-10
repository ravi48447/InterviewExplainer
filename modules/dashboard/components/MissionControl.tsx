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
        {[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-xl border border-border bg-surface" />)}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 lg:px-6">
      {/* ============ target bar ============ */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-caption font-medium uppercase tracking-wider text-muted-foreground">
              <Target className="h-3 w-3" /> Active target
            </div>
            <h2 className="mt-1 font-display text-title tracking-tight">
              {profile?.targetDomains?.[0]?.replace(/-/g, ' ') ?? 'Pick your target to focus everything'}
            </h2>
            {daysTo != null && (
              <div className={`mt-0.5 flex items-center gap-1 text-sm ${daysTo <= 7 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                <Calendar className="h-3 w-3" />
                {daysTo > 0 ? `${daysTo} days to interview` : 'Interview day'} · {interviewDate}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Link href="/mock-interviews" className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-muted">
              <Mic className="h-3.5 w-3.5" /> New mock
            </Link>
            <Link href="/offer-ready/start" className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
              <Sparkles className="h-3.5 w-3.5" /> Plan campaign
            </Link>
          </div>
        </div>
      </div>

      {/* ============ next best action ============ */}
      {nba ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-primary/40 bg-primary/[0.04] p-5">
          <div className="mb-2 flex items-center gap-2 text-caption font-medium uppercase tracking-wider text-primary">
            <Zap className="h-3 w-3" /> Next best action
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-foreground">{nba.cta}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {nba.domain.replace(/-/g, ' ')} · weakest: {nba.concepts?.slice(0, 3).join(', ') || 'coverage gaps'}
              </div>
            </div>
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-primary" />
          </div>
        </motion.div>
      ) : sessions.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-2 flex items-center gap-2 text-caption font-medium uppercase tracking-wider text-muted-foreground">
            <Zap className="h-3 w-3" /> Start here
          </div>
          <div className="text-base font-semibold text-foreground">Run your first mock — 15 minutes</div>
          <div className="mt-1 text-sm text-muted-foreground">
            One session calibrates the engine: your weak concepts become your plan.
          </div>
          <Link href="/mock-interviews" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
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
          icon={<Trophy className="h-4 w-4 text-primary" />}
        />
        <StatCard
          label="Sessions"
          value={String(sessions.length)}
          sub={avg != null ? `avg score ${avg}` : 'no scores yet'}
          icon={<Mic className="h-4 w-4 text-emerald-600" />}
        />
        <StatCard
          label="Streak"
          value={`${streak}d`}
          sub={streak > 0 ? 'keep it alive' : 'start today'}
          icon={<Flame className="h-4 w-4 text-amber-600" />}
        />
        <StatCard
          label="Resume"
          value={sessions.length ? 'on file' : 'none'}
          sub="claims seed your gaps"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* ============ competency gap map ============ */}
      {coverage.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 text-caption font-medium uppercase tracking-wider text-muted-foreground">Competency coverage</div>
          <div className="space-y-2.5">
            {coverage.map((c) => {
              const pct = c.total ? Math.round((c.covered / c.total) * 100) : 0;
              return (
                <div key={c.domain} className="flex items-center gap-3">
                  <div className="w-40 shrink-0 truncate text-sm text-foreground">
                    {c.domain.replace(/-/g, ' ')}
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={`h-full rounded-full ${pct >= 60 ? 'bg-emerald-600' : pct >= 30 ? 'bg-amber-500' : 'bg-destructive'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <div className="w-16 text-right font-mono text-caption text-muted-foreground">{c.covered}/{c.total}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ recent sessions ============ */}
      {sessions.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-caption font-medium uppercase tracking-wider text-muted-foreground">Recent sessions</div>
            <Link href="/mock-interviews/history" className="flex items-center gap-1 text-caption text-muted-foreground hover:text-foreground">
              history <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {sessions.slice(0, 4).reverse().map((s) => (
              <div key={s.sessionId} className="flex items-center gap-3 py-2.5">
                <ScoreBadge score={s.overallScore ?? 0} />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{s.domain?.replace(/-/g, ' ')}</div>
                  <div className="text-caption text-muted-foreground">
                    {s.turnsCount ?? '?'} questions · {s.mode ?? 'technical'} · {s.at ? new Date(s.at).toLocaleDateString() : ''}
                  </div>
                </div>
                {s.weakConcepts?.length ? (
                  <div className="hidden sm:flex gap-1">
                    {s.weakConcepts.slice(0, 2).map((w) => (
                      <span key={w} className="max-w-28 truncate rounded-md border border-destructive/40 px-2 py-0.5 text-caption text-destructive">
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
    <div className="rounded-xl border border-border bg-surface p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-caption font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="mt-1.5 text-xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-caption text-muted-foreground">{sub}</div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 70 ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-700'
    : score >= 40 ? 'border-amber-600/40 bg-amber-500/10 text-amber-700'
    : 'border-destructive/40 bg-destructive/10 text-destructive';
  return <span className={`shrink-0 rounded-lg border px-2 py-1 text-sm font-semibold tabular-nums ${tone}`}>{score}</span>;
}

export default MissionControl;
