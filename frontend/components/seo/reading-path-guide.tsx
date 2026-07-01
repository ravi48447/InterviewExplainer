import Link from "next/link";
import { BookOpenCheck, ListOrdered, MousePointerClick } from "lucide-react";

/** On-module guide: linear read path + anchors into the catalog. */
export function ModuleReadingPathGuide({
  moduleTitle,
  totalQuestions,
  seoSlug,
  firstQuestionSlug,
}: {
  moduleTitle: string;
  totalQuestions: number;
  seoSlug: string;
  firstQuestionSlug: string;
}) {
  return (
    <section
      id="reading-path"
      aria-labelledby="reading-path-heading"
      className="mb-8 scroll-mt-24 rounded-2xl border border-border/90 bg-gradient-to-br from-white via-slate-50/80 to-blue-50/30 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 p-5 sm:p-6 shadow-sm ring-1 ring-slate-900/[0.03]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p
            id="reading-path-heading"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-2"
          >
            Suggested path
          </p>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2">
            Read {moduleTitle} from question 1 to {totalQuestions}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Topics follow a teaching order. Each answer ends with a clear{" "}
            <strong className="text-foreground">Next question</strong> control so
            you can move forward without hunting the list.
          </p>
          <ol className="mt-4 space-y-2.5 text-sm text-foreground">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-800 text-[11px] font-bold text-white">
                1
              </span>
              <span className="pt-0.5 leading-snug">
                <span className="font-semibold text-foreground">Start</span> with
                question 1 — it sets up the rest of the module.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-foreground">
                2
              </span>
              <span className="pt-0.5 leading-snug">
                Use <strong className="text-foreground">Continue · Next question</strong>{" "}
                at the bottom of every page (and the arrows in the sticky bar when
                you scroll).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-foreground">
                3
              </span>
              <span className="pt-0.5 leading-snug">
                Jump to any topic in the{" "}
                <a
                  href="#all-questions"
                  className="font-semibold text-indigo-700 dark:text-indigo-400 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-900 dark:text-indigo-400"
                >
                  full catalog
                </a>{" "}
                — every row is numbered in reading order (Q1–Q{totalQuestions}).
              </span>
            </li>
          </ol>
        </div>
        <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto sm:min-w-[200px]">
          <Link
            href={`/${seoSlug}/${firstQuestionSlug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 dark:bg-indigo-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-900/15 hover:bg-indigo-700 dark:bg-indigo-800 transition-colors"
          >
            <BookOpenCheck className="h-4 w-4 shrink-0" aria-hidden />
            Open question 1
          </Link>
          <Link
            href={`/${seoSlug}#q-${firstQuestionSlug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:bg-indigo-500/10 dark:bg-indigo-950/20/60 transition-colors"
          >
            <ListOrdered className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            Jump to Q1 in list
          </Link>
          <a
            href="#all-questions"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-background/80 transition-colors"
          >
            <MousePointerClick className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Scroll to full catalog
          </a>
        </div>
      </div>
    </section>
  );
}

/** Pillar hub: orient visitors across multiple modules. */
export function PillarReadingPathGuide({
  topicNoun,
  firstModuleSeoSlug,
  firstQuestionSlug,
  moduleCount,
}: {
  topicNoun: string;
  firstModuleSeoSlug: string;
  firstQuestionSlug: string;
  moduleCount: number;
}) {
  return (
    <section
      id="reading-path"
      aria-labelledby="pillar-reading-path-heading"
      className="mb-8 scroll-mt-24 rounded-2xl border border-border/90 bg-gradient-to-br from-white via-slate-50/80 to-indigo-50/25 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 p-5 sm:p-6 shadow-sm ring-1 ring-slate-900/[0.03]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p
            id="pillar-reading-path-heading"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-2"
          >
            How to use this hub
          </p>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-2">
            Work module by module — then read Q1 to the end in each
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {moduleCount} modules cover {topicNoun.toLowerCase()} end-to-end. Open
            the first module, use <strong className="text-foreground">Open question 1</strong>{" "}
            on its landing page, and use <strong className="text-foreground">Next</strong>{" "}
            at the bottom of each answer to stay in order.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0 w-full lg:w-auto">
          <Link
            href={`/${firstModuleSeoSlug}/${firstQuestionSlug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 dark:bg-indigo-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-900/15 hover:bg-indigo-700 dark:bg-indigo-800 transition-colors whitespace-nowrap"
          >
            <BookOpenCheck className="h-4 w-4 shrink-0" aria-hidden />
            Start with the first question
          </Link>
          <a
            href="#all-modules"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:bg-indigo-500/10 dark:bg-indigo-950/20/60 transition-colors"
          >
            <ListOrdered className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            Jump to all modules
          </a>
        </div>
      </div>
    </section>
  );
}
