import { AlertTriangle, Sparkles, Target } from "lucide-react";

interface InterviewerIntentProps {
  testing: string;
  commonMistake: string;
  toStandOut: string;
}

export function InterviewerIntentCard({
  testing,
  commonMistake,
  toStandOut,
}: InterviewerIntentProps) {
  if (!testing && !commonMistake && !toStandOut) return null;

  return (
    <section className="mb-6">
      <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/40 dark:bg-blue-500/10 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10">
          <Target className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            Coaching Notes
          </span>
        </div>
        <div className="px-5 py-4 divide-y divide-blue-100">
          {testing && (
            <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/20">
                <Target className="h-3 w-3 text-primary dark:text-primary" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-primary dark:text-primary uppercase tracking-wide mb-1">
                  What they&apos;re testing
                </p>
                <p className="text-[14px] text-foreground leading-[1.75]">
                  {testing}
                </p>
              </div>
            </div>
          )}
          {commonMistake && (
            <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/20">
                <AlertTriangle className="h-3 w-3 text-amber-500 dark:text-amber-400" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wide mb-1">
                  Common mistake
                </p>
                <p className="text-[14px] text-foreground leading-[1.75]">
                  {commonMistake}
                </p>
              </div>
            </div>
          )}
          {toStandOut && (
            <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/20">
                <Sparkles className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wide mb-1">
                  How to stand out
                </p>
                <p className="text-[14px] text-foreground leading-[1.75]">
                  {toStandOut}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
