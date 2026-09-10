import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Network,
  Zap,
  Layers,
  Link2,
  Radio,
  Cloud,
  LayoutGrid,
  Braces,
} from "lucide-react";
import { TechIcon } from "@/components/tech-icon";

/**
 * Homepage "standout picks" — dense Q&A entry cards (Java, Spring, data,
 * APIs, design, DevOps, frontend). Each links to a module SEO URL + #all-questions
 * or a pillar / domain browser where noted.
 */

export type HomeStandoutIcon =
  | "java"
  | "python"
  | "go"
  | "react"
  | "spring"
  | "network"
  | "sql"
  | "typescript"
  | "javascript"
  | "zap"
  | "layers"
  | "link2"
  | "radio"
  | "cloud"
  | "layout"
  | "braces";

export interface HomeStandoutPick {
  headline: string;
  tagline: string;
  href: string;
  questionCount: number | null;
  icon: HomeStandoutIcon;
}

const LUCIDE_ICON_BOXES: Partial<
  Record<HomeStandoutIcon, { wrap: string; node: ReactNode }>
> = {
  network: {
    wrap: "bg-teal-500/10 dark:bg-teal-500/20",
    node: <Network className="h-5 w-5 text-teal-600 dark:text-teal-400" aria-hidden />,
  },
  zap: {
    wrap: "bg-orange-500/10 dark:bg-orange-500/20",
    node: <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-hidden />,
  },
  layers: {
    wrap: "bg-blue-500/10 dark:bg-blue-500/20",
    node: <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />,
  },
  link2: {
    wrap: "bg-blue-500/10 dark:bg-blue-500/20",
    node: <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />,
  },
  radio: {
    wrap: "bg-rose-500/10 dark:bg-rose-500/20",
    node: <Radio className="h-5 w-5 text-rose-600 dark:text-rose-400" aria-hidden />,
  },
  cloud: {
    wrap: "bg-sky-500/10 dark:bg-sky-500/20",
    node: <Cloud className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden />,
  },
  layout: {
    wrap: "bg-blue-500/10 dark:bg-blue-500/20",
    node: <LayoutGrid className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />,
  },
  braces: {
    wrap: "bg-amber-500/10 dark:bg-amber-500/20",
    node: <Braces className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />,
  },
};

function PickIcon({ icon }: { icon: HomeStandoutIcon }) {
  const lucide = LUCIDE_ICON_BOXES[icon];
  if (lucide) {
    return (
      <div
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center [&_svg]:size-4 ${lucide.wrap}`}
      >
        {lucide.node}
      </div>
    );
  }
  return (
    <div className="shrink-0 w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
      <TechIcon name={icon} className="h-4 w-4" />
    </div>
  );
}

function countLabel(n: number | null): string {
  if (n === null) return "Browse tracks";
  if (n >= 50) return "50+ questions";
  return `${n}+ questions`;
}

export function HomeStandoutPicks({ picks }: { picks: HomeStandoutPick[] }) {
  return (
    <section
      aria-labelledby="home-standouts-heading"
      className="py-14 sm:py-16 bg-gradient-to-b from-slate-50/90 to-white dark:from-slate-900/40 dark:to-background border-y border-slate-100 dark:border-slate-800/60"
    >
      <div className="w-full px-6 sm:px-12 lg:px-20">
        <div className="w-full min-w-0">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Highest-signal decks
            </p>
            <h2
              id="home-standouts-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3"
            >
              Top interview question sets to open first
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Curated entry points into our biggest Q&amp;A modules — language, APIs, data,
              messaging, orchestration, LLD, system design, and frontend. Module links scroll
              straight to the full question list. Python opens the domain browser.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {picks.map((p) => (
              <li key={`${p.headline}::${p.href}`}>
                <Link
                  href={p.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-background p-3 shadow-sm hover:border-default dark:border-default hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <PickIcon icon={p.icon} />
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary dark:group-hover:text-primary transition-colors">
                        {p.headline}
                      </h3>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-snug line-clamp-3">
                        {p.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="text-[10.5px] font-semibold tabular-nums text-muted-foreground">
                      {countLabel(p.questionCount)}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-primary dark:text-primary">
                      Open
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
