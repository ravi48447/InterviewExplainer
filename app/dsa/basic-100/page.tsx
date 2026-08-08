import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBasic100,
  basic100ProblemAuthored,
} from "@/lib/contentV2";
import { buildBasic100Metadata } from "@/lib/dsa";
import {
  Home,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Target,
  BookOpen,
  Sparkles,
  GraduationCap,
  ListChecks,
  Flag,
  Play,
  Baby,
  Gauge,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = buildBasic100Metadata();

// ─── Sub-components ──────────────────────────────────────────────────────────

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
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5 transition-colors hover:bg-hover">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15 shrink-0">
        <Icon className="h-4 w-4 text-success" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-black text-foreground leading-none tracking-tight">
          {value}
        </div>
        <div className="text-[11px] font-medium text-muted-foreground mt-1.5 truncate">
          {label}
        </div>
      </div>
    </div>
  );
}

function ProblemRow({
  position,
  slug,
  title,
  oneLiner,
  pattern,
}: {
  position: number;
  slug: string;
  title: string;
  oneLiner: string;
  pattern?: string;
}) {
  const authored = basic100ProblemAuthored(slug);
  const href = authored ? `/dsa/problem/${slug}` : null;

  const RowInner = (
    <>
      <span className="text-[11px] font-mono text-muted-foreground w-7 shrink-0 tabular-nums">
        {String(position).padStart(2, "0")}
      </span>
      {authored ? (
        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
      <span className="flex-1 min-w-0">
        <span
          className={`block text-sm font-semibold truncate transition-colors ${
            authored
              ? "text-foreground group-hover:text-primary"
              : "text-muted-foreground"
          }`}
        >
          {title}
        </span>
        <span className="block text-[12px] text-muted-foreground truncate">
          {oneLiner}
        </span>
      </span>
      {pattern && (
        <span className="hidden sm:inline-flex text-[10px] font-medium text-muted-foreground bg-surface border border-border rounded px-1.5 py-0.5 shrink-0 capitalize">
          {pattern.replace(/-/g, " ")}
        </span>
      )}
      {authored ? (
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-success/10 text-success border-success/30 shrink-0">
          Solved
        </span>
      ) : (
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-surface text-muted-foreground border-border shrink-0">
          Queued
        </span>
      )}
      {href && (
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      )}
    </>
  );

  const baseClass =
    "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl border bg-card";

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClass} border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-colors`}
      >
        {RowInner}
      </Link>
    );
  }
  return (
    <div className={`${baseClass} border-border/60 bg-surface/60`}>
      {RowInner}
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  kicker,
  kickerColor,
  title,
}: {
  icon: typeof BookOpen;
  kicker: string;
  kickerColor: string;
  title: string;
}) {
  return (
    <div className="mb-4">
      <p
        className={`text-xs font-bold uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1.5 ${kickerColor}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {kicker}
      </p>
      <h2 className="text-[1.4rem] font-black text-foreground tracking-[-0.01em] leading-tight">
        {title}
      </h2>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Basic100Page() {
  const catalog = getBasic100();
  if (!catalog) notFound();

  const allProblems = catalog.groups.flatMap((g) => g.problems);
  const total = allProblems.length;
  const authoredCount = allProblems.filter((p) =>
    basic100ProblemAuthored(p.slug),
  ).length;
  const progressPercent =
    total > 0 ? Math.round((authoredCount / total) * 100) : 0;

  const firstAuthored = allProblems.find((p) =>
    basic100ProblemAuthored(p.slug),
  );

  const descParagraphs = (catalog.description ?? "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

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
            name: catalog.title,
            item: `${SITE_URL}/dsa/basic-100`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: catalog.title,
        description: catalog.description,
        numberOfItems: total,
        itemListElement: allProblems.slice(0, 30).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          url: basic100ProblemAuthored(p.slug)
            ? `${SITE_URL}/dsa/problem/${p.slug}`
            : `${SITE_URL}/dsa/basic-100`,
        })),
      },
      {
        "@type": "Course",
        name: catalog.title,
        description: catalog.description,
        provider: {
          "@type": "Organization",
          name: "InterviewExplainer",
          url: SITE_URL,
        },
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <header className="relative z-10 overflow-hidden border-b border-border/60 bg-surface">
        <div className="relative mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground pt-4 pb-2 flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/dsa" className="hover:text-foreground transition-colors">DSA</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Basic 100</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 xl:gap-12 items-start py-8 lg:py-10">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3.5 py-1.5">
                <GraduationCap className="h-3 w-3 text-success" />
                <span className="text-xs font-bold uppercase tracking-widest text-success">
                  Start here · for freshers
                </span>
              </div>

              <h1 className="text-4xl sm:text-[3rem] font-black tracking-[-0.02em] text-foreground leading-[1.02] mb-4 text-pretty">
                {catalog.title}
              </h1>
              <p className="text-base sm:text-[1.0625rem] text-muted-foreground leading-[1.65] max-w-[580px] mb-7 text-pretty">
                {catalog.tagline}
              </p>

              <div className="flex flex-wrap gap-2.5 mb-2">
                {firstAuthored && (
                  <Link
                    href={`/dsa/problem/${firstAuthored.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-success hover:bg-success/90 text-primary-foreground font-bold rounded-xl transition-colors text-sm"
                  >
                    <Play className="h-4 w-4" /> Start first problem
                  </Link>
                )}
                <a
                  href="#problems"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-hover border border-border/60 text-muted-foreground hover:text-foreground font-medium rounded-xl transition-colors text-sm"
                >
                  Jump to the 100 problems <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="lg:pt-1">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <HeroStat icon={Target} label="Problems" value={`${total}`} />
                <HeroStat icon={BookOpen} label="Topics" value={`${catalog.groups.length}`} />
                <HeroStat icon={Sparkles} label="Solutions ready" value={`${authoredCount}/${total}`} />
                <HeroStat icon={Gauge} label="Languages" value="Java · Py" />
              </div>

              {total > 0 && (
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Walkthroughs authored
                    </span>
                    <span className="text-xs font-black text-foreground">{progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success"
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
        <div className="relative mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12 py-8 space-y-10">

          {/* About */}
          {descParagraphs.length > 0 && (
            <section className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <div className="px-6 sm:px-8 pt-5 pb-3 border-b border-border/60 bg-surface">
                <p className="text-xs font-bold uppercase tracking-widest text-success flex items-center gap-1.5">
                  <Baby className="h-3.5 w-3.5" />
                  What is the Basic 100?
                </p>
              </div>
              <div className="px-6 sm:px-8 py-6 grid lg:grid-cols-2 lg:gap-x-12">
                {descParagraphs.map((p, i) => (
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
                ))}
              </div>
            </section>
          )}

          {/* How to use */}
          {catalog.howToUse && catalog.howToUse.length > 0 && (
            <section className="rounded-2xl border border-primary/30 bg-card overflow-hidden">
              <div className="px-6 pt-5 pb-3 bg-surface border-b border-primary/30">
                <SectionHeading
                  icon={Flag}
                  kicker="How to use it"
                  kickerColor="text-primary"
                  title="Get the most out of these 100"
                />
              </div>
              <ol className="p-5 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {catalog.howToUse.map((line, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-[14.5px] text-foreground leading-[1.7]"
                  >
                    <span className="text-[11px] font-bold font-mono text-primary bg-primary/10 border border-primary/30 rounded-lg w-6 h-6 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Problem list, grouped */}
          <section id="problems" className="scroll-mt-24">
            <SectionHeading
              icon={ListChecks}
              kicker="The problem set"
              kickerColor="text-primary"
              title={`All ${total} problems`}
            />

            <div className="space-y-6">
              {catalog.groups.map((group, gi) => {
                const offset = catalog.groups
                  .slice(0, gi)
                  .reduce((acc, g) => acc + g.problems.length, 0);
                return (
                  <div
                    key={group.groupSlug}
                    id={`grp-${group.groupSlug}`}
                    className="scroll-mt-24 rounded-2xl border border-border/60 bg-card overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border/60 bg-surface">
                      <h3 className="text-[15px] font-bold text-foreground flex items-center gap-2.5 tracking-tight">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-primary text-primary-foreground text-xs font-black">
                          {gi + 1}
                        </span>
                        {group.title}
                      </h3>
                      <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
                        {group.problems.length} problems
                      </span>
                    </div>
                    {group.blurb && (
                      <p className="text-sm text-muted-foreground px-5 pt-3 -mb-1">
                        {group.blurb}
                      </p>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-4">
                      {group.problems.map((p, i) => (
                        <ProblemRow
                          key={p.slug}
                          position={offset + i + 1}
                          slug={p.slug}
                          title={p.title}
                          oneLiner={p.oneLiner}
                          pattern={p.pattern}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Next steps */}
          <section>
            <SectionHeading
              icon={GraduationCap}
              kicker="Ready for more?"
              kickerColor="text-amber-600 dark:text-amber-400"
              title="Level up from the basics"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: "/dsa/easy", label: "Easy tier", desc: "One pattern per problem — the next step up." },
                { href: "/dsa/medium", label: "Medium tier", desc: "Combine patterns — where most interviews are decided." },
                { href: "/dsa", label: "Full DSA hub", desc: "18-module roadmap, study plans & the full library." },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:bg-hover transition-colors overflow-hidden flex flex-col"
                >
                  <div className="h-1.5 bg-primary/20" />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-lg font-black text-foreground group-hover:text-primary tracking-tight transition-colors">
                      {c.label}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 leading-snug">{c.desc}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      Continue <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="pt-2">
            <Link
              href="/dsa"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
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
