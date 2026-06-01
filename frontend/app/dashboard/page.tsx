'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import apiClient from '@/lib/api-client';
import {
  Flame, BookOpen, Clock, Bookmark, Target, AlertTriangle, CheckCircle2,
  BarChart3, Zap, Trophy, Award, Play, Activity,
  Calendar, Rocket, Mic, ArrowRight,
  Brain, Lightbulb, LogIn, Sparkles, Compass, Star,
  GraduationCap, Shield, Code2, TrendingUp, Timer,
  RefreshCw, ChevronRight, ChevronDown, Medal,
  Layers, Flag, Crown,
} from 'lucide-react';
import Link from 'next/link';
import { DashboardSummary } from '@/lib/api';
import { PRO_PRICE_LABEL, PAYMENTS_ENABLED, hasProAccess } from '@/lib/billing';
import dynamic from 'next/dynamic';

const SkillRadar = dynamic(
  () => import('@/components/dashboard/skill-radar').then(m => m.SkillRadar),
  { ssr: false, loading: () => <div className="h-[240px] flex items-center justify-center text-xs text-slate-400">Loading chart…</div> },
);
import { cn } from '@/lib/utils';
import { FocusDomainPicker } from '@/components/dashboard/focus-domain-picker';
import { saveFocusDomain, getFocusDomain } from '@/lib/focus-domain';
import type { ContentDomain } from '@/lib/types/content-domain';

/* Stacks/categories returned by /api/content/domain-stacks for a domain slug. */
interface ContentStack {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  questionCount: number;
  category: string;
}
interface ContentCategory { id: number; name: string; slug: string; stacks: ContentStack[]; }
interface DomainStructure { stacks: ContentStack[]; categories: ContentCategory[]; }

/* ─── Helpers ─────────────────────────────────────────────────── */

