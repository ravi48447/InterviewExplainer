"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, ArrowLeft, Circle, CheckCircle2, Layers, FolderOpen, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface StackEntry {
  slug: string;
  name: string;
  questionCount: number;
  questions: { slug: string; title: string }[];
}

interface ModuleGroup {
  moduleSlug: string;
  moduleName: string;
  stacks: StackEntry[];
}

interface V2ContentTreeNavProps {
  lang: string;
  track: string;
  level: string;
  activeStackSlug: string;
  activeQuestionSlug?: string;
}

function toDisplayName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function V2ContentTreeNav({
  lang, track, level, activeStackSlug, activeQuestionSlug,
}: V2ContentTreeNavProps) {
  const [modules, setModules] = useState<ModuleGroup[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedStacks, setExpandedStacks] = useState<Set<string>>(new Set([activeStackSlug]));

  useEffect(() => {
    fetch(`/api/v2/interview-nav?lang=${lang}&track=${track}&level=${level}`, {
      cache: 'no-store',
    })
      .then(r => r.ok ? r.json() : [])
      .then((data: unknown) => {
        // Guard: ensure we got the grouped format (ModuleGroup[]), not old flat format
        if (!Array.isArray(data) || data.length === 0) return;
        const isGrouped = 'moduleSlug' in (data[0] as object);
        if (!isGrouped) return;
        const groups = data as ModuleGroup[];
        setModules(groups);
        const activeModule = groups.find(m =>
          (m.stacks ?? []).some(s => s.slug === activeStackSlug)
        );
        if (activeModule) {
          setExpandedModules(new Set([activeModule.moduleSlug]));
        }
      })
      .catch(() => {});
  }, [lang, track, level, activeStackSlug]);

  const toggleModule = (slug: string) => {
    setExpandedModules(prev => {
      const n = new Set(prev);
      n.has(slug) ? n.delete(slug) : n.add(slug);
      return n;
    });
  };

  const toggleStack = (slug: string) => {
    setExpandedStacks(prev => {
      const n = new Set(prev);
      n.has(slug) ? n.delete(slug) : n.add(slug);
      return n;
    });
  };

  const basePath = `/interview/${lang}/${track}/${level}`;

  // Flat layout: single module with empty moduleName → no module headers
  const isFlatLayout = modules.length === 1 && modules[0].moduleSlug === '__flat__';

  return (
    <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-border">
        <Link
          href={basePath}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          {toDisplayName(lang)} {toDisplayName(track)}
        </Link>
      </div>

      <div className="p-2 max-h-[calc(100vh-120px)] overflow-y-auto">
        {modules.length === 0 && (
          <div className="px-3 py-6 text-[11px] text-slate-400 text-center animate-pulse">Loading...</div>
        )}

        {isFlatLayout
          ? renderStacks(modules[0].stacks ?? [])
          : modules.map(mod => {
              const stacks = mod.stacks ?? [];
              const isModuleExpanded = expandedModules.has(mod.moduleSlug);
              const moduleHasActive = stacks.some(s => s.slug === activeStackSlug);
              const totalQuestions = stacks.reduce((sum, s) => sum + s.questionCount, 0);

              return (
                <div key={mod.moduleSlug} className="mb-1">
                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(mod.moduleSlug)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors",
                      moduleHasActive
                        ? "text-blue-700 bg-blue-50/60"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface"
                    )}
                  >
                    {isModuleExpanded
                      ? <FolderOpen className={cn("h-3.5 w-3.5 shrink-0", moduleHasActive ? "text-blue-500" : "text-slate-400")} />
                      : <Folder className={cn("h-3.5 w-3.5 shrink-0", moduleHasActive ? "text-blue-500" : "text-slate-400")} />
                    }
                    <span className="flex-1 text-left truncate">{mod.moduleName}</span>
                    <span className={cn(
                      "text-[9px] font-bold shrink-0",
                      moduleHasActive ? "text-blue-500" : "text-slate-400"
                    )}>
                      {totalQuestions}
                    </span>
                    {isModuleExpanded
                      ? <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
                      : <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                    }
                  </button>

                  {/* Stacks inside module */}
                  {isModuleExpanded && (
                    <div className="ml-2 pl-2 border-l-2 border-slate-100 mb-1">
                      {renderStacks(stacks)}
                    </div>
                  )}
                </div>
              );
            })
        }
      </div>
    </div>
  );

  function renderStacks(stacks: StackEntry[]) {
    return <>{stacks.map(stack => {
      const isActive = stack.slug === activeStackSlug;
      const isExpanded = expandedStacks.has(stack.slug);

      return (
        <div key={stack.slug} className={cn("rounded-lg transition-colors mb-0.5", isActive && "bg-blue-50/50")}>
          <button
            onClick={() => toggleStack(stack.slug)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors",
              isActive
                ? "text-blue-700 font-bold"
                : "text-secondary hover:text-foreground hover:bg-surface font-medium"
            )}
          >
            <Layers className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-blue-500" : "text-slate-400")} />
            <span className="flex-1 text-left truncate text-[11px]">{stack.name}</span>
            <span className={cn(
              "text-[10px] shrink-0 px-1.5 py-0.5 rounded font-bold",
              isActive ? "bg-blue-100 text-blue-600" : "text-slate-400"
            )}>
              {stack.questionCount}
            </span>
            {isExpanded
              ? <ChevronDown className="h-3 w-3 shrink-0 text-slate-400" />
              : <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
            }
          </button>

          {isExpanded && (
            <div className="ml-4 pl-3 border-l-2 border-slate-100 mb-1 space-y-0.5">
              {stack.questions.map((q, idx) => {
                const isActiveQ = q.slug === activeQuestionSlug;
                return (
                  <Link
                    key={`${idx}-${q.slug}`}
                    href={`${basePath}/${stack.slug}/${q.slug}`}
                    className={cn(
                      "flex items-start gap-2 pl-2 pr-2 py-1.5 text-[11px] rounded-lg transition-all",
                      isActiveQ
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-primary-foreground dark:text-foreground font-medium shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface"
                    )}
                  >
                    <span className={cn("shrink-0 mt-0.5", isActiveQ ? "text-blue-200" : "text-slate-300")}>
                      {isActiveQ ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                    </span>
                    <span className="leading-snug line-clamp-2">{q.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    })}</>;
  }
}