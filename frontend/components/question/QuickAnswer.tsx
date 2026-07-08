"use client";

import { Lightbulb } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { useContentTheme } from "./ThemeContext";

interface QuickAnswerProps {
  keyPointsContent?: string;
  directAnswer?: string;
  legacyExpectation?: string;
}

function parseBullets(raw: string): string[] {
  const cleaned = raw.replace(/^#[^\n]*\n+/, "").trim();
  const lines = cleaned.split(/\n/);
  const bullets: string[] = [];
  let current = "";
  for (const line of lines) {
    if (/^[-*•]\s/.test(line.trim())) {
      if (current) bullets.push(current.trim());
      current = line.trim().replace(/^[-*•]\s+/, "");
    } else if (current && line.trim()) {
      current += " " + line.trim();
    }
  }
  if (current) bullets.push(current.trim());
  return bullets;
}

function NutshellCard({ children }: { children: React.ReactNode }) {
  const { theme } = useContentTheme();
  const d = theme === "dark";

  return (
    <section className="mb-6">
      <div
        className={`rounded-xl overflow-hidden shadow-md ${
          d
            ? "border border-default dark:border-default/50 bg-[#1a1408] shadow-black/40"
            : "border border-default dark:border-default/20/80 bg-amber-50/70 dark:bg-amber-500/10 shadow-sm"
        }`}
      >
        <div
          className={`flex items-center gap-2 px-5 py-2.5 border-b ${
            d
              ? "border-default dark:border-default/50 bg-amber-900 dark:bg-amber-800/30"
              : "border-default dark:border-default/20/60 bg-amber-100 dark:bg-amber-950/20/50"
          }`}
        >
          <Lightbulb className={`h-3.5 w-3.5 ${d ? "text-amber-600" : "text-amber-600 dark:text-amber-400"}`} />
          <span
            className={`text-[11px] font-bold uppercase tracking-widest ${
              d ? "text-amber-700" : "text-amber-700 dark:text-amber-400"
            }`}
          >
            In a nutshell
          </span>
          <span
            className={`ml-auto text-[11px] font-medium ${
              d ? "text-amber-500" : "text-amber-600 dark:text-amber-400"
            }`}
          >
            Quick revision
          </span>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </section>
  );
}

export function QuickAnswer({
  keyPointsContent,
  directAnswer,
  legacyExpectation,
}: QuickAnswerProps) {
  const { theme } = useContentTheme();
  const d = theme === "dark";

  if (!keyPointsContent && !directAnswer && !legacyExpectation) return null;

  const source = keyPointsContent || legacyExpectation;

  if (source) {
    const bullets = parseBullets(source);

    if (bullets.length > 0) {
      return (
        <NutshellCard>
          <ul className="space-y-3">
            {bullets.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`mt-[8px] h-1.5 w-1.5 rounded-full shrink-0 ${
                    d ? "bg-amber-500 dark:bg-amber-800" : "bg-amber-600 dark:bg-amber-800"
                  }`}
                />
                <span
                  className={`text-[15.5px] leading-[1.7] ${
                    d ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  <MarkdownContent content={point} inline />
                </span>
              </li>
            ))}
          </ul>
        </NutshellCard>
      );
    }

    const body = source.replace(/^#[^\n]*\n+/, "").trim();
    return (
      <NutshellCard>
        <div
          className={`text-[15.5px] leading-[1.7] ${
            d ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          <MarkdownContent content={body} />
        </div>
      </NutshellCard>
    );
  }

  if (directAnswer) {
    const sentences = directAnswer
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 10)
      .slice(0, 4);

    if (sentences.length > 0) {
      return (
        <NutshellCard>
          <ul className="space-y-3">
            {sentences.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`mt-[8px] h-1.5 w-1.5 rounded-full shrink-0 ${
                    d ? "bg-amber-500 dark:bg-amber-800" : "bg-amber-600 dark:bg-amber-800"
                  }`}
                />
                <span
                  className={`text-[15.5px] leading-[1.7] ${
                    d ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {point.trim()}
                </span>
              </li>
            ))}
          </ul>
        </NutshellCard>
      );
    }
  }

  return null;
}
