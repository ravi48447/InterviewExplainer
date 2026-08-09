/**
 * Phase 14 — Curriculum V2 track hub (/interview/:lang/:track).
 * Hoisted from app/interview/[lang]/[track]/page.tsx.
 */

import Link from "next/link";
import { ChevronRight, Users, BookOpen, TrendingUp } from "lucide-react";
import type { TrackHubData } from "@/lib/curriculum";
import { getCanonicalOrigin } from "@/lib/seo/config";
import { Tag } from "@/components/ui/tag";

export function TrackHub({ data }: { data: TrackHubData }) {
  const { lang, track, langTitle, trackTitle, levels } = data;
  const origin = getCanonicalOrigin();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: origin },
          { "@type": "ListItem", position: 2, name: "Interview Questions", item: `${origin}/interview` },
          { "@type": "ListItem", position: 3, name: langTitle, item: `${origin}/interview/${lang}` },
          { "@type": "ListItem", position: 4, name: `${langTitle} ${trackTitle}`, item: `${origin}/interview/${lang}/${track}` },
        ],
      },
      {
        "@type": "WebPage",
        name: `${langTitle} ${trackTitle} Interview Questions`,
        description: `All experience levels for ${langTitle} ${trackTitle} engineering interviews.`,
        url: `${origin}/interview/${lang}/${track}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/interview" className="hover:text-foreground">Interview Questions</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/interview/${lang}`} className="hover:text-foreground">{langTitle}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold" aria-current="page">{trackTitle}</span>
        </nav>

        <header className="mb-10">
          <h1 className="type-display text-4xl tracking-tight text-foreground mb-3">{langTitle} {trackTitle} Interview Questions</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Complete interview preparation for {langTitle} {trackTitle} engineers — three experience levels, each with genuinely different answers, production examples, and what interviewers actually want to hear.
          </p>
        </header>

        <section className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {levels.map(({ key, meta, stacks }) => (
            <Link key={key} href={`/interview/${lang}/${track}/${key}`} className="group relative rounded-2xl border-2 bg-background p-6 hover:shadow-xl transition-colors duration-200 ease-out" style={{ borderColor: meta.color + "80" }}>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold border ${meta.colorClass}`}>{meta.label} · {meta.range}</span>
                <TrendingUp className="h-5 w-5 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors" />
              </div>
              <div className="mb-4">
                <div className="text-3xl font-extrabold text-foreground">{stacks.length}</div>
                <div className="text-sm text-muted-foreground">tech stacks</div>
              </div>
              {stacks.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {stacks.slice(0, 5).map((s) => (
                    <Tag key={s} className="text-[10px] font-medium">
                      {s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Tag>
                  ))}
                  {stacks.length > 5 && (
                    <Tag className="text-[10px]">+{stacks.length - 5} more</Tag>
                  )}
                </div>
              )}
              <div className="flex items-center gap-1 text-xs font-bold transition-colors duration-200 ease-out" style={{ color: meta.color }}>
                {stacks.length > 0 ? "Start Preparing" : "Coming Soon"}
                <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-background p-8 mb-12">
          <h2 className="text-xl font-extrabold text-foreground mb-6">What Changes Between Levels</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Aspect</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-success dark:text-success uppercase tracking-wider">Beginner</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-warning dark:text-warning uppercase tracking-wider">Intermediate</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-destructive dark:text-destructive uppercase tracking-wider">Advanced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Focus", "What & Why", "How it works + trade-offs", "Architecture decisions + failure modes"],
                  ["Code examples", "5–10 line snippets", "Real Spring Boot patterns", "Full system snippets"],
                  ["Depth", "Core concepts", "Production patterns", "Scale, performance, design"],
                  ["Answer length", "~250 words", "~300–350 words", "~350–400 words"],
                ].map(([aspect, beg, inter, adv]) => (
                  <tr key={aspect}>
                    <td className="py-3 pr-4 text-xs font-bold text-muted-foreground">{aspect}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{beg}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{inter}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{adv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dsa" className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-border hover:shadow-lg transition-colors duration-200 ease-out group  ">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary dark:text-primary" />
            </div>
            <div>
              <div className="font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors">DSA Problems</div>
              <div className="text-xs text-muted-foreground">Line-by-line explanations — beats LeetCode</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto transition-colors duration-200 ease-out" />
          </Link>
          <Link href="/companies" className="flex items-center gap-4 p-5 bg-warning/5 rounded-2xl border border-warning/20 hover:shadow-lg transition-colors duration-200 ease-out group  ">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-warning dark:text-warning" />
            </div>
            <div>
              <div className="font-extrabold text-foreground group-hover:text-warning dark:group-hover:text-warning transition-colors">Company Prep</div>
              <div className="text-xs text-muted-foreground">Amazon, Google, Microsoft, Meta</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto transition-colors duration-200 ease-out" />
          </Link>
        </section>
      </div>
    </div>
  );
}
