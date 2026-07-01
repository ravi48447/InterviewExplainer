import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, BarChart2 } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title: "Data Analyst Interview Questions — SQL, Python, Case Studies | InterviewExplainer",
  description: "SQL coding rounds, Python pandas, A/B testing, data visualization, and case study interview questions for Data Analysts. Beginner to advanced.",
  alternates: { canonical: `${SITE_URL}/interview/data-analyst` },
};

const TOPIC_AREAS = [
  { name: "SQL Analytics", emoji: "🗄️", desc: "Window functions, CTEs, subqueries, query optimization, GROUP BY patterns" },
  { name: "Python for Data", emoji: "🐍", desc: "Pandas, NumPy, data cleaning, aggregations, exploratory analysis" },
  { name: "Statistics & A/B Testing", emoji: "📊", desc: "Hypothesis testing, p-values, confidence intervals, experiment design" },
  { name: "Data Visualization", emoji: "📈", desc: "Tableau, Power BI, chart choice, storytelling with data" },
  { name: "Business Metrics", emoji: "📋", desc: "KPIs, north star metrics, cohort analysis, funnel analysis, churn" },
  { name: "Case Studies", emoji: "💡", desc: "Open-ended: 'How would you measure X?' or 'Why is metric Y dropping?'" },
];

export default function DataAnalystHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/20 dark:from-background dark:to-background/50 dark:via-background/80">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/interview" className="hover:text-foreground">Interview Questions</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Data Analyst</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-100 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <BarChart2 className="h-3.5 w-3.5" /> Data Analyst Interview Prep
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">
            Data Analyst Interview Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            The complete prep resource nobody else provides for DA roles — SQL coding rounds, Python data analysis,
            A/B testing, business metric case studies, and behavioral questions. Coming soon.
          </p>
        </header>

        <div className="mb-8 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-5">
          <h2 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-2">💡 Why DA interviews are unique</h2>
          <p className="text-foreground text-sm leading-relaxed">
            Data Analyst interviews combine <strong>SQL technical rounds</strong> (think LeetCode but for SQL),
            <strong> business case questions</strong> ({"'"}How would you define a metric for X?{"'"}),
            and <strong>stat concepts</strong> (p-values, confidence intervals, experiment design).
            No existing platform covers all three well. We will.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TOPIC_AREAS.map(area => (
            <div key={area.name} className="rounded-xl border border-teal-200 dark:border-teal-500/20 bg-background p-5 opacity-70">
              <div className="text-2xl mb-3">{area.emoji}</div>
              <h3 className="font-black text-foreground mb-2">{area.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{area.desc}</p>
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
