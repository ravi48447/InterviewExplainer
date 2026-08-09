/**
 * Phase 15 — Prep hub V2 component.
 *
 * Renders the /prep hub from the canonical `lib/learning` loader. Unlike the
 * other learning hubs (pure static catalogs), the prep hub is dynamic: pillar
 * cards and module lists come from PILLAR_HUBS / SEO_MODULES with live question
 * counts. It also embeds <PrepTrackSurfaces> (shared landing component) and the
 * Java-roadmap CTA.
 */

import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Layers,
  Zap,
  Compass,
  Sparkles,
} from "lucide-react";
import {
  PILLAR_HUBS,
  COMPLETE_TRACK_CTA,
} from "@/lib/seo-pillars";
import { SEO_MODULES } from "@/lib/seo-slugs";
import { getCanonicalOrigin } from "@/lib/seo/config";
import { PrepTrackSurfaces } from "@/components/landing/prep-track-surfaces";
import type { PrepHubData } from "@/lib/learning";
import type { ModulePillarGroup, PillarWithStats } from "@/lib/learning";

function PillarHubCards({ stats }: { stats: PillarWithStats[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {stats.map(({ pillar, moduleCount, questionCount }) => (
        <Link
          key={pillar.pillarSlug}
          href={`/${pillar.pillarSlug}`}
          className="group block rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default transition-all overflow-hidden"
        >
          <div className="px-5 py-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-foreground group-hover:text-primary dark:group-hover:text-primary leading-snug transition-colors">
                  {pillar.title}
                </h3>
                <div className="mt-1 text-xs text-muted-foreground leading-snug line-clamp-2">
                  {pillar.tagline}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span className="font-bold text-foreground">{questionCount}</span>
                <span>questions</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3 w-3" />
                <span className="font-bold text-foreground">{moduleCount}</span>
                <span>modules</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ModulePillarSections({ groups }: { groups: ModulePillarGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.pillarName}
          className="rounded-xl border border-border bg-background shadow-sm overflow-hidden"
        >
          <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-b border-border flex items-baseline gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 self-center" />
            <h3 className="text-sm font-black text-foreground">{group.pillarName}</h3>
            <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-primary">
              {group.modules.length}
            </span>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {group.modules.map(({ entry, questionCount }) => (
              <li key={entry.seoSlug}>
                <Link
                  href={`/${entry.seoSlug}`}
                  className="group flex items-center gap-4 px-5 py-3 hover:bg-primary/10 transition-colors"
                >
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors leading-snug">
                      {entry.title} Interview Questions
                    </span>
                    {entry.altSlugs.length > 0 && (
                      <span className="mt-1 block text-[11px] text-muted-foreground leading-snug">
                        Also covers:{" "}
                        {entry.altSlugs
                          .map((s) =>
                            s
                              .replace(/-interview-questions$/, "")
                              .replace(/-/g, " "),
                          )
                          .join(", ")}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    <span className="font-bold text-foreground">{questionCount}</span>{" "}
                    Q&amp;A
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function PrepHub({ data }: { data: PrepHubData }) {
  const {
    architecturePillars,
    javaPlatformPillars,
    jfiGroups,
    jbiGroups,
    totalModules,
    totalQuestions,
  } = data;

  const origin = getCanonicalOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: origin },
          {
            "@type": "ListItem",
            position: 2,
            name: "Interview Prep",
            item: `${origin}/prep`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "Interview Prep Hub — System Design, Java, Python & Frontend",
        url: `${origin}/prep`,
        isPartOf: {
          "@type": "WebSite",
          url: origin,
          name: "InterviewExplainer",
        },
      },
      {
        "@type": "ItemList",
        name: "Interview prep topic hubs",
        numberOfItems: PILLAR_HUBS.length,
        itemListElement: PILLAR_HUBS.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: p.title,
          url: `${origin}/${p.pillarSlug}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-surface border border-default dark:from-slate-950 font-sans text-foreground">
        <div className="w-full min-w-0 px-4 py-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5"
          >
            <Link
              href="/"
              className="hover:text-foreground flex items-center gap-1"
            >
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold">Interview Prep</span>
          </nav>

          <header className="mb-6 rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="px-7 py-7 bg-surface border border-default">
              <div className="text-[11px] font-bold uppercase tracking-widest text-primary dark:text-primary mb-2">
                Interview prep hub
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3 leading-tight">
                System design, Java, Python &amp; frontend — pick a surface
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                This index lists every topic hub and SEO module we publish, but they are not all
                &quot;the same as Java prep&quot;: system design and architecture hubs are
                language-agnostic; Python and frontend have their own roadmaps and domains. Use the
                cards below to enter the right track first, then drill modules.
              </p>
            </div>

            <div className="px-7 py-3 bg-background border-t border-border flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-primary dark:text-primary" />
                <span className="font-bold text-foreground">{totalQuestions}+</span>
                <span className="text-muted-foreground">questions</span>
              </div>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2 text-sm">
                <Layers className="h-4 w-4 text-primary dark:text-primary" />
                <span className="font-bold text-foreground">{totalModules}</span>
                <span className="text-muted-foreground">modules</span>
              </div>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2 text-sm">
                <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-foreground">{PILLAR_HUBS.length}</span>
                <span className="text-muted-foreground">topic hubs</span>
              </div>
            </div>
          </header>

          <PrepTrackSurfaces variant="prep" />

          <aside
            aria-label="Java backend full roadmap"
            className="mb-8 rounded-xl border border-border bg-background shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-800 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Optional — Java only
                </p>
                <p className="text-sm text-foreground leading-snug">
                  {COMPLETE_TRACK_CTA.tagline}{" "}
                  <span className="text-muted-foreground">
                    Use this when you want the full Java-backend sequence, not SD/Python/React
                    first.
                  </span>
                </p>
              </div>
              <Link
                href={COMPLETE_TRACK_CTA.href}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-default dark:border-default/20 bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-primary font-semibold text-sm hover:bg-blue-100 dark:bg-blue-950/20 transition-colors shrink-0"
              >
                Java roadmap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <section
            id="track-architecture"
            className="mb-10 scroll-mt-24 rounded-2xl border border-success/20 bg-success/10 p-5 sm:p-6"
          >
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-1">
                Language-agnostic
              </p>
              <h2 className="text-xl font-black text-foreground">
                System design &amp; architecture topic hubs
              </h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                These hubs are framed for interview rounds that are not tied to a single language.
                Open any card — content may use examples in several stacks, but the trade-offs are
                universal.
              </p>
            </div>
            <PillarHubCards stats={architecturePillars} />
          </section>

          <section id="track-java" className="mb-10 scroll-mt-24">
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Java &amp; platform stack
              </p>
              <h2 className="text-xl font-black text-foreground">
                Java backend &amp; ecosystem topic hubs
              </h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                Spring, JVM, data, security, DevOps, cloud, SRE, and more — the pillars that sit
                under a typical Java backend hiring loop.
              </p>
            </div>
            <PillarHubCards stats={javaPlatformPillars} />
          </section>

          <section id="track-frontend" className="mb-10 scroll-mt-24 rounded-2xl border border-primary/20 bg-primary/10 p-5 sm:p-6">
            <h2 className="text-xl font-black text-foreground">
              Frontend &amp; fullstack modules (JavaScript, TypeScript, React…)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl mb-4">
              These SEO modules live on the{" "}
              <Link
                href="/java-fullstack-intermediate"
                className="font-semibold text-primary dark:text-primary hover:underline"
              >
                Java fullstack intermediate
              </Link>{" "}
              roadmap — grouped by curriculum pillar below so they stay separate from the Java
              backend list.
            </p>
            <ModulePillarSections groups={jfiGroups} />
          </section>

          <section aria-labelledby="java-backend-modules-heading" className="mb-10 scroll-mt-24">
            <div className="flex items-baseline justify-between mb-4 gap-2 flex-wrap">
              <h2
                id="java-backend-modules-heading"
                className="text-xl font-black text-foreground"
              >
                Java backend curriculum — every SEO module
              </h2>
              <span className="text-xs text-muted-foreground">
                Grouped by pillar from the backend index
              </span>
            </div>
            <ModulePillarSections groups={jbiGroups} />
          </section>

          <footer className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground leading-relaxed">
            <p>
              Question sets share one answer template and cross-links for follow-up prep. Start from
              a track at the top of this page; use topic hubs for breadth, individual modules for
              depth, or the{" "}
              <Link href={COMPLETE_TRACK_CTA.href} className="font-bold text-foreground hover:underline">
                Java backend roadmap
              </Link>{" "}
              when you want an ordered Java-only path.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

// SEO_MODULES import retained for module-count derivation parity with the
// legacy page; totalModules is part of PrepHubData but the value originates
// from SEO_MODULES.length in the loader.
export const _SEO_MODULES_LENGTH_REF = SEO_MODULES.length;
