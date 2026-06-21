import { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  Briefcase,
  BookOpen,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  Search,
  MessageSquare,
  Shield,
  Star,
  Target,
  Lightbulb,
  GraduationCap,
  Award,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title:
    "Career Guide for Software Engineers — Resume, Negotiation, Interview Process",
  description:
    "Complete career guide for software engineers. Resume optimization for ATS and recruiters, salary negotiation playbook, interview process breakdowns for FAANG, company tier rankings, and career transition strategies.",
  alternates: { canonical: `${SITE_URL}/career` },
};

const MAIN_SECTIONS = [
  {
    slug: "resume",
    name: "Resume & Portfolio",
    desc: "ATS-optimized resume templates, action verb lists, project descriptions that impress, GitHub portfolio strategy, LinkedIn optimization",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-100",
    articles: 8,
    highlight: "Includes downloadable templates",
  },
  {
    slug: "interview-process",
    name: "Interview Process Deep-Dive",
    desc: "Step-by-step breakdown of tech interview processes at 20+ companies. What to expect in each round, how to prepare, timeline management",
    icon: Search,
    color: "text-violet-600",
    bg: "bg-violet-100",
    articles: 12,
    highlight: "FAANG + unicorn processes covered",
  },
  {
    slug: "negotiation",
    name: "Salary Negotiation Playbook",
    desc: "Evidence-based negotiation strategies. How to evaluate offers, negotiate base + equity + signing bonus, handle competing offers, know your leverage",
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    articles: 6,
    highlight: "Scripts and email templates included",
  },
  {
    slug: "company-tiers",
    name: "Company Tier Rankings",
    desc: "How companies are tiered in the industry. FAANG vs Tier-2 vs startups. Compensation benchmarks, work-life balance, growth trajectories",
    icon: Building2,
    color: "text-amber-600",
    bg: "bg-amber-100",
    articles: 5,
    highlight: "2025 compensation data",
  },
  {
    slug: "career-transitions",
    name: "Career Transitions",
    desc: "Switching roles: frontend to backend, IC to management, big tech to startup, non-tech to tech. Framework for evaluating transitions",
    icon: TrendingUp,
    color: "text-rose-600",
    bg: "bg-rose-100",
    articles: 7,
    highlight: "Real transition stories",
  },
  {
    slug: "networking",
    name: "Networking & Referrals",
    desc: "How to get referrals without being spammy. Cold outreach templates, conference networking, building your professional brand",
    icon: Users,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
    articles: 4,
    highlight: "Cold message templates",
  },
];

const QUICK_GUIDES = [
  {
    title: "How to Write a One-Page Resume That Gets Callbacks",
    category: "Resume",
    readTime: "8 min read",
    slug: "one-page-resume",
    icon: FileText,
  },
  {
    title: "The Counter-Offer Email Template That Works",
    category: "Negotiation",
    readTime: "5 min read",
    slug: "counter-offer-template",
    icon: DollarSign,
  },
  {
    title: "Amazon Interview: Complete Process Breakdown",
    category: "Process",
    readTime: "12 min read",
    slug: "amazon-process",
    icon: Search,
  },
  {
    title: "Should You Join a Startup or Big Tech?",
    category: "Transitions",
    readTime: "10 min read",
    slug: "startup-vs-big-tech",
    icon: Lightbulb,
  },
  {
    title: "How to Negotiate When You Have No Other Offers",
    category: "Negotiation",
    readTime: "7 min read",
    slug: "negotiate-single-offer",
    icon: Shield,
  },
  {
    title: "Building a GitHub Portfolio That Stands Out",
    category: "Resume",
    readTime: "6 min read",
    slug: "github-portfolio",
    icon: Star,
  },
  {
    title: "From Junior to Senior: 3-Year Acceleration Plan",
    category: "Growth",
    readTime: "15 min read",
    slug: "junior-to-senior",
    icon: GraduationCap,
  },
  {
    title: "FAANG vs Non-FAANG: Total Comp Analysis 2025",
    category: "Compensation",
    readTime: "10 min read",
    slug: "faang-comp-analysis",
    icon: Award,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Resume: "bg-blue-100 text-blue-700",
  Negotiation: "bg-emerald-100 text-emerald-700",
  Process: "bg-violet-100 text-violet-700",
  Transitions: "bg-rose-100 text-rose-700",
  Growth: "bg-amber-100 text-amber-700",
  Compensation: "bg-cyan-100 text-cyan-700",
};

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/20 to-pink-50/20 font-sans text-slate-800 selection:bg-rose-200">
      <div className="w-full min-w-0 px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
          <Link
            href="/"
            className="hover:text-slate-600 flex items-center gap-1"
          >
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 font-medium">Career Guide</span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-5 w-5 text-rose-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600">
                Beyond the Interview
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
              Career Guide for Software Engineers
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              Acing the technical interview is only half the battle. This guide
              covers everything else — crafting a resume that passes ATS
              screens, understanding interview processes at 20+ companies,
              negotiating offers with real scripts, evaluating company tiers, and
              planning career transitions. Written by engineers who&apos;ve been
              through it.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Sections
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {MAIN_SECTIONS.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Articles
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {MAIN_SECTIONS.reduce((s, sec) => s + sec.articles, 0)}+
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-fuchsia-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-fuchsia-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    Templates
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    Included
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Sections */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-black text-slate-900">
              Complete Career Sections
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-5 max-w-2xl">
            Each section is a comprehensive guide with actionable advice,
            templates, and real examples from industry professionals.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MAIN_SECTIONS.map((section) => (
              <Link
                key={section.slug}
                href={`/career/${section.slug}`}
                className="group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-rose-300 transition-all p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${section.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <section.icon
                      className={`h-5 w-5 ${section.color}`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                      {section.articles} articles
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
                <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-rose-600 transition-colors mb-1.5">
                  {section.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {section.desc}
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    {section.highlight}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-black text-slate-900">
              Popular Articles
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-5 max-w-2xl">
            The most-read career guides. Each one is a deep-dive with actionable
            takeaways you can implement immediately.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/career/articles/${guide.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-rose-200 transition-all p-4"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                  <guide.icon className="h-4 w-4 text-slate-500 group-hover:text-rose-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug mb-0.5">
                    {guide.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[guide.category] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {guide.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {guide.readTime}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 p-8 text-center mb-12">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Career Guidance + Technical Prep = Complete Package
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-xl mx-auto">
            Combine career strategy with domain-specific interview prep. Select
            your path and get Q&A, system design, DSA, behavioral, roadmap,
            cheatsheets — plus all the career guidance above.
          </p>
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Select Your Domain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
