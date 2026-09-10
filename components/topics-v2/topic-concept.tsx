/**
 * Phase 13 — Topics V2 concept detail component.
 *
 * Server component rendering /topics/:concept. Hoisted from
 * app/topics/[concept]/page.tsx — pure presentational composition over the
 * canonical lib/topics data layer.
 */

import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import type { TopicConceptPageData } from "@/lib/topics";
import { topicToTitle, trackHref } from "@/lib/topics";

export function TopicConcept({ data }: { data: TopicConceptPageData }) {
  const { concept, name, meta } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-blue-50/20 dark:via-blue-950/40  ">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/topics" className="hover:text-foreground">Topics</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">{name}</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            Concept Hub · Cross-Language
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">{name}</h1>
          {meta?.desc && <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{meta.desc}</p>}
        </header>

        {meta?.tracks && meta.tracks.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-black text-foreground mb-5">Interview Questions by Track</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {meta.tracks.map((t) => (
                <Link
                  key={`${t.lang}-${t.track}-${t.level}-${t.stack}`}
                  href={trackHref(t)}
                  className="group flex items-center gap-4 p-4 bg-background rounded-xl border border-border hover:border-blue-400 dark:border-blue-700 hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <div className="text-sm font-black text-foreground group-hover:text-blue-600 dark:text-blue-400 transition-colors">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{topicToTitle(t.lang)} · {topicToTitle(t.level)}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-400 dark:text-blue-300 shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {meta?.tools && meta.tools.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-black text-foreground mb-4">Relevant Tools</h2>
            <div className="flex flex-wrap gap-2">
              {meta.tools.map((t) => (
                <Link
                  key={t}
                  href={`/tools/${t}`}
                  className="px-4 py-2 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-500/20 rounded-lg text-sm font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:bg-teal-950/20 transition-colors capitalize"
                >
                  {t.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </section>
        )}

        {meta?.comparisons && meta.comparisons.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-black text-foreground mb-4">Common Comparisons</h2>
            <div className="flex flex-wrap gap-2">
              {meta.comparisons.map((c) => (
                <Link
                  key={c}
                  href={`/compare/${c}`}
                  className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:border-default dark:border-default hover:text-primary dark:text-primary transition-all"
                >
                  {c.replace(/-vs-/g, " vs ").replace(/-/g, " ")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {!meta && (
          <div className="rounded-2xl border border-border bg-background p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-black text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground text-sm">{name} questions are being added. <Link href="/interview" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Browse all questions →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
