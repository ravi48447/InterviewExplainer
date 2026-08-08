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
      <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-primary/20 bg-primary/10">
          <Target className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            Coaching Notes
          </span>
        </div>
        <div className="px-5 py-4 divide-y divide-border">
          {testing && (
            <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-3 w-3 text-primary" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-wide mb-1">
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
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning/10">
                <AlertTriangle className="h-3 w-3 text-warning" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-warning uppercase tracking-wide mb-1">
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
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10">
                <Sparkles className="h-3 w-3 text-success" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-success uppercase tracking-wide mb-1">
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
