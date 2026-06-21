import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuestionsForTool } from "@/lib/contentV2";
import type { Level } from "@/lib/contentV2-types";
import {
  ChevronRight, Home, Clock, GraduationCap,
  Wrench, BookOpen, ArrowRight,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function toDisplayName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function difficultyBadge(d: string): { bg: string; text: string; label: string } {
  if (d === "easy") return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Easy" };
  if (d === "medium") return { bg: "bg-amber-100", text: "text-amber-700", label: "Medium" };
  return { bg: "bg-red-100", text: "text-red-700", label: "Hard" };
}

const LEVEL_META: Record<Level, { label: string; colorClass: string; range: string; icon: string }> = {
  beginner: { label: "Beginner", colorClass: "bg-emerald-100 text-emerald-700 border-emerald-200", range: "0–2 yrs", icon: "🌱" },
  intermediate: { label: "Intermediate", colorClass: "bg-amber-100 text-amber-700 border-amber-200", range: "2–5 yrs", icon: "⚡" },
  advanced: { label: "Advanced", colorClass: "bg-red-100 text-red-700 border-red-200", range: "5+ yrs", icon: "🚀" },
};

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  const canonicalUrl = `${SITE_URL}/tools/${tool}`;
  return {
    title: `${toDisplayName(tool)} Interview Questions — All Levels`,
    description: `${toDisplayName(tool)} interview questions across beginner, intermediate, and advanced levels.`,
    alternates: { canonical: canonicalUrl },
  };
}

export default async function ToolHubPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const toolName = toDisplayName(tool);
  const levels = getQuestionsForTool(tool);
  if (levels.length === 0) notFound();

  const totalQs = levels.reduce((s, l) => s + l.questions.length, 0);
  const canonicalUrl = `${SITE_URL}/tools/${tool}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${toolName} Interview Questions`,
    url: canonicalUrl,
    numberOfItems: totalQs,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 font-sans text-slate-800 selection:bg-blue-200">
        <div className="w-full min-w-0 px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
            <Link href="/" className="hover:text-slate-600 flex items-center gap-1"><Home className="h-3 w-3" /> Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/tools" className="hover:text-slate-600">Tools</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 font-medium">{toolName}</span>
          </nav>

          {/* Hero */}
          <header className="mb-10 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="relative px-8 py-6 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-teal-100 text-teal-700 border border-teal-200 shadow-sm">
                  Tool
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                  Universal
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                {toolName}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                Universal interview questions — applies across Java, Python, Go, and every track that uses {toolName}.
              </p>
            </div>
            <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Questions</div>
                    <div className="text-lg font-bold text-slate-900">{totalQs}</div>
                  </div>
                </div>
                <div className="h-9 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Levels</div>
                    <div className="text-lg font-bold text-slate-900">{levels.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Questions by Level */}
          <div className="space-y-6 pb-12">
            {levels.map(({ level, questions }) => {
              const lm = LEVEL_META[level];
              return (
                <section key={level} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className={`px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lm.icon}</span>
                      <h2 className="text-sm font-bold text-slate-900">{lm.label}</h2>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${lm.colorClass}`}>{lm.range}</span>
                      <div className="flex-1" />
                      <span className="text-xs text-slate-400 font-medium">{questions.length} Qs</span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-50">
                    {questions.map((q, idx) => {
                      const db = difficultyBadge(q.difficulty);
                      return (
                        <div key={`${idx}-${q.slug}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                          <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-[10px] font-bold text-teal-700">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-slate-700 leading-snug">{q.title || q.question}</h3>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${db.bg} ${db.text} shrink-0`}>
                            {db.label}
                          </span>
                          <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {q.reading_time_minutes ?? 5}m
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Cross-links */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 mb-12">
            <h2 className="text-sm font-bold text-slate-900 mb-3">See {toolName} in context</h2>
            <div className="flex flex-wrap gap-2">
              {["java/backend", "python/backend"].map(path => (
                <Link
                  key={path}
                  href={`/interview/${path}/intermediate/${tool}`}
                  className="group flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  {toDisplayName(path.replace("/", " "))}
                  <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  {toolName}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
