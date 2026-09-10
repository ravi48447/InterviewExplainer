/**
 * Phase 12 — Compare hub V2 component (/compare).
 *
 * Renders the X-vs-Y comparison index from the canonical `lib/compare`
 * data layer. Server component.
 */
import Link from "next/link"
import {
  Home,
  ChevronRight,
  ArrowRight,
  ArrowLeftRight,
  BookOpen,
  Layers,
  TrendingUp,
} from "lucide-react"
import {
  COMPARISONS,
  compareAllTags,
  compareCountByTag,
  comparePopular,
  compareTagColor,
} from "@/lib/compare"

export function CompareHub() {
  const allTags = compareAllTags()
  const popular = comparePopular()

  return (
    <div className="min-h-screen bg-surface border border-default dark:from-slate-950 font-sans text-foreground selection:bg-blue-200">
      <div className="w-full min-w-0 px-6 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-muted-foreground flex items-center gap-1">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground font-medium">Compare (X vs Y)</span>
        </nav>

        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-surface border border-default">
            <div className="flex items-center gap-2 mb-3">
              <ArrowLeftRight className="h-5 w-5 text-primary dark:text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-primary">
                Head-to-Head Analysis
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              X vs Y — Interview-Ready Comparisons
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              &quot;When would you use Kafka over RabbitMQ?&quot; — Every interviewer loves comparison questions. These aren&apos;t generic articles. Each comparison is framed for the interview: key differences, trade-offs, when to pick which, and exactly what to say. Includes real-world use cases and architecture implications.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <ArrowLeftRight className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Comparisons</div>
                  <div className="text-lg font-bold text-foreground">{COMPARISONS.length}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Categories</div>
                  <div className="text-lg font-bold text-foreground">{allTags.length}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Total Monthly Searches</div>
                  <div className="text-lg font-bold text-foreground">1.2M+</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <span key={tag} className={`text-xs font-bold px-3 py-1.5 rounded-full ${compareTagColor(tag)}`}>
              {tag} ({compareCountByTag(tag)})
            </span>
          ))}
        </div>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary dark:text-primary" />
            <h2 className="text-xl font-black text-foreground">Most Searched Comparisons</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            The comparison questions with highest search volume — every interviewer asks at least one of these.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popular.map((c) => (
              <Link key={c.slug} href={`/compare/${c.slug}`}
                className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default transition-all p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${compareTagColor(c.tag)}`}>{c.tag}</span>
                    <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {c.search}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-[15px] font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors mb-2">
                  {c.title}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary dark:text-primary bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">{c.left}</span>
                  <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-bold text-primary dark:text-primary bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">{c.right}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="font-semibold text-foreground">Quick verdict:</span> {c.verdict}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary dark:text-primary" />
            <h2 className="text-xl font-black text-foreground">All Comparisons</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Complete list across all categories. Each comparison includes trade-off tables, when-to-use flowcharts, and interview phrasing.
          </p>
          <div className="space-y-2">
            {COMPARISONS.map((c) => (
              <Link key={c.slug} href={`/compare/${c.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default transition-all p-4">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors">{c.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${compareTagColor(c.tag)}`}>{c.tag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug line-clamp-1">{c.verdict}</p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground shrink-0">{c.search}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-default dark:border-default/20 bg-surface p-8 text-center mb-12">
          <h2 className="text-2xl font-black text-foreground mb-3">Comparisons in Your Interview Prep</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            These comparisons appear as interview questions in your domain prep. Select your path and get them mapped alongside Q&A, system design, DSA, and behavioral.
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
