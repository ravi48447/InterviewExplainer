/**
 * Phase 14 — Curriculum V2 stack hub (/interview/:lang/:track/:level/:stack).
 * Hoisted from app/interview/[lang]/[track]/[level]/[stack]/page.tsx.
 * Preserves the V2ContentTreeNav left sidebar.
 */

import Link from "next/link";
import { ChevronRight, BookOpen, Layers, Clock, GraduationCap, Filter } from "lucide-react";
import type { StackHubData } from "@/lib/curriculum";
import { difficultyColor, difficultyLabel } from "@/lib/curriculum";
import { getCanonicalOrigin } from "@/lib/seo/config";
import V2ContentTreeNav from "@/components/V2ContentTreeNav";
import { Tag } from "@/components/ui/tag";

export function StackHub({ data }: { data: StackHubData }) {
  const { lang, track, level, stack, stackName, description, questions, lvlMeta } = data;
  const origin = getCanonicalOrigin();
  const canonicalUrl = `${origin}/interview/${lang}/${track}/${level}/${stack}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: origin },
          { "@type": "ListItem", position: 2, name: "Interview", item: `${origin}/interview` },
          { "@type": "ListItem", position: 3, name: "Interview", item: `${origin}/interview/${lang}` },
          { "@type": "ListItem", position: 4, name: "Interview", item: `${origin}/interview/${lang}/${track}` },
          { "@type": "ListItem", position: 5, name: lvlMeta.label, item: `${origin}/interview/${lang}/${track}/${level}` },
          { "@type": "ListItem", position: 6, name: stackName, item: canonicalUrl },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${stackName} Interview Questions`,
        url: canonicalUrl,
        description: description ?? `${stackName} interview questions`,
        numberOfItems: questions.length,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-surface font-sans text-foreground selection:bg-primary/20">
        <div className="w-full min-w-0 min-h-screen flex gap-6 px-6 py-6">
          {/* LEFT SIDEBAR — V2ContentTreeNav (preserved) */}
          <aside className="hidden lg:flex w-[300px] shrink-0 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
            <V2ContentTreeNav lang={lang} track={track} level={level} activeStackSlug={stack} />
          </aside>

          {/* MAIN COLUMN */}
          <main className="flex-1 min-w-0">
            <header className="mb-5 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="px-6 py-5 bg-surface border-b border-border">
                <nav className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground mb-3 flex-wrap" aria-label="Breadcrumb">
                  <Link href="/interview" className="hover:text-primary dark:text-primary transition-colors">Interview</Link>
                  <ChevronRight className="h-3 w-3 opacity-50" />
                  <Link href={`/interview/${lang}`} className="hover:text-primary dark:text-primary transition-colors">{lang}</Link>
                  <ChevronRight className="h-3 w-3 opacity-50" />
                  <Link href={`/interview/${lang}/${track}`} className="hover:text-primary dark:text-primary transition-colors">{track}</Link>
                  <ChevronRight className="h-3 w-3 opacity-50" />
                  <Link href={`/interview/${lang}/${track}/${level}`} className="hover:text-primary dark:text-primary transition-colors">{lvlMeta.label}</Link>
                  <ChevronRight className="h-3 w-3 opacity-50" />
                  <span className="text-foreground" aria-current="page">{stackName}</span>
                </nav>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Tag className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm bg-primary/10 text-primary dark:text-primary border border-border">{lang}</Tag>
                  <Tag className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm bg-primary/10 text-primary dark:text-primary border border-border">{track}</Tag>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${lvlMeta.colorClass}`}>{lvlMeta.label} · {lvlMeta.range}</span>
                </div>
                <h1 className="type-display text-3xl tracking-tight text-foreground mb-2">{stackName}</h1>
                {description && <p className="text-sm text-foreground leading-relaxed max-w-3xl">{description}</p>}
              </div>
              <div className="px-6 py-3 bg-surface border-t border-border">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-success dark:text-success" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Questions</div>
                      <div className="text-lg font-bold text-foreground">{questions.length}</div>
                    </div>
                  </div>
                  <div className="h-9 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Layers className="h-4 w-4 text-primary dark:text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stack</div>
                      <div className="text-sm font-bold text-foreground">{stackName}</div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="space-y-2 pb-10">
              {questions.map((q, idx) => (
                <Link
                  key={`${idx}-${q.slug}`}
                  href={`/interview/${lang}/${track}/${level}/${stack}/${q.slug}`}
                  className="group flex items-center justify-between p-3.5 rounded-[10px] border border-border shadow-sm bg-surface-subtle hover:border-border hover:shadow-md transition-colors duration-200 ease-out"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-background border border-border text-muted-foreground flex items-center justify-center text-[11px] font-bold shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground transition-colors leading-tight">{q.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white shadow-sm" style={{ backgroundColor: difficultyColor(q.difficulty) }}>
                          {difficultyLabel(q.difficulty)}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {q.estimatedReadTime ?? 5} min read
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary dark:text-primary transition-colors duration-200 ease-out shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </main>

          {/* RIGHT SIDEBAR (kept minimal, parity with original) */}
          <aside className="hidden xl:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
            <div className="rounded-xl border border-border bg-surface shadow-sm p-4  ">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-4 w-4 text-primary dark:text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Stack Info</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Questions</span><span className="font-bold text-foreground">{questions.length}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Level</span><span className="font-bold" style={{ color: lvlMeta.color }}>{lvlMeta.label}</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface shadow-sm p-4  ">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-primary dark:text-primary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Level</h3>
              </div>
              <Link href={`/interview/${lang}/${track}/${level}`} className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-primary dark:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 ease-out border border-transparent hover:border-border">
                <span>← Back to {lvlMeta.label}</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
