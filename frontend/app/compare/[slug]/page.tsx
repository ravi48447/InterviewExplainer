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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/compare" className="hover:text-slate-700">Comparisons</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-700 font-semibold">{title}</span>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            Interview Comparison
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">{title}</h1>
          {data?.subtitle && <p className="text-lg text-slate-600 leading-relaxed">{data.subtitle}</p>}
        </header>

        {data ? (
          <>
            {/* TL;DR */}
            <section className="mb-8 rounded-xl border-2 border-blue-300 bg-blue-50 p-6">
              <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3">TL;DR — The Interview Answer</h2>
              <p className="text-slate-800 leading-relaxed">{data.summary}</p>
            </section>

            {/* Comparison table */}
            {data.comparison && data.comparison.length > 0 && (
              <section className="mb-8 rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Side-by-Side Comparison</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase w-1/3">Aspect</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-blue-600 uppercase">{data.whenToUse?.a.name ?? "Option A"}</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-purple-600 uppercase">{data.whenToUse?.b.name ?? "Option B"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.comparison.map(row => (
                        <tr key={row.aspect} className="hover:bg-slate-50">
                          <td className="py-3 px-4 text-xs font-bold text-slate-600">{row.aspect}</td>
                          <td className="py-3 px-4 text-xs text-slate-700">{row.a}</td>
                          <td className="py-3 px-4 text-xs text-slate-700">{row.b}</td>
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
                  <div key={i} className={`rounded-xl border p-5 ${i === 0 ? "border-blue-200 bg-blue-50" : "border-purple-200 bg-purple-50"}`}>
                    <h3 className={`text-sm font-black mb-3 ${i === 0 ? "text-blue-800" : "text-purple-800"}`}>
                      Use {opt.name} when…
                    </h3>
                    <ul className="space-y-2">
                      {opt.conditions.map((c, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? "bg-blue-500" : "bg-purple-500"}`} />
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
              <section className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4">🎤 Interview Tips</h2>
                <ul className="space-y-3">
                  {data.interviewTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
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
                  <Link key={c} href={`/compare/${c}`} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all">
                    {formatSlug(c)}
                  </Link>
                ))}
                {data.relatedTools?.map(t => (
                  <Link key={t} href={`/tools/${t}`} className="px-4 py-2 bg-white border border-teal-200 rounded-lg text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-all capitalize">
                    {t.replace(/-/g, " ")}
                  </Link>
                ))}
              </section>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Content Loading</h2>
            <p className="text-slate-600 text-sm">{title} comparison is being written. <Link href="/compare" className="text-blue-600 font-bold hover:underline">Browse all comparisons →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
