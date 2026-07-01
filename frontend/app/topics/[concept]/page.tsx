import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

const TOPIC_META: Record<string, { name: string; desc: string; tracks: { lang: string; track: string; level: string; stack: string; label: string }[]; tools?: string[]; comparisons?: string[] }> = {
  "system-design": {
    name: "System Design",
    desc: "Architecture interviews: scalability, availability, consistency, databases, caching, messaging, APIs. The senior engineer's domain.",
    tracks: [
      { lang: "java", track: "backend", level: "intermediate", stack: "system-design", label: "Java Backend System Design" },
      { lang: "java", track: "backend", level: "advanced", stack: "system-design", label: "Java Backend System Design (Advanced)" },
    ],
    tools: ["kafka", "redis", "postgresql", "docker", "kubernetes"],
    comparisons: ["microservices-vs-monolith", "sql-vs-nosql", "rest-vs-graphql"],
  },
  microservices: {
    name: "Microservices",
    desc: "Service decomposition, inter-service communication, service discovery, distributed tracing, saga patterns, and when NOT to use microservices.",
    tracks: [
      { lang: "java", track: "backend", level: "intermediate", stack: "microservices", label: "Java Microservices — Intermediate" },
      { lang: "java", track: "backend", level: "advanced", stack: "microservices", label: "Java Microservices — Advanced" },
    ],
    comparisons: ["microservices-vs-monolith"],
  },
  "event-driven-architecture": {
    name: "Event-Driven Architecture",
    desc: "Events, commands, publishers, consumers, event sourcing, CQRS, outbox pattern, eventual consistency.",
    tracks: [
      { lang: "java", track: "backend", level: "intermediate", stack: "kafka", label: "Java Kafka (Event-Driven)" },
    ],
    tools: ["kafka", "rabbitmq"],
    comparisons: ["kafka-vs-rabbitmq"],
  },
  caching: {
    name: "Caching",
    desc: "Cache strategies (write-through, write-behind, read-through), eviction policies, cache invalidation, distributed caching, Redis patterns.",
    tracks: [
      { lang: "java", track: "backend", level: "intermediate", stack: "redis", label: "Java Redis Caching" },
    ],
    tools: ["redis"],
    comparisons: ["redis-vs-memcached"],
  },
};

function toTitle(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ concept: string }> }): Promise<Metadata> {
  const { concept } = await params;
  const meta = TOPIC_META[concept];
  const name = meta?.name ?? toTitle(concept);
  const title = `${name} Interview Questions — All Languages | InterviewExplainer`;
  const description = meta?.desc ?? `Complete ${name} interview preparation — concepts, patterns, trade-offs across all languages and experience levels.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/topics/${concept}` },
    openGraph: { title, description, url: `${SITE_URL}/topics/${concept}` },
  };
}

export default async function TopicHubPage({ params }: { params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  const meta = TOPIC_META[concept];
  const name = meta?.name ?? toTitle(concept);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/20 dark:from-background dark:to-background/50 dark:via-background/80">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/topics" className="hover:text-foreground">Topics</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">{name}</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-100 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            Concept Hub · Cross-Language
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">{name}</h1>
          {meta?.desc && <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{meta.desc}</p>}
        </header>

        {meta?.tracks && meta.tracks.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-black text-foreground mb-5">Interview Questions by Track</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {meta.tracks.map(t => (
                <Link key={`${t.lang}-${t.track}-${t.level}-${t.stack}`}
                  href={`/interview/${t.lang}/${t.track}/${t.level}/${t.stack}`}
                  className="group flex items-center gap-4 p-4 bg-background rounded-xl border border-border hover:border-violet-400 dark:border-violet-700 hover:shadow-md transition-all">
                  <div className="flex-1">
                    <div className="text-sm font-black text-foreground group-hover:text-violet-600 dark:text-violet-400 transition-colors">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{toTitle(t.lang)} · {toTitle(t.level)}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-400 dark:text-violet-300 shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {meta?.tools && meta.tools.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-black text-foreground mb-4">Relevant Tools</h2>
            <div className="flex flex-wrap gap-2">
              {meta.tools.map(t => (
                <Link key={t} href={`/tools/${t}`}
                  className="px-4 py-2 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-500/20 rounded-lg text-sm font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:bg-teal-950/20 transition-colors capitalize">
                  {t.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </section>
        )}

        {meta?.comparisons && meta.comparisons.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-black text-foreground mb-4">Common Comparisons</h2>
            <div className="flex flex-wrap gap-2">
              {meta.comparisons.map(c => (
                <Link key={c} href={`/compare/${c}`}
                  className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:border-blue-400 dark:border-blue-700 hover:text-blue-600 dark:text-blue-400 transition-all">
                  {c.replace(/-vs-/g, " vs ").replace(/-/g, " ")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {!meta && (
          <div className="rounded-2xl border border-border bg-background p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-black text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground text-sm">{name} questions are being added. <Link href="/interview" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">Browse all questions →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