function fmtTime(s: number): string {
  if (!s || s <= 0) return '0h';
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtAvg(total: number, count: number): string {
  if (!count) return '—';
  const avg = Math.round(total / count / 60);
  return avg > 0 ? `${avg}m` : '<1m';
}

function fmtExp(raw: string | null): string {
  if (!raw) return '';
  const map: Record<string, string> = {
    BEGINNER: '0–2 years', INTERMEDIATE: '2–5 years', ADVANCED: '5+ years',
    E0_0_TO_1: '0–2 years', E1_1_TO_3: '0–2 years', E2_3_TO_5: '2–5 years', E3_5_PLUS: '5+ years',
  };
  return map[raw] ?? raw;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* Human-friendly relative time for an ISO yyyy-MM-dd date string. */
function relativeDate(iso: string): string {
  if (!iso) return '';
  const then = new Date(iso + 'T00:00:00');
  if (isNaN(then.getTime())) return iso;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - then.getTime()) / 86_400_000);
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function initialsOf(name?: string | null): string {
  if (!name) return 'IE';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'IE';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

/* Gamification — derived purely from real progress (10 questions = 1 level). */
const PER_LEVEL = 10;
function levelInfo(done: number, streak: number) {
  const level = Math.floor(done / PER_LEVEL) + 1;
  const intoLevel = done % PER_LEVEL;
  const toNext = PER_LEVEL - intoLevel;
  const pct = Math.round((intoLevel / PER_LEVEL) * 100);
  const xp = done * 100 + streak * 50;
  const title =
    level >= 20 ? 'Distinguished' :
    level >= 12 ? 'Expert' :
    level >= 7 ? 'Proficient' :
    level >= 3 ? 'Apprentice' : 'Novice';
  return { level, intoLevel, toNext, pct, xp, title };
}

const MILESTONES = [
  { n: 1, label: 'First Step' },
  { n: 10, label: 'Rolling' },
  { n: 50, label: 'Committed' },
  { n: 100, label: 'Century' },
  { n: 250, label: 'Master' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function computeActivityStats(data: { date: string; count: number }[]) {
  let total = 0, active = 0, best = 0;
  for (const d of data) {
    if (d.count > 0) { total += d.count; active += 1; }
    if (d.count > best) best = d.count;
  }
  return { total, active, best };
}

/* ─── Count-up animation hook ─────────────────────────────────── */

function useCountUp(target: number, duration = 1000): number {
  const [val, setVal] = useState(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReduced.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    }
    if (prefersReduced.current || target <= 0) { setVal(target); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return val;
}

/* ─── Sample Data ─────────────────────────────────────────────── */

const SAMPLE: DashboardSummary = {
  totalQuestions: 467, totalConcepts: 85, activeTracks: 3, domainsCount: 64,
  completedQuestions: 47, totalTimeSpent: 18720, currentStreak: 12, longestStreak: 21, bookmarksCount: 8,
  stackPerformance: [
    { label: 'Spring Boot', progress: 72, color: '#3b82f6', completed: 18, total: 25 },
    { label: 'Core Java', progress: 85, color: '#22c55e', completed: 17, total: 20 },
    { label: 'Microservices', progress: 40, color: '#f59e0b', completed: 6, total: 15 },
    { label: 'System Design', progress: 30, color: '#a855f7', completed: 3, total: 10 },
    { label: 'SQL & Databases', progress: 60, color: '#06b6d4', completed: 3, total: 5 },
  ],
  weakAreas: [
    { label: 'Microservices', description: 'Focus on service discovery, circuit breakers, and fault tolerance patterns.', mastery: 40, color: '#f59e0b' },
    { label: 'System Design', description: 'Practice distributed system fundamentals: CAP theorem, consistent hashing, load balancing.', mastery: 30, color: '#ef4444' },
  ],
  recentActivity: [
    { title: 'Completed a question', detail: 'What is Spring Boot', activityType: 'QUESTION_COMPLETED', date: '2026-05-31' },
    { title: 'Saved a bookmark', detail: 'HashMap Internals', activityType: 'BOOKMARK_ADDED', date: '2026-05-30' },
    { title: 'Completed a question', detail: 'REST vs gRPC', activityType: 'QUESTION_COMPLETED', date: '2026-05-30' },
    { title: 'Completed a question', detail: 'SOLID Principles', activityType: 'QUESTION_COMPLETED', date: '2026-05-29' },
    { title: 'Started a mock interview', detail: 'Java Backend', activityType: 'MOCK_STARTED', date: '2026-05-28' },
  ],
  primaryDomainName: 'Java Backend Intermediate',
  primaryDomainSlug: 'java-backend-intermediate',
  experienceLevel: 'INTERMEDIATE',
  radarData: [
    { subject: 'Core Java', score: 85 }, { subject: 'Spring Boot', score: 72 },
    { subject: 'Databases', score: 60 }, { subject: 'Microservices', score: 40 },
    { subject: 'System Design', score: 30 }, { subject: 'DevOps', score: 15 },
  ],
  dailyActivity: [],
  difficultyBreakdown: { easy: 21, medium: 17, hard: 9 },
};

const EMPTY: DashboardSummary = {
  totalQuestions: 0, totalConcepts: 0, activeTracks: 0, domainsCount: 64,
  completedQuestions: 0, totalTimeSpent: 0, currentStreak: 0, longestStreak: 0, bookmarksCount: 0,
  stackPerformance: [], weakAreas: [], recentActivity: [],
  primaryDomainName: null, primaryDomainSlug: null, experienceLevel: null,
  radarData: [],
  dailyActivity: [],
  difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
};

/* ─── Circular Gauge ─────────────────────────────────────────── */

function ReadinessGauge({ value, size = 140, strokeWidth = 12 }: {
  value: number; size?: number; strokeWidth?: number;
}) {
  const display = useCountUp(value, 1100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const gradId = 'gauge-grad';
  const tier = value >= 70 ? 'Strong' : value >= 40 ? 'Building' : value > 0 ? 'Getting Started' : 'Not Started';
  const colors = value >= 70
    ? { from: '#22c55e', to: '#16a34a', text: 'text-emerald-600' }
    : value >= 40
      ? { from: '#f59e0b', to: '#d97706', text: 'text-amber-600' }
      : { from: '#3b82f6', to: '#6366f1', text: 'text-blue-600' };

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Interview readiness ${value} percent — ${tier}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f1f5f9" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius}
          stroke={`url(#${gradId})`} strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-slate-900 tabular-nums">{display}<span className="text-base">%</span></span>
        <span className={cn("text-[11px] font-bold mt-0.5", colors.text)}>{tier}</span>
      </div>
    </div>
  );
}

/* ─── Activity Heatmap ────────────────────────────────────────── */

function heatColor(count: number): string {
  if (count === 0) return '#eef1f6';
  if (count <= 2) return '#c7d2fe';
  if (count <= 4) return '#818cf8';
  if (count <= 6) return '#4f46e5';
  return '#3730a3';
}

function ActivityHeatmap({ data, weeks = 52 }: { data: { date: string; count: number }[]; weeks?: number }) {
  const { columns, monthLabels } = useMemo(() => {
    const dataMap = new Map(data.map(d => [d.date, d.count]));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - (weeks * 7 - 1));
    start.setDate(start.getDate() - start.getDay()); // align to Sunday for clean week columns

    const cols: { date: string; count: number }[][] = [];
    let col: { date: string; count: number }[] = [];
    const cursor = new Date(start);
    while (cursor <= today) {
      const ds = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      col.push({ date: ds, count: dataMap.get(ds) ?? 0 });
      if (cursor.getDay() === 6) { cols.push(col); col = []; }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (col.length) cols.push(col);

    const labels: string[] = [];
    let lastMonth = -1;
    cols.forEach((c, i) => {
      const m = new Date(c[0].date + 'T00:00:00').getMonth();
      if (m !== lastMonth) { labels[i] = MONTHS[m]; lastMonth = m; }
      else labels[i] = '';
    });

    return { columns: cols, monthLabels: labels };
  }, [data, weeks]);

  const colCount = columns.length;
  const gridCols = { gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` };

  return (
    <div>
      <div className="grid gap-[3px] mb-1.5" style={gridCols}>
        {monthLabels.map((l, i) => (
          <div key={i} className="text-[9px] text-slate-400 font-semibold whitespace-nowrap">{l}</div>
        ))}
      </div>
      <div className="grid gap-[3px]" style={gridCols}>
        {columns.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[3px]">
            {week.map((day, dIdx) => (
              <div key={dIdx}
                className="aspect-square w-full rounded-[2px] ring-1 ring-inset ring-slate-900/[0.04] hover:ring-2 hover:ring-indigo-400 transition-all"
                style={{ backgroundColor: heatColor(day.count) }}
                role="img"
                aria-label={`${day.date}: ${day.count} ${day.count === 1 ? 'question' : 'questions'}`}
                title={`${day.date}: ${day.count} questions`} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-slate-400 font-medium">
        <span>Less</span>
        <div className="flex gap-[2px]">
          {[0, 1, 3, 5, 7].map(i => (
            <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: heatColor(i) }} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

/* ─── Section Header ──────────────────────────────────────────── */

function SH({ icon: Icon, title, badge }: {
  icon: React.ElementType; title: string; badge?: React.ReactNode; iconCls?: string; iconColor?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <h2 className="text-[13px] font-semibold text-slate-900 tracking-tight">{title}</h2>
      </div>
      {badge}
    </div>
  );
}

/* ─── Card wrapper (premium surface) ──────────────────────────── */

function Card({ className, children, delay }: {
  className?: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        "transition-colors duration-200 hover:border-slate-300",
        delay ? `animate-fade-in-up anim-delay-${delay}` : "animate-fade-in-up",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── Achievement Badge ───────────────────────────────────────── */

function Badge({ icon: Icon, label, earned, progress, desc }: {
  icon: React.ElementType; label: string; earned: boolean; progress?: number; desc: string;
}) {
  return (
    <div className={cn(
      "relative flex items-center gap-3 p-3 rounded-xl border transition-colors",
      earned ? "bg-white border-slate-200" : "bg-slate-50/60 border-slate-200 opacity-70",
    )}>
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
        earned ? "bg-indigo-600" : "bg-slate-200",
      )}>
        <Icon className={cn("h-4 w-4", earned ? "text-white" : "text-slate-400")} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-800 leading-tight">{label}</p>
        <p className="text-[11px] text-slate-500 leading-tight">{desc}</p>
        {!earned && progress !== undefined && progress > 0 && (
          <div className="mt-1.5 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {earned && (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}

/* ─── Loading Skeleton ────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <div className="bg-slate-900 h-44" />
      <div className="px-6 lg:px-10 xl:px-16 -mt-8 animate-pulse space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-28 bg-white rounded-2xl shadow-sm" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-2xl shadow-sm" />)}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ──────────────────────────────────────────── */

export default function DashboardPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [domainMenuOpen, setDomainMenuOpen] = useState(false);
  const [switchingDomain, setSwitchingDomain] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [domainList, setDomainList] = useState<ContentDomain[]>([]);
  const [domainStruct, setDomainStruct] = useState<DomainStructure | null>(null);
  const isGuest = !user;

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setError(false);
    apiClient.get('/dashboard/summary')
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user, authLoading, reloadKey]);

  /* Resolve the focus domain slug: server profile wins, else the locally
     remembered choice (keeps the dashboard correct even if the backend is
     briefly unavailable). */
  useEffect(() => {
    if (isGuest) { setActiveSlug(null); return; }
    setActiveSlug(data?.primaryDomainSlug ?? getFocusDomain()?.slug ?? null);
  }, [data, isGuest]);

  /* The real domain catalog (drives the picker + display names). */
  useEffect(() => {
    if (isGuest) return;
    let alive = true;
    fetch('/api/content/all-domains')
      .then(r => r.json())
      .then((all: ContentDomain[]) => { if (alive) setDomainList(Array.isArray(all) ? all : []); })
      .catch(() => { /* picker still works via its own fetch */ });
    return () => { alive = false; };
  }, [isGuest]);

  /* The chosen domain's REAL stacks/categories/question-counts, straight from
     the filesystem content the rest of the site serves. */
  useEffect(() => {
    if (isGuest || !activeSlug) { setDomainStruct(null); return; }
    let alive = true;
    fetch(`/api/content/domain-stacks?domainSlug=${encodeURIComponent(activeSlug)}`)
      .then(r => r.json())
      .then((body) => {
        if (!alive) return;
        setDomainStruct(body && Array.isArray(body.stacks) ? body as DomainStructure : null);
      })
      .catch(() => { if (alive) setDomainStruct(null); });
    return () => { alive = false; };
  }, [activeSlug, isGuest]);

  const retry = useCallback(() => setReloadKey(k => k + 1), []);

  /* Activate (and persist) a focus domain — adds it to the user's workspace if
     it's new, then makes it active. Drives the switchable-dashboard behaviour. */
  const applyDomain = useCallback(async (slug: string, name: string) => {
    setDomainMenuOpen(false);
    setSwitchingDomain(true);
    saveFocusDomain({ slug, name });
    setActiveSlug(slug); // instant UI update via the content API
    try {
      await apiClient.post('/dashboard/primary-domain-slug', null, { params: { slug, name } });
      await refreshUser();
      const res = await apiClient.get('/dashboard/summary');
      setData(res.data);
    } catch {
      /* Persist failed — the dashboard still reflects the new domain locally
         because activeSlug + the content API don't depend on the round-trip. */
    } finally {
      setSwitchingDomain(false);
    }
  }, [refreshUser]);

  const chooseDomain = useCallback((domain: ContentDomain) => {
    const label = `${domain.name}${domain.levelLabel ? ` · ${domain.levelLabel}` : ''}`;
    return applyDomain(domain.slug, label);
  }, [applyDomain]);

  // Guests now see a blank (real-shape) dashboard rather than fabricated sample
  // data — the graphs fill in only after sign-in + activity.
  const showSample = false;
  const selectedDomains = user?.domains ?? [];

  /* Interview readiness countdown (only when the user set a date at signup). */
  const interviewCountdown = useMemo(() => {
    if (!user?.interviewDate) return null;
    const target = new Date(user.interviewDate + 'T00:00:00');
    if (isNaN(target.getTime())) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
    return { days, role: user.targetRole ?? null };
  }, [user?.interviewDate, user?.targetRole]);
  const d = data ?? (showSample ? SAMPLE : EMPTY);
  const done = d.completedQuestions || 0;

  /* When we have the chosen domain's real structure, it is the source of truth
     for the stack list / totals / skill axes — not the (sparse) DB summary. */
  const contentStacks = domainStruct?.stacks ?? [];
  const hasContentStruct = !isGuest && contentStacks.length > 0;

  const activeDomain = domainList.find(dd => dd.slug === activeSlug) ?? null;
  const domainDisplayName = activeDomain
    ? `${activeDomain.name}${activeDomain.levelLabel ? ` · ${activeDomain.levelLabel}` : ''}`
    : (data?.primaryDomainName ?? null);

  const total = hasContentStruct
    ? contentStacks.reduce((s, x) => s + (x.questionCount || 0), 0)
    : (d.totalQuestions || 467);

  /* Real per-stack progress comes from the DB summary; the content tree only
     supplies the canonical stack list + totals. Merge them by normalized name
     so the progress bars reflect actual completions instead of always 0%. */
  const normName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const perfByName = new Map((d.stackPerformance ?? []).map(sp => [normName(sp.label), sp]));

  const stacks = hasContentStruct
    ? [...contentStacks]
        .sort((a, b) => (b.questionCount || 0) - (a.questionCount || 0))
        .slice(0, 14)
        .map(s => {
          const perf = perfByName.get(normName(s.name));
          const stackTotal = s.questionCount || 0;
          const solved = stackTotal > 0
            ? Math.min(perf?.completed ?? 0, stackTotal)
            : (perf?.completed ?? 0);
          const pct = stackTotal > 0
            ? Math.round((solved / stackTotal) * 100)
            : (perf?.progress ?? 0);
          return { name: s.name, solved, total: stackTotal, pct };
        })
    : (d.stackPerformance ?? []).map(sp => ({
        name: sp.label, solved: sp.completed ?? 0, total: sp.total ?? 0, pct: sp.progress ?? 0,
      }));

  const radarByName = new Map((d.radarData ?? []).map(r => [normName(r.subject), r.score]));
  const radar = hasContentStruct
    ? (domainStruct?.categories ?? [])
        .filter(c => c.stacks.some(s => (s.questionCount || 0) > 0))
        .slice(0, 8)
        .map(c => ({ subject: c.name, score: radarByName.get(normName(c.name)) ?? 0 }))
    : (d.radarData ?? []);

  const continueHref = activeSlug ? `/${activeSlug}` : '/domains';

  const stackAvg = stacks.length > 0
    ? Math.round(stacks.reduce((s, x) => s + x.pct, 0) / stacks.length)
    : 0;

  const lvl = levelInfo(done, d.currentStreak ?? 0);
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;
  const strengths = [...stacks].sort((a, b) => b.pct - a.pct).filter(s => s.pct >= 50).slice(0, 3);
  const topWeak = (d.weakAreas ?? [])[0] ?? null;

  /* Real difficulty distribution of completed questions (no fabricated split). */
  const diff = d.difficultyBreakdown ?? { easy: 0, medium: 0, hard: 0 };
  const diffTotal = diff.easy + diff.medium + diff.hard;
  const roadmapFill = Math.min(100, (done / MILESTONES[MILESTONES.length - 1].n) * 100);
  const currentMilestoneIdx = MILESTONES.findIndex(m => done < m.n);

  const knowledge = [
    { icon: Brain,   label: 'Concepts',   val: (d.totalConcepts ?? 0).toLocaleString(), cls: 'bg-slate-100 text-slate-500' },
    { icon: Layers,  label: 'Tracks',     val: `${d.activeTracks ?? 0}`,                 cls: 'bg-slate-100 text-slate-500' },
    { icon: Compass, label: 'Domains',    val: `${d.domainsCount ?? 0}`,                 cls: 'bg-slate-100 text-slate-500' },
    { icon: Target,  label: 'Completion', val: `${completionPct}%`,                      cls: 'bg-slate-100 text-slate-500' },
  ];

  const achievements = [
    { icon: Target,   label: 'First Steps',  desc: 'Complete 1 question',   earned: done >= 1,  progress: Math.min(100, done * 100) },
    { icon: Zap,      label: 'On a Roll',    desc: 'Complete 10 questions',  earned: done >= 10, progress: Math.min(100, done * 10) },
    { icon: Trophy,   label: 'Century Club', desc: '100 questions',          earned: done >= 100, progress: Math.min(100, done) },
    { icon: Flame,    label: '3-Day Streak', desc: '3 days in a row',        earned: (d.currentStreak ?? 0) >= 3 },
    { icon: Star,     label: 'Week Warrior', desc: '7-day streak',           earned: (d.currentStreak ?? 0) >= 7 },
    { icon: Rocket,   label: 'Unstoppable',  desc: '30-day streak',          earned: (d.currentStreak ?? 0) >= 30 },
    { icon: Bookmark, label: 'Curator',      desc: 'Save 5 bookmarks',       earned: (d.bookmarksCount ?? 0) >= 5, progress: Math.min(100, ((d.bookmarksCount ?? 0) / 5) * 100) },
    { icon: Shield,   label: 'Deep Diver',   desc: '10 hours study',         earned: (d.totalTimeSpent ?? 0) >= 36000, progress: Math.min(100, ((d.totalTimeSpent ?? 0) / 36000) * 100) },
  ];

  const earnedCount = achievements.filter(a => a.earned).length;
  const nextBadge = achievements.find(a => !a.earned);

  const sampleHeatmap = useMemo(() => {
    if (!showSample) return [];
    const arr: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 0; i < 371; i++) {
      const dt = new Date(today); dt.setDate(dt.getDate() - i);
      const r = Math.random();
      if (r > 0.4) arr.push({ date: dt.toISOString().split('T')[0], count: Math.ceil(r * 8) });
    }
    return arr;
  }, [showSample]);

  const heatmapData = showSample ? sampleHeatmap : (d.dailyActivity ?? []);
  const actStats = useMemo(() => computeActivityStats(heatmapData), [heatmapData]);
  const activitySummary = [
    { icon: Flame,        label: 'Current streak', val: `${d.currentStreak || 0}`, unit: d.currentStreak === 1 ? 'day' : 'days', cls: 'bg-slate-100 text-slate-500' },
    { icon: Calendar,     label: 'Active days',    val: `${actStats.active}`, unit: 'this year', cls: 'bg-slate-100 text-slate-500' },
    { icon: CheckCircle2, label: 'Questions',      val: `${actStats.total}`, unit: 'last 12 mo', cls: 'bg-slate-100 text-slate-500' },
    { icon: Zap,          label: 'Best day',       val: `${actStats.best}`, unit: 'questions', cls: 'bg-slate-100 text-slate-500' },
  ];

  if (authLoading || loading) return <DashboardSkeleton />;

  /* Hard failure for logged-in users — surface it instead of an empty dashboard. */
  if (error && !isGuest && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-red-500" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 mb-1.5">Couldn’t load your dashboard</h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            We hit a problem fetching your progress. Check your connection and try again.
          </p>
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-16">

      {/* ══════════ AMBIENT BACKGROUND ══════════ */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
        <div className="absolute top-1/4 -left-40 h-[30rem] w-[30rem] rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute top-1/2 -right-32 h-[28rem] w-[28rem] rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-violet-200/20 blur-3xl" />
      </div>

      {/* ══════════ HERO ══════════ */}
      <div className="relative bg-slate-900 text-white border-b border-slate-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
          <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        <div className="relative px-6 lg:px-10 xl:px-16 py-5 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="relative h-14 w-14 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-base font-semibold tracking-tight text-slate-200">
                  {isGuest ? <Sparkles className="h-5 w-5 text-slate-300" /> : initialsOf(user?.name)}
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium mb-0.5">{greeting()}</p>
                <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">
                  {isGuest ? 'Dashboard Preview' : (user?.name ?? 'Welcome Back')}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {!isGuest && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> {lvl.title} · Level {lvl.level}
                    </span>
                  )}
                  {!isGuest && data?.experienceLevel && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-slate-300">
                      <GraduationCap className="h-3 w-3 text-slate-400" /> {fmtExp(data.experienceLevel)}
                    </span>
                  )}
                  {!isGuest && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDomainMenuOpen(o => !o)}
                        disabled={switchingDomain}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-60"
                      >
                        <Target className="h-3 w-3 text-slate-400" aria-hidden="true" />
                        {switchingDomain ? 'Saving…' : (domainDisplayName ?? 'Set focus domain')}
                        <ChevronDown className={cn("h-3 w-3 text-slate-400 transition-transform", domainMenuOpen && "rotate-180")} aria-hidden="true" />
                      </button>
                      {domainMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setDomainMenuOpen(false)} />
                          <div className="absolute left-0 top-full mt-1.5 z-30 w-[20rem] max-w-[calc(100vw-3rem)] rounded-xl bg-white shadow-xl border border-slate-200 p-3 max-h-[70vh] overflow-y-auto">
                            {selectedDomains.length > 0 && (
                              <div className="mb-3">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Your dashboards</p>
                                <div className="space-y-1">
                                  {selectedDomains.map(dom => {
                                    const active = dom.slug === activeSlug;
                                    return (
                                      <button
                                        key={dom.slug}
                                        type="button"
                                        onClick={() => applyDomain(dom.slug, dom.name)}
                                        className={cn(
                                          'flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                                          active
                                            ? 'border-indigo-300 bg-indigo-50 text-indigo-800 font-semibold'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50',
                                        )}
                                      >
                                        <span className="truncate">{dom.name}</span>
                                        {active && <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" aria-hidden="true" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              {selectedDomains.length > 0 ? 'Add another path' : 'Choose focus domain'}
                            </p>
                            <FocusDomainPicker
                              valueSlug={activeSlug}
                              domains={domainList.length > 0 ? domainList : undefined}
                              onSelect={chooseDomain}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {isGuest && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-slate-300">
                      <Sparkles className="h-3 w-3 text-slate-400" /> Preview Mode
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch sm:items-end gap-3 lg:min-w-[280px]">
              {!isGuest && (
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10">
                    <Flame className="h-4 w-4 text-slate-300" />
                    <span className="text-sm font-semibold tabular-nums">{d.currentStreak || 0}</span>
                    <span className="text-[11px] text-slate-400">day streak</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10">
                    <CheckCircle2 className="h-4 w-4 text-slate-300" />
                    <span className="text-sm font-semibold tabular-nums">{done.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400">solved</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                {isGuest ? (
                  <>
                    <Link href="/signup" className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors">
                      Create Free Account
                    </Link>
                    <Link href="/login?redirect=/dashboard" className="px-5 py-2.5 rounded-lg border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors flex items-center gap-1.5">
                      <LogIn className="h-3.5 w-3.5" /> Log In
                    </Link>
                  </>
                ) : (
                  <Link
                    href={continueHref}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="h-3.5 w-3.5" /> Continue Learning
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Level progress bar */}
          {!isGuest && (
            <div className="mt-6 max-w-xl">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-300 font-medium">Level {lvl.level} · {lvl.title}</span>
                <span className="text-slate-400">{lvl.toNext} more to Level {lvl.level + 1}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${Math.max(4, lvl.pct)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ STATS ROW — 6 cards ══════════ */}
      <div className="px-6 lg:px-10 xl:px-16 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Questions Solved',  val: done.toLocaleString(), sub: `of ${total.toLocaleString()}`, icon: CheckCircle2 },
            { label: 'Current Streak',    val: `${d.currentStreak || 0}`, sub: `day${(d.currentStreak ?? 0) === 1 ? '' : 's'}`, icon: Flame },
            { label: 'Study Time',        val: fmtTime(d.totalTimeSpent ?? 0), sub: 'total invested', icon: Clock },
            { label: 'Avg. per Question', val: fmtAvg(d.totalTimeSpent ?? 0, done), sub: 'avg read time', icon: Timer },
            { label: 'Active Stacks',     val: `${stacks.length}`, sub: `of ${d.domainsCount ?? 64} domains`, icon: BarChart3 },
            { label: 'Bookmarks',         val: `${d.bookmarksCount ?? 0}`, sub: 'saved for review', icon: Bookmark },
          ].map((m, i) => (
            <div
              key={m.label}
              className={cn(
                "group bg-white rounded-xl border border-slate-200 px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                "transition-colors duration-200 hover:border-slate-300 animate-fade-in-up",
                `anim-delay-${Math.min(6, i + 1)}`,
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">{m.label}</p>
                <m.icon className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-400 transition-colors" aria-hidden="true" />
              </div>
              <p className="text-xl font-semibold text-slate-900 tracking-tight leading-none tabular-nums">{m.val}</p>
              <p className="text-[11px] text-slate-500 mt-1">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ ONBOARDING — new signed-in users ══════════ */}
      {!isGuest && done === 0 && (
        <div className="px-6 lg:px-10 xl:px-16 mt-5">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 lg:p-6 text-white animate-fade-in-up">
            <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  <Rocket className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold tracking-tight">
                    {activeSlug ? "Let's solve your first question" : 'Pick a focus domain to begin'}
                  </h2>
                  <p className="text-sm text-indigo-100 mt-1 max-w-xl leading-relaxed">
                    {activeSlug
                      ? 'Your dashboard fills with real progress, streaks, and insights as you complete questions. Start with your first one now.'
                      : 'Choose a learning path and your dashboard will track completions, streaks, strengths and weak spots automatically.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {!activeSlug && (
                  <button
                    type="button"
                    onClick={() => setDomainMenuOpen(true)}
                    className="px-5 py-2.5 rounded-lg bg-white/15 border border-white/25 text-white font-semibold text-sm hover:bg-white/25 transition-colors"
                  >
                    Choose focus domain
                  </button>
                )}
                <Link
                  href={continueHref}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-white text-indigo-700 font-semibold text-sm hover:bg-indigo-50 transition-colors"
                >
                  <Play className="h-3.5 w-3.5" /> {activeSlug ? 'Start learning' : 'Browse paths'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ PRO / PRICING BANNER ══════════ */}
      {!isGuest && (
        <div className="px-6 lg:px-10 xl:px-16 mt-5">
          {user?.plan === 'pro' || (!PAYMENTS_ENABLED && hasProAccess(user?.plan)) ? (
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-2.5 text-sm">
              <Crown className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
              <span className="text-slate-700">
                {user?.plan === 'pro'
                  ? 'Pro unlocked — your full personalized dashboard is active.'
                  : `Pro (normally ${PRO_PRICE_LABEL}) is free during beta — full dashboard unlocked.`}
              </span>
              <Link href="/pricing" className="ml-auto text-xs font-semibold text-amber-700 hover:underline shrink-0">
                View plan
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3">
              <Crown className="h-5 w-5 text-amber-500 shrink-0" aria-hidden="true" />
              <p className="text-sm text-slate-700 flex-1">
                Unlock the full personalized dashboard, multi-domain switching and progress tracking with{' '}
                <span className="font-bold">Pro — {PRO_PRICE_LABEL}</span>.
              </p>
              <Link
                href="/pricing"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors"
              >
                See Pricing
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ══════════ INTERVIEW READINESS COUNTDOWN ══════════ */}
      {!isGuest && interviewCountdown && (
        <div className="px-6 lg:px-10 xl:px-16 mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-blue-950/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 shrink-0">
              <Timer className="h-5 w-5 text-indigo-500" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {interviewCountdown.days > 1
                  ? `${interviewCountdown.days} days until your interview`
                  : interviewCountdown.days === 1
                    ? 'Your interview is tomorrow — final review time'
                    : interviewCountdown.days === 0
                      ? 'Your interview is today — you’ve got this!'
                      : 'Interview date passed — set a new goal anytime'}
              </p>
              <p className="text-xs text-slate-500">
                {interviewCountdown.role
                  ? `Targeting: ${interviewCountdown.role}. `
                  : ''}
                {interviewCountdown.days > 0
                  ? 'Keep your streak going — finish today’s focus questions below.'
                  : 'Review your bookmarks and weak spots below.'}
              </p>
            </div>
            <Link
              href="/account"
              className="shrink-0 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Edit goal
            </Link>
          </div>
        </div>
      )}

      {/* ══════════ MAIN CONTENT — balanced rows ══════════ */}
      <div className="px-6 lg:px-10 xl:px-16 mt-5 space-y-4">

        {/* ── ROW 1: Readiness · Community · Knowledge Base ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Readiness */}
          <Card className="flex flex-col" delay={1}>
            <SH icon={Trophy} title="Interview Readiness" iconCls="bg-amber-50" iconColor="text-amber-600" />
            <div className="flex flex-col items-center">
              <ReadinessGauge value={stackAvg} size={124} strokeWidth={11} />
              <div className="grid grid-cols-3 gap-2 w-full mt-4">
                {[
                  { n: done, l: 'Solved' },
                  { n: stacks.length, l: 'Stacks' },
                  { n: `${completionPct}%`, l: 'Done' },
                ].map(s => (
                  <div key={s.l} className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-base font-semibold text-slate-900 leading-none tabular-nums">{s.n}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            {nextBadge && (
              <div className="mt-auto pt-4 flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Medal className="h-4 w-4 text-indigo-500 shrink-0" aria-hidden="true" />
                <p className="text-xs text-slate-600">
                  Next badge: <span className="font-semibold text-slate-800">{nextBadge.label}</span>
                </p>
              </div>
            )}
          </Card>

          {/* Consistency — real streak + activity data (no fabricated ranking) */}
          <Card className="flex flex-col" delay={2}>
            <SH icon={Flame} title="Consistency" iconCls="bg-orange-50" iconColor="text-orange-600" />
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-3xl font-semibold text-slate-900 leading-none tabular-nums">
                {d.currentStreak || 0}
                <span className="text-base font-medium text-slate-400 ml-1">day{(d.currentStreak ?? 0) === 1 ? '' : 's'}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1.5">current streak</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <div className="text-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-base font-semibold text-slate-900 leading-none tabular-nums">{d.longestStreak || 0}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">Longest streak</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-base font-semibold text-slate-900 leading-none tabular-nums">{actStats.active}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">Active days</p>
              </div>
            </div>
          </Card>

          {/* Knowledge Base */}
          <Card className="flex flex-col" delay={3}>
            <SH icon={Layers} title="Knowledge Base" iconCls="bg-cyan-50" iconColor="text-cyan-600" />
            <div className="grid grid-cols-2 gap-2.5 flex-1">
              {knowledge.map(k => (
                <div key={k.label} className="flex flex-col justify-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mb-1.5", k.cls)}>
                    <k.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900 leading-none tabular-nums">{k.val}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{k.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── ROW 2: Stack Progress (8) · Skill Distribution (4) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <Card className="lg:col-span-8 flex flex-col" delay={1}>
            <SH icon={BarChart3} title="Stack Progress"
              badge={stacks.length > 0 ? (
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">{stacks.length} active</span>
              ) : undefined}
            />
            {stacks.length > 0 ? (
              <div className="space-y-4">
                {stacks.map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 tabular-nums">{s.solved}/{s.total}</span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded tabular-nums",
                          s.pct >= 70 ? "text-emerald-700 bg-emerald-50" :
                          s.pct >= 40 ? "text-amber-700 bg-amber-50" :
                          "text-blue-700 bg-blue-50",
                        )}>{s.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden"
                      role="progressbar" aria-valuenow={s.pct} aria-valuemin={0} aria-valuemax={100}
                      aria-label={`${s.name}: ${s.pct}% complete, ${s.solved} of ${s.total} solved`}>
                      <div className={cn(
                        "h-full rounded-full transition-all duration-700",
                        s.pct >= 70 ? "bg-gradient-to-r from-emerald-500 to-green-500" :
                        s.pct >= 40 ? "bg-gradient-to-r from-amber-400 to-yellow-500" :
                        "bg-gradient-to-r from-blue-500 to-indigo-500",
                      )} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-slate-200" aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-600 mb-1">No stacks started</p>
                <p className="text-xs text-slate-500 mb-4">Select a domain to begin tracking your progress.</p>
                <Link href="/domains" className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  <Compass className="h-3.5 w-3.5" /> Browse Paths
                </Link>
              </div>
            )}
          </Card>

          <Card className="lg:col-span-4 flex flex-col" delay={2}>
            <SH icon={Brain} title="Skill Distribution" iconCls="bg-purple-50" iconColor="text-purple-600" />
            {radar.length > 0 ? (
              <div className="flex-1 flex items-center">
                <div className="w-full" role="img"
                  aria-label={`Skill distribution: ${radar.map(r => `${r.subject} ${r.score}%`).join(', ')}`}>
                  <SkillRadar data={radar} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Brain className="h-8 w-8 text-slate-200 mb-3" aria-hidden="true" />
                <p className="text-xs text-slate-500 text-center">Complete questions across stacks to build your skill map.</p>
              </div>
            )}
          </Card>
        </div>

        {/* ── ROW 3: Strengths · Focus Areas · Difficulty ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Strengths */}
          <Card className="flex flex-col" delay={1}>
            <SH icon={TrendingUp} title="Your Strengths" iconCls="bg-emerald-50" iconColor="text-emerald-600" />
            {strengths.length > 0 ? (
              <div className="space-y-3">
                {strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{s.name}</p>
                      <p className="text-[11px] text-slate-500">{s.solved} of {s.total} solved</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded tabular-nums">{s.pct}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                <TrendingUp className="h-7 w-7 mx-auto mb-2 text-slate-200" aria-hidden="true" />
                <p className="text-xs text-slate-500">Reach 50% in a stack to mark it as a strength.</p>
              </div>
            )}
          </Card>

          {/* Focus Areas */}
          <Card className="flex flex-col" delay={2}>
            <SH icon={AlertTriangle} title="Focus Areas" iconCls="bg-orange-50" iconColor="text-orange-600" />
            {(d.weakAreas ?? []).length > 0 ? (
              <div className="space-y-3">
                {d.weakAreas.map((area, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-50/60 border border-orange-100">
                    <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-bold text-slate-800">{area.label}</span>
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded tabular-nums",
                          area.mastery < 40 ? "text-red-700 bg-red-50" : "text-amber-700 bg-amber-50",
                        )}>{area.mastery}%</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{area.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                <Target className="h-7 w-7 mx-auto mb-2 text-slate-200" aria-hidden="true" />
                <p className="text-xs text-slate-500">Complete questions to identify areas for improvement.</p>
              </div>
            )}
          </Card>

          {/* Difficulty Breakdown — real distribution of completed questions */}
          <Card className="flex flex-col" delay={3}>
            <SH icon={BarChart3} title="Difficulty Breakdown" iconCls="bg-green-50" iconColor="text-green-600"
              badge={diffTotal > 0 ? <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full tabular-nums">{diffTotal} solved</span> : undefined}
            />
            {diffTotal > 0 ? (() => {
              const easy = diff.easy;
              const med = diff.medium;
              const hard = diff.hard;
              const ePct = Math.round((easy / diffTotal) * 100);
              const mPct = Math.round((med / diffTotal) * 100);
              const hPct = 100 - ePct - mPct;
              return (
                <div className="flex flex-col flex-1 justify-center">
                  <div className="h-4 rounded-full overflow-hidden flex mb-4">
                    <div className="bg-emerald-500 transition-all duration-700" style={{ width: `${ePct}%` }} />
                    <div className="bg-amber-400 transition-all duration-700" style={{ width: `${mPct}%` }} />
                    <div className="bg-red-500 transition-all duration-700" style={{ width: `${hPct}%` }} />
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Easy', count: easy, pct: ePct, dot: 'bg-emerald-500' },
                      { label: 'Medium', count: med, pct: mPct, dot: 'bg-amber-400' },
                      { label: 'Hard', count: hard, pct: hPct, dot: 'bg-red-500' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2.5 h-2.5 rounded-full", r.dot)} />
                          <span className="text-sm font-medium text-slate-700">{r.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 tabular-nums">{r.count}</span>
                          <span className="text-xs text-slate-400 tabular-nums">({r.pct}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })() : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                <BarChart3 className="h-7 w-7 mx-auto mb-2 text-slate-200" aria-hidden="true" />
                <p className="text-xs text-slate-500">Solve questions to see difficulty distribution.</p>
              </div>
            )}
          </Card>
        </div>

        {/* ── ROW 4: Milestones roadmap (full) ── */}
        <Card delay={1}>
          <SH icon={Flag} title="Your Roadmap" iconCls="bg-violet-50" iconColor="text-violet-600"
            badge={<span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full tabular-nums">{done} solved</span>}
          />
          <div className="relative pt-2 pb-1 px-1">
            <div className="absolute left-[18px] right-[18px] top-[26px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${roadmapFill}%` }} />
            </div>
            <div className="relative flex items-start justify-between">
              {MILESTONES.map((m, i) => {
                const reached = done >= m.n;
                const current = i === currentMilestoneIdx;
                return (
                  <div key={m.n} className="relative z-10 flex flex-col items-center gap-2 w-16">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
                      reached ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/30" :
                      current ? "border-blue-500 bg-white text-blue-600 ring-4 ring-blue-100" :
                      "border-slate-200 bg-white text-slate-400",
                    )}>
                      {reached ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-semibold tabular-nums">{m.n}</span>}
                    </div>
                    <div className="text-center">
                      <p className={cn("text-[11px] font-bold leading-tight",
                        reached ? "text-slate-800" : current ? "text-blue-600" : "text-slate-400")}>{m.label}</p>
                      <p className="text-[10px] text-slate-400 tabular-nums">{m.n} Q</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* ── ROW 5: Activity graph (9) · Activity summary (3) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <Card className="lg:col-span-9 flex flex-col" delay={1}>
            <SH icon={Calendar} title="Study Activity"
              iconCls="bg-indigo-50" iconColor="text-indigo-600"
              badge={<span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">Last 12 months</span>}
            />
            <div className="flex-1 flex flex-col justify-center">
              <ActivityHeatmap data={heatmapData} />
            </div>
            {showSample && (
              <p className="text-[11px] text-slate-400 mt-3 italic">Sample data — sign in to see your real activity.</p>
            )}
          </Card>

          <Card className="lg:col-span-3 flex flex-col" delay={2}>
            <SH icon={TrendingUp} title="Activity Summary" iconCls="bg-orange-50" iconColor="text-orange-600" />
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 flex-1">
              {activitySummary.map(s => (
                <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", s.cls)}>
                    <s.icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-slate-900 leading-none tabular-nums">{s.val}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{s.label} · {s.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── ROW 6: Achievements (full, badge grid) ── */}
        <Card delay={1}>
          <SH icon={Award} title="Achievements" iconCls="bg-amber-50" iconColor="text-amber-600"
            badge={<span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full tabular-nums">{earnedCount}/{achievements.length} unlocked</span>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {achievements.map((a, i) => <Badge key={i} {...a} />)}
          </div>
        </Card>

        {/* ── ROW 7: Today's Focus · Recent Activity · Smart Insights ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Today's Focus (personalized) */}
          <Card className="flex flex-col" delay={1}>
            <SH icon={Rocket} title="Today's Focus" />
            <div className="space-y-3 flex-1">
              <p className="text-sm text-slate-600 leading-relaxed">
                {isGuest
                  ? 'Sign in to get a personalised study plan based on your progress.'
                  : <>You&apos;re <span className="font-semibold text-slate-900">{completionPct}%</span> through <span className="font-semibold text-slate-900">{domainDisplayName ?? 'your path'}</span>. Keep the momentum going!</>}
              </p>
              {!isGuest && topWeak && (
                <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Target className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-slate-600">
                    Recommended: brush up on <span className="font-semibold text-slate-800">{topWeak.label}</span> today.
                  </p>
                </div>
              )}
            </div>
            <Link
              href={isGuest ? '/signup' : continueHref}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors"
            >
              {isGuest ? 'Get Started Free' : 'Continue Learning'} <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          {/* Recent Activity */}
          <Card className="flex flex-col" delay={2}>
            <SH icon={Activity} title="Recent Activity" iconCls="bg-blue-50" iconColor="text-blue-600" />
            {(d.recentActivity ?? []).length > 0 ? (
              <div className="space-y-0.5">
                {d.recentActivity.map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-100" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {act.title}
                        {act.detail ? <>: <span className="font-semibold text-slate-900">{act.detail}</span></> : null}
                      </p>
                      {act.date && <p className="text-[11px] text-slate-400 mt-0.5">{relativeDate(act.date)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-5 text-center">
                <Activity className="h-7 w-7 mx-auto mb-2 text-slate-200" aria-hidden="true" />
                <p className="text-xs text-slate-500">{isGuest ? 'Sign in to track activity.' : 'Complete questions to see activity.'}</p>
              </div>
            )}
          </Card>

          {/* Smart Insights */}
          <Card className="flex flex-col" delay={3}>
            <SH icon={Lightbulb} title="Smart Insights" />
            {!isGuest && (d.weakAreas ?? []).length > 0 ? (
              <div className="space-y-2.5">
                {d.weakAreas.slice(0, 3).map((area, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <Lightbulb className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Strengthen {area.label}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{area.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                <Lightbulb className="h-7 w-7 text-slate-200 mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isGuest ? 'Sign up and complete questions for personalised study recommendations.' : 'Complete more questions for AI-powered insights.'}
                </p>
                {isGuest && (
                  <Link href="/signup" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline">
                    Get started free <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* ── ROW 8: Mock Interview banner (full) ── */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-5 lg:p-6 text-white animate-fade-in-up anim-delay-1">
          <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-indigo-600/10 blur-2xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                <Mic className="h-6 w-6 text-slate-300" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-semibold tracking-tight">Ready for a Mock Interview?</h2>
                <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
                  Simulate real interview conditions with timed questions and get structured feedback comparing your answers against expert solutions.
                </p>
              </div>
            </div>
            <Link href="/mock-interviews"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors">
              <Play className="h-4 w-4" /> Start Practice Session
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════ QUICK ACTIONS ══════════ */}
      <div className="px-6 lg:px-10 xl:px-16 mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { href: '/domains',         icon: Compass,      title: 'Browse Learning Paths', desc: 'Language, track & level' },
            { href: '/mock-interviews', icon: Mic,           title: 'Mock Interview',        desc: 'AI-powered timed practice' },
            { href: '/dsa',            icon: Code2,          title: 'Practice DSA',          desc: '450+ problems by pattern' },
            { href: '/search',         icon: TrendingUp,     title: 'Explore Content',       desc: 'Search all questions' },
          ].map(({ href, icon: Icon, title, desc }) => (
            <Link key={href} href={href} className="group flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                <Icon className="h-5 w-5 text-slate-500 group-hover:text-indigo-600 transition-colors" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════ GUEST CTA ══════════ */}
      {isGuest && (
        <div className="px-6 lg:px-10 xl:px-16 mt-10">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 lg:p-12 text-white">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <Sparkles className="h-9 w-9 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-3">Your personal dashboard awaits</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Everything above is sample data. Create a free account to track real progress, earn achievements, and get personalised insights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/signup" className="w-full sm:w-auto px-7 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors">
                  Create Free Account
                </Link>
                <Link href="/login?redirect=/dashboard" className="w-full sm:w-auto px-7 py-3 rounded-lg border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors text-center">
                  Already have an account? Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
