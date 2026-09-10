/**
 * Phase 14 — Curriculum V2 role page for non-curriculum interview tracks
 * (ruby, business-analyst, data-analyst). Hoisted from the per-role pages.
 */

import Link from "next/link";
import { ChevronRight, ArrowLeft, Sparkles } from "lucide-react";
import type { RolePageData } from "@/lib/curriculum";
import { Badge } from "@/components/ui/badge";

const ACCENT_BG: Record<string, string> = {
  rose: "bg-destructive/10 text-destructive dark:text-destructive",
  amber: "bg-warning/10 text-warning dark:text-warning",
  teal: "bg-primary/10 text-primary dark:text-primary",
};

const ACCENT_BORDER: Record<string, string> = {
  rose: "border-destructive/20",
  amber: "border-warning/20",
  teal: "border-primary/20",
};

const ACCENT_TEXT: Record<string, string> = {
  rose: "text-destructive dark:text-destructive",
  amber: "text-warning dark:text-warning",
  teal: "text-primary dark:text-primary",
};

export function RolePage({ data }: { data: RolePageData }) {
  const { slug, title, eyebrow, description, topics, accent } = data;
  const accentBg = ACCENT_BG[accent] ?? ACCENT_BG.rose;
  const accentBorder = ACCENT_BORDER[accent] ?? ACCENT_BORDER.rose;
  const accentText = ACCENT_TEXT[accent] ?? ACCENT_TEXT.rose;

  return (
    <div className="min-h-screen bg-surface font-sans text-foreground selection:bg-primary/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Interview Prep", item: "/interview" },
              { "@type": "ListItem", position: 3, name: title, item: `/interview/${slug}` },
            ],
          }),
        }}
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/interview" className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider hover:text-primary dark:text-primary transition-colors">
            <ArrowLeft className="h-3 w-3" />
            All Interview Tracks
          </Link>
        </nav>

        <div className="mb-10">
          <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${accentBg} ${accentBorder} mb-4`}>
            {eyebrow}
          </span>
          <h1 className="type-display text-4xl tracking-tight text-foreground mb-4">{title}</h1>
          <p className="text-base text-foreground leading-relaxed max-w-2xl">{description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={`h-4 w-4 ${accentText}`} />
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wide">Topics &amp; Areas</h2>
          </div>
          {topics.map((topic) => (
            <div key={topic.name} className={`flex items-center justify-between p-4 rounded-xl border ${accentBorder} bg-surface-subtle shadow-sm`}>
              <div className="flex items-start gap-3 min-w-0">
                {topic.emoji && <span className="text-xl leading-none mt-0.5">{topic.emoji}</span>}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground leading-tight">{topic.name}</h3>
                  {topic.desc && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{topic.desc}</p>}
                </div>
              </div>
              <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest shrink-0 ml-3 ${accentBg} ${accentBorder}`}>
                Coming Soon
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/interview" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary dark:text-primary transition-colors">
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            Back to all interview tracks
          </Link>
        </div>
      </div>
    </div>
  );
}
