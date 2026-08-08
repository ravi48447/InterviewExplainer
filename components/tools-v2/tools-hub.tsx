/**
 * Phase 12 — Tools hub V2 component (/tools).
 *
 * Renders the tools & technologies index from the canonical `lib/tools`
 * data layer. Icon resolution from iconKey → lucide component happens
 * here. Server component.
 */
import Link from "next/link"
import {
  Home,
  ChevronRight,
  ArrowRight,
  Wrench,
  BookOpen,
  Layers,
  Database,
  Radio,
  Cloud,
  Container,
  Terminal,
  Server,
  Shield,
  Code2,
  Gauge,
  Target,
} from "lucide-react"
import { buildToolCategoryGroups, totalToolQuestions } from "@/lib/tools"
import type { ToolCategoryGroup, ToolCardData } from "@/lib/tools"

const CATEGORY_ICONS: Record<string, typeof Database> = {
  database: Database,
  radio: Radio,
  cloud: Cloud,
  container: Container,
  globe: Target,
  terminal: Terminal,
  server: Server,
  gauge: Gauge,
  "code-2": Code2,
  shield: Shield,
  wrench: Wrench,
}

function ToolCard({ tool, group }: { tool: ToolCardData; group: ToolCategoryGroup }) {
  const Icon = CATEGORY_ICONS[group.iconKey] ?? Wrench
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-teal-300 dark:border-teal-700 transition-all p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${group.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon className={`h-5 w-5 ${group.color}`} />
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-teal-500 dark:text-teal-400 group-hover:translate-x-1 transition-all mt-1" />
      </div>
      <h3 className="text-[15px] font-bold text-foreground group-hover:text-teal-600 dark:text-teal-400 transition-colors mb-1.5">
        {tool.name}
      </h3>
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
        <span className="text-xs font-semibold text-muted-foreground">{tool.questionCount} Questions</span>
        <span className="text-xs text-muted-foreground">{tool.levelCount} level{tool.levelCount > 1 ? "s" : ""}</span>
      </div>
    </Link>
  )
}

export function ToolsHub() {
  const groups = buildToolCategoryGroups()
  const categorized = groups.filter((g) => g.key !== "other")
  const uncategorized = groups.find((g) => g.key === "other")
  const toolCount = groups.reduce((n, g) => n + g.tools.length, 0)
  const totalQs = totalToolQuestions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-teal-50/20 dark:via-teal-950/40 font-sans text-foreground selection:bg-teal-200">
      <div className="w-full min-w-0 px-6 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-muted-foreground flex items-center gap-1">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground font-medium">Tools & Technologies</span>
        </nav>

        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-teal-50 dark:from-teal-950/40">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Universal Content
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Tools & Technologies
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Interview questions organized by tool. These are universal — shared across Java, Python, Go, and every track that uses them. &quot;Explain how Kafka guarantees ordering&quot; is the same question whether you&apos;re a Java or Python backend engineer. Learn the tool, ace the question in any domain.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Tools</div>
                  <div className="text-lg font-bold text-foreground">{toolCount}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Total Questions</div>
                  <div className="text-lg font-bold text-foreground">{totalQs}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Categories</div>
                  <div className="text-lg font-bold text-foreground">{categorized.length}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {categorized.map((group) => {
          const Icon = CATEGORY_ICONS[group.iconKey] ?? Wrench
          return (
            <section key={group.key} className="mb-10">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-7 h-7 rounded-lg ${group.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${group.color}`} />
                </div>
                <h2 className="text-lg font-black text-foreground">{group.label}</h2>
                <span className="text-xs font-medium text-muted-foreground ml-1">({group.tools.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {group.tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} group={group} />
                ))}
              </div>
            </section>
          )
        })}

        {uncategorized && uncategorized.tools.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-1.5">
              <Wrench className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-black text-foreground">Other Tools</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {uncategorized.tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} group={uncategorized} />
              ))}
            </div>
          </section>
        )}

        {toolCount === 0 && (
          <div className="text-center py-16 text-muted-foreground bg-background rounded-xl border border-border shadow-sm">
            <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">No tools available yet. Check back soon.</p>
          </div>
        )}

        <section className="rounded-xl border border-teal-200 dark:border-teal-500/20 bg-gradient-to-r from-teal-50 dark:from-teal-950/40 p-8 text-center mb-12">
          <h2 className="text-2xl font-black text-foreground mb-3">Tools in Your Domain Prep</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Select your domain and get tool-specific questions mapped to your tech stack. A Java Backend engineer sees Docker, Kafka, and AWS. A Python ML engineer sees MLflow, DVC, and Kubernetes.
          </p>
          <Link href="/domains" className="inline-flex items-center gap-2 px-8 py-3 bg-surface border border-default text-foreground font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all">
            Select Your Domain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  )
}
