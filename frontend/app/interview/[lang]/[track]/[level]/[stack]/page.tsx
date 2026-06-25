import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  resolveStackContent,
  getV2QuestionsForStack,
} from "@/lib/contentV2";
import type { Level } from "@/lib/contentV2-types";
import V2ContentTreeNav from "@/components/V2ContentTreeNav";
import {
  ChevronRight, Layers, BookOpen, GraduationCap,
  ArrowRight, Clock, TrendingUp, Zap, Target,
  CheckCircle2, BookMarked, ArrowUpRight,
} from "lucide-react";

export const revalidate = 3600;

// Domains fully migrated to the new locked /{domainSlug}/... URL shape —
// for these, the proxy 301s the legacy /interview/... URL to the new one,
// so there's no point prerendering them here. See frontend/proxy.ts.
const MIGRATED_DOMAINS = new Set<string>([
  "java/backend/intermediate",
]);

export async function generateStaticParams() {
  const { listLanguages, listTracks, listLevels, listStacksForPath } = await import("@/lib/contentV2");
  const params: { lang: string; track: string; level: string; stack: string }[] = [];
  for (const lang of listLanguages()) {
    for (const track of listTracks(lang)) {
      for (const level of listLevels(lang, track)) {
        if (MIGRATED_DOMAINS.has(`${lang}/${track}/${level}`)) continue;
        for (const stack of listStacksForPath(lang, track, level as import("@/lib/contentV2-types").Level)) {
          params.push({ lang, track, level, stack });
        }
      }
    }
  }
  return params;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function toDisplayName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function difficultyColor(d: string): string {
  return d === "easy" ? "#10b981" : d === "medium" ? "#f59e0b" : "#ef4444";
}
function difficultyLabel(d: string): string {
  return d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard";
}

const LEVEL_META: Record<string, { label: string; color: string; colorClass: string; range: string }> = {
  beginner: { label: "Beginner", color: "#10b981", colorClass: "bg-emerald-100 text-emerald-700 border-emerald-200", range: "0–2 yrs" },
  intermediate: { label: "Intermediate", color: "#f59e0b", colorClass: "bg-amber-100 text-amber-700 border-amber-200", range: "2–5 yrs" },
  advanced: { label: "Advanced", color: "#ef4444", colorClass: "bg-red-100 text-red-700 border-red-200", range: "5+ yrs" },
};

type PageParams = { lang: string; track: string; level: string; stack: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { lang, track, level, stack } = await params;
  const content = resolveStackContent(lang, track, level as Level, stack);
  const stackName = content?.meta?.stack ? toDisplayName(content.meta.stack) : toDisplayName(stack);
  const count = content?.questions?.length ?? 0;

  const title = `${stackName} Interview Questions - ${toDisplayName(lang)} ${toDisplayName(track)} ${toDisplayName(level)}`;
  const description = content?.meta?.description ?? `${count} curated ${stackName} interview questions for ${toDisplayName(level)} developers.`;
  const canonicalUrl = `${SITE_URL}/interview/${lang}/${track}/${level}/${stack}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: "website", siteName: "InterviewExplainer" },
  };
}

export default async function V2StackPage({ params }: { params: Promise<PageParams> }) {
  const { lang, track, level, stack } = await params;
  const validLevel = level as Level;

  const content = resolveStackContent(lang, track, validLevel, stack);
  if (!content || content.questions.length === 0) notFound();

  const questions = getV2QuestionsForStack(lang, track, validLevel, stack);
  const stackName = content.meta?.stack ? toDisplayName(content.meta.stack) : toDisplayName(stack);
  const basePath = `/interview/${lang}/${track}/${level}/${stack}`;
  const lvlMeta = LEVEL_META[level] ?? LEVEL_META.intermediate;
  const canonicalUrl = `${SITE_URL}/interview/${lang}/${track}/${level}/${stack}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Interview", item: `${SITE_URL}/interview` },
          { "@type": "ListItem", position: 3, name: `${toDisplayName(lang)} ${toDisplayName(track)} ${lvlMeta.label}`, item: `${SITE_URL}/interview/${lang}/${track}/${level}` },
          { "@type": "ListItem", position: 4, name: stackName, item: canonicalUrl },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${stackName} Interview Questions`,
        url: canonicalUrl,
        numberOfItems: questions.length,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 font-sans text-foreground selection:bg-blue-200">
        <div className="w-full min-w-0 min-h-screen flex gap-6 px-6 py-6">

          {/* ─── LEFT SIDEBAR ─── */}
          <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-6">
            <V2ContentTreeNav
              lang={lang} track={track} level={level}
              activeStackSlug={stack}
            />
          </aside>

          {/* ─── MAIN COLUMN ─── */}
          <main className="flex-1 min-w-0">
            {/* Hero */}
            <header className="mb-6 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="relative px-6 py-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                    {toDisplayName(lang)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                    {toDisplayName(track)}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${lvlMeta.colorClass}`}>
                    {lvlMeta.label} · {lvlMeta.range}
                  </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">{stackName}</h1>
                {content.meta?.description && (
                  <p className="text-sm text-foreground leading-relaxed max-w-3xl">{content.meta.description}</p>
                )}
              </div>
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-border">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Questions</div>
                      <div className="text-lg font-bold text-foreground">{questions.length}</div>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Layers className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Stack</div>
                      <div className="text-sm font-bold text-foreground">{stackName}</div>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: lvlMeta.color + '20' }}>
                      <GraduationCap className="h-5 w-5" style={{ color: lvlMeta.color }} />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Level</div>
                      <div className="text-sm font-bold text-foreground">{lvlMeta.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Question List */}
            <div className="space-y-1.5 pb-10">
              <div className="relative">
                <div className="absolute left-[34px] top-6 bottom-6 w-px bg-surface hidden sm:block" />
                <div className="flex flex-col gap-1.5 relative z-10">
                  {questions.map((q, idx) => (
                    <Link
                      key={`${idx}-${q.slug}`}
                      href={`${basePath}/${q.slug}`}
                      className="group/link flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:pr-5 rounded-[12px] border border-border bg-background shadow-sm hover:border-[#2e64e5]/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0 max-w-full overflow-hidden">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover/link:border-[#2e64e5] group-hover/link:text-[#2e64e5] shadow-sm transition-all sm:ml-2">
                          {idx + 1}
                        </div>
                        <h4 className="text-[14px] font-medium text-foreground group-hover/link:text-foreground transition-colors leading-snug">
                          {q.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 pl-9 sm:pl-0 shrink-0 opacity-80 group-hover/link:opacity-100 transition-opacity">
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-primary-foreground dark:text-foreground shadow-sm"
                          style={{ backgroundColor: difficultyColor(q.difficulty) }}
                        >
                          {difficultyLabel(q.difficulty)}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 min-w-[45px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {q.estimatedReadTime ?? 5}m
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover/link:text-[#2e64e5] group-hover/link:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* ─── RIGHT SIDEBAR ─── */}
          <aside className="hidden xl:flex w-[300px] shrink-0 flex-col gap-4 self-start sticky top-6">
            <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-200">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">At a Glance</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-background rounded-lg p-3 border border-purple-200 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 mb-1">Questions</div>
                    <div className="text-2xl font-black text-foreground leading-none">{questions.length}</div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-purple-200 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 mb-1">Level</div>
                    <div className="text-sm font-black leading-none" style={{ color: lvlMeta.color }}>{lvlMeta.label}</div>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t border-purple-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary font-medium">Language</span>
                    <span className="font-bold text-foreground">{toDisplayName(lang)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary font-medium">Track</span>
                    <span className="font-bold text-foreground">{toDisplayName(track)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary font-medium">Stack</span>
                    <span className="font-bold text-foreground">{stackName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-teal-600" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">What You'll Learn</h3>
              </div>
              <div className="space-y-2">
                {[
                  "Core concepts & patterns",
                  "What interviewers look for",
                  "Common mistakes to avoid",
                  "Practice explaining out loud",
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-border">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Actions</h3>
              </div>
              <div className="p-3 space-y-2">
                <Link href={`/interview/${lang}/${track}/${level}`} className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-200">
                  <span>All {toDisplayName(lang)} Stacks</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <Link href="/interview" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-200">
                  <span>All Languages</span>
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
