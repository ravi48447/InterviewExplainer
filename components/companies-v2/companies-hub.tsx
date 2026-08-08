/**
 * Phase 12 — Companies hub V2 component.
 *
 * Renders the /companies hub from the canonical `lib/companies` data layer.
 * Server component — no client interactivity needed.
 */
import Link from "next/link"
import {
  Home,
  ChevronRight,
  ArrowRight,
  Building2,
  BookOpen,
  Layers,
  Target,
  Code2,
  Brain,
  Network,
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Gauge,
  Wrench,
} from "lucide-react"
import {
  COMPANY_TIERS,
  totalCompanyCount,
  toTitle,
} from "@/lib/companies"
import type { CompanyCardData, CompanyTier } from "@/lib/companies"

const DSA_LEVEL_COLORS: Record<string, string> = {
  Medium: "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400",
  "Medium-Hard": "bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400",
  Hard: "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400",
  "Very Hard": "bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-400",
}

const SD_LEVEL_COLORS: Record<string, string> = {
  Medium: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  "Medium-High": "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  High: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  "Very High": "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400",
  "High (L4+)": "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
}

const TIER_ICONS: Record<string, typeof Star> = {
  star: Star,
  "trending-up": TrendingUp,
  users: Users,
  "dollar-sign": DollarSign,
}

function CompanyCard({ company }: { company: CompanyCardData }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-orange-300 dark:border-orange-700 transition-all overflow-hidden"
    >
      <div className={`h-1.5 bg-gradient-to-r ${company.gradient}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-black text-foreground group-hover:text-orange-600 dark:text-orange-400 transition-colors">
            {company.name}
          </h3>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 dark:text-orange-400 group-hover:translate-x-1 transition-all mt-1" />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {company.desc}
        </p>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DSA_LEVEL_COLORS[company.dsaFocus] ?? "bg-surface text-muted-foreground"}`}>
            DSA: {company.dsaFocus}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SD_LEVEL_COLORS[company.sdFocus] ?? "bg-surface text-muted-foreground"}`}>
            System Design: {company.sdFocus}
          </span>
          {company.behavioralFocus && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
              Behavioral: {company.behavioralFocus}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mb-3 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="font-medium">{company.rounds}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
          {company.topPatterns.map((p) => (
            <span key={p} className="text-[10px] font-medium text-muted-foreground bg-surface px-2 py-0.5 rounded-md">
              {p}
            </span>
          ))}
          {company.timeline && (
            <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-md ml-auto">
              {company.timeline}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function CompaniesHub() {
  const total = totalCompanyCount()
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-subtle to-background font-sans text-foreground selection:bg-primary/20">
      <div className="w-full min-w-0 px-6 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-muted-foreground flex items-center gap-1">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground font-medium">Company Prep</span>
        </nav>

        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-orange-50 dark:from-orange-950/40 to-yellow-50 dark:to-yellow-950/40">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                Company-Specific Preparation
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Company Interview Prep
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Every company interviews differently. Amazon is 50% behavioral. Google has the hardest DSA bar. Stripe has a bug-squash round. We break down the process, focus areas, key patterns, and culture signals for {total}+ companies — so you know exactly what to prepare.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-surface-subtle to-surface border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Companies</div>
                  <div className="text-lg font-bold text-foreground">{total}+</div>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Tiers Covered</div>
                  <div className="text-lg font-bold text-foreground">4</div>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-950/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Process Breakdowns</div>
                  <div className="text-lg font-bold text-foreground">Detailed</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-10 rounded-xl border border-border bg-background p-6">
          <h2 className="text-sm font-black text-foreground mb-4">What Each Company Guide Includes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Gauge, label: "Interview Process", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-950/20" },
              { icon: Code2, label: "DSA Focus Areas", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-950/20" },
              { icon: Network, label: "System Design", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/20" },
              { icon: Brain, label: "Behavioral Prep", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-950/20" },
              { icon: TrendingUp, label: "Difficulty Level", color: "text-red-600", bg: "bg-red-100 dark:bg-red-950/20" },
              { icon: Star, label: "Culture Signals", color: "text-primary dark:text-primary", bg: "bg-blue-100 dark:bg-blue-950/20" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mx-auto mb-2`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className="text-[11px] font-bold text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {COMPANY_TIERS.map((tier: CompanyTier) => {
          const Icon = TIER_ICONS[tier.iconKey] ?? Star
          return (
            <section key={tier.key} className="mb-10">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`h-5 w-5 ${tier.color}`} />
                <h2 className="text-xl font-black text-foreground">{tier.label}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">{tier.blurb}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tier.companies.map((c) => (
                  <CompanyCard key={c.slug} company={c} />
                ))}
              </div>
            </section>
          )
        })}

        <section className="rounded-xl border border-orange-200 dark:border-orange-500/20 bg-gradient-to-r from-orange-50 dark:from-orange-950/40 p-8 text-center mb-12">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Company Prep Is Part of Your Domain Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Select your domain and get company-specific prep mapped to your tech stack, alongside Q&A, system design, DSA, behavioral, roadmap, and progress tracking.
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
