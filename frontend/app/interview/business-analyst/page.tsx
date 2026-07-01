import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Briefcase } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title: "Business Analyst Interview Questions — Requirements, SQL, Case Studies | InterviewExplainer",
  description: "Business Analyst interview prep: requirements gathering, stakeholder management, SQL basics, Agile/JIRA, process mapping, and STAR behavioral questions.",
  alternates: { canonical: `${SITE_URL}/interview/business-analyst` },
};

const TOPICS = [
  { name: "Requirements Gathering", emoji: "📝", desc: "User stories, acceptance criteria, BRDs, stakeholder interviews, scope definition" },
  { name: "Stakeholder Management", emoji: "🤝", desc: "Managing conflicting priorities, communication plans, executive presentations" },
  { name: "Process Mapping", emoji: "🔄", desc: "As-is vs to-be, swimlane diagrams, BPMN, process improvement, Lean/Six Sigma basics" },
  { name: "SQL for BAs", emoji: "🗄️", desc: "Basic queries, JOINs, aggregations, report generation — enough to talk to engineers and pull data" },
  { name: "Agile & JIRA", emoji: "⚡", desc: "Sprint ceremonies, backlog grooming, user story writing, velocity tracking, Kanban vs Scrum" },
  { name: "Case Studies & Behavioral", emoji: "💬", desc: "STAR method, 'Tell me about a time you prioritized competing requirements', product sense questions" },
];

export default function BusinessAnalystPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-amber-50/20 dark:via-amber-950/40 to-yellow-50/20 dark:to-yellow-950/40  ">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/interview" className="hover:text-foreground">Interview Questions</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Business Analyst</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <Briefcase className="h-3.5 w-3.5" /> Business Analyst Interview Prep
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">
            Business Analyst Interview Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Requirements gathering, stakeholder management, Agile, SQL basics, process mapping,
            and STAR behavioral questions — the complete BA prep guide. Coming soon.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TOPICS.map(topic => (
            <div key={topic.name} className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-background p-5 opacity-70">
              <div className="text-2xl mb-3">{topic.emoji}</div>
              <h3 className="font-black text-foreground mb-2">{topic.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{topic.desc}</p>
              <div className="mt-3 text-[10px] font-bold px-2 py-1 bg-surface text-muted-foreground rounded-full inline-block">Coming Soon</div>
            </div>
          ))}
        </div>

        <Link href="/interview" className="px-4 py-2 dark:bg-surface text-white rounded-lg text-sm font-bold hover:bg-slate-700 dark:bg-slate-800 transition-colors">
          ← Browse All Roles
        </Link>
      </div>
    </div>
  );
}
