import { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  Building2,
  BookOpen,
  Layers,
  Target,
  Code2,
  Brain,
  Network,
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Gauge,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title:
    "Company Interview Prep — Amazon, Google, Microsoft, Meta & More | InterviewExplainer",
  description:
    "Company-specific interview preparation for FAANG, unicorns, and top tech. Interview process breakdown, DSA patterns, system design focus, behavioral frameworks, and compensation insights.",
  alternates: { canonical: `${SITE_URL}/companies` },
};

const FAANG = [
  {
    slug: "amazon",
    name: "Amazon",
    desc: "14 Leadership Principles drive every decision. Bar raiser model ensures consistent high bar. Behavioral is 50% of the evaluation — more than any other FAANG.",
    rounds: "OA → Phone → 4-5 Onsite Loops",
    dsaFocus: "Medium-Hard",
    sdFocus: "High",
    behavioralFocus: "Very High",
    topPatterns: ["Hash Maps", "Trees", "Graphs", "DP"],
    timeline: "4-8 weeks",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    slug: "google",
    name: "Google",
    desc: "Highest DSA bar in the industry. Emphasis on clean code, handling all edge cases, and optimal solutions. System design for L4+ (3+ years). Googliness assessment for culture fit.",
    rounds: "Phone → 4-5 Onsite (Coding + SD + Behavioral)",
    dsaFocus: "Very Hard",
    sdFocus: "High (L4+)",
    behavioralFocus: "Medium",
    topPatterns: ["Graphs", "DP", "Binary Search", "Two Pointers"],
    timeline: "6-12 weeks",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    desc: "Growth mindset culture. Pragmatic and collaborative interviews. Strong system design focus. Azure knowledge helpful for cloud roles. Very structured interview process.",
    rounds: "Phone → 4 Onsite (Coding + SD + Design + Hire/No-hire)",
    dsaFocus: "Medium",
    sdFocus: "High",
    behavioralFocus: "Medium",
    topPatterns: ["Arrays", "Trees", "Strings", "DP"],
    timeline: "3-6 weeks",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    slug: "meta",
    name: "Meta",
    desc: "Move fast culture. Heavy DSA emphasis (45 minutes, 2 problems expected). React/frontend expertise valued. System design at scale. Impact-focused behavioral questions.",
    rounds: "Phone → 3-4 Onsite (2 Coding + SD + Behavioral)",
    dsaFocus: "Hard",
    sdFocus: "High",
    behavioralFocus: "Medium-High",
    topPatterns: ["Arrays", "Graphs", "Strings", "BFS/DFS"],
    timeline: "4-8 weeks",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    slug: "apple",
    name: "Apple",
    desc: "Culture fit is paramount. Deep expertise in your specific domain required. Hardware-software integration knowledge valued. Secretive about projects even in interviews.",
    rounds: "Phone → Team Match → 5-6 Onsite Loops",
    dsaFocus: "Medium-Hard",
    sdFocus: "Medium-High",
    behavioralFocus: "High",
    topPatterns: ["Arrays", "Linked Lists", "Trees", "Concurrency"],
    timeline: "6-10 weeks",
    gradient: "from-slate-600 to-slate-800",
  },
  {
    slug: "netflix",
    name: "Netflix",
    desc: "Freedom & Responsibility culture. Hire senior-only. System design heavy. Java/Python backend focus. Compensation is top-of-market, all cash, no equity vesting games.",
    rounds: "Phone → 4-5 Onsite (Technical + Culture)",
    dsaFocus: "Medium",
    sdFocus: "Very High",
    behavioralFocus: "High",
    topPatterns: ["System Design", "Architecture", "API Design", "Scaling"],
    timeline: "4-8 weeks",
    gradient: "from-red-600 to-rose-700",
  },
];

