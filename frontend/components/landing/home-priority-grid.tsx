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
    wrap: "bg-gradient-to-br from-emerald-500 to-teal-600",
    node: <Network className="h-5 w-5 text-white" aria-hidden />,
  },
  zap: {
    wrap: "bg-gradient-to-br from-amber-500 to-orange-600",
    node: <Zap className="h-5 w-5 text-white" aria-hidden />,
  },
  layers: {
    wrap: "bg-gradient-to-br from-indigo-500 to-blue-600",
    node: <Layers className="h-5 w-5 text-white" aria-hidden />,
  },
  link2: {
    wrap: "bg-gradient-to-br from-violet-500 to-purple-600",
    node: <Link2 className="h-5 w-5 text-white" aria-hidden />,
  },
  radio: {
    wrap: "bg-gradient-to-br from-rose-500 to-pink-600",
    node: <Radio className="h-5 w-5 text-white" aria-hidden />,
  },
  cloud: {
    wrap: "bg-gradient-to-br from-sky-500 to-cyan-600",
    node: <Cloud className="h-5 w-5 text-white" aria-hidden />,
  },
  layout: {
    wrap: "bg-gradient-to-br from-slate-600 to-slate-800",
    node: <LayoutGrid className="h-5 w-5 text-white" aria-hidden />,
  },
  braces: {
    wrap: "bg-gradient-to-br from-orange-500 to-amber-600",
    node: <Braces className="h-5 w-5 text-white" aria-hidden />,
  },
};

function PickIcon({ icon }: { icon: HomeStandoutIcon }) {
  const lucide = LUCIDE_ICON_BOXES[icon];
  if (lucide) {
    return (
      <div
        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${lucide.wrap}`}
      >
        {lucide.node}
      </div>
    );
  }
  return (
    <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
      <TechIcon name={icon} className="h-6 w-6" />
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
      className="py-14 sm:py-16 bg-gradient-to-b from-slate-50/90 to-white border-y border-slate-100"
    >
      <div className="w-full px-6 sm:px-12 lg:px-20">
        <div className="w-full min-w-0">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Highest-signal decks
            </p>
            <h2
              id="home-standouts-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3"
            >
              Top interview question sets to open first
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
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
                  className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <PickIcon icon={p.icon} />
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-[15px] font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors">
                        {p.headline}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 leading-snug line-clamp-3">
                        {p.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold tabular-nums text-slate-500">
                      {countLabel(p.questionCount)}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-indigo-600">
                      Open
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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
