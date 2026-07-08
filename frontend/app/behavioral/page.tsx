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
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/20",
  },
  {
    slug: "teamwork",
    name: "Teamwork & Collaboration",
    count: 10,
    desc: "Cross-functional work, resolving disagreements, building consensus, supporting teammates",
    icon: Users,
    color: "text-primary dark:text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "conflict-resolution",
    name: "Conflict Resolution",
    count: 8,
    desc: "Handling disagreements, managing stakeholders, navigating difficult conversations",
    icon: Shield,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-950/20",
  },
  {
    slug: "failure-learning",
    name: "Failure & Learning",
    count: 6,
    desc: "Discussing mistakes constructively, showing growth mindset, post-mortem culture",
    icon: AlertTriangle,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950/20",
  },
  {
    slug: "problem-solving",
    name: "Problem Solving",
    count: 8,
    desc: "Ambiguous situations, creative solutions, data-driven decisions, debugging production",
    icon: Lightbulb,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "communication",
    name: "Communication",
    count: 6,
    desc: "Explaining technical concepts, presenting to executives, writing technical docs",
    icon: MessageSquare,
    color: "text-primary",
    bg: "bg-cyan-100 dark:bg-cyan-950/20",
  },
  {
    slug: "growth-adaptability",
    name: "Growth & Adaptability",
    count: 6,
    desc: "Learning new technologies, adapting to change, handling ambiguity, continuous improvement",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-950/20",
  },
  {
    slug: "customer-focus",
    name: "Customer Focus",
    count: 5,
    desc: "User empathy, prioritizing customer impact, measuring outcomes, product thinking",
    icon: Heart,
    color: "text-primary",
    bg: "bg-pink-100 dark:bg-pink-950/20",
  },
  {
    slug: "time-management",
    name: "Prioritization & Time Management",
    count: 5,
    desc: "Managing competing priorities, estimating work, saying no, deadline management",
    icon: Target,
    color: "text-primary",
    bg: "bg-blue-100 dark:bg-blue-950/20",
  },
  {
    slug: "mentoring",
    name: "Mentoring & Development",
    count: 4,
    desc: "Coaching junior engineers, code reviews as teaching, fostering team growth",
    icon: Award,
    color: "text-teal-600",
    bg: "bg-teal-100 dark:bg-teal-950/20",
  },
];

const COMPANY_SPECIFIC = [
  {
    slug: "amazon-lp",
    name: "Amazon Leadership Principles",
    count: 16,
    desc: "All 16 LPs with behavioral question mapping. Customer Obsession, Ownership, Dive Deep, and more. The most behavioral-heavy interview in tech.",
    tag: "FAANG",
    tagColor: "bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400",
  },
  {
    slug: "google-behavioral",
    name: "Google — Googleyness & Leadership",
    count: 8,
    desc: "Google's unique behavioral dimensions: cognitive ability, role-related knowledge, Googleyness, and leadership signals they look for.",
    tag: "FAANG",
    tagColor: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  },
  {
    slug: "meta-behavioral",
    name: "Meta — Move Fast Culture",
    count: 8,
    desc: "Meta values impact and velocity. Questions focus on autonomy, driving impact, working at scale, and cross-functional collaboration.",
    tag: "FAANG",
    tagColor: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  },
  {
    slug: "microsoft-behavioral",
    name: "Microsoft — Growth Mindset",
    count: 6,
    desc: "Microsoft's culture emphasizes growth mindset, empathy, and customer obsession. Unique focus on inclusive leadership and accessibility.",
    tag: "FAANG",
    tagColor: "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400",
  },
  {
    slug: "startup-behavioral",
    name: "Startups — Ownership & Scrappiness",
    count: 6,
    desc: "Startup interviews value resourcefulness, wearing multiple hats, handling ambiguity, and delivering with limited resources.",
    tag: "Startups",
    tagColor: "bg-blue-100 dark:bg-blue-950/20 text-primary dark:text-primary",
  },
];

const STAR_STEPS = [
  {
    letter: "S",
    title: "Situation",
    desc: "Set the context. When and where did this happen? What was your role? Keep it concise — 2-3 sentences max.",
    color: "from-blue-400 to-blue-500",
  },
  {
    letter: "T",
    title: "Task",
    desc: "What was your specific responsibility? What challenge or goal were you facing? What were the stakes?",
    color: "from-blue-500 to-blue-600",
  },
  {
    letter: "A",
    title: "Action",
    desc: "What did YOU do? Be specific about your individual contribution. This should be 60% of your answer. Use 'I', not 'we'.",
    color: "from-blue-600 to-blue-700",
  },
  {
    letter: "R",
    title: "Result",
    desc: "What was the outcome? Quantify when possible (reduced latency by 40%, saved $50K/month). Include learnings.",
    color: "from-blue-700 to-blue-800",
  },
];

const totalQuestions = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

export default function BehavioralPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-950/40  to-orange-50/20 dark:to-orange-950/40 font-sans text-foreground selection:bg-amber-200  ">
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
          <span className="text-muted-foreground font-medium">
            Behavioral Interview
          </span>
        </nav>

        {/* Hero */}
        <header className="mb-12 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="relative px-8 py-8 bg-surface via-orange-50 dark:via-orange-950/40 to-rose-50 dark:to-rose-950/40  ">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Soft Skills & Culture Fit
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Behavioral Interview Prep
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Behavioral questions are asked in every single tech interview — at
              Amazon it&apos;s 50% of the evaluation. Master the STAR framework,
              practice with {totalQuestions}+ real questions organized by theme,
              and prepare company-specific responses for FAANG and top tech.
            </p>
          </div>
          <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
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
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
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
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-rose-600 dark:text-rose-400" />
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
            <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
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
                  <span className="text-xl font-black text-white">
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
            <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
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
                className="group rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default/30 transition-all p-5"
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
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 dark:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
                <h3 className="text-[15px] font-bold text-foreground group-hover:text-amber-600 dark:text-amber-400 transition-colors mb-1.5">
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
            <Briefcase className="h-5 w-5 text-rose-600 dark:text-rose-400" />
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
                className="group flex items-start gap-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-default dark:border-default/30 transition-all p-5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-[15px] font-bold text-foreground group-hover:text-amber-600 dark:text-amber-400 transition-colors">
                      {comp.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${comp.tagColor}`}
                    >
                      {comp.tag}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {comp.count} areas
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {comp.desc}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 dark:text-amber-400 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-default dark:border-default/20 bg-surface p-8 text-center mb-12  ">
          <h2 className="text-2xl font-black text-foreground mb-3">
            Behavioral Prep Is Part of Every Interview Domain
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            Select your domain and get behavioral questions mapped to your
            experience level alongside Q&A, system design, DSA, and a complete
            roadmap.
          </p>
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-8 py-3 bg-surface border border-default text-foreground font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            Select Your Domain
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
