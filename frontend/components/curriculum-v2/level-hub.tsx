/**
 * Phase 14 — Curriculum V2 level hub (/interview/:lang/:track/:level).
 * Hoisted from app/interview/[lang]/[track]/[level]/page.tsx.
 */

import Link from "next/link";
import {
  ChevronRight, Layers, BookOpen,
  GraduationCap, TrendingUp,
  Zap, Target, CheckCircle2, BookMarked,
  ArrowUpRight, Filter, Award, Sparkles, ArrowLeft, Clock,
} from "lucide-react";
import type { LevelHubData } from "@/lib/curriculum";
import {
  LEVEL_META,
  curriculumToTitle,
  difficultyColor,
  difficultyLabel,
} from "@/lib/curriculum";
import { getCanonicalOrigin } from "@/lib/seo/config";
import { Tag } from "@/components/ui/tag";

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

export function LevelHub({ data }: { data: LevelHubData }) {
  const { lang, track, level, meta, stacks, totalQuestions, availableLevels } = data;
  const origin = getCanonicalOrigin();
  const basePath = `/interview/${lang}/${track}/${level}`;
  const canonicalUrl = `${origin}/interview/${lang}/${track}/${level}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: origin },
          { "@type": "ListItem", position: 2, name: "Interview", item: `${origin}/interview` },
          { "@type": "ListItem", position: 3, name: curriculumToTitle(lang), item: `${origin}/interview/${lang}` },
          { "@type": "ListItem", position: 4, name: curriculumToTitle(track), item: `${origin}/interview/${lang}/${track}` },
          { "@type": "ListItem", position: 5, name: meta.label, item: canonicalUrl },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${curriculumToTitle(lang)} ${curriculumToTitle(track)} ${meta.label} Interview Questions`,
        url: canonicalUrl,
        numberOfItems: totalQuestions,
        educationalLevel: meta.label,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-surface font-sans text-foreground selection:bg-primary/20">
        <div className="w-full min-w-0 min-h-screen flex gap-6 px-6 py-6">
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
            <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-surface border-b border-border">
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
                  {curriculumToTitle(lang)} {curriculumToTitle(track)} · {meta.label}
                </p>
              </div>
            </div>

            {availableLevels.length > 1 && (
              <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden  ">
                <div className="px-4 py-3 bg-surface border-b border-border  ">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-primary dark:text-primary" />
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Experience Level</h3>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  {availableLevels.map((lvl) => {
                    const lvlMeta = LEVEL_META[lvl];
                    const isActive = lvl === level;
                    return (
                      <Link key={lvl} href={`/interview/${lang}/${track}/${lvl}`} className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors duration-200 ease-out ${isActive ? "bg-background text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/50 border border-transparent"}`}>
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lvlMeta.color }} />
                        <span>{lvlMeta.label}</span>
                        <span className="text-muted-foreground ml-auto">{lvlMeta.range}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-surface shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-4 w-4 text-success dark:text-success" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Your Progress</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Stacks Completed</span>
                  <span className="font-bold text-foreground">0/{stacks.length}</span>
                </div>
                <div className="w-full bg-success/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-surface h-full rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface shadow-sm p-4  ">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-warning dark:text-warning" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Tip</h3>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                Focus on understanding concepts deeply rather than memorizing answers. Practice explaining them out loud.
              </p>
            </div>
          </aside>

          {/* MAIN COLUMN */}
          <main className="flex-1 min-w-0">
            {/* Visible breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/interview" className="hover:text-foreground">Interview</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/interview/${lang}`} className="hover:text-foreground">{curriculumToTitle(lang)}</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/interview/${lang}/${track}`} className="hover:text-foreground">{curriculumToTitle(track)}</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-semibold" aria-current="page">{meta.label}</span>
            </nav>
            <header className="mb-6 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="relative px-6 py-5 bg-surface border-b border-border">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Tag className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm bg-primary/10 text-primary dark:text-primary border border-border">{curriculumToTitle(lang)}</Tag>
                  <Tag className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm bg-primary/10 text-primary dark:text-primary border border-border">{curriculumToTitle(track)}</Tag>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${meta.colorClass}`}>{meta.label} · {meta.range}</span>
                </div>
                <h1 className="type-display text-3xl tracking-tight text-foreground mb-3">{curriculumToTitle(lang)} {curriculumToTitle(track)}</h1>
                <p className="text-sm text-foreground leading-relaxed max-w-3xl">
                  {meta.label} ({meta.range}) interview preparation. Master the core concepts and advanced topics required to excel.
                </p>
              </div>
              <div className="px-6 py-4 bg-surface border-t border-border">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Layers className="h-5 w-5 text-primary dark:text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Tech Stacks</div>
                      <div className="text-lg font-bold text-foreground">{stacks.length}</div>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-success dark:text-success" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Total Questions</div>
                      <div className="text-lg font-bold text-foreground">{totalQuestions}</div>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: meta.color + "20" }}>
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

            <div className="space-y-3 pb-10">
              {stacks.map((stack) => (
                <div key={stack.slug} className="border rounded-[12px] border-border shadow-sm bg-surface-subtle overflow-hidden hover:border-border hover:shadow-md transition-colors duration-200 ease-out">
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
                      <Link href={`${basePath}/${stack.slug}`} className="flex items-center justify-center h-8 px-3 rounded-md bg-background border border-border text-primary text-[11px] font-bold uppercase tracking-wider hover:border-primary hover:bg-primary/5 transition-colors shadow-sm">
                        Start <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {stack.questions.length > 0 && (
                    <div className="border-t border-border bg-background px-3 sm:px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        {stack.questions.map((q, idx) => (
                          <Link key={`${idx}-${q.slug}`} href={`${basePath}/${stack.slug}/${q.slug}`} className="group/link flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:pr-4 rounded-[8px] hover:bg-surface-subtle transition-colors duration-200 ease-out">
                            <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0 max-w-full overflow-hidden">
                              <div className="shrink-0 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center text-[9px] font-bold text-muted-foreground group-hover/link:border-primary group-hover/link:text-primary shadow-sm transition-colors sm:ml-2">
                                {idx + 1}
                              </div>
                              <h4 className="text-[13.5px] font-medium text-foreground group-hover/link:text-foreground transition-colors leading-tight truncate">{q.title}</h4>
                            </div>
                            <div className="flex items-center gap-3 pl-8 sm:pl-0 shrink-0 opacity-80 group-hover/link:opacity-100 transition-opacity">
                              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white shadow-sm" style={{ backgroundColor: difficultyColor(q.difficulty) }}>
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
                        <div className="mt-3 text-center border-t border-border pt-3">
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

          {/* RIGHT SIDEBAR */}
          <aside className="hidden xl:flex w-[300px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
            <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-surface border-b border-border">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary dark:text-primary" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">At a Glance</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-primary mb-1">Stacks</div>
                    <div className="text-2xl font-extrabold text-foreground leading-none">{stacks.length}</div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-primary mb-1">Questions</div>
                    <div className="text-2xl font-extrabold text-foreground leading-none">{totalQuestions}</div>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Level</span>
                    <span className="font-bold" style={{ color: meta.color }}>{meta.label} ({meta.range})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Language</span>
                    <span className="font-bold text-foreground">{curriculumToTitle(lang)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Track</span>
                    <span className="font-bold text-foreground">{curriculumToTitle(track)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 shadow-sm p-4  ">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-primary dark:text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">What You&apos;ll Learn</h3>
              </div>
              <div className="space-y-2">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary dark:text-primary mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface shadow-sm p-4  ">
              <div className="flex items-center gap-2 mb-3">
                <BookMarked className="h-4 w-4 text-primary dark:text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Study Strategy</h3>
              </div>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 bg-background/60 rounded-lg p-2 border border-border">
                    <span className="text-sm leading-none mt-0.5">{tip.icon}</span>
                    <p className="text-xs text-foreground leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-surface border-b border-border">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Actions</h3>
              </div>
              <div className="p-3 space-y-2">
                <Link href="/interview" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-primary dark:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 ease-out border border-transparent hover:border-border">
                  <span>Browse All Languages</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <Link href="/dashboard" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-primary dark:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 ease-out border border-transparent hover:border-border">
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
