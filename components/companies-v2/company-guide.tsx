/**
 * Phase 12 — Company guide V2 component (/companies/[company]).
 *
 * Renders the per-company interview guide from the canonical
 * `lib/companies` data layer. Server component.
 */
import Link from "next/link"
import { ChevronRight, ArrowUpRight, Users, Code2, BookOpen } from "lucide-react"
import { getCanonicalOrigin } from "@/lib/seo"
import type { CompanyGuidePageData } from "@/lib/companies"

const SITE_ORIGIN = getCanonicalOrigin()

export function CompanyGuide({ data }: { data: CompanyGuidePageData }) {
  const { name, slug, meta } = data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: "Company Prep", item: `${SITE_ORIGIN}/companies` },
          { "@type": "ListItem", position: 3, name, item: `${SITE_ORIGIN}/companies/${slug}` },
        ],
      },
      {
        "@type": "WebPage",
        name: `${name} Interview Prep`,
        description: meta?.desc,
        url: `${SITE_ORIGIN}/companies/${slug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40 via-orange-50/20 dark:via-orange-950/40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/companies" className="hover:text-foreground">Company Prep</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">{name}</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <Users className="h-3.5 w-3.5" />
            Company Prep
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">
            {name} Interview Guide
          </h1>
          {meta?.desc && <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{meta.desc}</p>}
        </header>

        {meta ? (
          <>
            <section className="mb-10">
              <h2 className="text-xl font-black text-foreground mb-5">Interview Process</h2>
              <div className="space-y-3">
                {meta.rounds.map((round, i) => (
                  <div key={round.name} className="flex gap-4 p-4 bg-background rounded-xl border border-border">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-50 dark:from-orange-950/40 text-white flex items-center justify-center text-xs font-black shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-black text-foreground mb-1">{round.name}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{round.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <section>
                <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary dark:text-primary" />
                  Key DSA Patterns
                </h2>
                <div className="space-y-2">
                  {meta.dsaPatterns.map((p) => (
                    <Link key={p} href={`/dsa/pattern/${p}`}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-default dark:border-default/20 hover:border-default hover:shadow-sm transition-all group">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary dark:group-hover:text-primary capitalize">{p.replace(/-/g, " ")}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  Key Technical Topics
                </h2>
                <div className="space-y-2">
                  {meta.keyTopics.map((t) => (
                    <Link key={t} href={`/topics/${t}`}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-teal-200 dark:border-teal-500/20 hover:border-teal-400 dark:border-teal-700 hover:shadow-sm transition-all group">
                      <span className="text-sm font-semibold text-foreground group-hover:text-teal-600 dark:text-teal-400 capitalize">{t.replace(/-/g, " ")}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-teal-400 dark:group-hover:text-teal-300" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <section className="mb-10 rounded-xl border border-default dark:border-default/20 bg-blue-50 dark:bg-blue-500/10 p-5">
              <h2 className="text-base font-black text-foreground mb-3">Preferred Languages at {name}</h2>
              <div className="flex flex-wrap gap-2">
                {meta.langFocus.map((lang) => (
                  <Link key={lang} href={`/interview/${lang}`}
                    className="px-4 py-2 bg-background border border-default dark:border-default rounded-lg text-sm font-bold text-primary dark:text-primary hover:bg-blue-100 dark:bg-blue-950/20 transition-colors capitalize">
                    {lang === "csharp" ? "C#" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-background p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-black text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground text-sm">
              {name} prep guide is being built.{" "}
              <Link href="/companies" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                Browse all companies →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
