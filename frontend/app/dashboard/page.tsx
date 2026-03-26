'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import apiClient from '@/lib/api-client';
import {
  Flame, BookOpen, Clock, Bookmark, ChevronRight,
  Target, AlertTriangle, CheckCircle2, TrendingUp,
  BarChart3, User, ArrowRight, Zap, ListChecks,
  Activity, Award, Focus
} from 'lucide-react';
import Link from 'next/link';
import { DashboardSummary } from '@/lib/api';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ─── tiny helpers ────────────────────────────────────────────── */

function fmtTime(s: number): string {
  if (!s || s <= 0) return '0m';
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtExp(raw: string | null): string {
  if (!raw) return '—';
  const map: Record<string, string> = {
    E0_0_TO_1: '0-1 yrs · Entry',
    E1_1_TO_3: '1-3 yrs · Junior',
    E2_3_TO_5: '3-5 yrs · Mid-Level',
    E3_5_PLUS: '5+ yrs · Senior',
  };
  return map[raw] ?? raw;
}

// Professional Palette for Charts
const COLORS = {
  primary: 'hsl(191 100% 50%)',
  secondary: 'hsl(221 83% 53%)',
  accent: 'hsl(262 83% 58%)',
  muted: 'hsl(240 5% 65%)',
  destructive: 'hsl(0 72% 51%)',
  border: 'hsl(240 10% 15% / 0.1)',
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent];

/* ─── sub-components ──────────────────────────────────────────── */

function GlassCard({ children, className, title, icon: Icon, delay = 0 }: { children: React.ReactNode, className?: string, title?: string, icon?: React.ElementType, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn("glass-strong rounded-3xl p-5 relative overflow-hidden group border-white/5", className)}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-3.5 w-3.5 text-primary/70" />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">{title}</span>
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
}

function StatMini({ label, value, icon: Icon, colorClass }: { label: string, value: string, icon: any, colorClass: string }) {
  return (
    <div className="flex items-center gap-3 p-1">
      <div className={cn("p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors", colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</div>
        <div className="text-base font-black tracking-tight">{value}</div>
      </div>
    </div>
  );
}

/* ─── main ────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/dashboard/summary')
      .then(res => setData(res.data))
      .catch(err => console.error('Dashboard fetch failed:', err))
      .finally(() => setLoading(false));
  }, [user]);

  const total = data?.totalQuestions || 1;
  const done = data?.completedQuestions || 0;
  const pct = Math.round((done / total) * 100);

  const pieData = [
    { name: 'Completed', value: done },
    { name: 'Remaining', value: Math.max(0, total - done) },
    { name: 'Review', value: data?.weakAreas?.length || 0 },
  ];

  // Use real radar data from backend
  const radar = data?.radarData || [];

  // Mock progress trend data for visual flair (kept as weekly trace)
  const trendData = [
    { name: 'M', q: Math.floor(done * 0.1) }, 
    { name: 'T', q: Math.floor(done * 0.2) }, 
    { name: 'W', q: Math.floor(done * 0.15) },
    { name: 'T', q: Math.floor(done * 0.3) }, 
    { name: 'F', q: Math.floor(done * 0.25) }, 
    { name: 'S', q: Math.floor(done * 0.4) }, 
    { name: 'S', q: Math.floor(done * 0.35) }
  ];

  if (loading) return (
    <div className="min-h-screen bg-background p-8 animate-pulse space-y-8">
      <div className="h-20 w-full glass rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 glass rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-96 glass rounded-3xl" />
        <div className="h-96 glass rounded-3xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-12">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.03),transparent_70%)] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 space-y-6">
        
        {/* Identity & Context Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative h-12 w-12 rounded-2xl bg-card border border-white/10 flex items-center justify-center shadow-2xl">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-0.5">Professional Profile</div>
              <h1 className="text-xl font-black tracking-tight leading-none">{user?.name ?? 'Candidate'}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                  {fmtExp(data?.experienceLevel || 'E1_1_TO_3')}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary/80 uppercase tracking-widest">
                  <Award className="h-3 w-3" /> Certified Mastery
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass-strong px-5 py-3 rounded-2xl border-white/5 flex items-center gap-4">
              <div className="text-right">
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Current Streak</div>
                <div className="text-lg font-black text-orange-500 leading-none">{data?.currentStreak ?? 0} Days</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Flame className="h-6 w-6 fill-current animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Main Focus / Domain Card (Span 8) */}
          <GlassCard className="md:col-span-8 p-0 overflow-hidden" delay={0.1}>
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1 space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                    <Zap className="h-3 w-3 fill-current" /> Active Learning Path
                 </div>
                 <h2 className="text-3xl font-black tracking-tight">{data?.primaryDomainName || "Explore New Stacks"}</h2>
                 <p className="text-sm text-muted-foreground max-w-sm font-medium leading-relaxed">
                   Continue your journey in {data?.primaryDomainName || "a new engineering domain"}. Tracking {data?.totalQuestions || 0} essential architectural patterns.
                 </p>
                 <div className="flex items-center gap-4 pt-4">
                    <Link 
                      href={data?.primaryDomainSlug ? `/${data.primaryDomainSlug}` : '/domains'}
                      className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      {data?.primaryDomainName ? "Resume Path" : "Get Started"} <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/domains" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                      Browse All Domains
                    </Link>
                 </div>
              </div>

              <div className="w-full md:w-56 space-y-6 bg-white/[0.01] p-6 rounded-3xl border border-white/[0.03]">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-muted-foreground/60">Global Progress</span>
                       <span className="text-primary">{pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-[18px] font-black tracking-tighter">{done}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Questions</div>
                    </div>
                    <div>
                      <div className="text-[18px] font-black tracking-tighter">{fmtTime(data?.totalTimeSpent ?? 0)}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Invested</div>
                    </div>
                 </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats Grid (Span 4) */}
          <div className="md:col-span-4 grid grid-cols-1 gap-5">
             <GlassCard className="flex flex-col justify-center" title="Execution Focus" icon={Activity} delay={0.2}>
                <div className="h-[120px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorQ" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.1)" />
                      <Area type="monotone" dataKey="q" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorQ)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center mt-3 px-1">
                   <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">Weekly Activity Trace</span>
                   <span className="text-[11px] font-black text-primary">+12% vs last week</span>
                </div>
             </GlassCard>
             <div className="grid grid-cols-2 gap-5">
               <GlassCard className="p-4" delay={0.3}>
                  <StatMini label="Bookmarks" value={(data?.bookmarksCount ?? 0).toString()} icon={Bookmark} colorClass="text-purple-400" />
               </GlassCard>
               <GlassCard className="p-4" delay={0.4}>
                  <StatMini label="Readiness" value={`${pct}%`} icon={Focus} colorClass="text-cyan-400" />
               </GlassCard>
             </div>
          </div>

          {/* Secondary Bento Row */}
          
          {/* Radar Chart (Span 4) */}
          <GlassCard className="md:col-span-4" title="Expertise Mapping" icon={Target} delay={0.5}>
            <div className="h-[240px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radar}>
                  <PolarGrid stroke="hsl(var(--border) / 0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Expertise" dataKey="score" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.2} />
                  <Tooltip 
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border) / 0.5)', borderRadius: '12px', fontSize: '11px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Stack Progress (Span 4) */}
          <GlassCard className="md:col-span-4 p-0" title="Stack Saturation" icon={BarChart3} delay={0.6}>
             <div className="divide-y divide-white/[0.04] max-h-[260px] overflow-y-auto px-5 py-2">
                {data?.stackPerformance && data.stackPerformance.length > 0 ? (
                  data.stackPerformance.map((stack, i) => (
                    <div key={i} className="py-3.5 group/stack">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-black text-foreground group-hover/stack:text-primary transition-colors">{stack.label}</span>
                        <span className="text-[10px] font-mono text-muted-foreground/60">{stack.completed}/{stack.total}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/80 transition-all duration-700"
                          style={{ width: `${stack.progress}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center flex flex-col items-center gap-3">
                    <ListChecks className="h-8 w-8 text-muted-foreground/20" />
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Aura is quiet. Choose a domain.</p>
                  </div>
                )}
             </div>
          </GlassCard>

          {/* Syllabus Split (Span 4) */}
          <GlassCard className="md:col-span-4" title="Syllabus Decryption" icon={Award} delay={0.7}>
            <div className="flex items-center justify-around h-[220px]">
              <div className="h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 12, background: 'hsl(var(--card))', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{d.name}</span>
                    </div>
                    <span className="text-sm font-black pl-4">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Bottom Row */}
          
          {/* Recent Activity (Span 8) */}
          <GlassCard className="md:col-span-8" title="Recent Chronology" icon={Clock} delay={0.8}>
             <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {data?.recentActivity && data.recentActivity.length > 0 ? (
                  data.recentActivity.map((act, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-all">
                      <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-foreground leading-snug">{act}</p>
                        <div className="text-[9px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest">Verified Completion</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground/40 text-[11px] font-bold uppercase tracking-widest italic">
                    Log is clear. Start your session today.
                  </div>
                )}
             </div>
          </GlassCard>

          {/* Weak Areas (Span 4) */}
          <GlassCard className="md:col-span-4" title="Architectural Gaps" icon={AlertTriangle} delay={0.9}>
            <div className="space-y-4 py-2">
              {data?.weakAreas && data.weakAreas.length > 0 ? data.weakAreas.map((area, i) => (
                <div key={i} className="p-4 rounded-2xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-black text-foreground">{area.label}</span>
                    <span className="text-[10px] font-black text-destructive/80">{area.mastery}% Mastery</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-black/20 overflow-hidden">
                    <div className="h-full bg-destructive/50 rounded-full" style={{ width: `${area.mastery}%` }} />
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center flex flex-col items-center gap-3">
                  <Trophy className="h-8 w-8 text-primary/20" />
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">No Gaps Detected yet.</p>
                </div>
              )}
            </div>
          </GlassCard>

        </div>
      </main>
    </div>
  );
}
