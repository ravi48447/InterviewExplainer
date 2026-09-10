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
 *
 * V2 learning-site treatment: replaces the multi-colour gradient panels with
 * the restrained token system — `bg-card` / `bg-surface` cards with
 * `border-border/60`, the single indigo `--primary` accent, and the homepage
 * card pattern. The structural layout (overview + playbook side by side,
 * pitfalls grid, FAQ disclosure) is preserved so information density is not
 * lost — only the visual chrome is aligned to the system.
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
    <section id={id} className="scroll-mt-24 mb-12 space-y-8">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Heading */}
      <div>
        <p className="type-label mb-1 flex items-center gap-1.5 text-primary">
          <Compass className="h-3.5 w-3.5" />
          {kicker}
        </p>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {heading}
        </h2>
      </div>

      {/* Overview + Study playbook side by side on wide screens */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
        {/* Overview prose */}
        {content.overview.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
            <div className="flex items-center gap-1.5 border-b border-border/60 bg-surface px-5 py-3">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <p className="type-label text-muted-foreground">Overview</p>
            </div>
            <div className="space-y-3.5 px-5 py-5">
              {content.overview.map((p, i) => (
                <p key={i} className="type-body text-foreground">
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Study playbook */}
        {content.studyTips.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
            <div className="flex items-center gap-1.5 border-b border-border/60 bg-surface px-5 py-3">
              <Compass className="h-3.5 w-3.5 text-primary" />
              <p className="type-label text-muted-foreground">Study playbook</p>
            </div>
            <ol className="space-y-2.5 p-4">
              {content.studyTips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-surface p-3.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-foreground">{tip.title}</div>
                    <div className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                      {tip.body}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Pitfalls */}
      {content.pitfalls.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
          <div className="flex items-center gap-1.5 border-b border-border/60 bg-surface px-5 py-3">
            <AlertTriangle className="h-3.5 w-3.5 text-primary" />
            <p className="type-label text-muted-foreground">Common pitfalls</p>
          </div>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 px-5 py-5 md:grid-cols-2">
            {content.pitfalls.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FAQ */}
      {content.faqs.length > 0 && (
        <div>
          <p className="type-label mb-3 flex items-center gap-1.5 text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently asked
          </p>
          <div className="space-y-2">
            {content.faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-lg border border-border/60 bg-card transition-colors hover:border-primary/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5">
                  <span className="flex items-start gap-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f.q}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-4 pl-12 text-sm leading-relaxed text-muted-foreground">
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