const UNICORNS = [
  {
    slug: "uber",
    name: "Uber",
    desc: "Distributed systems at scale. Real-time systems, geo-spatial algorithms, micro-trips. Strong backend focus with Go and Java.",
    rounds: "Phone → 4 Onsite",
    dsaFocus: "Hard",
    sdFocus: "Very High",
    topPatterns: ["Graphs", "Geo-spatial", "DP", "System Design"],
  },
  {
    slug: "airbnb",
    name: "Airbnb",
    desc: "Strong culture fit emphasis. Unique 'cross-functional' interview. Frontend and full-stack focus. Booking system design commonly asked.",
    rounds: "Phone → 5 Onsite (incl. Cross-functional)",
    dsaFocus: "Medium-Hard",
    sdFocus: "High",
    topPatterns: ["Strings", "DP", "Search", "Booking Systems"],
  },
  {
    slug: "stripe",
    name: "Stripe",
    desc: "API design excellence. Payment systems, distributed transactions. Strong emphasis on code quality and debugging. Unique 'bug squash' interview round.",
    rounds: "Phone → 4 Onsite (incl. Bug Squash)",
    dsaFocus: "Medium",
    sdFocus: "High",
    topPatterns: ["APIs", "Payments", "Debugging", "Distributed Txn"],
  },
  {
    slug: "databricks",
    name: "Databricks",
    desc: "Spark expertise valued. Distributed computing, data pipelines. Strong on system design for data platforms. Growing rapidly.",
    rounds: "Phone → 4-5 Onsite",
    dsaFocus: "Medium-Hard",
    sdFocus: "High",
    topPatterns: ["DP", "Distributed Systems", "Data Pipelines", "SQL"],
  },
];

const INDIA_TIER1 = [
  {
    slug: "flipkart",
    name: "Flipkart",
    desc: "E-commerce at scale. Machine coding round is unique. Strong DSA + System Design. Java-heavy backend.",
    rounds: "Machine Coding → Phone → 3-4 Onsite",
    dsaFocus: "Hard",
    sdFocus: "High",
    topPatterns: ["DP", "Trees", "Machine Coding", "LLD"],
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    desc: "Payments at scale. Fintech domain expertise. Strong backend focus with Go/Java. Growing engineering team.",
    rounds: "Phone → 3-4 Onsite",
    dsaFocus: "Medium-Hard",
    sdFocus: "High",
    topPatterns: ["APIs", "System Design", "Payments", "Concurrency"],
  },
  {
    slug: "swiggy",
    name: "Swiggy",
    desc: "Hyperlocal logistics. Real-time systems, geo-spatial. Machine coding emphasis. Java/Kotlin backend.",
    rounds: "Machine Coding → 3-4 Onsite",
    dsaFocus: "Medium",
    sdFocus: "High",
    topPatterns: ["Machine Coding", "Geo-spatial", "LLD", "System Design"],
  },
];

const FINANCE = [
  {
    slug: "goldman-sachs",
    name: "Goldman Sachs",
    desc: "Quantitative reasoning, Java/Python, financial systems. Technical deep-dives. Multiple coding rounds. Strong on data structures.",
    rounds: "HackerRank → Phone → 4-5 Onsite",
    dsaFocus: "Hard",
    sdFocus: "Medium-High",
    topPatterns: ["DP", "Math", "Arrays", "Trees"],
  },
  {
    slug: "jpmorgan",
    name: "JPMorgan Chase",
    desc: "Enterprise Java, Spring ecosystem. CodeVue assessment. Cloud migration and modernization projects. Structured interview process.",
    rounds: "CodeVue → Phone → 3-4 Onsite",
    dsaFocus: "Medium",
    sdFocus: "Medium",
    topPatterns: ["Java", "Spring Boot", "SQL", "OOP"],
  },
];

const DSA_LEVEL_COLORS: Record<string, string> = {
  Medium: "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400",
  "Medium-Hard": "bg-orange-100 dark:bg-orange-950/20 text-orange-700",
  Hard: "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400",
  "Very Hard": "bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-400",
};

const SD_LEVEL_COLORS: Record<string, string> = {
  Medium: "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400",
  "Medium-High": "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400",
  High: "bg-indigo-100 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400",
  "Very High": "bg-violet-100 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400",
  "High (L4+)": "bg-indigo-100 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400",
};

