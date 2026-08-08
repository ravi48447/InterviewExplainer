/**
 * Phase 12 — Compare detail V2 component (/compare/[slug]).
 *
 * Renders a comparison detail page from the canonical `lib/compare`
 * data layer. Server component.
 */
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getCanonicalOrigin } from "@/lib/seo"
import { formatCompareSlug, type ComparePageData } from "@/lib/compare"

const SITE_ORIGIN = getCanonicalOrigin()

export function CompareDetail({ data }: { data: ComparePageData }) {
  const { slug, data: comparison } = data
  const title = comparison?.title ?? formatCompareSlug(slug)

  const jsonLd = comparison
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
              { "@type": "ListItem", position: 2, name: "Comparisons", item: `${SITE_ORIGIN}/compare` },
              { "@type": "ListItem", position: 3, name: title, item: `${SITE_ORIGIN}/compare/${slug}` },
            ],
          },
          {
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `${title} — which should I use?`,
                acceptedAnswer: { "@type": "Answer", text: comparison.summary },
              },
              ...(comparison.whenToUse
                ? [
                    {
                      "@type": "Question",
                      name: `When to use ${comparison.whenToUse.a.name}?`,
                      acceptedAnswer: { "@type": "Answer", text: comparison.whenToUse.a.conditions.join(". ") },
                    },
                    {
                      "@type": "Question",
                      name: `When to use ${comparison.whenToUse.b.name}?`,
                      acceptedAnswer: { "@type": "Answer", text: comparison.whenToUse.b.conditions.join(". ") },
                    },
                  ]
                : []),
            ],
          },
        ],
      }
    : null

  return (
    <div className="min-h-screen bg-surface border border-default">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/compare" className="hover:text-foreground">Comparisons</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">{title}</span>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            Interview Comparison
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">{title}</h1>
          {comparison?.subtitle && <p className="text-lg text-muted-foreground leading-relaxed">{comparison.subtitle}</p>}
        </header>

        {comparison ? (
          <>
            <section className="mb-8 rounded-xl border-2 border-default dark:border-default bg-blue-50 dark:bg-blue-500/10 p-6">
              <h2 className="text-sm font-bold text-primary dark:text-primary uppercase tracking-wider mb-3">TL;DR — The Interview Answer</h2>
              <p className="text-foreground leading-relaxed">{comparison.summary}</p>
            </section>

            {comparison.comparison && comparison.comparison.length > 0 && (
              <section className="mb-8 rounded-xl border border-border bg-background overflow-hidden">
                <div className="px-6 py-4 bg-surface border-b border-border">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Side-by-Side Comparison</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase w-1/3">Aspect</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-primary dark:text-primary uppercase">{comparison.whenToUse?.a.name ?? "Option A"}</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-primary dark:text-primary uppercase">{comparison.whenToUse?.b.name ?? "Option B"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {comparison.comparison.map((row) => (
                        <tr key={row.aspect} className="hover:bg-surface">
                          <td className="py-3 px-4 text-xs font-bold text-muted-foreground">{row.aspect}</td>
                          <td className="py-3 px-4 text-xs text-foreground">{row.a}</td>
                          <td className="py-3 px-4 text-xs text-foreground">{row.b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {comparison.whenToUse && (
              <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[comparison.whenToUse.a, comparison.whenToUse.b].map((opt, i) => (
                  <div key={i} className="rounded-xl border p-5 border-default dark:border-default/20 bg-blue-50 dark:bg-blue-500/10">
                    <h3 className="text-sm font-black mb-3 text-primary dark:text-primary">Use {opt.name} when…</h3>
                    <ul className="space-y-2">
                      {opt.conditions.map((c, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-foreground">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500 dark:bg-blue-800" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {comparison.interviewTips && comparison.interviewTips.length > 0 && (
              <section className="mb-8 rounded-xl border border-default dark:border-default/20 bg-emerald-50 dark:bg-emerald-500/10 p-6">
                <h2 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-4">🎤 Interview Tips</h2>
                <ul className="space-y-3">
                  {comparison.interviewTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(comparison.relatedComparisons?.length || comparison.relatedTools?.length) ? (
              <section className="flex flex-wrap gap-3">
                {comparison.relatedComparisons?.map((c) => (
                  <Link key={c} href={`/compare/${c}`} className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:border-default dark:border-default hover:text-primary dark:text-primary transition-all">
                    {formatCompareSlug(c)}
                  </Link>
                ))}
                {comparison.relatedTools?.map((t) => (
                  <Link key={t} href={`/tools/${t}`} className="px-4 py-2 bg-background border border-teal-200 dark:border-teal-500/20 rounded-lg text-sm font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:bg-teal-950/20 transition-all capitalize">
                    {t.replace(/-/g, " ")}
                  </Link>
                ))}
              </section>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-background p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-black text-foreground mb-2">Content Loading</h2>
            <p className="text-muted-foreground text-sm">
              {title} comparison is being written.{" "}
              <Link href="/compare" className="text-primary dark:text-primary font-bold hover:underline">
                Browse all comparisons →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
