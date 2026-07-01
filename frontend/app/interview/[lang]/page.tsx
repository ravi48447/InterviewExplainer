import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Server, Globe, Database, Brain } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

const LANG_META: Record<string, { name: string; tracks: { slug: string; name: string; icon: typeof Server; desc: string; stacks: string }[] }> = {
  java: {
    name: "Java",
    tracks: [
      { slug: "backend", name: "Java Backend", icon: Server, desc: "Spring Boot, Kafka, Redis, PostgreSQL, AWS, Microservices, JVM", stacks: "32 stacks · 500+ questions" },
      { slug: "fullstack", name: "Java Full Stack", icon: Globe, desc: "Java BE + React/Angular FE, REST APIs, Docker", stacks: "18 stacks · 200+ questions" },
    ],
  },
  python: {
    name: "Python",
    tracks: [
      { slug: "backend", name: "Python Backend", icon: Server, desc: "Django, FastAPI, Flask, SQLAlchemy, Celery, Redis", stacks: "28 stacks · 400+ questions" },
      { slug: "fullstack", name: "Python Full Stack", icon: Globe, desc: "Django/FastAPI + React, REST, WebSockets", stacks: "16 stacks · 180+ questions" },
      { slug: "data-engineering", name: "Data Engineering", icon: Database, desc: "Airflow, Spark, Kafka, dbt, data pipelines, warehouses", stacks: "12 stacks · 150+ questions" },
      { slug: "ml-ai", name: "ML / AI Engineering", icon: Brain, desc: "MLOps, LLMs, model deployment, feature engineering, vector DBs", stacks: "10 stacks · 120+ questions" },
    ],
  },
  javascript: {
    name: "JavaScript",
    tracks: [
      { slug: "frontend", name: "JS Frontend", icon: Globe, desc: "React, Next.js, TypeScript, Vue, Angular, performance", stacks: "20 stacks · Coming soon" },
      { slug: "backend", name: "Node.js Backend", icon: Server, desc: "Express, NestJS, GraphQL, REST, tRPC", stacks: "14 stacks · Coming soon" },
      { slug: "fullstack", name: "JS Full Stack", icon: Globe, desc: "React + Node, Next.js, Prisma, Vercel", stacks: "10 stacks · Coming soon" },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const meta = LANG_META[lang];
  if (!meta) return { title: "Not Found" };
  const title = `${meta.name} Interview Questions — All Tracks & Levels | InterviewExplainer`;
  const description = `Complete ${meta.name} interview preparation: ${meta.tracks.map(t => t.name).join(", ")}. Beginner to advanced answers, DSA, system design, company prep.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/interview/${lang}` },
    openGraph: { title, description, url: `${SITE_URL}/interview/${lang}` },
  };
}

export default async function LangHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const meta = LANG_META[lang];
  if (!meta) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/interview" className="hover:text-foreground">Interview Questions</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">{meta.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">
            {meta.name} Interview Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Everything you need to ace {meta.name} interviews — across every track and experience level.
            Beginner to advanced, interview-framed answers with production examples.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-black text-foreground mb-5">Choose Your Track</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {meta.tracks.map(track => {
              const Icon = track.icon;
              return (
                <Link
                  key={track.slug}
                  href={`/interview/${lang}/${track.slug}`}
                  className="group flex items-start gap-4 p-5 bg-background rounded-2xl border border-border hover:border-blue-400 dark:border-blue-700 hover:shadow-lg transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 dark:from-blue-950/400 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-foreground group-hover:text-blue-600 dark:text-blue-400 transition-colors mb-0.5">{track.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-2">{track.stacks}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{track.desc}</p>
                    <div className="mt-3 flex gap-2">
                      {["Beginner", "Intermediate", "Advanced"].map(lvl => (
                        <Link
                          key={lvl}
                          href={`/interview/${lang}/${track.slug}/${lvl.toLowerCase()}`}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg bg-surface text-muted-foreground hover:bg-blue-100 dark:bg-blue-950/20 hover:text-blue-700 dark:text-blue-400 transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          {lvl}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-400 dark:text-blue-300 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick links to levels */}
        <section className="rounded-2xl border border-indigo-200 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50 dark:from-indigo-950/40 to-purple-50 dark:to-purple-950/40 p-6  ">
          <h2 className="text-lg font-black text-foreground mb-4">Jump Directly to a Level</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { level: "beginner", label: "Beginner", range: "0–2 yrs", color: "border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
              { level: "intermediate", label: "Intermediate", range: "2–5 yrs", color: "border-amber-300 dark:border-amber-500/30 hover:bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
            ].map(({ level, label, range, color }) => (
              <Link
                key={level}
                href={`/interview/${lang}/backend/${level}`}
                className={`block p-4 bg-background rounded-xl border-2 ${color} transition-colors`}
              >
                <div className="font-black text-sm">{label}</div>
                <div className="text-xs opacity-75">{range} experience</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
