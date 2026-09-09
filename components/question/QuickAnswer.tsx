"use client";

import { Lightbulb } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";

interface QuickAnswerProps {
  keyPointsContent?: string;
  directAnswer?: string;
  legacyExpectation?: string;
}

function parseBullets(raw: string): string[] {
  const cleaned = raw.replace(/^#[^\n]*\n+/, "").trim();
  const lines = cleaned.split("\n");
  const bullets: string[] = [];
  let current = "";

  for (const line of lines) {
    if (/^[-*•]\s/.test(line.trim())) {
      if (current) bullets.push(current.trim());
      current = line.trim().replace(/^[-*•]\s+/, "");
    } else if (current && line.trim()) {
      current += ` ${line.trim()}`;
    }
  }

  if (current) bullets.push(current.trim());
  return bullets;
}

export function QuickAnswer({
  keyPointsContent,
  directAnswer,
  legacyExpectation,
}: QuickAnswerProps) {
  const supportingSource = keyPointsContent || legacyExpectation || "";
  const points = supportingSource ? parseBullets(supportingSource) : [];
  const fallbackBody = points.length === 0
    ? supportingSource.replace(/^#[^\n]*\n+/, "").trim()
    : "";

  if (!directAnswer?.trim() && points.length === 0 && !fallbackBody) return null;

  return (
    <section
      id="zone-quick"
      aria-labelledby="quick-revision-title"
      className="mb-6 scroll-mt-8"
      data-testid="quick-revision"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#e4dccd] bg-[#fffdf8] shadow-[0_6px_22px_rgba(92,69,25,0.045)] dark:border-slate-800 dark:bg-slate-950">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-300 to-blue-400" />

        <header className="border-b border-[#e8e0d3] bg-[linear-gradient(112deg,#fbf3e5_0%,#fbf8f1_56%,#f3f7f8_100%)] px-5 py-4 sm:px-7 dark:border-slate-800 dark:bg-none dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#decda9] bg-white/80 font-sans text-[10.5px] font-extrabold tabular-nums text-[#79591d] shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-amber-300">
              01
            </span>
            <Lightbulb aria-hidden="true" className="h-4 w-4 shrink-0 text-[#a46e12] dark:text-amber-300" />
            <div className="min-w-0">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#98702d] dark:text-amber-300">Fast recall</p>
              <h2 id="quick-revision-title" className="font-display text-[20px] font-bold tracking-[-0.016em] text-[#21384b] sm:text-[21px] dark:text-slate-100">
                Quick revision
              </h2>
            </div>
          </div>
        </header>

        <div className="px-5 py-5 sm:px-7 sm:py-6">
          {directAnswer?.trim() && (
            <div className="max-w-[76ch]">
              <p className="mb-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a692d] dark:text-amber-300">
                Core answer
              </p>
              <div className="font-sans text-[16.5px] font-medium leading-[1.65] tracking-[-0.002em] text-[#2c4354] [&_code]:!rounded-[3px] [&_code]:!border-0 [&_code]:!bg-[#eef2f3] [&_code]:!px-1 [&_code]:!py-[2px] [&_code]:!text-[#314b59] dark:text-slate-200 dark:[&_code]:!bg-slate-800 dark:[&_code]:!text-slate-200">
                <MarkdownContent content={directAnswer.trim()} inline />
              </div>
            </div>
          )}

          {points.length > 0 && (
            <ul className={`${directAnswer?.trim() ? "mt-5 border-t border-[#e8e1d6] pt-4 dark:border-slate-800" : ""} space-y-2.5`}>
              {points.map((point, index) => (
                <li key={`${point}-${index}`} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88928] dark:bg-amber-400" />
                  <div className="font-sans text-[15px] leading-[1.62] text-[#3f515e] [&_code]:!rounded-[3px] [&_code]:!border-0 [&_code]:!bg-[#eef2f3] [&_code]:!px-1 [&_code]:!py-[2px] [&_code]:!text-[#314b59] dark:text-slate-300 dark:[&_code]:!bg-slate-800 dark:[&_code]:!text-slate-200">
                    <MarkdownContent content={point} inline />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {fallbackBody && (
            <div className={`${directAnswer?.trim() ? "mt-5 border-t border-[#e8e1d6] pt-4 dark:border-slate-800" : ""} font-sans text-[15px] leading-[1.68] text-[#3f515e] dark:text-slate-300`}>
              <MarkdownContent content={fallbackBody} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
