"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity, Blocks, BookOpen, Braces, ChevronDown, Cloud, Container, Database,
  FlaskConical, Layers3, Leaf, MessagesSquare, Network, ShieldCheck, Workflow,
  CircleCheck, Clock3, ArrowRight,
} from "lucide-react";
import type { DomainCategory, TechStack } from "@/lib/api";
import { cn } from "@/lib/utils";

type PillarPresentation = { Icon: LucideIcon; blurb: string };

const THEMES = [
  { accent: "#1e7af2", soft: "#eef6ff", border: "#b8d7ff", module: "bg-blue-50 text-blue-700" },
  { accent: "#20a464", soft: "#effbf4", border: "#bce9cf", module: "bg-emerald-50 text-emerald-700" },
  { accent: "#7357d7", soft: "#f4f1ff", border: "#d7ccff", module: "bg-violet-50 text-violet-700" },
  { accent: "#ed7900", soft: "#fff5e9", border: "#ffd4a6", module: "bg-orange-50 text-orange-700" },
  { accent: "#169b9a", soft: "#ecfbfa", border: "#b8e9e7", module: "bg-teal-50 text-teal-700" },
  { accent: "#e45842", soft: "#fff1ee", border: "#ffc9bf", module: "bg-rose-50 text-rose-700" },
] as const;

function getPillarPresentation(name: string): PillarPresentation {
  const value = name.toLowerCase();
  if (value.includes("interview")) return { Icon: MessagesSquare, blurb: "Turn technical depth into clear interview answers." };
  if (value.includes("production")) return { Icon: Activity, blurb: "Observe, operate and recover production systems." };
  if (value.includes("cloud")) return { Icon: Cloud, blurb: "Deploy and scale across modern cloud platforms." };
  if (value.includes("devops")) return { Icon: Container, blurb: "Build and automate reliable delivery pipelines." };
  if (value.includes("testing")) return { Icon: FlaskConical, blurb: "Prove correctness with focused quality practices." };
  if (value.includes("security")) return { Icon: ShieldCheck, blurb: "Protect identities, APIs and system boundaries." };
  if (value.includes("system design")) return { Icon: Workflow, blurb: "Reason through scale, trade-offs and system cases." };
  if (value.includes("architecture")) return { Icon: Blocks, blurb: "Shape maintainable services with sound patterns." };
  if (value.includes("api") || value.includes("messaging") || value.includes("microservice")) return { Icon: Network, blurb: "Connect services through APIs, events and messaging." };
  if (value.includes("data") || value.includes("persistence")) return { Icon: Database, blurb: "Model, query and persist data confidently." };
  if (value.includes("spring")) return { Icon: Leaf, blurb: "Master Spring from dependency injection to security." };
  if (value.includes("java") || value.includes("language") || value.includes("core")) return { Icon: Braces, blurb: "Build depth in Java, OOP, collections and runtime." };
  return { Icon: Layers3, blurb: "Learn the concepts and decisions in this stage." };
}

