import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  listStacksForPath,
  resolveStackContent,
  listLevels,
  getV2QuestionsForStack,
} from "@/lib/contentV2";
import type { Level } from "@/lib/contentV2-types";
import {
  ChevronRight, Layers, BookOpen,
  GraduationCap, ArrowRight, TrendingUp,
  Zap, Target, CheckCircle2, BookMarked,
  ArrowUpRight, Filter, SlidersHorizontal,
  Award, Sparkles, ArrowLeft, Clock, ChevronDown,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function toDisplayName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

const LEVEL_META: Record<Level, { label: string; color: string; colorClass: string; range: string }> = {
  beginner: { label: "Beginner", color: "hsl(var(--difficulty-easy))", colorClass: "bg-success/10 dark:bg-success/20 text-success dark:text-success border-default dark:border-default/20", range: "0–2 years" },
  intermediate: { label: "Intermediate", color: "hsl(var(--difficulty-medium))", colorClass: "bg-warning/10 dark:bg-warning/20 text-warning dark:text-warning border-default dark:border-default/20", range: "2–5 years" },
  advanced: { label: "Advanced", color: "hsl(var(--difficulty-hard))", colorClass: "bg-destructive/10 dark:bg-destructive/20 text-destructive dark:text-destructive border-default dark:border-default/20", range: "5+ years" },
};

type PageParams = { lang: string; track: string; level: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { lang, track, level } = await params;
  const validLevel = level as Level;
  const meta = LEVEL_META[validLevel] ?? LEVEL_META.intermediate;

  const title = `${toDisplayName(lang)} ${toDisplayName(track)} ${meta.label} Interview Questions`;
  const description = `${meta.label} level ${toDisplayName(lang)} ${toDisplayName(track)} interview preparation for ${meta.range} experience developers.`;
  const canonicalUrl = `${SITE_URL}/interview/${lang}/${track}/${level}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: "website", siteName: "InterviewExplainer" },
  };
}

export default async function V2LevelPage({ params }: { params: Promise<PageParams> }) {
  const { lang, track, level } = await params;
  const validLevel = level as Level;
  const meta = LEVEL_META[validLevel];
  if (!meta) notFound();

  const stacks = listStacksForPath(lang, track, validLevel);
  if (stacks.length === 0) notFound();

  const stackData = stacks.map(stackSlug => {
    const content = resolveStackContent(lang, track, validLevel, stackSlug);
    const questions = getV2QuestionsForStack(lang, track, validLevel, stackSlug);
    return {
      slug: stackSlug,
      name: content?.meta.stack ? toDisplayName(content.meta.stack) : toDisplayName(stackSlug),
      description: content?.meta.description ?? null,
      questionCount: questions.length,
      questions: questions.slice(0, 5),
    };
  }).sort((a, b) => b.questionCount - a.questionCount);

  const totalQuestions = stackData.reduce((s, st) => s + st.questionCount, 0);
  const availableLevels = listLevels(lang, track);
  const basePath = `/interview/${lang}/${track}/${level}`;
  const canonicalUrl = `${SITE_URL}/interview/${lang}/${track}/${level}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Interview", item: `${SITE_URL}/interview` },
          { "@type": "ListItem", position: 3, name: toDisplayName(lang), item: `${SITE_URL}/interview/${lang}` },
          { "@type": "ListItem", position: 4, name: toDisplayName(track), item: `${SITE_URL}/interview/${lang}/${track}` },
          { "@type": "ListItem", position: 5, name: meta.label, item: canonicalUrl },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${toDisplayName(lang)} ${toDisplayName(track)} ${meta.label} Interview Questions`,
        url: canonicalUrl,
        numberOfItems: totalQuestions,
        educationalLevel: meta.label,
      },
    ],
  };

  const benefits = [
    "Structured interview preparation",
    "Practice real technical questions",
    "Understand what interviewers look for",
    "Build confidence with guided answers",
    "Track your progress across stacks",
  ];

  const tips = [
    { icon: "🎯", text: "Click any stack below, then open questions you want to study." },
    { icon: "🧠", text: "Read the Speakable Answer first to get a quick mental model." },
    { icon: "⚡", text: "Focus on medium difficulty — they appear most in real interviews." },
  ];

  function difficultyColor(d: string): string {
    return d === "easy" ? "hsl(var(--difficulty-easy))" : d === "medium" ? "hsl(var(--difficulty-medium))" : "hsl(var(--difficulty-hard))";
  }
  function difficultyLabel(d: string): string {
    return d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard";
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-surface border border-default dark:from-slate-950 font-sans text-foreground selection:bg-blue-200">
        <div className="w-full min-w-0 min-h-screen flex gap-6 px-6 py-6">

          {/* ─── LEFT SIDEBAR ─── */}
          <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
            <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-surface border border-default dark:from-slate-900/40 dark:to-slate-900/20 border-b border-border">
                <Link href="/interview" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="h-3 w-3" />
                  All Languages
                </Link>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-4 w-4 text-primary dark:text-primary" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Study Path</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {toDisplayName(lang)} {toDisplayName(track)} · {meta.label}
                </p>
              </div>
            </div>

            {/* Level Switcher */}
            {availableLevels.length > 1 && (
              <div className="rounded-xl border border-default dark:border-default/20 bg-surface shadow-sm overflow-hidden  ">
                <div className="px-4 py-3 bg-surface border-b border-default dark:border-default/20  ">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-primary dark:text-primary" />
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Experience Level</h3>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  {availableLevels.map(lvl => {
                    const lvlMeta = LEVEL_META[lvl];
                    const isActive = lvl === validLevel;
                    return (
                      <Link
                        key={lvl}
                        href={`/interview/${lang}/${track}/${lvl}`}
                        className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                          isActive
                            ? "bg-background text-foreground border border-default dark:border-default/20 shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50 border border-transparent"
                        }`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lvlMeta.color }} />
                        <span>{lvlMeta.label}</span>
                        <span className="text-muted-foreground ml-auto">{lvlMeta.range}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Progress Tracker */}
            <div className="rounded-xl border border-default dark:border-default/20 bg-surface shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Your Progress</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Stacks Completed</span>
                  <span className="font-bold text-foreground">0/{stacks.length}</span>
                </div>
                <div className="w-full bg-emerald-100 dark:bg-emerald-950/20 rounded-full h-2 overflow-hidden">
                  <div className="bg-surface h-full rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-default dark:border-default/20 bg-surface shadow-sm p-4  ">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Tip</h3>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                Focus on understanding concepts deeply rather than memorizing answers. Practice explaining them out loud.
              </p>
            </div>
          </aside>

          {/* ─── MAIN COLUMN ─── */}
          <main className="flex-1 min-w-0">
            {/* Hero Header */}
            <header className="mb-6 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="relative px-6 py-5 bg-surface border border-default">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary border border-default dark:border-default/20 shadow-sm">
                    {toDisplayName(lang)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary border border-default dark:border-default/20 shadow-sm">
                    {toDisplayName(track)}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${meta.colorClass}`}>
                    {meta.label} · {meta.range}
                  </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-foreground mb-3">
                  {toDisplayName(lang)} {toDisplayName(track)}
                </h1>
                <p className="text-sm text-foreground leading-relaxed max-w-3xl">
                  {meta.label} ({meta.range}) interview preparation. Master the core concepts and advanced topics required to excel.
                </p>
              </div>
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                      <Layers className="h-5 w-5 text-primary dark:text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Tech Stacks</div>
                      <div className="text-lg font-bold text-foreground">{stacks.length}</div>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/20 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Total Questions</div>
                      <div className="text-lg font-bold text-foreground">{totalQuestions}</div>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: meta.color + '20' }}>
                      <TrendingUp className="h-5 w-5" style={{ color: meta.color }} />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Level</div>
                      <div className="text-sm font-bold text-foreground">{meta.label} <span className="text-muted-foreground font-normal">({meta.range})</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Stacks with preview questions */}
            <div className="space-y-3 pb-10">
              {stackData.map((stack, sIdx) => (
                <div key={stack.slug} className="border rounded-[12px] border-border shadow-sm bg-surface-subtle overflow-hidden hover:border-border hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                    <div className="flex-1 flex gap-3 items-start sm:items-center p-4 sm:px-5">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-background border border-border text-muted-foreground flex items-center justify-center">
                        <Layers className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-foreground tracking-tight leading-tight mb-0.5">{stack.name}</h3>
                        {stack.description && <p className="text-[13px] text-muted-foreground leading-snug line-clamp-1">{stack.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 px-4 pb-3 sm:pb-0 sm:pr-5">
                      <div className="hidden sm:flex flex-col items-end gap-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</span>
                        <span className="text-[12px] font-semibold text-muted-foreground">{stack.questionCount} Qs</span>
                      </div>
                      <Link
                        href={`${basePath}/${stack.slug}`}
                        className="flex items-center justify-center h-8 px-3 rounded-md bg-background border border-border text-primary text-[11px] font-bold uppercase tracking-wider hover:border-primary hover:bg-primary/5 transition-colors shadow-sm"
                      >
                        Start <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Preview questions */}
                  {stack.questions.length > 0 && (
                    <div className="border-t border-slate-100 dark:border-slate-800/60 bg-background px-3 sm:px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        {stack.questions.map((q, idx) => (
                          <Link
                            key={`${idx}-${q.slug}`}
                            href={`${basePath}/${stack.slug}/${q.slug}`}
                            className="group/link flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:pr-4 rounded-[8px] hover:bg-surface-subtle transition-all duration-200"
                          >
                            <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0 max-w-full overflow-hidden">
                              <div className="shrink-0 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center text-[9px] font-bold text-muted-foreground group-hover/link:border-primary group-hover/link:text-primary shadow-sm transition-all sm:ml-2">
                                {idx + 1}
                              </div>
                              <h4 className="text-[13.5px] font-medium text-foreground group-hover/link:text-foreground transition-colors leading-tight truncate">
                                {q.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-3 pl-8 sm:pl-0 shrink-0 opacity-80 group-hover/link:opacity-100 transition-opacity">
                              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white shadow-sm"
                                style={{ backgroundColor: difficultyColor(q.difficulty) }}
                              >
                                {difficultyLabel(q.difficulty)}
                              </span>
                              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 min-w-[45px]">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                {q.estimatedReadTime ?? 5}m
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      {stack.questionCount > 5 && (
                        <div className="mt-3 text-center border-t border-slate-100 dark:border-slate-800/60 pt-3">
                          <Link href={`${basePath}/${stack.slug}`} className="text-primary hover:text-primary/80 dark:text-primary text-[12px] font-bold tracking-wide flex items-center justify-center gap-1">
                            See all {stack.questionCount} questions <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>

          {/* ─── RIGHT SIDEBAR ─── */}
          <aside className="hidden xl:flex w-[300px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
            <div className="rounded-xl border border-default dark:border-default/20 bg-surface shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-surface border border-default border-b dark:border-default/20">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary dark:text-primary" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">At a Glance</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-background rounded-lg p-3 border border-default dark:border-default/20 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-primary mb-1">Stacks</div>
                    <div className="text-2xl font-black text-foreground leading-none">{stacks.length}</div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-default dark:border-default/20 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-primary mb-1">Questions</div>
                    <div className="text-2xl font-black text-foreground leading-none">{totalQuestions}</div>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t border-default dark:border-default/20">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Level</span>
                    <span className="font-bold" style={{ color: meta.color }}>{meta.label} ({meta.range})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Language</span>
                    <span className="font-bold text-foreground">{toDisplayName(lang)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Track</span>
                    <span className="font-bold text-foreground">{toDisplayName(track)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-teal-200 dark:border-teal-500/20 bg-gradient-to-br from-teal-50 dark:from-teal-950/40  shadow-sm p-4  ">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">What You'll Learn</h3>
              </div>
              <div className="space-y-2">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-default dark:border-default/20 bg-surface shadow-sm p-4  ">
              <div className="flex items-center gap-2 mb-3">
                <BookMarked className="h-4 w-4 text-primary dark:text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Study Strategy</h3>
              </div>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 bg-background/60 rounded-lg p-2 border border-default dark:border-default/20">
                    <span className="text-sm leading-none mt-0.5">{tip.icon}</span>
                    <p className="text-xs text-foreground leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-surface border border-default dark:from-slate-900/40 dark:to-slate-900/20 border-b border-border">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Actions</h3>
              </div>
              <div className="p-3 space-y-2">
                <Link href="/interview" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-primary dark:text-primary hover:bg-blue-50 dark:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-default dark:border-default/20">
                  <span>Browse All Languages</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <Link href="/dashboard" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-primary dark:text-primary hover:bg-blue-50 dark:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-default dark:border-default/20">
                  <span>My Dashboard</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
