import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import fs from "fs";
import path from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";
const COMPARE_ROOT = path.join(process.cwd(), "..", "content", "compare");

interface ComparisonData {
  title: string;
  slug: string;
  subtitle?: string;
  summary: string;
  whenToUse?: { a: { name: string; conditions: string[] }; b: { name: string; conditions: string[] } };
  comparison?: { aspect: string; a: string; b: string }[];
  interviewTips?: string[];
  relatedComparisons?: string[];
  relatedTools?: string[];
}

function loadComparison(slug: string): ComparisonData | null {
  const fpath = path.join(COMPARE_ROOT, `${slug}.json`);
  if (!fs.existsSync(fpath)) return null;
  try { return JSON.parse(fs.readFileSync(fpath, "utf-8")); } catch { return null; }
}

function formatSlug(slug: string) {
  return slug.replace(/-vs-/g, " vs ").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = loadComparison(slug);
  const title = data?.title ?? `${formatSlug(slug)} — Interview Answer | InterviewExplainer`;
  const description = data?.summary ?? `When to use each, trade-offs, and exactly what to say in the interview. ${formatSlug(slug)} explained for engineers.`;
  return {
    title: `${title} | Interview Q&A | InterviewExplainer`,
    description,
    alternates: { canonical: `${SITE_URL}/compare/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/compare/${slug}`, type: "article" },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = loadComparison(slug);
  const title = data?.title ?? formatSlug(slug);

  const jsonLd = data ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Comparisons", item: `${SITE_URL}/compare` },
          { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}/compare/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `${title} — which should I use?`,
            acceptedAnswer: { "@type": "Answer", text: data.summary },
          },
          ...(data.whenToUse ? [
            {
              "@type": "Question",
              name: `When to use ${data.whenToUse.a.name}?`,
              acceptedAnswer: { "@type": "Answer", text: data.whenToUse.a.conditions.join(". ") },
            },
            {
              "@type": "Question",
              name: `When to use ${data.whenToUse.b.name}?`,
              acceptedAnswer: { "@type": "Answer", text: data.whenToUse.b.conditions.join(". ") },
            },
          ] : []),
        ],
      },
    ],
  } : null;

  return (
    <div className="min-h-screen bg-surface border border-default dark:from-slate-950 dark:">
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
          {data?.subtitle && <p className="text-lg text-muted-foreground leading-relaxed">{data.subtitle}</p>}
        </header>

        {data ? (
          <>
            {/* TL;DR */}
            <section className="mb-8 rounded-xl border-2 border-default dark:border-default bg-blue-50 dark:bg-blue-500/10 p-6">
              <h2 className="text-sm font-bold text-primary dark:text-primary uppercase tracking-wider mb-3">TL;DR — The Interview Answer</h2>
              <p className="text-foreground leading-relaxed">{data.summary}</p>
            </section>

            {/* Comparison table */}
            {data.comparison && data.comparison.length > 0 && (
              <section className="mb-8 rounded-xl border border-border bg-background overflow-hidden">
                <div className="px-6 py-4 bg-surface border-b border-border">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Side-by-Side Comparison</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase w-1/3">Aspect</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-primary dark:text-primary uppercase">{data.whenToUse?.a.name ?? "Option A"}</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-primary dark:text-primary uppercase">{data.whenToUse?.b.name ?? "Option B"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {data.comparison.map(row => (
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

            {/* When to use each */}
            {data.whenToUse && (
              <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[data.whenToUse.a, data.whenToUse.b].map((opt, i) => (
                  <div key={i} className={`rounded-xl border p-5 ${i === 0 ? "border-default dark:border-default/20 bg-blue-50 dark:bg-blue-500/10" : "border-default dark:border-default/20 bg-blue-50 dark:bg-blue-950/20"}`}>
                    <h3 className={`text-sm font-black mb-3 ${i === 0 ? "text-primary dark:text-primary" : "text-primary dark:text-primary"}`}>
                      Use {opt.name} when…
                    </h3>
                    <ul className="space-y-2">
                      {opt.conditions.map((c, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-foreground">
                          <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? "bg-blue-500 dark:bg-blue-800" : "bg-blue-500 dark:bg-blue-800"}`} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {/* Interview tips */}
            {data.interviewTips && data.interviewTips.length > 0 && (
              <section className="mb-8 rounded-xl border border-default dark:border-default/20 bg-emerald-50 dark:bg-emerald-500/10 p-6">
                <h2 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-4">🎤 Interview Tips</h2>
                <ul className="space-y-3">
                  {data.interviewTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Related */}
            {(data.relatedComparisons?.length || data.relatedTools?.length) ? (
              <section className="flex flex-wrap gap-3">
                {data.relatedComparisons?.map(c => (
                  <Link key={c} href={`/compare/${c}`} className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:border-default dark:border-default hover:text-primary dark:text-primary transition-all">
                    {formatSlug(c)}
                  </Link>
                ))}
                {data.relatedTools?.map(t => (
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
            <p className="text-muted-foreground text-sm">{title} comparison is being written. <Link href="/compare" className="text-primary dark:text-primary font-bold hover:underline">Browse all comparisons →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
