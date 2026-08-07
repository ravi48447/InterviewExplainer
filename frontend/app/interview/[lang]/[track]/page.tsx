import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Users, BookOpen, TrendingUp } from "lucide-react";
import { EXPERIENCE_LEVELS, type ExperienceLevelKey } from "@/lib/levels";
import { getVisibleStackSlugs } from "@/lib/content-reader";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

function toTitle(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; track: string }> }): Promise<Metadata> {
  const { lang, track } = await params;
  const langTitle = toTitle(lang);
  const trackTitle = toTitle(track);
  const title = `${langTitle} ${trackTitle} Interview Questions — All Levels | InterviewExplainer`;
  const description = `${langTitle} ${trackTitle} interview questions for all experience levels (0–2, 2–5, 5+ years). Beginner to advanced — interview-framed answers with production examples.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/interview/${lang}/${track}` },
    openGraph: { title, description, url: `${SITE_URL}/interview/${lang}/${track}` },
  };
}

export default async function TrackHubPage({ params }: { params: Promise<{ lang: string; track: string }> }) {
  const { lang, track } = await params;
  const langTitle = toTitle(lang);
  const trackTitle = toTitle(track);

  // Get stack counts per level
  const levelData = (Object.entries(EXPERIENCE_LEVELS) as [ExperienceLevelKey, typeof EXPERIENCE_LEVELS[ExperienceLevelKey]][]).map(([key, meta]) => {
    const domainSlug = `${lang}-${track}-${key}`;
    const stacks = getVisibleStackSlugs(domainSlug);
    return { key, meta, stacks, domainSlug };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Interview Questions", item: `${SITE_URL}/interview` },
          { "@type": "ListItem", position: 3, name: langTitle, item: `${SITE_URL}/interview/${lang}` },
          { "@type": "ListItem", position: 4, name: `${langTitle} ${trackTitle}`, item: `${SITE_URL}/interview/${lang}/${track}` },
        ],
      },
      {
        "@type": "WebPage",
        name: `${langTitle} ${trackTitle} Interview Questions`,
        description: `All experience levels for ${langTitle} ${trackTitle} engineering interviews.`,
        url: `${SITE_URL}/interview/${lang}/${track}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-surface border border-default">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/interview" className="hover:text-foreground">Interview Questions</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/interview/${lang}`} className="hover:text-foreground">{langTitle}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">{trackTitle}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">
            {langTitle} {trackTitle} Interview Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Complete interview preparation for {langTitle} {trackTitle} engineers — three experience levels,
            each with genuinely different answers, production examples, and what interviewers actually want to hear.
          </p>
        </header>

        {/* Level Cards */}
        <section className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {levelData.map(({ key, meta, stacks }) => (
            <Link
              key={key}
              href={`/interview/${lang}/${track}/${key}`}
              className="group relative rounded-2xl border-2 bg-background p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
              style={{ borderColor: meta.color + "80" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-black border ${meta.colorClass}`}>
                  {meta.label} · {meta.range}
                </span>
                <TrendingUp className="h-5 w-5 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors" />
              </div>

              <div className="mb-4">
                <div className="text-3xl font-black text-foreground">{stacks.length}</div>
                <div className="text-sm text-muted-foreground">tech stacks</div>
              </div>

              {stacks.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {stacks.slice(0, 5).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-surface text-muted-foreground rounded-md font-medium">
                      {toTitle(s)}
                    </span>
                  ))}
                  {stacks.length > 5 && (
                    <span className="text-[10px] px-2 py-0.5 bg-surface text-muted-foreground rounded-md">
                      +{stacks.length - 5} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all" style={{ color: meta.color }}>
                {stacks.length > 0 ? "Start Preparing" : "Coming Soon"}
                <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </section>

        {/* What's different per level */}
        <section className="rounded-2xl border border-border bg-background p-8 mb-12">
          <h2 className="text-xl font-black text-foreground mb-6">What Changes Between Levels</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Aspect</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Beginner</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Intermediate</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Advanced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
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

        {/* CTA */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href={`/dsa`} className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-default dark:border-default/20 hover:shadow-lg transition-all group  ">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary dark:text-primary" />
            </div>
            <div>
              <div className="font-black text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors">DSA Problems</div>
              <div className="text-xs text-muted-foreground">Line-by-line explanations — beats LeetCode</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href={`/companies`} className="flex items-center gap-4 p-5 bg-gradient-to-br from-orange-50 dark:from-orange-950/40  rounded-2xl border border-orange-200 dark:border-orange-500/20 hover:shadow-lg transition-all group  ">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="font-black text-foreground group-hover:text-orange-600 dark:text-orange-400 transition-colors">Company Prep</div>
              <div className="text-xs text-muted-foreground">Amazon, Google, Microsoft, Meta</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>
      </div>
    </div>
  );
}
