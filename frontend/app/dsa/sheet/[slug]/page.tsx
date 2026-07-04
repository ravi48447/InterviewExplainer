import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import {
  getDSASheet,
  getDSAIndex,
  listDSASheets,
} from "@/lib/contentV2";
import type { DSAProblemIndex } from "@/lib/contentV2-types";
import {
  Home,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Target,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  ListChecks,
  Flag,
  Play,
  Trophy,
  Gauge,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const DSA_ROOT = path.join(process.cwd(), "..", "content", "dsa");

const BG_HERO_GRID: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "32px 32px",
};

const DIFFICULTY_PILL: Record<string, string> = {
  easy: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  medium: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  hard: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
};

function problemHasAuthoredContent(
  category: string | undefined,
  slug: string,
): boolean {
  if (!category) return false;
  try {
    return fs.existsSync(path.join(DSA_ROOT, category, `${slug}.json`));
  } catch {
    return false;
  }
}

/**
 * For a sheet's problem slug, look up the index entry so we can render
 * its difficulty, category link, and company tags. Returns null for
 * slugs that aren't indexed yet (harmless — renders a "queued" row).
 */
function resolveProblems(): Map<string, DSAProblemIndex> {
  const index = getDSAIndex();
  if (!index) return new Map();
  return new Map(index.problems.map((p) => [p.slug, p]));
}