function CompanyCard({
  company,
  showGradient,
}: {
  company: (typeof FAANG)[0];
  showGradient?: boolean;
}) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-orange-300 dark:border-orange-700 transition-all overflow-hidden"
    >
      {showGradient && (
        <div
          className={`h-1.5 bg-gradient-to-r ${company.gradient}`}
        />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-black text-foreground group-hover:text-orange-600 dark:text-orange-400 transition-colors">
            {company.name}
          </h3>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 dark:text-orange-400 group-hover:translate-x-1 transition-all mt-1" />
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {company.desc}
        </p>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DSA_LEVEL_COLORS[company.dsaFocus] ?? "bg-surface text-muted-foreground"}`}
          >
            DSA: {company.dsaFocus}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SD_LEVEL_COLORS[company.sdFocus] ?? "bg-surface text-muted-foreground"}`}
          >
            System Design: {company.sdFocus}
          </span>
          {"behavioralFocus" in company && company.behavioralFocus && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
              Behavioral: {company.behavioralFocus}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-3 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="font-medium">{company.rounds}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          {company.topPatterns.map((p) => (
            <span
              key={p}
              className="text-[10px] font-medium text-muted-foreground bg-surface px-2 py-0.5 rounded-md"
            >
              {p}
            </span>
          ))}
          {"timeline" in company && (
            <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-md ml-auto">
              {company.timeline}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

const totalCompanies =
  FAANG.length + UNICORNS.length + INDIA_TIER1.length + FINANCE.length;

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/20 font-sans text-foreground selection:bg-orange-200 dark:from-background dark:to-background/50 dark:via-background/80">
      <div className="w-full min-w-0 px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link
            href="/"
            className="hover:text-muted-foreground flex items-center gap-1"
          >
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground font-medium">Company Prep</span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-background dark:to-background/50 dark:via-background/80">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                Company-Specific Preparation
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Company Interview Prep
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Every company interviews differently. Amazon is 50% behavioral.
              Google has the hardest DSA bar. Stripe has a bug-squash round.
              We break down the process, focus areas, key patterns, and
              culture signals for {totalCompanies}+ companies — so you know
              exactly what to prepare.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Companies
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {totalCompanies}+
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Tiers Covered
                  </div>
                  <div className="text-lg font-bold text-foreground">4</div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-950/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Process Breakdowns
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    Detailed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* What Each Guide Covers */}
        <section className="mb-10 rounded-xl border border-border bg-background p-6">
          <h2 className="text-sm font-black text-foreground mb-4">
            What Each Company Guide Includes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Gauge, label: "Interview Process", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-950/20" },
              { icon: Code2, label: "DSA Focus Areas", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-950/20" },
              { icon: Network, label: "System Design", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/20" },
              { icon: Brain, label: "Behavioral Prep", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-950/20" },
              { icon: TrendingUp, label: "Difficulty Level", color: "text-red-600", bg: "bg-red-100 dark:bg-red-950/20" },
              { icon: Star, label: "Culture Signals", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-950/20" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mx-auto mb-2`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className="text-[11px] font-bold text-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FAANG */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-1.5">
            <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl font-black text-foreground">
              FAANG / Big Tech
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            The most sought-after companies with the most structured (and
            demanding) interview processes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FAANG.map((c) => (
              <CompanyCard key={c.slug} company={c} showGradient />
            ))}
          </div>
        </section>

        {/* Unicorns */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h2 className="text-xl font-black text-foreground">
              Top Unicorns & Growth Companies
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            High-growth companies with competitive comp and interesting
            technical challenges.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UNICORNS.map((c) => (
              <CompanyCard
                key={c.slug}
                company={{ ...c, gradient: "from-violet-500 to-purple-600", behavioralFocus: "", timeline: "" }}
              />
            ))}
          </div>
        </section>

        {/* India Tier-1 */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-1.5">
            <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-black text-foreground">
              India Tier-1 Tech
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Top Indian tech companies known for machine coding rounds and
            strong system design focus.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INDIA_TIER1.map((c) => (
              <CompanyCard
                key={c.slug}
                company={{ ...c, gradient: "from-emerald-500 to-teal-600", behavioralFocus: "", timeline: "" }}
              />
            ))}
          </div>
        </section>

        {/* Finance */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-1.5">
            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-black text-foreground">
              Finance & Banking
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Top financial institutions with strong enterprise engineering and
            quantitative focus.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FINANCE.map((c) => (
              <CompanyCard
                key={c.slug}
                company={{ ...c, gradient: "from-blue-500 to-cyan-600", behavioralFocus: "", timeline: "" }}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-orange-200 dark:border-orange-500/20 bg-gradient-to-r from-orange-50 to-amber-50 p-8 text-center mb-12 dark:from-background dark:to-background/50">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Company Prep Is Part of Your Domain Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Select your domain and get company-specific prep mapped to your
            tech stack, alongside Q&A, system design, DSA, behavioral,
            roadmap, and progress tracking.
          </p>
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Select Your Domain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
