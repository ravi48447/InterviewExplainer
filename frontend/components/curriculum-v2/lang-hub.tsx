/**
 * Phase 14 — Curriculum V2 language hub (/interview/:lang).
 * Hoisted from app/interview/[lang]/page.tsx.
 */

import Link from "next/link";
import { ChevronRight, Server, Globe, Database, Brain } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LangHubData } from "@/lib/curriculum";
import { Tag } from "@/components/ui/tag";

const ICON_MAP: Record<string, LucideIcon> = {
  server: Server,
  globe: Globe,
  database: Database,
  brain: Brain,
};

export function LangHub({ data }: { data: LangHubData }) {
  const { lang, name, tracks } = data;
  return (
    <div className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Interview Prep", item: "/interview" },
              { "@type": "ListItem", position: 3, name, item: `/interview/${lang}` },
            ],
          }),
        }}
      />
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/interview" className="hover:text-foreground">Interview Questions</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold" aria-current="page">{name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="type-display text-4xl tracking-tight text-foreground mb-3">{name} Interview Questions</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Everything you need to ace {name} interviews — across every track and experience level. Beginner to advanced, interview-framed answers with production examples.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-extrabold text-foreground mb-5">Choose Your Track</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tracks.map((track) => {
              const Icon = ICON_MAP[track.iconKey] ?? Server;
              return (
                <Link key={track.slug} href={`/interview/${lang}/${track.slug}`} className="group flex items-start gap-4 p-5 bg-background rounded-2xl border border-border hover:border-border hover:shadow-lg transition-colors duration-200 ease-out">
                  <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center shrink-0 shadow-md">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors mb-0.5">{track.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-2">{track.stacks}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{track.desc}</p>
                    <div className="mt-3 flex gap-2">
                      {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                        <Tag key={lvl} asChild>
                          <Link href={`/interview/${lang}/${track.slug}/${lvl.toLowerCase()}`} className="text-[10px] font-bold hover:bg-primary/10 hover:text-primary dark:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                            {lvl}
                          </Link>
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200 ease-out shrink-0 mt-1" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6  ">
          <h2 className="text-lg font-extrabold text-foreground mb-4">Jump Directly to a Level</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { level: "beginner", label: "Beginner", range: "0–2 yrs", color: "border-border hover:bg-success/10 text-success dark:text-success" },
              { level: "intermediate", label: "Intermediate", range: "2–5 yrs", color: "border-border hover:bg-warning/10 text-warning dark:text-warning" },
            ].map(({ level, label, range, color }) => (
              <Link key={level} href={`/interview/${lang}/backend/${level}`} className={`block p-4 bg-background rounded-xl border-2 ${color} transition-colors duration-200 ease-out`}>
                <div className="font-extrabold text-sm">{label}</div>
                <div className="text-xs opacity-75">{range} experience</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
