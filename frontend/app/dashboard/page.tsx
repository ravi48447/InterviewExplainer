'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { cn } from '@/lib/utils';
import type { ContentDomain } from '@/lib/types/content-domain';

// Import modular dashboard components
import { HeroSection } from '@/modules/dashboard/components/HeroSection';
import { StatsGrid } from '@/modules/dashboard/components/StatsGrid';
import { ReadinessCard } from '@/modules/dashboard/components/ReadinessCard';
import { KnowledgeCard } from '@/modules/dashboard/components/KnowledgeCard';
import { SkillRadarCard } from '@/modules/dashboard/components/SkillRadarCard';
import { ProgressSection } from '@/modules/dashboard/components/ProgressSection';
import { ActivityHeatmapCard } from '@/modules/dashboard/components/ActivityHeatmapCard';
import { AchievementsCard } from '@/modules/dashboard/components/AchievementsCard';
import { RoadmapCard } from '@/modules/dashboard/components/RoadmapCard';
import { InsightsCard } from '@/modules/dashboard/components/InsightsCard';
import { RecentActivityCard } from '@/modules/dashboard/components/RecentActivityCard';
import { Card } from '@/components/ui/card';

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

function computeActivityStats(data: { date: string; count: number }[]) {
  let total = 0, active = 0, best = 0;
  for (const d of data) {
    if (d.count > 0) { total += d.count; active += 1; }
    if (d.count > best) best = d.count;
  }
  return { total, active, best };
}