export function PillarCurveCard({
  cat, index, side, domainSlug, stacks, expanded, disabled, filterActive, onToggle,
}: {
  cat: DomainCategory;
  index: number;
  side: "left" | "right";
  domainSlug: string;
  stacks: TechStack[];
  expanded: boolean;
  disabled: boolean;
  filterActive: boolean;
  onToggle: () => void;
  variant?: "standard" | "premium";
}) {
  const totalQuestions = stacks.reduce((sum, stack) => sum + stack.questionCount, 0);
  const allQuestions = cat.stacks.reduce((sum, stack) => sum + stack.questionCount, 0);
  const { Icon, blurb } = getPillarPresentation(cat.name);
  const theme = THEMES[index % THEMES.length];

  return (
    <article className={cn("group/station relative min-w-0", disabled && "pointer-events-none opacity-40")}>
      <div
        className={cn(
          "relative overflow-visible transition-all duration-300",
          expanded
            ? "rounded-[14px] border ring-2 ring-white/90 shadow-[0_26px_60px_-26px_rgba(15,35,70,.58)]"
            : "rounded-[10px] border border-transparent hover:-translate-y-1",
        )}
        style={{
          borderColor: expanded ? theme.accent : "transparent",
          background: expanded
            ? `linear-gradient(138deg, #ffffff 0%, #ffffff 58%, ${theme.soft} 100%)`
            : "transparent",
        }}
      >
        {expanded ? <span
          className="pointer-events-none absolute inset-y-3 left-0 w-[3px] rounded-r-full opacity-90"
          style={{ backgroundColor: theme.accent }}
          aria-hidden
        /> : null}
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          aria-expanded={expanded}
          className={cn(
            "relative flex w-full items-center gap-2.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-blue-100",
            expanded ? "min-h-[84px] px-3 py-2.5 focus-visible:ring-inset" : "min-h-[72px] rounded-[12px] px-1 py-1.5",
            side === "left" && "flex-row-reverse text-right",
          )}
        >
          <span
            className={cn("relative flex shrink-0 items-center justify-center rounded-full border-white text-white", expanded ? "h-12 w-12 border-[4px]" : "h-14 w-14 border-[5px] ring-1 ring-white")}
            style={{ background: `linear-gradient(145deg, ${theme.accent}, color-mix(in srgb, ${theme.accent} 72%, #0f2346))`, boxShadow: `0 12px 26px -10px ${theme.accent}` }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#0f2346] px-1 text-[9px] font-bold text-white">
              {index + 1}
            </span>
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: theme.accent }}>Pillar {String(index + 1).padStart(2, "0")}</span>
            <span className={cn("mt-0.5 block font-semibold leading-snug tracking-[-0.015em] text-[#0f2346]", expanded ? "text-[13px]" : "text-[14px]")}>{cat.name}</span>
            {expanded ? <span className="mt-0.5 block line-clamp-1 text-[9px] leading-4 text-[#71839b]">{blurb}</span> : null}
            <span className={cn("mt-1 flex flex-wrap items-center gap-2 text-[9px] font-semibold text-[#60738f]", side === "left" && "justify-end")}>
              <span>{cat.stacks.length} modules</span><span className="h-1 w-1 rounded-full bg-[#b8c6d8]" /><span>{allQuestions} questions</span>
            </span>
          </span>

          <span className={cn("flex shrink-0 items-center justify-center rounded-full border bg-white shadow-sm", expanded ? "h-7 w-7" : "h-6 w-6")} style={{ borderColor: theme.accent, color: theme.accent }}>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", expanded && "rotate-180")} />
          </span>
        </button>

        {!expanded && stacks.length > 0 ? (
          <div
            className={cn(
              "pointer-events-none absolute top-[94px] z-30 hidden w-48 translate-y-2 rounded-[11px] border bg-white/95 p-3 opacity-0 shadow-[0_18px_42px_-24px_rgba(15,35,70,.5)] backdrop-blur-md transition-all duration-200 group-hover/station:translate-y-0 group-hover/station:opacity-100 xl:block",
              side === "right" ? "left-4" : "right-4",
            )}
            style={{ borderColor: theme.border }}
          >
            <div className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>Quick preview</div>
            <ul className="mt-2 space-y-1.5">
              {stacks.slice(0, 3).map((stack) => <li key={stack.id} className="truncate text-[10px] font-medium text-[#334a68]">• {stack.name}</li>)}
            </ul>
            {stacks.length > 3 ? <div className="mt-2 text-[9px] text-[#8292a8]">+ {stacks.length - 3} more modules</div> : null}
          </div>
        ) : null}

        <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="min-h-0 overflow-hidden">
            <div className="border-t bg-[#f7f9fc]/95 p-4 sm:p-5" style={{ borderColor: theme.border }}>
              {stacks.length === 0 ? (
                <p className="rounded-[10px] border border-dashed border-[#c9d8ea] bg-white px-3 py-6 text-center text-xs text-[#60738f]">No modules match your search.</p>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div><div className="flex items-center gap-2 text-[10px] font-bold text-[#0f2346]"><CircleCheck className="h-3.5 w-3.5" style={{ color: theme.accent }} /> Why interviewers ask this</div><p className="mt-1 max-w-[420px] text-[9px] leading-4 text-[#60738f]">Connect implementation details to trade-offs, explain the decision clearly, and handle the follow-up.</p></div>
                    <span className="shrink-0 rounded-md px-2 py-1 text-[8px] font-bold" style={{color:theme.accent,backgroundColor:theme.soft}}>{stacks.length} modules</span>
                  </div>
                  <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {stacks.slice(0, 6).map((stack, moduleIndex) => (
                      <li key={stack.id}>
                        <Link href={`/${domainSlug}/${stack.slug}`} className="group/module flex min-h-[58px] items-start gap-2 rounded-[8px] border border-[#dce5ef] bg-white p-2 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm">
                          <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[8px] font-bold", theme.module)}>{moduleIndex + 1}</span>
                          <span className="min-w-0 flex-1"><span className="block line-clamp-2 text-[9px] font-semibold leading-3.5 text-[#213a5b] group-hover/module:text-[#1e7af2]">{stack.name}</span><span className="mt-1 flex items-center gap-1 text-[8px] text-[#8292a8]"><Clock3 className="h-2.5 w-2.5" />{stack.questionCount} questions</span></span>
                          <CircleCheck className="h-3 w-3 shrink-0 text-emerald-500" />
                        </Link>
                      </li>
                    ))}
                  </ol>
                  {stacks.length > 6 ? <div className="mt-2 text-[8px] text-[#71839b]">+ {stacks.length - 6} more modules in this pillar</div> : null}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dfe8f2]"><div className="h-full w-[18%] rounded-full" style={{ backgroundColor: theme.accent }} /></div>
                <span className="text-[9px] font-semibold text-[#71839b]">{filterActive ? `${totalQuestions} matching` : `${allQuestions} questions`}</span>
                {stacks[0] ? <Link href={`/${domainSlug}/${stacks[0].slug}`} className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[10px] font-bold text-white" style={{ backgroundColor: theme.accent }}>Continue <ArrowRight className="h-3 w-3" /></Link> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