// ─── Next.js hooks ───────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return listDSASheets().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const sheet = getDSASheet(slug);
  if (!sheet) return { title: "Sheet not found — InterviewExplainer" };

  const title =
    sheet.seo?.title ?? `${sheet.title} | InterviewExplainer`;
  const description =
    sheet.seo?.description ?? sheet.tagline;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/dsa/sheet/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/dsa/sheet/${slug}`,
      type: "article",
    },
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Glassy stat tile for the dark hero. */
function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-background/[0.04] p-3.5 transition-colors hover:bg-background/[0.07] hover:border-violet-500 dark:border-violet-500/50 dark:border-violet-700/25">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500 dark:bg-violet-800/15 shrink-0">
        <Icon className="h-4 w-4 text-violet-300 dark:text-violet-300" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-black text-white leading-none tracking-tight">{value}</div>
        <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-1.5 truncate">{label}</div>
      </div>
    </div>
  );
}

function ProblemRow({
  position,
  slug,
  idx,
}: {
  position: number;
  slug: string;
  idx: Map<string, DSAProblemIndex>;
}) {
  const p = idx.get(slug);
  const title = p?.title ?? slug.replace(/-/g, " ");
  const difficulty = p?.difficulty;
  const isAuthored = p
    ? problemHasAuthoredContent(p.category, p.slug)
    : false;
  const href =
    p && isAuthored ? `/dsa/problem/${p.slug}` : null;

  const RowInner = (
    <>
      <span className="text-[11px] font-mono text-muted-foreground w-7 shrink-0 tabular-nums">
        {String(position).padStart(2, "0")}
      </span>
      {isAuthored ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
      <span className="flex-1 text-sm font-medium text-foreground group-hover:text-violet-700 dark:text-violet-400 capitalize truncate transition-colors">
        {title}
      </span>
      {difficulty && (
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${DIFFICULTY_PILL[difficulty] ?? DIFFICULTY_PILL.medium}`}
        >
          {difficulty}
        </span>
      )}
      {!isAuthored && (
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-surface text-muted-foreground border-border">
          Queued
        </span>
      )}
      {href && (
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-violet-600 dark:text-violet-400 transition-colors" />
      )}
    </>
  );

  const baseClass =
    "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl border bg-background";

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClass} border-border hover:border-violet-300 dark:border-violet-500/30 hover:shadow-sm hover:bg-violet-50 dark:bg-violet-500/10 dark:bg-violet-950/20/30 transition-all`}
      >
        {RowInner}
      </Link>
    );
  }
  return <div className={`${baseClass} border-slate-100 dark:border-slate-800/60 bg-surface/60`}>{RowInner}</div>;
}

/** Section header used in the sheet body. */
function SectionHeading({
  icon: Icon,
  kicker,
  kickerColor,
  title,
}: {
  icon: typeof Award;
  kicker: string;
  kickerColor: string;
  title: string;
}) {
  return (
    <div className="mb-4">
      <p className={`text-xs font-bold uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1.5 ${kickerColor}`}>
        <Icon className="h-3.5 w-3.5" />
        {kicker}
      </p>
      <h2 className="text-[1.4rem] font-black text-foreground tracking-[-0.01em] leading-tight">{title}</h2>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DSASheetPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const sheet = getDSASheet(slug);
  if (!sheet) notFound();

  const idx = resolveProblems();

  // Flatten problems for progress and JSON-LD.
  const allSlugs: string[] = sheet.groups
    ? sheet.groups.flatMap((g) => g.problemSlugs)
    : sheet.problemOrder ?? [];
  const authoredCount = allSlugs.filter((s) => {
    const p = idx.get(s);
    return p ? problemHasAuthoredContent(p.category, p.slug) : false;
  }).length;
  const progressPercent =
    allSlugs.length > 0
      ? Math.round((authoredCount / allSlugs.length) * 100)
      : 0;

  // First solvable problem — powers the hero "Start" CTA.
  const firstAuthoredSlug = allSlugs.find((s) => {
    const p = idx.get(s);
    return p ? problemHasAuthoredContent(p.category, p.slug) : false;
  });

  // Difficulty split across the sheet (for the "In this plan" panel).
  const diffCounts = { easy: 0, medium: 0, hard: 0 };
  for (const s of allSlugs) {
    const d = idx.get(s)?.difficulty;
    if (d === "easy" || d === "medium" || d === "hard") diffCounts[d] += 1;
  }
  const diffTotal = diffCounts.easy + diffCounts.medium + diffCounts.hard;
  const pct = (n: number) => (diffTotal > 0 ? Math.round((n / diffTotal) * 100) : 0);

  // Split the description into two balanced columns so the "About" card fills
  // its full width instead of leaving the right half empty. Multiple paragraphs
  // are halved by paragraph; a single paragraph is halved by sentence.
  const descParagraphs = (sheet.description ?? "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  let descCols: [string[], string[]] = [descParagraphs, []];
  if (descParagraphs.length === 1) {
    const sentences =
      descParagraphs[0].match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [];
    if (sentences.length >= 2) {
      const mid = Math.ceil(sentences.length / 2);
      descCols = [
        [sentences.slice(0, mid).join(" ")],
        [sentences.slice(mid).join(" ")],
      ];
    }
  } else if (descParagraphs.length >= 2) {
    const mid = Math.ceil(descParagraphs.length / 2);
    descCols = [descParagraphs.slice(0, mid), descParagraphs.slice(mid)];
  }
  const descTwoCol = descCols[1].length > 0;

  const otherSheets = listDSASheets().filter((s) => s !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "DSA", item: `${SITE_URL}/dsa` },
          {
            "@type": "ListItem",
            position: 3,
            name: sheet.title,
            item: `${SITE_URL}/dsa/sheet/${slug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: sheet.title,
        description: sheet.description,
        numberOfItems: sheet.totalProblems,
        itemListElement: allSlugs.slice(0, 25).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: idx.get(s)?.title ?? s,
          url: (() => {
            const p = idx.get(s);
            return p && problemHasAuthoredContent(p.category, p.slug)
              ? `${SITE_URL}/dsa/problem/${p.slug}`
              : `${SITE_URL}/dsa/sheet/${slug}`;
          })(),
        })),
      },
      {
        "@type": "Course",
        name: sheet.title,
        description: sheet.description,
        provider: {
          "@type": "Organization",
          name: "InterviewExplainer",
          url: SITE_URL,
        },
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#eef0f4] to-[#f4f5f7] dark:from-background dark:to-background font-sans text-foreground">
      {/* Page-wide ambient light — soft coloured glows drifting across the page. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 45% at 12% 8%, rgba(139,92,246,0.10) 0%, transparent 60%)," +
            "radial-gradient(55% 40% at 92% 18%, rgba(99,102,241,0.09) 0%, transparent 60%)," +
            "radial-gradient(50% 50% at 50% 100%, rgba(56,189,248,0.07) 0%, transparent 65%)",
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── HERO (dark, consistent with the hub) ─────────────────── */}
      <header className="relative z-10 overflow-hidden bg-[#0f1014] text-white">
        <div className="pointer-events-none absolute inset-0" style={BG_HERO_GRID} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 65% at 25% -5%, rgba(139,92,246,0.22) 0%, transparent 60%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 50% 60% at 100% 110%, rgba(99,102,241,0.16) 0%, transparent 55%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f4f5f7]/0 to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 pt-4 pb-2 flex-wrap">
            <Link href="/" className="hover:text-muted-foreground transition-colors flex items-center gap-1">
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/dsa" className="hover:text-muted-foreground transition-colors">DSA</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-600 dark:text-zinc-400">Study plans</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-foreground font-medium">{sheet.title}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 xl:gap-12 items-start py-8 lg:py-10">
            {/* LEFT */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500 dark:border-violet-500/50 dark:border-violet-700/25 bg-violet-500 dark:bg-violet-800/10 px-3.5 py-1.5">
                <ListChecks className="h-3 w-3 text-violet-400 dark:text-violet-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-violet-300 dark:text-violet-300">
                  Curated study plan
                </span>
              </div>

              <h1 className="text-4xl sm:text-[3rem] font-black tracking-[-0.02em] text-white leading-[1.02] mb-4 text-pretty">
                {sheet.title}
              </h1>
              <p className="text-base sm:text-[1.0625rem] text-muted-foreground leading-[1.65] max-w-[580px] mb-7 text-pretty">
                {sheet.tagline}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                {firstAuthoredSlug && (
                  <Link
                    href={`/dsa/problem/${firstAuthoredSlug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 dark:bg-violet-800 hover:bg-violet-500 dark:bg-violet-800 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-violet-900/40"
                  >
                    <Play className="h-4 w-4" /> Start first problem
                  </Link>
                )}
                <a
                  href="#problems"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-background/[0.06] hover:bg-background/[0.12] border border-white/[0.12] text-muted-foreground hover:text-white font-medium rounded-xl transition-colors text-sm"
                >
                  Jump to problem list <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              {/* Credit */}
              {(sheet.credit || sheet.sourceUrl) && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 flex-wrap">
                  {sheet.credit && <span>{sheet.credit}</span>}
                  {sheet.sourceUrl && (
                    <a
                      href={sheet.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-violet-400 dark:text-violet-300 hover:text-violet-300 dark:text-violet-300"
                    >
                      Original source
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — stats + progress */}
            <div className="lg:pt-1">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <HeroStat icon={Target} label="Problems" value={`${sheet.totalProblems}`} />
                {sheet.estimatedDuration && (
                  <HeroStat icon={Clock} label="Duration" value={sheet.estimatedDuration} />
                )}
                <HeroStat icon={Sparkles} label="Solutions ready" value={`${authoredCount}/${allSlugs.length}`} />
                <HeroStat icon={BookOpen} label="Languages" value="Java · Py" />
              </div>

              {allSlugs.length > 0 && (
                <div className="rounded-xl border border-white/[0.08] bg-background/[0.03] p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Walkthroughs authored
                    </span>
                    <span className="text-xs font-black text-white">{progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-background/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-50 dark:from-violet-950/400 to-fuchsia-50 dark:to-fuchsia-950/400"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── BODY ─────────────────────────────────────────────────── */}
      <div className="relative z-10">
        {/* Soft violet wash carrying the hero's colour into the body. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-violet-200/25 via-violet-100/10 to-transparent"
        />
        <div className="relative mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12 py-8 space-y-10">

        {/* Difficulty split — slim full-width strip */}
        {diffTotal > 0 && (
          <section className="rounded-2xl border border-border bg-gradient-to-b from-white to-slate-50/60 dark:to-slate-950/40 ring-1 ring-white/70 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 shadow-[0_2px_20px_-10px_rgba(124,58,237,0.22)] px-5 sm:px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <Gauge className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                Difficulty split
              </div>
              <div className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
                <div className="bg-emerald-500 dark:bg-emerald-800" style={{ width: `${pct(diffCounts.easy)}%` }} />
                <div className="bg-amber-500 dark:bg-amber-800" style={{ width: `${pct(diffCounts.medium)}%` }} />
                <div className="bg-rose-500 dark:bg-rose-800" style={{ width: `${pct(diffCounts.hard)}%` }} />
              </div>
              <div className="flex shrink-0 items-center gap-4 sm:gap-5">
                {([
                  ["Easy", diffCounts.easy, "text-emerald-600 dark:text-emerald-400", "bg-emerald-500 dark:bg-emerald-800"],
                  ["Medium", diffCounts.medium, "text-amber-600 dark:text-amber-400", "bg-amber-500 dark:bg-amber-800"],
                  ["Hard", diffCounts.hard, "text-rose-600 dark:text-rose-400", "bg-rose-500 dark:bg-rose-800"],
                ] as const).map(([label, n, color, dot]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                    <span className={`text-sm font-black tabular-nums ${color}`}>{n}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About this plan — balanced two-column prose fills the width comfortably */}
        {sheet.description && (
          <section className="rounded-2xl border border-border bg-gradient-to-b from-white to-slate-50/60 dark:to-slate-950/40 ring-1 ring-white/70 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 shadow-[0_2px_20px_-10px_rgba(124,58,237,0.22)] overflow-hidden">
            <div className="px-6 sm:px-8 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/40 dark:to-background">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                About this plan
              </p>
            </div>
            <div
              className={`px-6 sm:px-8 py-6 ${
                descTwoCol ? "grid lg:grid-cols-2 lg:gap-x-12" : ""
              }`}
            >
              {descTwoCol ? (
                descCols.map((col, ci) => (
                  <div key={ci}>
                    {col.map((p, i) => (
                      <p
                        key={i}
                        className={`mb-4 last:mb-0 text-foreground ${
                          ci === 0 && i === 0
                            ? "text-[16px] leading-[1.75] text-foreground font-medium"
                            : "text-[15px] leading-[1.8]"
                        }`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                ))
              ) : (
                descParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className={`mb-4 last:mb-0 text-foreground ${
                      i === 0
                        ? "text-[16px] leading-[1.75] text-foreground font-medium"
                        : "text-[15px] leading-[1.8]"
                    }`}
                  >
                    {p}
                  </p>
                ))
              )}
            </div>
          </section>
        )}

        {/* WHY + HOW — naturally balanced pair */}
        {((sheet.whyThisSheet && sheet.whyThisSheet.length > 0) ||
          (sheet.howToUse && sheet.howToUse.length > 0)) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {sheet.whyThisSheet && sheet.whyThisSheet.length > 0 && (
              <section className="rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-gradient-to-b from-white to-emerald-50/40 dark:to-emerald-950/40 ring-1 ring-white/70 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 shadow-[0_2px_20px_-10px_rgba(16,185,129,0.22)] overflow-hidden">
                <div className="px-6 pt-5 pb-3 bg-gradient-to-br from-emerald-50 to-emerald-50/30 dark:from-emerald-950/40 dark:to-emerald-950/10 border-b border-emerald-100 dark:border-emerald-500/20 dark:border-emerald-900/40">
                  <SectionHeading
                    icon={Award}
                    kicker="Why this sheet"
                    kickerColor="text-emerald-700 dark:text-emerald-400"
                    title="Worth your time because…"
                  />
                </div>
                <ul className="p-5 space-y-2.5">
                  {sheet.whyThisSheet.map((line, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-[14.5px] text-foreground leading-[1.7]"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {sheet.howToUse && sheet.howToUse.length > 0 && (
              <section className="rounded-2xl border border-violet-100 dark:border-violet-500/20 bg-gradient-to-b from-white to-violet-50/40 dark:to-violet-950/40 ring-1 ring-white/70 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 shadow-[0_2px_20px_-10px_rgba(124,58,237,0.22)] overflow-hidden">
                <div className="px-6 pt-5 pb-3 bg-gradient-to-br from-violet-50 to-violet-50/30 dark:from-violet-950/40 dark:to-violet-950/10 border-b border-violet-100 dark:border-violet-500/20 dark:border-violet-900/40">
                  <SectionHeading
                    icon={Flag}
                    kicker="How to use it"
                    kickerColor="text-violet-700 dark:text-violet-400"
                    title="Work through it like this"
                  />
                </div>
                <ol className="p-5 space-y-2.5">
                  {sheet.howToUse.map((line, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-[14.5px] text-foreground leading-[1.7]"
                    >
                      <span className="text-[11px] font-bold font-mono text-violet-700 dark:text-violet-400 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-500/20 dark:border-violet-700/50 rounded-lg w-6 h-6 flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        )}

        {/* PROBLEM LIST */}
        <section id="problems" className="scroll-mt-24">
          <SectionHeading
            icon={ListChecks}
            kicker="The problem set"
            kickerColor="text-indigo-600 dark:text-indigo-400"
            title={`All ${allSlugs.length} problems`}
          />

          {sheet.groups && sheet.groups.length > 0 ? (
            <div className="space-y-6">
              {sheet.groups.map((group, gi) => {
                const offset = sheet.groups!
                  .slice(0, gi)
                  .reduce((acc, g) => acc + g.problemSlugs.length, 0);

                return (
                  <div
                    key={group.groupSlug}
                    id={`grp-${group.groupSlug}`}
                    className="scroll-mt-24 rounded-2xl border border-border bg-gradient-to-b from-white to-slate-50/60 dark:to-slate-950/40 ring-1 ring-white/70 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 shadow-[0_2px_20px_-10px_rgba(124,58,237,0.22)] overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/40 dark:to-background dark:from-zinc-900 dark:to-zinc-950/60">
                      <h3 className="text-[15px] font-bold text-foreground capitalize flex items-center gap-2.5 tracking-tight">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-gradient-to-br from-violet-50 dark:from-violet-950/400 to-fuchsia-50 dark:to-fuchsia-950/400 text-white text-xs font-black shadow-sm shadow-violet-200">
                          {gi + 1}
                        </span>
                        {group.title}
                      </h3>
                      <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
                        {group.problemSlugs.length} problems
                      </span>
                    </div>
                    {group.blurb && (
                      <p className="text-sm text-muted-foreground px-5 pt-3 -mb-1">
                        {group.blurb}
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                      {group.problemSlugs.map((s, i) => (
                        <ProblemRow
                          key={s}
                          position={offset + i + 1}
                          slug={s}
                          idx={idx}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (sheet.problemOrder ?? []).length > 0 ? (
            <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-slate-50/60 dark:to-slate-950/40 ring-1 ring-white/70 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 shadow-[0_2px_20px_-10px_rgba(124,58,237,0.22)] p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(sheet.problemOrder ?? []).map((s, i) => (
                  <ProblemRow key={s} position={i + 1} slug={s} idx={idx} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground text-center">
              Problem list is being compiled.
            </div>
          )}
        </section>

        {/* SIBLING SHEETS */}
        <section>
          <SectionHeading
            icon={Trophy}
            kicker="Keep exploring"
            kickerColor="text-amber-600 dark:text-amber-400"
            title="Other curated plans"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherSheets.map((s) => (
              <Link
                key={s}
                href={`/dsa/sheet/${s}`}
                className="group rounded-2xl border border-border bg-gradient-to-b from-white to-slate-50/60 dark:to-slate-950/40 ring-1 ring-white/70 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 shadow-[0_2px_16px_-10px_rgba(124,58,237,0.18)] hover:border-violet-300 dark:border-violet-500/30 hover:shadow-xl hover:shadow-violet-200/50 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-violet-50 dark:from-violet-950/400 to-fuchsia-50 dark:to-fuchsia-950/400" />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-2">
                    <ListChecks className="h-3.5 w-3.5" /> Study plan
                  </div>
                  <div className="text-lg font-black text-foreground group-hover:text-violet-700 dark:text-violet-400 capitalize tracking-tight transition-colors">
                    {s.replace(/-/g, " ")}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
                    Open plan <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href="/dsa"
              className="group rounded-2xl bg-[#0f1014] hover:bg-[#15161c] transition-all overflow-hidden flex flex-col relative"
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 70% 80% at 110% -10%, rgba(139,92,246,0.25) 0%, transparent 60%)" }}
                aria-hidden
              />
              <div className="h-1.5 bg-gradient-to-r from-violet-50 dark:from-violet-950/400 to-indigo-50 dark:to-indigo-950/400" />
              <div className="relative p-5 flex flex-col flex-1 text-white">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-violet-300 dark:text-violet-300 mb-2">
                  <Sparkles className="h-3.5 w-3.5" /> Full hub
                </div>
                <div className="text-lg font-black tracking-tight">
                  Browse the whole DSA hub
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-violet-300 dark:text-violet-300">
                  All plans, modules &amp; problems <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Back link */}
        <div className="pt-2">
          <Link
            href="/dsa"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-violet-700 dark:text-violet-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to DSA hub
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
