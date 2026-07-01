import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, Users, Code2, BookOpen } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

const COMPANY_META: Record<string, {
  name: string;
  desc: string;
  dsaPatterns: string[];
  keyTopics: string[];
  langFocus: string[];
  rounds: { name: string; desc: string }[];
}> = {
  amazon: {
    name: "Amazon",
    desc: "FAANG-level preparation. Amazon is famous for the Leadership Principles (14 LPs) in behavioral rounds, and heavy DSA in coding rounds. System design is core for SDE2+.",
    dsaPatterns: ["hash-map", "tree-bfs", "tree-dfs", "dynamic-programming", "two-pointers"],
    keyTopics: ["system-design", "distributed-systems", "databases", "microservices"],
    langFocus: ["java", "python"],
    rounds: [
      { name: "OA (Online Assessment)", desc: "2 DSA problems, LeetCode medium/hard. Time-boxed. Focus on correctness over elegance." },
      { name: "Technical Phone Screen", desc: "1–2 coding problems + intro. Same DSA level. Sometimes system design lite." },
      { name: "Virtual Onsite (4–5 loops)", desc: "1 system design round + 3–4 coding rounds. Each round also has Leadership Principle questions." },
      { name: "Bar Raiser", desc: "Cross-functional calibration. Any round can be the bar raiser. Focus on your most impressive projects." },
    ],
  },
  google: {
    name: "Google",
    desc: "The hardest DSA bar in industry. Googlers write clean code, handle edge cases, analyze complexity. System design for L4+. Googliness + leadership for behavioral.",
    dsaPatterns: ["graph-bfs-dfs", "dynamic-programming", "binary-search", "backtracking", "heap-top-k"],
    keyTopics: ["system-design", "distributed-systems", "observability"],
    langFocus: ["python", "java", "go"],
    rounds: [
      { name: "Phone Screen (2x)", desc: "45 min each. 1–2 DSA problems on Google Docs (no IDE). Think aloud, edge cases, complexity." },
      { name: "Onsite (4–5 rounds)", desc: "Coding (3x) + System Design (1x) + Googliness/Leadership (1x). Expect hard-level DSA." },
    ],
  },
  microsoft: {
    name: "Microsoft",
    desc: "Rigorous but more pragmatic than Google/Amazon. Strong on system design and coding. Azure knowledge helpful for cloud roles. Collaborative culture emphasized.",
    dsaPatterns: ["tree-bfs", "tree-dfs", "hash-map", "two-pointers", "sliding-window"],
    keyTopics: ["system-design", "databases", "api-design", "security"],
    langFocus: ["csharp", "java", "python"],
    rounds: [
      { name: "Recruiter Screen", desc: "Background + motivation check. 30 min. Very lightweight." },
      { name: "Technical Screen", desc: "1 coding problem + behavioral. LeetCode medium." },
      { name: "Onsite (4 rounds)", desc: "Coding (2x) + Design (1x) + Behavioral (1x). Sometimes a 'As Appropriate' round with senior engineer." },
    ],
  },
  meta: {
    name: "Meta",
    desc: "Fast-paced culture (move fast). Heavy focus on DSA, React/frontend knowledge, and system design at scale. Data structures and algorithms are rigorously tested.",
    dsaPatterns: ["two-pointers", "sliding-window", "hash-map", "graph-bfs-dfs", "dynamic-programming"],
    keyTopics: ["system-design", "distributed-systems", "api-design"],
    langFocus: ["javascript", "python", "java"],
    rounds: [
      { name: "Initial Screen", desc: "LeetCode-style coding, 45 min. 1–2 problems. Python/JS preferred." },
      { name: "Onsite (5 rounds)", desc: "Coding (2x) + System Design (1x) + Behavioral (1x) + Leadership (1x). Move fast mentality in behavioral." },
    ],
  },
};

function toTitle(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ company: string }> }): Promise<Metadata> {
  const { company } = await params;
  const meta = COMPANY_META[company];
  const name = meta?.name ?? toTitle(company);
  const title = `${name} Interview Prep — DSA, System Design, Behavioral | InterviewExplainer`;
  const description = meta?.desc ?? `Complete ${name} interview preparation: coding rounds, system design, behavioral questions with interview strategies.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/companies/${company}` },
    openGraph: { title, description, url: `${SITE_URL}/companies/${company}` },
  };
}

export default async function CompanyHubPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const meta = COMPANY_META[company];
  const name = meta?.name ?? toTitle(company);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Company Prep", item: `${SITE_URL}/companies` },
          { "@type": "ListItem", position: 3, name: name, item: `${SITE_URL}/companies/${company}` },
        ],
      },
      {
        "@type": "WebPage",
        name: `${name} Interview Prep`,
        description: meta?.desc,
        url: `${SITE_URL}/companies/${company}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/20 dark:from-background dark:to-background/50 dark:via-background/80">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/companies" className="hover:text-foreground">Company Prep</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">{name}</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
            <Users className="h-3.5 w-3.5" />
            Company Prep
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">
            {name} Interview Guide
          </h1>
          {meta?.desc && <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{meta.desc}</p>}
        </header>

        {meta ? (
          <>
            {/* Interview Rounds */}
            <section className="mb-10">
              <h2 className="text-xl font-black text-foreground mb-5">Interview Process</h2>
              <div className="space-y-3">
                {meta.rounds.map((round, i) => (
                  <div key={round.name} className="flex gap-4 p-4 bg-background rounded-xl border border-border">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs font-black shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-black text-foreground mb-1">{round.name}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{round.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {/* DSA Patterns */}
              <section>
                <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Key DSA Patterns
                </h2>
                <div className="space-y-2">
                  {meta.dsaPatterns.map(p => (
                    <Link key={p} href={`/dsa/pattern/${p}`}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 dark:border-purple-700 hover:shadow-sm transition-all group">
                      <span className="text-sm font-semibold text-foreground group-hover:text-purple-600 dark:text-purple-400 capitalize">{p.replace(/-/g, " ")}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-purple-400 dark:text-purple-300" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Key Topics */}
              <section>
                <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  Key Technical Topics
                </h2>
                <div className="space-y-2">
                  {meta.keyTopics.map(t => (
                    <Link key={t} href={`/topics/${t}`}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-teal-200 dark:border-teal-500/20 hover:border-teal-400 dark:border-teal-700 hover:shadow-sm transition-all group">
                      <span className="text-sm font-semibold text-foreground group-hover:text-teal-600 dark:text-teal-400 capitalize">{t.replace(/-/g, " ")}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-teal-400 dark:text-teal-300" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Language focus */}
            <section className="mb-10 rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 p-5">
              <h2 className="text-base font-black text-foreground mb-3">Preferred Languages at {name}</h2>
              <div className="flex flex-wrap gap-2">
                {meta.langFocus.map(lang => (
                  <Link key={lang} href={`/interview/${lang}`}
                    className="px-4 py-2 bg-background border border-blue-300 dark:border-blue-700 rounded-lg text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:bg-blue-950/20 transition-colors capitalize">
                    {lang === "csharp" ? "C#" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-background p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-black text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground text-sm">{name} prep guide is being built. <Link href="/companies" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">Browse all companies →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
