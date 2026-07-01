import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Code2, BookOpen, Users, Target, Brain } from "lucide-react";
import fs from "fs";
import path from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const COMPANIES_ROOT = path.join(process.cwd(), "..", "content", "companies");

const TYPE_META: Record<string, { label: string; icon: typeof Code2; desc: string }> = {
  overview:      { label: "Interview Overview",    icon: BookOpen, desc: "Process breakdown, what to expect, timeline" },
  dsa:           { label: "DSA Preparation",       icon: Code2,    desc: "Patterns tested, problem list, approach guide" },
  "system-design": { label: "System Design",       icon: Target,   desc: "Real SD questions asked, how to approach" },
  behavioral:    { label: "Behavioral Questions",  icon: Users,    desc: "Culture-fit, leadership, past experience" },
  "java-backend":  { label: "Java Backend",        icon: Code2,    desc: "Java-specific questions this company asks" },
  "python-backend":{ label: "Python Backend",      icon: Code2,    desc: "Python-specific questions this company asks" },
  "react-specific":{ label: "React / Frontend",    icon: Brain,    desc: "React, TypeScript, browser questions" },
  "azure-specific":{ label: "Azure / Cloud",       icon: Target,   desc: "Azure-specific questions and scenarios" },
  "coding-rounds": { label: "Coding Rounds",       icon: Code2,    desc: "What each coding round looks like" },
  "seed-stage":  { label: "Seed Stage Startups",   icon: Users,    desc: "Early-stage interview expectations" },
  "series-a":    { label: "Series A Startups",     icon: Users,    desc: "Series A interview expectations" },
  "series-b-plus":{ label: "Series B+ Startups",  icon: Users,    desc: "Growth-stage interview expectations" },
};

const COMPANY_NAMES: Record<string, string> = {
  amazon: "Amazon", google: "Google", microsoft: "Microsoft",
  meta: "Meta", netflix: "Netflix", apple: "Apple", startups: "Startups",
};

function toTitle(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function loadTypeContent(company: string, type: string): Record<string, unknown> | null {
  const map: Record<string, string> = {
    overview: "overview.json", dsa: "dsa-patterns.json",
    "system-design": "system-design.json", behavioral: "behavioral.json",
  };
  const file = map[type];
  if (!file) return null;
  const fpath = path.join(COMPANIES_ROOT, company, file);
  if (!fs.existsSync(fpath)) return null;
  try { return JSON.parse(fs.readFileSync(fpath, "utf-8")); } catch { return null; }
}

export async function generateMetadata({
  params,
}: { params: Promise<{ company: string; type: string }> }): Promise<Metadata> {
  const { company, type } = await params;
  const companyName = COMPANY_NAMES[company] ?? toTitle(company);
  const typeMeta = TYPE_META[type];
  const label = typeMeta?.label ?? toTitle(type);
  const title = `${companyName} ${label} — Interview Prep | InterviewExplainer`;
  const description = typeMeta?.desc
    ? `${companyName} ${label}: ${typeMeta.desc}. Complete prep guide with real questions, strategies, and what they actually test.`
    : `${companyName} ${label} interview preparation — patterns, questions, and strategy.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/companies/${company}/${type}` },
    openGraph: { title, description, url: `${SITE_URL}/companies/${company}/${type}` },
  };
}

export default async function CompanyTypePage({
  params,
}: { params: Promise<{ company: string; type: string }> }) {
  const { company, type } = await params;
  const companyName = COMPANY_NAMES[company] ?? toTitle(company);
  const typeMeta = TYPE_META[type];
  const label = typeMeta?.label ?? toTitle(type);
  const Icon = typeMeta?.icon ?? BookOpen;
  const content = loadTypeContent(company, type);

  const COMPANY_TYPES: Record<string, string[]> = {
    amazon:    ["overview", "dsa", "system-design", "behavioral", "java-backend"],
    google:    ["overview", "dsa", "system-design", "coding-rounds"],
    microsoft: ["overview", "dsa", "system-design", "azure-specific"],
    meta:      ["overview", "dsa", "system-design", "react-specific"],
    startups:  ["seed-stage", "series-a", "series-b-plus"],
    default:   ["overview", "dsa", "system-design", "behavioral"],
  };
  const siblingTypes = COMPANY_TYPES[company] ?? COMPANY_TYPES.default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/20">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/companies" className="hover:text-foreground">Companies</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/companies/${company}`} className="hover:text-foreground">{companyName}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">{label}</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center">
              <Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold uppercase tracking-wider">
              {companyName} · {label}
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">
            {companyName} {label}
          </h1>
          {typeMeta?.desc && (
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{typeMeta.desc}</p>
          )}
        </header>

        {/* Sibling type nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {siblingTypes.map(t => (
            <Link
              key={t}
              href={`/companies/${company}/${t}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                t === type
                  ? "bg-orange-600 dark:bg-orange-800 text-white border-orange-600 dark:border-orange-700"
                  : "bg-background text-muted-foreground border-border hover:border-orange-400 dark:border-orange-700 hover:text-orange-600 dark:text-orange-400"
              }`}
            >
              {TYPE_META[t]?.label ?? toTitle(t)}
            </Link>
          ))}
        </div>

        {/* Content */}
        {content ? (
          <div className="space-y-6">
            <pre className="dark:bg-surface text-green-400 dark:text-green-300 text-xs p-4 rounded-xl overflow-auto">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="rounded-2xl border border-orange-200 dark:border-orange-500/20 bg-background p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-black text-foreground mb-2">{companyName} {label} — Coming Soon</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We&apos;re writing company-specific content based on real interview reports and patterns.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/companies/${company}`} className="px-4 py-2 bg-orange-600 dark:bg-orange-800 text-white rounded-lg text-sm font-bold hover:bg-orange-700 dark:bg-orange-800 transition-colors">
                ← {companyName} Overview
              </Link>
              <Link href="/dsa" className="px-4 py-2 bg-purple-600 dark:bg-purple-800 text-white rounded-lg text-sm font-bold hover:bg-purple-700 dark:bg-purple-800 transition-colors">
                Practice DSA Problems
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
