import { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  ArrowRight,
  Brain,
  BookOpen,
  Layers,
  Target,
  MessageSquare,
  Users,
  TrendingUp,
  AlertTriangle,
  Star,
  Lightbulb,
  Shield,
  Heart,
  Award,
  Briefcase,
} from "lucide-react";

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title:
    "Behavioral Interview Prep — STAR Method, Question Bank & Company-Specific",
  description:
    "Master behavioral interviews with STAR method framework, 50+ categorized questions, Amazon Leadership Principles prep, and company-specific behavioral guides. Free and comprehensive.",
  alternates: { canonical: `${SITE_URL}/behavioral` },
};

const CATEGORIES = [
  {
    slug: "leadership",
    name: "Leadership & Initiative",
    count: 12,
    desc: "Taking ownership, driving projects, influencing without authority, leading under pressure",
    icon: Star,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    slug: "teamwork",
    name: "Teamwork & Collaboration",
    count: 10,
    desc: "Cross-functional work, resolving disagreements, building consensus, supporting teammates",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    slug: "conflict-resolution",
    name: "Conflict Resolution",
    count: 8,
    desc: "Handling disagreements, managing stakeholders, navigating difficult conversations",
    icon: Shield,
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
  {
    slug: "failure-learning",
    name: "Failure & Learning",
    count: 6,
    desc: "Discussing mistakes constructively, showing growth mindset, post-mortem culture",
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    slug: "problem-solving",
    name: "Problem Solving",
    count: 8,
    desc: "Ambiguous situations, creative solutions, data-driven decisions, debugging production",
    icon: Lightbulb,
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
  {
    slug: "communication",
    name: "Communication",
    count: 6,
    desc: "Explaining technical concepts, presenting to executives, writing technical docs",
    icon: MessageSquare,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
  {
    slug: "growth-adaptability",
    name: "Growth & Adaptability",
    count: 6,
    desc: "Learning new technologies, adapting to change, handling ambiguity, continuous improvement",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    slug: "customer-focus",
    name: "Customer Focus",
    count: 5,
    desc: "User empathy, prioritizing customer impact, measuring outcomes, product thinking",
    icon: Heart,
    color: "text-pink-600",
    bg: "bg-pink-100",
  },
  {
    slug: "time-management",
    name: "Prioritization & Time Management",
    count: 5,
    desc: "Managing competing priorities, estimating work, saying no, deadline management",
    icon: Target,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    slug: "mentoring",
    name: "Mentoring & Development",
    count: 4,
    desc: "Coaching junior engineers, code reviews as teaching, fostering team growth",
    icon: Award,
    color: "text-teal-600",
    bg: "bg-teal-100",
  },
];

const COMPANY_SPECIFIC = [
  {
    slug: "amazon-lp",
    name: "Amazon Leadership Principles",
    count: 16,
    desc: "All 16 LPs with behavioral question mapping. Customer Obsession, Ownership, Dive Deep, and more. The most behavioral-heavy interview in tech.",
    tag: "FAANG",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    slug: "google-behavioral",
    name: "Google — Googleyness & Leadership",
    count: 8,
    desc: "Google's unique behavioral dimensions: cognitive ability, role-related knowledge, Googleyness, and leadership signals they look for.",
    tag: "FAANG",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    slug: "meta-behavioral",
    name: "Meta — Move Fast Culture",
    count: 8,
    desc: "Meta values impact and velocity. Questions focus on autonomy, driving impact, working at scale, and cross-functional collaboration.",
    tag: "FAANG",
    tagColor: "bg-indigo-100 text-indigo-700",
  },
  {
    slug: "microsoft-behavioral",
    name: "Microsoft — Growth Mindset",
    count: 6,
    desc: "Microsoft's culture emphasizes growth mindset, empathy, and customer obsession. Unique focus on inclusive leadership and accessibility.",
    tag: "FAANG",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    slug: "startup-behavioral",
    name: "Startups — Ownership & Scrappiness",
    count: 6,
    desc: "Startup interviews value resourcefulness, wearing multiple hats, handling ambiguity, and delivering with limited resources.",
    tag: "Startups",
    tagColor: "bg-purple-100 text-purple-700",
  },
];

const STAR_STEPS = [
  {
    letter: "S",
    title: "Situation",
    desc: "Set the context. When and where did this happen? What was your role? Keep it concise — 2-3 sentences max.",
    color: "from-blue-500 to-blue-600",
  },
  {
    letter: "T",
    title: "Task",
    desc: "What was your specific responsibility? What challenge or goal were you facing? What were the stakes?",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    letter: "A",
    title: "Action",
    desc: "What did YOU do? Be specific about your individual contribution. This should be 60% of your answer. Use 'I', not 'we'.",
    color: "from-violet-500 to-violet-600",
  },
  {
    letter: "R",
    title: "Result",
    desc: "What was the outcome? Quantify when possible (reduced latency by 40%, saved $50K/month). Include learnings.",
    color: "from-purple-500 to-purple-600",
  },
];

const totalQuestions = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

export default function BehavioralPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/20 font-sans text-foreground selection:bg-amber-200">
      <div className="w-full min-w-0 px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
          <Link
            href="/"
            className="hover:text-secondary flex items-center gap-1"
          >
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-secondary font-medium">
            Behavioral Interview
          </span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-amber-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                Soft Skills & Culture Fit
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Behavioral Interview Prep
            </h1>
            <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-3xl">
              Behavioral questions are asked in every single tech interview — at
              Amazon it&apos;s 50% of the evaluation. Master the STAR framework,
              practice with {totalQuestions}+ real questions organized by theme,
              and prepare company-specific responses for FAANG and top tech.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Categories
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {CATEGORIES.length}
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Total Questions
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {totalQuestions}+
                  </div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Company-Specific
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {COMPANY_SPECIFIC.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* STAR Method */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-black text-foreground">
              The STAR Method
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Every behavioral answer should follow this framework. Interviewers
            are trained to listen for it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STAR_STEPS.map((step) => (
              <div
                key={step.letter}
                className="rounded-xl border border-border bg-background shadow-sm p-5"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3`}
                >
                  <span className="text-xl font-black text-primary-foreground dark:text-foreground">
                    {step.letter}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Question Categories */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-black text-foreground">
              Question Categories
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Browse questions by theme. Each category includes sample answers
            with the STAR method applied, plus tips on what interviewers look
            for.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/behavioral/${cat.slug}`}
                className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-amber-300 transition-all p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${cat.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <cat.icon className={`h-5 w-5 ${cat.color}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {cat.count} Qs
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
                <h3 className="text-[15px] font-bold text-foreground group-hover:text-amber-600 transition-colors mb-1.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Company-Specific */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-black text-foreground">
              Company-Specific Behavioral Prep
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
            Every company has different behavioral expectations. Amazon lives
            and breathes Leadership Principles. Google values Googleyness. We
            break it down for each.
          </p>
          <div className="space-y-3">
            {COMPANY_SPECIFIC.map((comp) => (
              <Link
                key={comp.slug}
                href={`/behavioral/company/${comp.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-amber-300 transition-all p-5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-[15px] font-bold text-foreground group-hover:text-amber-600 transition-colors">
                      {comp.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${comp.tagColor}`}
                    >
                      {comp.tag}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {comp.count} areas
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {comp.desc}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-8 text-center mb-12">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Behavioral Prep Is Part of Every Interview Domain
          </h2>
          <p className="text-sm text-secondary mb-6 max-w-xl mx-auto">
            Select your domain and get behavioral questions mapped to your
            experience level alongside Q&A, system design, DSA, and a complete
            roadmap.
          </p>
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-primary-foreground dark:text-foreground font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Select Your Domain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
