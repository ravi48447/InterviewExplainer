/**
 * Phase 14 — Curriculum V2 all-languages hub.
 *
 * Server component rendering /interview. Hoisted from
 * app/interview/page.tsx — presentational composition over the canonical
 * lib/curriculum data layer.
 */

import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Layers,
  BookOpen,
  TrendingUp,
  Zap,
  Target,
  CheckCircle2,
  BookMarked,
  ArrowUpRight,
  Code2,
  Sparkles,
} from "lucide-react";
import type { InterviewHubLangData } from "@/lib/curriculum";
import { LEVEL_META, curriculumToTitle } from "@/lib/curriculum";
import { Tag } from "@/components/ui/tag";

const benefits = [
  "Deep explanations, not just code",
  "What interviewers actually look for",
  "Organized by experience level",
  "Reusable tools across tracks",
  "Track your progress",
];

export function InterviewHub({ langData }: { langData: InterviewHubLangData[] }) {
  const grandTotalQs = langData.reduce((s, l) => s + l.totalQs, 0);
  const grandTotalStacks = langData.reduce((s, l) => s + l.totalStacks, 0);

  return (
    <div className="min-h-screen bg-surface font-sans text-foreground selection:bg-primary/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Interview Prep", item: "/interview" },
            ],
          }),
        }}
      />
      <div className="w-full min-w-0 min-h-screen flex gap-6 px-6 py-6">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
          <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-surface border-b border-border">
              <div className="flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5 text-primary dark:text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Interview Hub</h3>
              </div>
            </div>
            <div className="p-3 space-y-1">
              <Link href="/interview" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-primary dark:text-primary bg-primary/10 rounded-lg border border-border">
                <span>All Languages</span>
              </Link>
              <Link href="/tools" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-primary dark:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 ease-out border border-transparent hover:border-border">
                <span>Tools & Technologies</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link href="/dsa" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-primary dark:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 ease-out border border-transparent hover:border-border">
                <span>DSA Problems</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link href="/domains" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-primary dark:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 ease-out border border-transparent hover:border-border">
                <span>Browse All Paths</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 shadow-sm p-4  ">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary dark:text-primary" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Why InterviewExplainer</h3>
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
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">How to Use</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: "1️⃣", text: "Pick your language and track below." },
                { icon: "2️⃣", text: "Select your experience level." },
                { icon: "3️⃣", text: "Open a stack, explore questions, and start learning." },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 bg-background/60 rounded-lg p-2 border border-border">
                  <span className="text-sm leading-none mt-0.5">{tip.icon}</span>
                  <p className="text-xs text-foreground leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN */}
        <main className="flex-1 min-w-0">
          <header className="mb-6 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="relative px-6 py-5 bg-surface border-b border-border">
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm bg-primary/10 text-primary dark:text-primary border border-border">
                  Interview Preparation
                </Tag>
              </div>
              <h1 className="type-display text-3xl tracking-tight text-foreground mb-3">Interview Questions</h1>
              <p className="text-sm text-foreground leading-relaxed max-w-3xl">
                Curated questions organized by language, track, and experience level. Deep explanations, real-world code, and what interviewers actually want to hear.
              </p>
            </div>
            <div className="px-6 py-4 bg-surface border-t border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code2 className="h-5 w-5 text-primary dark:text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Languages</div>
                    <div className="text-lg font-bold text-foreground">{langData.length}</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-primary dark:text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Tech Stacks</div>
                    <div className="text-lg font-bold text-foreground">{grandTotalStacks}</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-success dark:text-success" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Total Questions</div>
                    <div className="text-lg font-bold text-foreground">{grandTotalQs}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 pb-10">
            {langData.map(({ lang, tracks, totalStacks, totalQs }) => (
              <section key={lang}>
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shadow-md">
                      <span className="text-primary-foreground text-xs font-bold">{lang.charAt(0).toUpperCase()}</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-foreground tracking-tight">{curriculumToTitle(lang)}</h2>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{totalStacks} stacks · {totalQs} Qs</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {tracks.map(({ track, levels, totalQs: trackQs }) => (
                    <div key={track} className="border rounded-[12px] border-border shadow-sm bg-surface-subtle overflow-hidden hover:border-border hover:shadow-md transition-colors duration-200 ease-out">
                      <div className="flex items-center justify-between p-4 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-bold text-foreground tracking-tight">{curriculumToTitle(track)}</h3>
                            <p className="text-[13px] text-muted-foreground">{levels.length} levels · {trackQs} questions</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-border bg-background px-4 py-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {levels.map(({ level, stackCount, questionCount }) => {
                            const lm = LEVEL_META[level];
                            return (
                              <Link key={level} href={`/interview/${lang}/${track}/${level}`} className="group/link flex items-center justify-between p-3 rounded-lg hover:bg-surface-subtle transition-colors duration-200 ease-out">
                                <div className="flex items-center gap-3">
                                  <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: lm.color + "20" }}>
                                    <GraduationCap className="h-3 w-3" style={{ color: lm.color }} />
                                  </div>
                                  <div>
                                    <span className="text-[13px] font-bold text-foreground group-hover/link:text-primary transition-colors">{lm.label}</span>
                                    <span className="text-[11px] text-muted-foreground ml-1.5">{lm.range}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-medium text-muted-foreground">{stackCount}S · {questionCount}Q</span>
                                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-primary transition-colors duration-200 ease-out" />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {langData.length === 0 && (
            <div className="text-center py-20 text-muted-foreground bg-background/90 backdrop-blur-sm rounded-xl border border-border shadow-sm">
              <p className="text-sm">No content available yet. Check back soon.</p>
            </div>
          )}
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
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-primary mb-1">Languages</div>
                  <div className="text-2xl font-extrabold text-foreground leading-none">{langData.length}</div>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-primary mb-1">Questions</div>
                  <div className="text-2xl font-extrabold text-foreground leading-none">{grandTotalQs}</div>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Tech Stacks</span>
                  <span className="font-bold text-foreground">{grandTotalStacks}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Levels</span>
                  <span className="font-bold text-foreground">Beginner · Intermediate · Advanced</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-surface border-b border-border">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Jump</h3>
            </div>
            <div className="p-3 space-y-1">
              {langData.map(({ lang, totalQs }) => (
                <a key={lang} href={`#${lang}`} className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-primary dark:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 ease-out border border-transparent hover:border-border">
                  <span>{curriculumToTitle(lang)}</span>
                  <span className="text-muted-foreground">{totalQs} Qs</span>
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface shadow-sm p-4  ">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-warning dark:text-warning" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Pro Tip</h3>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              Start with your primary language, pick the track closest to your target role, and begin with medium difficulty questions — they appear most in interviews.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
