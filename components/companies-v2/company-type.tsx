/**
 * Phase 12 — Company × type V2 component (/companies/[company]/[type]).
 *
 * Renders the company × type sub-page from the canonical `lib/companies`
 * data layer. Icon resolution from iconKey → lucide component happens
 * here (data layer stays free of React imports). Server component.
 */
import Link from "next/link"
import { ChevronRight, Code2, BookOpen, Users, Target, Brain } from "lucide-react"
import type { CompanyTypePageData } from "@/lib/companies"

const TYPE_ICONS: Record<string, typeof Code2> = {
  "book-open": BookOpen,
  "code-2": Code2,
  target: Target,
  users: Users,
  brain: Brain,
}

export function CompanyType({ data }: { data: CompanyTypePageData }) {
  const { company, companyName, type, label, desc, iconKey, siblingTypes, typeLabel, content } = data
  const Icon = TYPE_ICONS[iconKey] ?? BookOpen

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-orange-50/20 dark:via-orange-950/40">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
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
          {desc && <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{desc}</p>}
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          {siblingTypes.map((t) => (
            <Link
              key={t}
              href={`/companies/${company}/${t}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                t === type
                  ? "bg-orange-600 dark:bg-orange-800 text-white border-orange-600 dark:border-orange-700"
                  : "bg-background text-muted-foreground border-border hover:border-orange-400 dark:border-orange-700 hover:text-orange-600 dark:text-orange-400"
              }`}
            >
              {typeLabel(t)}
            </Link>
          ))}
        </div>

        {content ? (
          <div className="space-y-6">
            <pre className="dark:bg-surface text-green-600 dark:text-green-300 text-xs p-4 rounded-xl overflow-auto">
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
              <Link href={`/companies/${company}`} className="px-4 py-2 bg-orange-600 dark:bg-orange-800 text-foreground rounded-lg text-sm font-bold hover:bg-orange-700 dark:bg-orange-800 transition-colors">
                ← {companyName} Overview
              </Link>
              <Link href="/dsa" className="px-4 py-2 bg-blue-600 dark:bg-blue-800 text-foreground rounded-lg text-sm font-bold hover:bg-blue-700 dark:bg-blue-800 transition-colors">
                Practice DSA Problems
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
