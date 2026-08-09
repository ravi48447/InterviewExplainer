/**
 * app/search/page.tsx — Canonical global search route (P07-T261..T282).
 *
 * Phase 07 route migration. Server component shell that hydrates the
 * canonical <SearchInput/> (client) for query + results, plus discovery
 * surfaces (popular searches, quick links) for the no-query state.
 *
 * SEO: buildMetadata with family "question" (search is question-centric).
 */

import Link from "next/link";
import { Search, Layers, BookOpen, Code2, TrendingUp } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/search-v2";

export const metadata = buildMetadata({
  family: "question",
  params: {},
  title: "Search Interview Questions",
  description:
    "Search across all interview questions, topics, and learning paths. Instant local content search with typo tolerance and smart suggestions.",
});

export const revalidate = 3600;

const POPULAR_SEARCHES = [
  "HashMap",
  "Spring Boot",
  "OOPS",
  "REST API",
  "Microservices",
  "SQL Joins",
  "Docker",
  "System Design",
  "Collections",
  "Multithreading",
];

const QUICK_LINKS = [
  { href: "/domains", icon: Layers, title: "All Learning Paths", desc: "Browse all languages, tracks & levels" },
  { href: "/topics", icon: BookOpen, title: "Topics", desc: "Explore concepts & fundamentals" },
  { href: "/dsa", icon: Code2, title: "DSA Problems", desc: "Data structures & algorithms practice" },
  { href: "/tools", icon: TrendingUp, title: "Tools & Technologies", desc: "Docker, Kafka, Redis & more" },
] as const;

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-surface">
      <main className="page-container py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-card text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-widest border border-border">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            Search
          </div>
          <h1 className="type-display text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Find Any Question
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Search across all interview questions, topics, and learning paths.
            Instant results powered by local content search.
          </p>
        </div>

        {/* Canonical search input + results */}
        <div className="mx-auto max-w-2xl">
          <SearchInput
            placeholder="Search questions... (e.g. HashMap, Spring Boot, Docker)"
            autoFocus
          />
        </div>

        {/* Discovery surfaces — shown below the input; the SearchInput
            manages its own results overlay, so these act as the landing
            content when no query is active. */}
        <div className="mx-auto max-w-2xl mt-10">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Popular Searches
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className={cn(
                    "px-4 py-2 rounded-xl bg-card border border-border text-sm font-semibold text-foreground",
                    "hover:border-ring hover:text-primary hover:bg-surface",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                    "transition-colors duration-200 ease-out shadow-sm",
                  )}
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Quick Links
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_LINKS.map(({ href, icon: Icon, title, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group flex items-center gap-4 p-5 rounded-xl bg-card border border-border",
                    "hover:border-ring hover:shadow-md",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                    "transition-colors duration-200 ease-out",
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 group-hover:bg-card transition-colors duration-200 ease-out">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200 ease-out">
                      {title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
