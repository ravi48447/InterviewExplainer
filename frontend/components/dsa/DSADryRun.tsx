import type { DSADryRun } from "@/lib/contentV2-types";

/**
 * Renders a hand-traced "dry run" of an algorithm as a state table.
 *
 * In a real DSA round the candidate walks through the algorithm on
 * paper *before* writing code — this component renders that exact
 * artefact: input on top, step-by-step state table in the middle,
 * final result on bottom.
 *
 * Token-driven chrome: the figure rides on `bg-background` with a
 * hairline border, the header uses the primary accent, and the "note"
 * highlight + result bar use the success token so the trace reads as
 * part of the light learning-site system.
 */
export function DSADryRun({ run }: { run: DSADryRun }) {
  return (
    <figure className="my-4 rounded-lg border border-border/60 bg-background overflow-hidden">
      <figcaption className="px-4 py-2 bg-primary/5 border-b border-border/60 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Dry-run on paper
        </span>
        <code className="text-[11px] font-mono text-foreground bg-background border border-border/60 rounded px-2 py-0.5">
          {run.input}
        </code>
      </figcaption>

      {run.intro && (
        <p className="px-4 pt-3 text-[12.5px] text-muted-foreground leading-relaxed italic">
          {run.intro}
        </p>
      )}

      <div className="overflow-x-auto px-2 py-3">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-1.5 text-left font-bold w-[18%]">Step</th>
              <th className="px-3 py-1.5 text-left font-bold w-[40%]">
                What happens
              </th>
              <th className="px-3 py-1.5 text-left font-bold">State after</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {run.steps.map((s, i) => (
              <tr
                key={i}
                className={s.note ? "bg-success/5" : "hover:bg-hover"}
              >
                <td className="px-3 py-2 align-top">
                  <code className="font-mono text-foreground text-[11.5px]">
                    {s.step}
                  </code>
                </td>
                <td className="px-3 py-2 align-top text-foreground leading-relaxed">
                  {s.action}
                  {s.note && (
                    <div className="mt-1 text-[11px] text-success font-semibold flex items-start gap-1">
                      <span aria-hidden="true">→</span>
                      <span>{s.note}</span>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 align-top">
                  <code className="font-mono text-[11.5px] text-foreground bg-surface border border-border/60 rounded px-1.5 py-0.5 inline-block break-all">
                    {s.state}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 bg-success/10 border-t border-success/30 flex items-baseline gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest text-success">
          Result
        </span>
        <code className="font-mono text-[12px] text-foreground">{run.result}</code>
      </div>
    </figure>
  );
}