const EMPTY: DashboardSummary = {
  totalQuestions: 0, totalConcepts: 0, activeTracks: 0, domainsCount: 64,
  completedQuestions: 0, totalTimeSpent: 0, currentStreak: 0, longestStreak: 0, bookmarksCount: 0,
  stackPerformance: [], weakAreas: [], recentActivity: [],
  primaryDomainName: null, primaryDomainSlug: null, experienceLevel: null,
  radarData: [],
  dailyActivity: [],
  difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
};

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-default h-44 animate-pulse" />
      <div className="px-6 lg:px-10 xl:px-16 -mt-8 animate-pulse space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-28 bg-card rounded-2xl border border-default" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-card rounded-2xl border border-default" />)}
        </div>
      </div>
    </div>
  );
}

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

  useEffect(() => {
    if (isGuest) { setActiveSlug(null); return; }
    setActiveSlug(data?.primaryDomainSlug ?? null);
  }, [data, isGuest]);

  useEffect(() => {
    if (isGuest) return;
    let alive = true;
    fetch('/api/content/all-domains')
      .then(r => r.json())
      .then((all: ContentDomain[]) => { if (alive) setDomainList(Array.isArray(all) ? all : []); })
      .catch(() => {});
    return () => { alive = false; };
  }, [isGuest]);

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

  const applyDomain = useCallback(async (slug: string, name: string) => {
    setDomainMenuOpen(false);
    setSwitchingDomain(true);
    setActiveSlug(slug);
    try {
      await apiClient.post('/dashboard/primary-domain-slug', null, { params: { slug, name } });
      await refreshUser();
      const res = await apiClient.get('/dashboard/summary');
      setData(res.data);
    } catch {
      // Local fallback stays active slug
    } finally {
      setSwitchingDomain(false);
    }
  }, [refreshUser]);

  const chooseDomain = useCallback((domain: ContentDomain) => {
    const label = `${domain.name}${domain.levelLabel ? ` · ${domain.levelLabel}` : ''}`;
    return applyDomain(domain.slug, label);
  }, [applyDomain]);

  const selectedDomains = user?.domains ?? [];

  const interviewCountdown = useMemo(() => {
    if (!user?.interviewDate) return null;
    const target = new Date(user.interviewDate + 'T00:00:00');
    if (isNaN(target.getTime())) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
    return { days, role: user.targetRole ?? null };
  }, [user?.interviewDate, user?.targetRole]);

  const d = data ?? EMPTY;
  const done = d.completedQuestions || 0;

  const contentStacks = domainStruct?.stacks ?? [];
  const hasContentStruct = !isGuest && contentStacks.length > 0;

  const activeDomain = domainList.find(dd => dd.slug === activeSlug) ?? null;
  const domainDisplayName = activeDomain
    ? `${activeDomain.name}${activeDomain.levelLabel ? ` · ${activeDomain.levelLabel}` : ''}`
    : (d.primaryDomainName ?? null);

  const total = hasContentStruct
    ? contentStacks.reduce((s, x) => s + (x.questionCount || 0), 0)
    : (d.totalQuestions || 467);

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

  const diff = d.difficultyBreakdown ?? { easy: 0, medium: 0, hard: 0 };
  const roadmapFill = Math.min(100, (done / MILESTONES[MILESTONES.length - 1].n) * 100);
  const currentMilestoneIdx = MILESTONES.findIndex(m => done < m.n);

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
  const nextBadge = achievements.find(a => !a.earned) ?? null;

  const heatmapData = d.dailyActivity ?? [];
  const actStats = computeActivityStats(heatmapData);

  if (authLoading || loading) return <DashboardSkeleton />;

  if (error && !isGuest && !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-card rounded-2xl border border-default p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4 border border-destructive/20">
            <AlertTriangle className="h-7 w-7 text-destructive" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-semibold text-primary mb-1.5">Couldn’t load your dashboard</h1>
          <p className="text-sm text-secondary mb-6 leading-relaxed">
            We hit a problem fetching your progress. Check your connection and try again.
          </p>
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-16 bg-background">
      {/* Hero Section */}
      <HeroSection
        user={user}
        isGuest={isGuest}
        lvl={lvl}
        switchingDomain={switchingDomain}
        domainMenuOpen={domainMenuOpen}
        setDomainMenuOpen={setDomainMenuOpen}
        domainDisplayName={domainDisplayName}
        selectedDomains={selectedDomains}
        activeSlug={activeSlug}
        applyDomain={applyDomain}
        chooseDomain={chooseDomain}
        domainList={domainList}
        continueHref={continueHref}
        currentStreak={d.currentStreak || 0}
        done={done}
        greeting={greeting}
        fmtExp={fmtExp}
        initialsOf={initialsOf}
      />

      {/* Metric Cards Row */}
      <StatsGrid
        done={done}
        total={total}
        currentStreak={d.currentStreak || 0}
        totalTimeSpent={d.totalTimeSpent || 0}
        stacksCount={stacks.length}
        domainsCount={d.domainsCount || 64}
        bookmarksCount={d.bookmarksCount || 0}
        fmtTime={fmtTime}
        fmtAvg={fmtAvg}
      />

      <div className="px-6 lg:px-10 xl:px-16 mt-6 space-y-6">
        {/* Onboarding for new users */}
        {!isGuest && done === 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-card border border-default p-6 text-primary">
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-surface border border-default flex items-center justify-center shrink-0">
                  <Rocket className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">
                    {activeSlug ? "Let's solve your first question" : 'Pick a focus domain to begin'}
                  </h2>
                  <p className="text-sm text-secondary mt-1 max-w-xl leading-relaxed">
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
                    className="px-5 py-2.5 rounded-lg bg-surface border border-default text-primary font-semibold text-sm hover:bg-hover transition-colors"
                  >
                    Choose focus domain
                  </button>
                )}
                <Link
                  href={continueHref}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> {activeSlug ? 'Start learning' : 'Browse paths'}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Banner */}
        {!isGuest && (
          <div>
            {user?.plan === 'pro' || (!PAYMENTS_ENABLED && hasProAccess(user?.plan)) ? (
              <div className="flex items-center gap-3 rounded-xl border border-default bg-surface px-4 py-3 text-sm">
                <Crown className="h-4.5 w-4.5 text-primary shrink-0" aria-hidden="true" />
                <span className="text-secondary">
                  {user?.plan === 'pro'
                    ? 'Pro unlocked — your full personalized dashboard is active.'
                    : `Pro (normally ${PRO_PRICE_LABEL}) is free during beta — full dashboard unlocked.`}
                </span>
                <Link href="/pricing" className="ml-auto text-xs font-semibold text-primary hover:underline shrink-0">
                  View plan
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-default bg-card px-5 py-4">
                <Crown className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                <p className="text-sm text-secondary flex-1">
                  Unlock the full personalized dashboard, multi-domain switching and progress tracking with{' '}
                  <span className="font-bold text-primary">Pro — {PRO_PRICE_LABEL}</span>.
                </p>
                <Link
                  href="/pricing"
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  See Pricing
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Interview Countdown */}
        {!isGuest && interviewCountdown && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-default bg-surface px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-default shrink-0">
              <Timer className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary">
                {interviewCountdown.days > 1
                  ? `${interviewCountdown.days} days until your interview`
                  : interviewCountdown.days === 1
                    ? 'Your interview is tomorrow — final review time'
                    : interviewCountdown.days === 0
                      ? 'Your interview is today — you’ve got this!'
                      : 'Interview date passed — set a new goal anytime'}
              </p>
              <p className="text-xs text-secondary mt-0.5">
                {interviewCountdown.role ? `Targeting: ${interviewCountdown.role}. ` : ''}
                {interviewCountdown.days > 0
                  ? 'Keep your streak going — finish today’s focus questions below.'
                  : 'Review your bookmarks and weak spots below.'}
              </p>
            </div>
            <Link
              href="/account"
              className="shrink-0 text-xs font-semibold text-primary hover:underline"
            >
              Edit goal
            </Link>
          </div>
        )}

        {/* Main Grid: 12-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Readiness Gauge */}
          <div className="col-span-1 lg:col-span-4">
            <ReadinessCard
              value={stackAvg}
              done={done}
              stacksLength={stacks.length}
              completionPct={completionPct}
              nextBadge={nextBadge}
            />
          </div>

          {/* Consistency */}
          <div className="col-span-1 lg:col-span-4">
            <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <h2 className="text-[13px] font-bold text-primary tracking-tight">Consistency</h2>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-4xl font-bold text-primary leading-none tabular-nums">
                  {d.currentStreak || 0}
                  <span className="text-sm font-semibold text-muted-foreground ml-1.5 uppercase tracking-wider">day{(d.currentStreak ?? 0) === 1 ? '' : 's'}</span>
                </p>
                <p className="text-xs text-secondary mt-2">current streak</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mt-5">
                <div className="text-center p-3 rounded-xl bg-surface border border-default">
                  <p className="text-lg font-bold text-primary leading-none tabular-nums">{d.longestStreak || 0}</p>
                  <p className="text-[10px] font-medium text-secondary mt-1">Longest streak</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface border border-default">
                  <p className="text-lg font-bold text-primary leading-none tabular-nums">{actStats.active}</p>
                  <p className="text-[10px] font-medium text-secondary mt-1">Active days</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Knowledge Base */}
          <div className="col-span-1 lg:col-span-4">
            <KnowledgeCard
              totalConcepts={d.totalConcepts || 0}
              activeTracks={d.activeTracks || 0}
              domainsCount={d.domainsCount || 0}
              completionPct={completionPct}
            />
          </div>
        </div>

        {/* Stack Progress & Skill Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="col-span-1 lg:col-span-8">
            <ProgressSection
              stacks={stacks}
              continueHref={continueHref}
            />
          </div>
          <div className="col-span-1 lg:col-span-4">
            <SkillRadarCard radar={radar} />
          </div>
        </div>

        {/* Roadmap */}
        <RoadmapCard
          milestones={MILESTONES}
          done={done}
          roadmapFill={roadmapFill}
          currentMilestoneIdx={currentMilestoneIdx}
        />

        {/* Activity Heatmap & Recent activity summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="col-span-1 lg:col-span-9">
            <ActivityHeatmapCard
              heatmapData={heatmapData}
              showSample={false}
            />
          </div>
          <div className="col-span-1 lg:col-span-3">
            <Card className="flex flex-col bg-card border border-default p-5 shadow-sm h-full rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <h2 className="text-[13px] font-bold text-primary tracking-tight">Activity Summary</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3.5 flex-1">
                {[
                  { icon: Flame,        label: 'Current streak', val: `${d.currentStreak || 0}`, unit: d.currentStreak === 1 ? 'day' : 'days' },
                  { icon: Calendar,     label: 'Active days',    val: `${actStats.active}`, unit: 'this year' },
                  { icon: CheckCircle2, label: 'Questions',      val: `${actStats.total}`, unit: 'last 12 mo' },
                  { icon: Zap,          label: 'Best day',       val: `${actStats.best}`, unit: 'questions' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-default">
                    <div className="w-8 h-8 rounded-lg bg-card border border-default flex items-center justify-center shrink-0">
                      <s.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-primary leading-none tabular-nums">{s.val}</p>
                      <p className="text-[10px] text-secondary leading-tight mt-1">{s.label} · {s.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Achievements */}
        <AchievementsCard
          achievements={achievements}
          earnedCount={earnedCount}
        />

        {/* Today's Focus, Smart Insights & Difficulty Breakdown */}
        <InsightsCard
          isGuest={isGuest}
          weakAreas={d.weakAreas || []}
          difficulty={diff}
          completionPct={completionPct}
          domainDisplayName={domainDisplayName}
          continueHref={continueHref}
        />

        {/* Recent Activity */}
        <RecentActivityCard
          recentActivity={d.recentActivity || []}
          isGuest={isGuest}
          relativeDate={relativeDate}
        />

        {/* Practice Sessions Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-card border border-default p-6 text-primary">
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-surface border border-default flex items-center justify-center shrink-0">
                <Mic className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Ready for a Mock Interview?</h2>
                <p className="text-sm text-secondary mt-1 max-w-xl leading-relaxed">
                  Simulate real interview conditions with timed questions and get structured feedback comparing your answers against expert solutions.
                </p>
              </div>
            </div>
            <Link href="/mock-interviews"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              <Play className="h-4 w-4 fill-current" /> Start Practice Session
            </Link>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { href: '/domains',         icon: Compass,      title: 'Browse Learning Paths', desc: 'Language, track & level' },
            { href: '/mock-interviews', icon: Mic,           title: 'Mock Interview',        desc: 'AI-powered timed practice' },
            { href: '/dsa',            icon: Code2,          title: 'Practice DSA',          desc: '450+ problems by pattern' },
            { href: '/search',         icon: TrendingUp,     title: 'Explore Content',       desc: 'Search all questions' },
          ].map(({ href, icon: Icon, title, desc }) => (
            <Link key={href} href={href} className="group flex items-center gap-3.5 p-4 rounded-xl bg-card border border-default shadow-sm hover:border-primary transition-all duration-150">
              <div className="w-10 h-10 rounded-lg bg-surface border border-default flex items-center justify-center shrink-0 transition-colors">
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary transition-colors">{title}</p>
                <p className="text-xs text-secondary mt-0.5">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>

        {/* Guest CTA */}
        {isGuest && (
          <div className="relative overflow-hidden rounded-2xl bg-card border border-default p-8 lg:p-12 text-primary">
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <Sparkles className="h-9 w-9 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3">Your personal dashboard awaits</h2>
              <p className="text-secondary mb-6 leading-relaxed">
                Everything above is sample data. Create a free account to track real progress, earn achievements, and get personalised insights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/signup" className="w-full sm:w-auto px-7 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                  Create Free Account
                </Link>
                <Link href="/login?redirect=/dashboard" className="w-full sm:w-auto px-7 py-3 rounded-lg border border-default text-primary font-medium text-sm hover:bg-hover transition-colors text-center">
                  Already have an account? Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
