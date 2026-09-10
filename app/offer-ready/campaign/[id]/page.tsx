'use client';

/**
 * Offer Ready — campaign dashboard. The daily home. Editorial premium.
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame, ArrowLeft, Play, CheckCircle2, Clock, Loader2, Target,
  Trophy, TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPE, SHELL, Ambient, PHASE_STYLE, CTA, CTA_QUIET, RULE } from '@/lib/offer-ready/design';
import { demoCampaign } from '@/lib/offer-ready/demo';

const DAY_ICON: Record<string, any> = {
  drill: Target, dsa: Target, 'live-coding': Play, 'system-design': Target,
  peer: Flame, 'company-loop': Trophy, dress_rehearsal: Trophy, rest: Clock, rapid: Flame,
  redemption: Flame, behavioral: Flame, adversarial: Flame, 'full-mock': Trophy,
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CampaignDashboard() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/engine/campaign?id=${id}`);
    if (res.status === 401) {
      // no login: demo mode — show the dashboard's purpose with seeded data
      const demo = demoCampaign();
      setData(demo);
      setIsDemo(true);
      return;
    }
    if (res.status === 404) {
      // unknown campaign: if it's the literal 'demo' slug or the user isn't authed, show the demo
      if (id === 'demo') {
        const demo = demoCampaign();
        setData(demo);
        setIsDemo(true);
        return;
      }
      setNotFound(true);
      return;
    }
    const d = await res.json();
    setData({ ...d, isDemo: false });
    setIsDemo(false);
  };
  useEffect(() => { load(); }, [id]);

  const completeToday = async () => {
    if (!data?.today) return;
    setBusy(true);
    try {
      await fetch('/api/engine/campaign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dayComplete', campaignId: id, dayDate: data.today.date, sessionResult: {} }),
      });
      await load();
    } finally { setBusy(false); }
  };

  if (notFound) return (
    <div className={SHELL}><Ambient />
      <main className="relative max-w-xl mx-auto px-5 py-24 text-center space-y-4">
        <Clock className="h-9 w-9 text-stone-600 mx-auto" />
        <p className="text-stone-400">Campaign not found — sign in with the account that created it.</p>
        <Link href="/offer-ready/start" className="text-[#e8a33d] text-sm underline underline-offset-4">Start a new campaign</Link>
      </main>
    </div>
  );

  if (!data) return (
    <div className={SHELL}><Ambient />
      <main className="relative max-w-2xl mx-auto px-5 py-24 text-center text-stone-400 flex items-center justify-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> loading your campaign…
      </main>
    </div>
  );

  const { campaign, today, graphs, stats } = data;
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.interviewDate).getTime() - Date.now()) / 86400000));
  const hist = campaign.readinessHistory ?? [];
  const currentReadiness = hist[hist.length - 1]?.value ?? data.readiness?.value ?? 0;
  const firstReadiness = hist[0]?.value ?? currentReadiness;
  const delta = hist.length > 1 ? currentReadiness - firstReadiness : undefined;
  const currentPhase = today?.phase ?? 'foundation';
  const ps = PHASE_STYLE[currentPhase] ?? PHASE_STYLE.foundation;
  const weekDays = campaign.days.filter((d: any) => Math.abs(new Date(d.date).getTime() - new Date(today?.date ?? Date.now()).getTime()) <= 3 * 86400000);
  const doneDays = campaign.days.filter((d: any) => d.status === 'completed').length;
  const phaseOrder = ['foundation', 'depth', 'pressure', 'rehearsal'];
  // readiness ring (editorial: thin ink ring, amber sweep)
  const R = 54, C = 2 * Math.PI * R;

  return (
    <div className={SHELL}>
      <Ambient />
      <main className="relative max-w-2xl mx-auto px-5 sm:px-6 py-12 space-y-12">

        <Link href="/offer-ready" className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-stone-300 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Offer Ready
        </Link>

        {/* demo-mode banner: purpose visible without login; real data hardens it */}
        {isDemo && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="border border-[#3d4a34] bg-[#161a13] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <div className="text-sm text-[#f5f1e8]">
                You're viewing a <span className="italic text-[#e8a33d]">demo campaign</span> — 14 days in.
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Sign in free and every graph hardens with your real sessions — this preview shows the shape of what's coming.
              </div>
            </div>
            <div className="flex gap-2.5 shrink-0">
              <a href="/login" className={`inline-flex items-center px-5 py-2.5 rounded-none ${CTA} text-xs`}>Sign in</a>
              <a href="/offer-ready/start" className={`inline-flex items-center px-5 py-2.5 rounded-none ${CTA_QUIET} text-xs`}>Build mine</a>
            </div>
          </motion.div>
        )}

        {/* ============ HERO: countdown + readiness ============ */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
          className="grid grid-cols-[auto_1fr] gap-8 items-center">
          <div className="relative w-[128px] h-[128px]">
            <svg width="128" height="128" className="-rotate-90">
              <circle cx="64" cy="64" r={R} fill="none" stroke="#26241f" strokeWidth="2.5" />
              <motion.circle cx="64" cy="64" r={R} fill="none" stroke="#e8a33d" strokeWidth="2.5" strokeLinecap="butt"
                initial={{ strokeDasharray: `0 ${C}` }} animate={{ strokeDasharray: `${(currentReadiness / 100) * C} ${C}` }}
                transition={{ duration: 1.3, ease: EASE }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CountUp to={currentReadiness} className={`${TYPE.num} text-3xl text-[#f5f1e8]`} />
              <span className="text-[9px] uppercase tracking-[0.2em] text-stone-600">ready</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className={TYPE.eyebrow}>{campaign.companyName ?? 'Your interview'} · {campaign.level}</div>
            <h1 className={`${TYPE.display} text-3xl sm:text-4xl text-[#f5f1e8] leading-[1.05]`}>
              {daysLeft === 0
                ? <>Interview day.<br /><span className="italic text-[#e8a33d]">You are ready.</span></>
                : <><span className="italic text-[#e8a33d]">{daysLeft} days</span> to go.</>}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-500">
              <span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${ps.dot}`} /> {currentPhase} phase</span>
              <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-[#c08a5a]" /> {doneDays} days done</span>
              {today && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{today.estMinutes} min today</span>}
            </div>
            {delta != null && delta !== 0 && (
              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <TrendingUp className={cn('h-3 w-3', delta >= 0 ? 'text-[#7d9a6b]' : 'text-[#c08a5a]')} />
                readiness {delta >= 0 ? 'up' : 'down'} {Math.abs(delta)} pts since day one
              </p>
            )}
          </div>
        </motion.section>

        {/* ============ TODAY ============ */}
        {today && today.status !== 'completed' && (
          <motion.section key="today" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
            className={`border ${ps.border} ${ps.bg} p-7 space-y-6`}>
            <div className={TYPE.eyebrow}>
              today — {new Date(today.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="space-y-2">
              <h2 className={`${TYPE.h1} text-[#f5f1e8]`}>{today.title}</h2>
              <p className="text-[15px] text-stone-300">
                The one thing: <span className="italic text-[#f5f1e8]">{today.oneThing}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {(today.sessionSpecs ?? []).map((s: any, i: number) => {
                const href = isDemo ? '/login' : sessionHref(s, campaign);
                return href ? (
                  <a key={i} href={href}
                    className={`group inline-flex items-center gap-2.5 px-6 py-3 rounded-none ${CTA} text-sm`}>
                    <Play className="h-4 w-4" /> Start session · {s.minutes} min
                  </a>
                ) : null;
              })}
              {!isDemo && (
              <button onClick={completeToday} disabled={busy}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-none ${CTA_QUIET} text-sm`}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" style={{ color: '#7d9a6b' }} />}
                Mark day complete
              </button>
              )}
            </div>
          </motion.section>
        )}
        {today?.status === 'completed' && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="border border-[#3d4a34] bg-[#161a13] p-6 flex items-center gap-4">
            <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: '#7d9a6b' }} />
            <div className="flex-1">
              <div className="font-medium text-sm text-[#f5f1e8]">Today's done — {today.title}</div>
              <div className="text-xs text-stone-500 mt-0.5">{today.oneThing}</div>
            </div>
            <a href="/mock-interviews" className="text-xs text-stone-400 hover:text-[#e8a33d] underline underline-offset-4 shrink-0">bonus session</a>
          </motion.section>
        )}

        {/* ============ GRAPHS: readiness arc + session strip ============ */}
        {graphs && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
            className={`${RULE} pt-8 space-y-10`}>

            {/* empty state: the plan itself is the first graph */}
            {graphs.arc.length <= 1 && graphs.sessionScores.length === 0 && (
              <div className="space-y-4">
                <div className={TYPE.eyebrow}>your campaign, ahead of you</div>
                <PlanStrip days={campaign.days} />
                <p className="text-[12px] text-stone-600 italic">
                  This is the shape of the next {campaign.days.length} days. Your readiness line
                  starts drawing with your first session.
                </p>
              </div>
            )}

            {/* readiness arc — the campaign's own line */}
            {graphs.arc.length > 1 && (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div className={TYPE.eyebrow}>readiness over the campaign</div>
                  <div className="text-[11px] text-stone-500 tabular-nums">
                    {graphs.arc[0].value} → {graphs.arc[graphs.arc.length - 1].value}
                  </div>
                </div>
                <ArcChart data={graphs.arc} />
              </div>
            )}

            {/* session score strip */}
            {graphs.sessionScores.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div className={TYPE.eyebrow}>recent sessions</div>
                  <div className="text-[11px] text-stone-500">
                    {stats?.avgScore ? `avg ${stats.avgScore}` : ''} {stats?.bestScore ? `· best ${stats.bestScore}` : ''}
                  </div>
                </div>
                <ScoreStrip data={graphs.sessionScores} />
              </div>
            )}

            {/* stat row — editorial numbers */}
            {stats && (
              <div className="grid grid-cols-4 divide-x divide-[#26241f] border-y border-[#26241f]">
                {[
                  { val: stats.totalSessions, label: 'sessions' },
                  { val: stats.minutesPracticed, label: 'minutes' },
                  { val: stats.avgScore, label: 'avg' },
                  { val: stats.bestScore, label: 'best' },
                ].map((s) => (
                  <div key={s.label} className="py-4 text-center space-y-1">
                    <div className={`${TYPE.num} text-2xl text-[#f5f1e8]`}>{s.val}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-stone-600">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ============ GRAPHS: readiness arc + session strip ============ */}
        {graphs && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
            className={`${RULE} pt-8 space-y-10`}>

            {/* empty state: the plan itself is the first graph */}
            {graphs.arc.length <= 1 && graphs.sessionScores.length === 0 && (
              <div className="space-y-4">
                <div className={TYPE.eyebrow}>your campaign, ahead of you</div>
                <PlanStrip days={campaign.days} />
                <p className="text-[12px] text-stone-600 italic">
                  This is the shape of the next {campaign.days.length} days. Your readiness line
                  starts drawing with your first session.
                </p>
              </div>
            )}

            {/* readiness arc — the campaign's own line */}
            {graphs.arc.length > 1 && (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div className={TYPE.eyebrow}>readiness over the campaign</div>
                  <div className="text-[11px] text-stone-500 tabular-nums">
                    {graphs.arc[0].value} → {graphs.arc[graphs.arc.length - 1].value}
                  </div>
                </div>
                <ArcChart data={graphs.arc} />
              </div>
            )}

            {/* session score strip */}
            {graphs.sessionScores.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div className={TYPE.eyebrow}>recent sessions</div>
                  <div className="text-[11px] text-stone-500">
                    {stats?.avgScore ? `avg ${stats.avgScore}` : ''} {stats?.bestScore ? `· best ${stats.bestScore}` : ''}
                  </div>
                </div>
                <ScoreStrip data={graphs.sessionScores} />
              </div>
            )}

            {/* stat row — editorial numbers */}
            {stats && (
              <div className="grid grid-cols-4 divide-x divide-[#26241f] border-y border-[#26241f]">
                {[
                  { val: stats.totalSessions, label: 'sessions' },
                  { val: stats.minutesPracticed, label: 'minutes' },
                  { val: stats.avgScore, label: 'avg' },
                  { val: stats.bestScore, label: 'best' },
                ].map((s) => (
                  <div key={s.label} className="py-4 text-center space-y-1">
                    <div className={`${TYPE.num} text-2xl text-[#f5f1e8]`}>{s.val}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-stone-600">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ============ THIS WEEK ============ */}
        <section className="space-y-4">
          <div className={TYPE.eyebrow}>this week</div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d: any) => {
              const Icon = DAY_ICON[d.dayType] ?? Target;
              const isToday = today?.date === d.date;
              return (
                <div key={d.date} className={cn(
                  'flex flex-col items-center gap-2 py-3 border-t-2 transition-colors',
                  d.status === 'completed' ? 'border-[#7d9a6b]'
                    : isToday ? 'border-[#e8a33d]'
                    : 'border-[#26241f]'
                )}>
                  <span className="text-[10px] uppercase tracking-widest text-stone-600">
                    {new Date(d.date).toLocaleDateString('en-IN', { weekday: 'narrow' })}
                  </span>
                  <Icon className={cn('h-4 w-4',
                    d.status === 'completed' ? 'text-[#7d9a6b]' : isToday ? 'text-[#e8a33d]' : 'text-stone-600')} />
                  <span className="text-[8px] text-stone-700 capitalize text-center leading-tight w-full truncate">
                    {d.dayType.replace(/-/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[12px] text-stone-600 italic">
            Rest days are part of the plan — spacing consolidates more than cramming.
          </p>
        </section>

        {/* ============ THE JOURNEY ============ */}
        <section className={`${RULE} pt-8 space-y-5`}>
          <div className="flex items-center justify-between">
            <div className={TYPE.eyebrow}>the journey</div>
            <Link href={`/offer-ready/certificate/${campaign.id}`} className="text-xs text-stone-400 hover:text-[#e8a33d] transition-colors flex items-center gap-1.5">
              <Trophy className="h-3 w-3" /> certificate
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {phaseOrder.map((p) => {
              const s = PHASE_STYLE[p];
              const done = campaign.days.filter((d: any) => d.phase === p && d.status === 'completed').length;
              const total = campaign.days.filter((d: any) => d.phase === p).length;
              const complete = total > 0 && done === total;
              const isCurrent = p === currentPhase;
              return (
                <div key={p} className="space-y-2">
                  <div className={cn('h-0.5', complete ? 'bg-[#7d9a6b]' : isCurrent ? s.dot : 'bg-[#26241f]')} />
                  <div className={cn('text-[10px] capitalize', isCurrent ? s.text : 'text-stone-600')}>{p}</div>
                  <div className="text-[9px] text-stone-700">{done}/{total}</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

/** CountUp — number animates to its value on load. Small, quiet. */
function CountUp({ to, className }: { to: number; className?: string }) {
  const [val, setVal] = React.useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className={className}>{val}</span>;
}

/**
 * PlanStrip — the campaign plan as a horizontal phase bar. Used as the
 * empty-state graph: the shape of what's ahead, phase-colored, animated.
 */
function PlanStrip({ days }: { days: { phase: string; dayType: string; status: string }[] }) {
  const phaseOrder = ['foundation', 'depth', 'pressure', 'rehearsal'];
  const colorOf = (p: string) =>
    p === 'foundation' ? '#7d9a6b' : p === 'depth' ? '#7a93ad' : p === 'pressure' ? '#c08a5a' : '#a98ba3';
  return (
    <div className="flex items-end gap-[3px] h-20">
      {days.map((d, i) => {
        const intensity = d.status === 'completed' ? 1 : d.status === 'missed' ? 0.35 : 0.65;
        const h = d.dayType === 'rest' ? 30 : d.dayType === 'dress_rehearsal' ? 100 : 55 + (i % 3) * 12;
        return (
          <motion.div
            key={i}
            className="flex-1 rounded-[1px]"
            style={{ height: `${h}%`, background: colorOf(d.phase), opacity: intensity }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${h}%`, opacity: intensity }}
            transition={{ delay: i * 0.025, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </div>
  );
}

/**
 * ArcChart — the readiness line over the campaign. Editorial: thin ink line,
 * amber stroke, small point ticks, drawn-in animation. No grid, no glow.
 */
function ArcChart({ data }: { data: { ts: number; value: number }[] }) {
  const W = 560, H = 120, PAD_L = 8, PAD_R = 8, PAD_T = 10, PAD_B = 18;
  const min = Math.min(...data.map((d) => d.value), 0);
  const max = Math.max(...data.map((d) => d.value), 60);
  const span = Math.max(max - min, 10);
  const x = (i: number) => PAD_L + (i * (W - PAD_L - PAD_R)) / Math.max(data.length - 1, 1);
  const y = (v: number) => H - PAD_B - ((v - min) / span) * (H - PAD_T - PAD_B);
  const pts = data.map((d, i) => [x(i), y(d.value)]);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* hairline baseline + top rule — quiet grid */}
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="#26241f" strokeWidth="1" />
        <line x1={PAD_L} y1={PAD_T} x2={W - PAD_R} y2={PAD_T} stroke="#26241f" strokeWidth="1" />
        {/* the line — draws in */}
        <motion.polyline
          fill="none" stroke="#e8a33d" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
          points={pts.map((p) => p.join(',')).join(' ')}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* point ticks */}
        {pts.map((p, i) => (
          <motion.circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#121110" stroke="#e8a33d" strokeWidth="1.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.08 }} />
        ))}
        {/* last value emphasis */}
        {pts.length > 0 && (
          <motion.circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill="#e8a33d"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, duration: 0.3 }} />
        )}
        {/* date ticks: first + last */}
        <text x={PAD_L} y={H - 4} fontSize="9" fill="#78716c" fontFamily="inherit">
          {new Date(data[0].ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </text>
        <text x={W - PAD_R} y={H - 4} fontSize="9" fill="#78716c" textAnchor="end">
          {new Date(data[data.length - 1].ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </text>
      </svg>
    </div>
  );
}

/**
 * ScoreStrip — per-session bars (recent 10). Height = score; amber for strong,
 * clay for mid, muted for weak. Mode tick on hover title. Editorial, no glow.
 */
function ScoreStrip({ data }: { data: { ts: number; score: number; mode: string; minutes: number }[] }) {
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((s, i) => {
        const h = Math.max(4, (s.score / 100) * 100);
        const barColor = s.score >= 70 ? '#e8a33d' : s.score >= 45 ? '#c08a5a' : '#5a544c';
        return (
          <motion.div
            key={s.ts + '-' + i}
            title={`${s.mode} · ${s.score} · ${s.minutes}m · ${new Date(s.ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
            className="flex-1 rounded-[1px]"
            style={{ height: `${h}%`, background: barColor }}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </div>
  );
}

function sessionHref(spec: any, campaign: any): string | null {
  const domain = spec.domain ?? campaign.domains?.[0] ?? 'ruby-backend-fresher';
  switch (spec.mode) {
    case 'quick': return `/mock-interviews/audio?mode=technical&preset=quick&tier=1&persona=mentor&domain=${domain}&count=5`;
    case 'dsa': return `/mock-interviews/audio?mode=coding&preset=deep&tier=2&domain=dsa`;
    case 'live-coding': return `/mock-interviews/audio?mode=coding&preset=deep&tier=3&persona=detail&domain=${domain}`;
    case 'system-design': return `/mock-interviews/audio?mode=technical&preset=deep&tier=4&persona=architect&domain=${domain}`;
    case 'behavioral': return `/mock-interviews/audio?mode=behavioral&preset=standard&tier=3&domain=${domain}`;
    case 'full': return `/mock-interviews/audio?mode=mixed&preset=deep&tier=${spec.tier ?? 3}&domain=${domain}`;
    case 'rapid': return `/mock-interviews/audio?mode=technical&preset=quick&tier=3&persona=rapid&domain=${domain}&count=12`;
    case 'peer': return `/mock-interviews/peer`;
    case 'company-loop': return `/mock-interviews/company`;
    default: return null;
  }
}
