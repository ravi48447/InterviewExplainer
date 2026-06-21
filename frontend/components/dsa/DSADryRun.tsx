import type { DSADryRun } from "@/lib/contentV2-types";

/**
 * Renders a hand-traced "dry run" of an algorithm as a state table.
 *
 * In a real DSA round the candidate walks through the algorithm on
 * paper *before* writing code — this component renders that exact
 * artefact: input on top, step-by-step state table in the middle,
 * final result on bottom.
 *
 * Designed to sit between an approach's plan/insight prose and the
 * code block, mirroring the "explain → trace → code" interview flow.
 */
export function DSADryRun({ run }: { run: DSADryRun }) {
  return (
    <figure className="my-4 rounded-lg border border-indigo-200 bg-white overflow-hidden">
      <figcaption className="px-4 py-2 bg-indigo-50 border-b border-indigo-200 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">
          Dry-run on paper
        </span>
        <code className="text-[11px] font-mono text-slate-700 bg-white border border-indigo-100 rounded px-2 py-0.5">
          {run.input}
        </code>
      </figcaption>

      {run.intro && (
        <p className="px-4 pt-3 text-[12.5px] text-slate-600 leading-relaxed italic">
          {run.intro}
        </p>
      )}

      <div className="overflow-x-auto px-2 py-3">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500">
              <th className="px-3 py-1.5 text-left font-bold w-[18%]">Step</th>
              <th className="px-3 py-1.5 text-left font-bold w-[40%]">
                What happens
              </th>
              <th className="px-3 py-1.5 text-left font-bold">State after</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {run.steps.map((s, i) => (
              <tr
                key={i}
                className={s.note ? "bg-emerald-50/50" : "hover:bg-slate-50/50"}
              >
                <td className="px-3 py-2 align-top">
                  <code className="font-mono text-slate-800 text-[11.5px]">
                    {s.step}
                  </code>
                </td>
                <td className="px-3 py-2 align-top text-slate-700 leading-relaxed">
                  {s.action}
                  {s.note && (
                    <div className="mt-1 text-[11px] text-emerald-700 font-semibold flex items-start gap-1">
                      <span aria-hidden="true">→</span>
                      <span>{s.note}</span>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 align-top">
                  <code className="font-mono text-[11.5px] text-slate-700 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 inline-block break-all">
                    {s.state}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 bg-emerald-50 border-t border-emerald-200 flex items-baseline gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
          Result
        </span>
        <code className="font-mono text-[12px] text-slate-800">
          {run.result}
        </code>
      </div>
    </figure>
  );
}
