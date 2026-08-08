/**
 * Phase 12 — Tool detail V2 component (/tools/[tool]).
 *
 * Renders the per-tool hub with level sections (beginner/intermediate/advanced)
 * from the canonical `lib/tools` data layer. Cross-links to domain tracks.
 */
import Link from "next/link"
import {
  Home,
  ChevronRight,
  ArrowRight,
  Wrench,
  BookOpen,
  Clock,
  GraduationCap,
} from "lucide-react"
import type { ToolHubPageData, ToolLevelSection } from "@/lib/tools"
import { TOOL_LEVEL_META } from "@/lib/tools"
import type { Difficulty } from "@/lib/contentV2-types"

const LEVEL_ORDER: (keyof typeof TOOL_LEVEL_META)[] = ["beginner", "intermediate", "advanced"]

function difficultyBadge(d: string): { bg: string; text: string; label: string } {
  if (d === "easy") return { bg: "bg-emerald-100 dark:bg-emerald-950/20", text: "text-emerald-700 dark:text-emerald-400", label: "Easy" }
  if (d === "medium") return { bg: "bg-amber-100 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-400", label: "Medium" }
  return { bg: "bg-red-100 dark:bg-red-950/20", text: "text-red-700 dark:text-red-400", label: "Hard" }
}

function LevelSection({ section }: { section: ToolLevelSection }) {
  const meta = TOOL_LEVEL_META[section.level as keyof typeof TOOL_LEVEL_META]
  if (!meta || section.questions.length === 0) return null
  return (
    <section className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background">
        <div className="flex items-center gap-3">
          <span className="text-lg">{meta.icon}</span>
          <h2 className="text-sm font-bold text-foreground">{meta.label}</h2>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${meta.colorClass}`}>{meta.range}</span>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground font-medium">{section.questions.length} Qs</span>
        </div>
      </div>
      <div className="divide-y divide-slate-50">
        {section.questions.map((q, idx) => {
          const db = difficultyBadge(q.difficulty)
          return (
            <div key={`${idx}-${q.slug}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface/50 transition-colors">
              <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-teal-100 dark:from-teal-950/50 flex items-center justify-center text-[10px] font-bold text-teal-700 dark:text-teal-400">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground leading-snug">{q.title || q.question}</h3>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${db.bg} ${db.text} shrink-0`}>
                {db.label}
              </span>
              <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {q.reading_time_minutes ?? 5}m
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function ToolDetail({ data }: { data: ToolHubPageData }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${data.name} Interview Questions`,
    url: `https://interviewexplainer.com/tools/${data.slug}`,
    numberOfItems: data.totalQuestions,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-surface border border-default dark:from-slate-950 font-sans text-foreground selection:bg-blue-200">
        <div className="w-full min-w-0 px-6 py-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-muted-foreground flex items-center gap-1">
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/tools" className="hover:text-muted-foreground">Tools</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-foreground font-medium">{data.name}</span>
          </nav>

          <header className="mb-10 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="relative px-8 py-6 bg-gradient-to-br from-teal-50 dark:from-teal-950/40">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 shadow-sm">
                  Tool
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary border border-default dark:border-default/20 shadow-sm">
                  Universal
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">{data.name}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Universal interview questions — applies across Java, Python, Go, and every track that uses {data.name}.
              </p>
            </div>
            <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/20 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-medium">Questions</div>
                    <div className="text-lg font-bold text-foreground">{data.totalQuestions}</div>
                  </div>
                </div>
                <div className="h-9 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-primary dark:text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-medium">Levels</div>
                    <div className="text-lg font-bold text-foreground">{data.levels.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 pb-12">
            {LEVEL_ORDER.map((lvl) => {
              const section = data.levels.find((l) => l.level === lvl)
              if (!section || section.questions.length === 0) return null
              return <LevelSection key={lvl} section={section} />
            })}
            {data.levels.every((l) => l.questions.length === 0) && (
              <div className="text-center py-16 text-muted-foreground bg-background rounded-xl border border-border shadow-sm">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Questions for {data.name} are coming soon.</p>
              </div>
            )}
          </div>

          <section className="rounded-xl border border-border bg-background shadow-sm p-6 mb-12">
            <h2 className="text-sm font-bold text-foreground mb-3">See {data.name} in context</h2>
            <div className="flex flex-wrap gap-2">
              {["java/backend", "python/backend"].map((path) => (
                <Link
                  key={path}
                  href={`/interview/${path}/intermediate/${data.slug}`}
                  className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary dark:text-primary px-3 py-2 rounded-lg border border-border hover:border-default dark:border-default hover:shadow-sm transition-all"
                >
                  {path.replace("/", " ")}
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors" />
                  {data.name}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
