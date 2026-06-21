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
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
          <p className="text-sm font-semibold text-slate-800">{directAnswer}</p>
        </div>
      )}

      {/* Overview */}
      {overview && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200">
            <GitBranch className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">How It Works</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Flow Diagram */}
      {flowDiagram && (
        <div className="rounded-xl border-2 border-slate-200 bg-slate-950 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700">
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Flow Diagram</span>
          </div>
          <div className="px-5 py-5 font-mono text-sm">
            <MarkdownContent content={flowDiagram.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Flow Steps / Deep Explanation */}
      {flowSteps && (
        <div className="rounded-xl border border-blue-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 border-b border-blue-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Step-by-Step Flow</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={flowSteps.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Key Rules */}
      {flowRules && (
        <div className="rounded-xl border border-purple-200 bg-purple-50/40 overflow-hidden">
          <div className="px-5 py-3 bg-purple-100/50 border-b border-purple-200">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wide">Key Rules to Remember</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={flowRules.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Failure Scenario */}
      {failureScenario && (
        <div className="rounded-xl border border-orange-200 bg-orange-50/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-orange-100/50 border-b border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">What Happens on Failure</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={failureScenario.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Code Example */}
      {codeExample && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-700">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Java Implementation</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={codeExample.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Interview Trap */}
      {interviewTrap && (
        <div className="rounded-xl border border-red-200 bg-red-50/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-red-100/50 border-b border-red-200">
            <Lightbulb className="h-4 w-4 text-red-600" />
            <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Common Interview Trap</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={interviewTrap.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Speakable */}
      {speakable && (
        <div className="rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 border-b-2 border-emerald-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Interview Answer</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={speakable.content.replace(/^#[^\n]*\n+/, '').trim()} />
          </div>
        </div>
      )}
    </div>
  );
}
