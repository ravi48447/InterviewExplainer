/**
 * Layout 11: FLOW DIAGRAM
 * For: Kafka consumer groups, event-driven flows, async processing, pub/sub
 * Sections: flow_diagram, flow_rules, failure_scenario, interview_trap
 */
import { ArrowRight, GitBranch, AlertTriangle, Lightbulb } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import type { AnswerSection } from "@/lib/api";

interface FlowDiagramLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function FlowDiagramLayout({
  title,
  sections,
  directAnswer,
}: FlowDiagramLayoutProps) {
  const overview          = sections.find(s => s.sectionType === 'overview' || s.sectionType === 'core_concepts');
  const flowDiagram       = sections.find(s => s.sectionType === 'flow_diagram' || s.sectionType === 'diagram');
  const flowSteps         = sections.find(s => s.sectionType === 'flow_steps' || s.sectionType === 'deep_explanation');
  const flowRules         = sections.find(s => s.sectionType === 'flow_rules' || s.sectionType === 'important_points');
  const failureScenario   = sections.find(s => s.sectionType === 'failure_scenario' || s.sectionType === 'scenario_based');
  const interviewTrap     = sections.find(s => s.sectionType === 'interview_trap' || s.sectionType === 'common_mistakes');
  const codeExample       = sections.find(s => s.sectionType === 'code_example');
  const speakable         = sections.find(s => s.sectionType === 'speakable_answer');

  return (
    <div className="space-y-8">
      {directAnswer && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 dark:from-background dark:to-background/50">
          <p className="text-sm font-semibold text-foreground">{directAnswer}</p>
        </div>
      )}

      {/* Overview */}
      {overview && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-surface border-b border-border">
            <GitBranch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">How It Works</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Flow Diagram */}
      {flowDiagram && (
        <div className="rounded-xl border-2 border-border bg-slate-950 dark:bg-slate-800 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Flow Diagram</span>
          </div>
          <div className="px-5 py-5 font-mono text-sm">
            <MarkdownContent content={flowDiagram.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Flow Steps / Deep Explanation */}
      {flowSteps && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-blue-200 dark:border-blue-500/20">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Step-by-Step Flow</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={flowSteps.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Key Rules */}
      {flowRules && (
        <div className="rounded-xl border border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-950/20/40 overflow-hidden">
          <div className="px-5 py-3 bg-purple-100 dark:bg-purple-950/20/50 border-b border-purple-200 dark:border-purple-500/20">
            <span className="text-xs font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wide">Key Rules to Remember</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={flowRules.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Failure Scenario */}
      {failureScenario && (
        <div className="rounded-xl border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/10 dark:bg-orange-950/20/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-orange-100 dark:bg-orange-950/20/50 border-b border-orange-200 dark:border-orange-500/20">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wide">What Happens on Failure</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={failureScenario.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Code Example */}
      {codeExample && (
        <div className="rounded-xl border border-border dark:bg-surface overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Java Implementation</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={codeExample.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Interview Trap */}
      {interviewTrap && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 dark:bg-red-950/20/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-red-100 dark:bg-red-950/20/50 border-b border-red-200 dark:border-red-500/20">
            <Lightbulb className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">Common Interview Trap</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={interviewTrap.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Speakable */}
      {speakable && (
        <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-500/30 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 dark:bg-emerald-900/30 border-b-2 border-emerald-200 dark:border-emerald-500/20 dark:border-emerald-800/60">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Interview Answer</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={speakable.content.replace(/^#[^\n]*\n+/, '').trim()} />
          </div>
        </div>
      )}
    </div>
  );
}
