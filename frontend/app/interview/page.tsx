import { Metadata } from "next";
import Link from "next/link";
import { listLanguages, listTracks, listLevels, listStacksForPath, resolveStackContent } from "@/lib/contentV2";
import type { Level } from "@/lib/contentV2-types";
import {
  ArrowRight, GraduationCap, Layers, BookOpen,
  TrendingUp, Zap, Target, CheckCircle2,
  BookMarked, ArrowUpRight, Code2, Sparkles,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function toDisplayName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

const LEVEL_META: Record<Level, { label: string; range: string; color: string; colorClass: string }> = {
  beginner: { label: "Beginner", range: "0–2 yrs", color: "#10b981", colorClass: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" },
  intermediate: { label: "Intermediate", range: "2–5 yrs", color: "#f59e0b", colorClass: "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" },
  advanced: { label: "Advanced", range: "5+ yrs", color: "#ef4444", colorClass: "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20" },
};

export const metadata: Metadata = {
  title: "Interview Questions — All Languages & Tracks",
  description: "Browse interview questions by language, track, and experience level. Java, Python, Go, Ruby — covering backend, frontend, fullstack, and more.",
  alternates: { canonical: `${SITE_URL}/interview` },
};

export default function InterviewIndexPage() {
  const languages = listLanguages();

  const langData = languages.map(lang => {
    const tracks = listTracks(lang);
    const trackData = tracks.map(track => {
      const levels = listLevels(lang, track);
      const levelData = levels.map(level => {
        const stacks = listStacksForPath(lang, track, level);
        let totalQ = 0;
        for (const stack of stacks) {
          const content = resolveStackContent(lang, track, level, stack);
          totalQ += content?.questions.length ?? 0;
        }
        return { level, stackCount: stacks.length, questionCount: totalQ };
      });
      const totalStacks = levelData.reduce((s, l) => s + l.stackCount, 0);
      const totalQs = levelData.reduce((s, l) => s + l.questionCount, 0);
      return { track, levels: levelData, totalStacks, totalQs };
    });
    const totalStacks = trackData.reduce((s, t) => s + t.totalStacks, 0);
    const totalQs = trackData.reduce((s, t) => s + t.totalQs, 0);
    return { lang, tracks: trackData, totalStacks, totalQs };
  });

  const grandTotalQs = langData.reduce((s, l) => s + l.totalQs, 0);
  const grandTotalStacks = langData.reduce((s, l) => s + l.totalStacks, 0);

  const benefits = [
    "Deep explanations, not just code",
    "What interviewers actually look for",
    "Organized by experience level",
    "Reusable tools across tracks",
    "Track your progress",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20 font-sans text-foreground selection:bg-blue-200">
      <div className="w-full min-w-0 min-h-screen flex gap-6 px-6 py-6">

        {/* ─── LEFT SIDEBAR ─── */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
          <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/40 dark:to-slate-900/20 border-b border-border">
              <div className="flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Interview Hub</h3>
              </div>
            </div>
            <div className="p-3 space-y-1">
              <Link href="/interview" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                <span>All Languages</span>
              </Link>
              <Link href="/tools" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-blue-200 dark:border-blue-500/20">
                <span>Tools & Technologies</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link href="/dsa" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-blue-200 dark:border-blue-500/20">
                <span>DSA Problems</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link href="/domains" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-blue-200 dark:border-blue-500/20">
                <span>Browse All Paths</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="rounded-xl border border-teal-200 dark:border-teal-500/20 bg-gradient-to-br from-teal-50 dark:from-teal-950/40 to-cyan-50 dark:to-cyan-950/40 shadow-sm p-4  ">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Why InterviewExplainer</h3>
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

          {/* Study Strategy */}
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50 dark:from-indigo-950/40 to-blue-50 dark:to-blue-950/40 shadow-sm p-4  ">
            <div className="flex items-center gap-2 mb-3">
              <BookMarked className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">How to Use</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: "1️⃣", text: "Pick your language and track below." },
                { icon: "2️⃣", text: "Select your experience level." },
                { icon: "3️⃣", text: "Open a stack, explore questions, and start learning." },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 bg-background/60 rounded-lg p-2 border border-indigo-100 dark:border-indigo-500/20">
                  <span className="text-sm leading-none mt-0.5">{tip.icon}</span>
                  <p className="text-xs text-foreground leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── MAIN COLUMN ─── */}
        <main className="flex-1 min-w-0">
          {/* Hero Header */}
          <header className="mb-6 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="relative px-6 py-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-sm">
                  Interview Preparation
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground mb-3">
                Interview Questions
              </h1>
              <p className="text-sm text-foreground leading-relaxed max-w-3xl">
                Curated questions organized by language, track, and experience level. Deep explanations, real-world code, and what interviewers actually want to hear.
              </p>
            </div>
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                    <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Languages</div>
                    <div className="text-lg font-bold text-foreground">{langData.length}</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Tech Stacks</div>
                    <div className="text-lg font-bold text-foreground">{grandTotalStacks}</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Total Questions</div>
                    <div className="text-lg font-bold text-foreground">{grandTotalQs}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Language Sections */}
          <div className="space-y-6 pb-10">
            {langData.map(({ lang, tracks, totalStacks, totalQs }) => (
              <section key={lang}>
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 dark:from-blue-950/400 to-indigo-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">{lang.charAt(0).toUpperCase()}</span>
                    </div>
                    <h2 className="text-lg font-black text-foreground tracking-tight">{toDisplayName(lang)}</h2>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{totalStacks} stacks · {totalQs} Qs</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {tracks.map(({ track, levels, totalQs: trackQs }) => (
                    <div key={track} className="border rounded-[12px] border-border shadow-sm bg-[#f8f9fa] overflow-hidden hover:border-border hover:shadow-md transition-all">
                      <div className="flex items-center justify-between p-4 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-bold text-foreground tracking-tight">{toDisplayName(track)}</h3>
                            <p className="text-[13px] text-muted-foreground">{levels.length} levels · {trackQs} questions</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800/60 bg-background px-4 py-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {levels.map(({ level, stackCount, questionCount }) => {
                            const lm = LEVEL_META[level];
                            return (
                              <Link
                                key={level}
                                href={`/interview/${lang}/${track}/${level}`}
                                className="group/link flex items-center justify-between p-3 rounded-lg hover:bg-[#f8f9fa] transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: lm.color + '20' }}>
                                    <GraduationCap className="h-3 w-3" style={{ color: lm.color }} />
                                  </div>
                                  <div>
                                    <span className="text-[13px] font-bold text-foreground group-hover/link:text-[#2e64e5] transition-colors">{lm.label}</span>
                                    <span className="text-[11px] text-muted-foreground ml-1.5">{lm.range}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-medium text-muted-foreground">{stackCount}S · {questionCount}Q</span>
                                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-[#2e64e5] group-hover/link:translate-x-0.5 transition-all" />
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

        {/* ─── RIGHT SIDEBAR ─── */}
        <aside className="hidden xl:flex w-[300px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
          {/* At a Glance */}
          <div className="rounded-xl border border-purple-200 dark:border-purple-500/20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-b border-purple-200 dark:border-purple-500/20">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">At a Glance</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-background rounded-lg p-3 border border-purple-200 dark:border-purple-500/20 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1">Languages</div>
                  <div className="text-2xl font-black text-foreground leading-none">{langData.length}</div>
                </div>
                <div className="bg-background rounded-lg p-3 border border-purple-200 dark:border-purple-500/20 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1">Questions</div>
                  <div className="text-2xl font-black text-foreground leading-none">{grandTotalQs}</div>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-purple-200 dark:border-purple-500/20">
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

          {/* Available Languages */}
          <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/40 dark:to-slate-900/20 border-b border-border">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Jump</h3>
            </div>
            <div className="p-3 space-y-1">
              {langData.map(({ lang, totalQs }) => (
                <a key={lang} href={`#${lang}`} className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-blue-200 dark:border-blue-500/20">
                  <span>{toDisplayName(lang)}</span>
                  <span className="text-muted-foreground">{totalQs} Qs</span>
                </a>
              ))}
            </div>
          </div>

          {/* Sparkles Tip */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 dark:from-amber-950/40 to-yellow-50 dark:to-yellow-950/40 shadow-sm p-4  ">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
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
