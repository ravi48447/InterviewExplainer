import {
  BookOpen,
  Compass,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import type { DSAPageContent } from "@/lib/dsaPageContent";

/**
 * Renders the editorial content (overview, study playbook, pitfalls, FAQ) that
 * makes the DSA browse pages feel complete rather than like bare problem lists.
 *
 * `id` anchors the block so a page nav / "Guide" link can jump to it. The FAQ
 * is also emitted as FAQPage JSON-LD for SEO.
 */
export function DSAContentSections({
  content,
  heading = "How to master this",
  kicker = "Study guide",
  id = "guide",
}: {
  content: DSAPageContent;
  heading?: string;
  kicker?: string;
  id?: string;
}) {
  const faqJsonLd =
    content.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <section id={id} className="scroll-mt-24 mb-12 space-y-6">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Heading */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1 flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5" />
          {kicker}
        </p>
        <h2 className="text-2xl font-black text-foreground tracking-tight">{heading}</h2>
      </div>

      {/* Overview + Study playbook side by side on wide screens */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        {/* Overview prose */}
        {content.overview.length > 0 && (
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-br from-blue-50 dark:from-blue-950/40 to-blue-50/30 dark:to-blue-950/40  ">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Overview
              </p>
            </div>
            <div className="px-6 py-5 space-y-3.5">
              {content.overview.map((p, i) => (
                <p key={i} className="text-[15px] leading-[1.75] text-foreground">
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Study playbook */}
        {content.studyTips.length > 0 && (
          <div className="rounded-2xl border border-violet-100 dark:border-violet-500/20 bg-background shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-violet-100 dark:border-violet-500/20 bg-gradient-to-br from-violet-50 dark:from-violet-950/40 to-violet-50/30 dark:to-violet-950/40  ">
              <p className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-400 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5" />
                Study playbook
              </p>
            </div>
            <ol className="p-4 space-y-2.5">
              {content.studyTips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-surface/60 p-3.5"
                >
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-violet-600 dark:bg-violet-800 text-primary-foreground dark:text-foreground flex items-center justify-center text-xs font-black">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-foreground mb-0.5">{tip.title}</div>
                    <div className="text-[13px] text-secondary leading-relaxed">{tip.body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Pitfalls */}
      {content.pitfalls.length > 0 && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-background shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-3 border-b border-rose-100 dark:border-rose-500/20 bg-gradient-to-br from-rose-50 dark:from-rose-950/40 to-rose-50/30 dark:to-rose-950/40  ">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Common pitfalls
            </p>
          </div>
          <ul className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
            {content.pitfalls.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-foreground leading-relaxed">
                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-800 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FAQ */}
      {content.faqs.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently asked
          </p>
          <div className="space-y-2">
            {content.faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border bg-background hover:border-violet-200 dark:border-violet-500/20 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-3.5 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-foreground group-hover:text-violet-700 dark:text-violet-400 transition-colors leading-snug flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-violet-400 dark:text-violet-300 shrink-0 mt-0.5" />
                    {f.q}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-300 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-4 pl-12 text-sm text-secondary leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
