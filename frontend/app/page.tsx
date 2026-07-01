import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Layers,
  Code2,
  Award,
  Brain,
  Rocket,
  Lightbulb,
  Compass,
  Star,
} from "lucide-react";
import { TechIcon } from "@/components/tech-icon";
import { HeroActions, FinalCTA } from "@/components/landing/hero-actions";
import { HeroDashboardVisual } from "@/components/landing/hero-dashboard-visual";
import { NewsletterWidget } from "@/components/NewsletterWidget";
import {
  HomeStandoutPicks,
  type HomeStandoutPick,
} from "@/components/landing/home-priority-grid";
import {
  FeatureCard,
  FeatureCardIcon,
  FeatureCardHeader,
  FeatureCardDescription,
  FeatureCardFooter,
} from "@/components/landing/feature-card";
import {
  ENABLED_LANGUAGES,
  LAUNCH_QUICK_PATHS,
  isHubEnabled,
} from "@/lib/launch-config";
import { getSubcategoriesWithQuestions } from "@/lib/content-reader";


// Every language we intend to support, ever. `available` is derived from
// launch-config so the ROADMAP and UI can't drift apart.
const ALL_LANGUAGES = [
  { name: "Java",       slug: "java",       icon: "java",       gradient: "from-orange-50 dark:from-orange-950/400 to-red-600" },
  { name: "Python",     slug: "python",     icon: "python",     gradient: "from-blue-50 dark:from-blue-950/400 to-cyan-600" },
  { name: "JavaScript", slug: "javascript", icon: "javascript", gradient: "from-yellow-400 to-orange-50 dark:to-orange-950/400" },
  { name: "TypeScript", slug: "typescript", icon: "typescript", gradient: "from-blue-600 to-indigo-700" },
  { name: "Go",         slug: "go",         icon: "go",         gradient: "from-cyan-50 dark:from-cyan-950/400 to-blue-600" },
  { name: "Kotlin",     slug: "kotlin",     icon: "kotlin",     gradient: "from-purple-50 dark:from-purple-950/400 to-violet-600" },
  { name: "Ruby",       slug: "ruby",       icon: "ruby",       gradient: "from-red-50 dark:from-red-950/400 to-rose-600" },
  { name: "C#",         slug: "csharp",     icon: "csharp",     gradient: "from-indigo-600 to-purple-700" },
];

const LANGUAGES = ALL_LANGUAGES.map((l) => ({
  ...l,
  available: (ENABLED_LANGUAGES as readonly string[]).includes(l.slug),
}));

// Pillars — keep only those that point to a hub we've launched.
// When we unlock a hub, it automatically appears here.
const ALL_PILLARS = [
  { key: "interviewQA",    icon: BookOpen, title: "Interview Q&A",   desc: "Domain-specific questions tailored to your language, track, and experience level.",   stat: "400+ Questions",  gradient: "from-blue-50 dark:from-blue-950/400 to-indigo-600",   href: "/domains" },
  { key: "systemDesign",   icon: Compass,  title: "System Design",   desc: "Real interview problems with architecture, deep-dives, and scaling strategies.",       stat: "25+ Problems",    gradient: "from-emerald-50 dark:from-emerald-950/400 to-teal-600",  href: "/system-design" },
  { key: "dsa",            icon: Code2,    title: "DSA Problems",    desc: "Problems organized by pattern — two pointers, sliding window, DP, graphs.",            stat: "450+ Problems",   gradient: "from-violet-50 dark:from-violet-950/400 to-purple-600", href: "/dsa" },
  { key: "behavioral",     icon: Brain,    title: "Behavioral Prep", desc: "STAR method with company-specific guides and Amazon Leadership Principles.",           stat: "70+ Questions",   gradient: "from-amber-50 dark:from-amber-950/400 to-orange-600",  href: "/behavioral" },
  { key: "companies",      icon: Target,   title: "Company Prep",    desc: "FAANG, unicorns and top-tech process breakdowns.",                                     stat: "22+ Companies",   gradient: "from-orange-50 dark:from-orange-950/400 to-red-600",    href: "/companies" },
  { key: "career",         icon: Rocket,   title: "Career Guide",    desc: "Resume optimization, salary negotiation playbook, and career transition strategies.",  stat: "42+ Articles",    gradient: "from-rose-50 dark:from-rose-950/400 to-pink-600",     href: "/career" },
] as const;

const PILLARS = ALL_PILLARS.filter((p) => isHubEnabled(p.key));

/**
 * Memoized question counts for homepage standout picks (reads complete-qa.json
 * per module on first access; survives HMR via globalThis).
 */
const _g = globalThis as typeof globalThis & {
  _ie_homeStandoutPicks?: HomeStandoutPick[];
  _ie_moduleQuestionCount?: Map<string, number>;
};

function getCachedQuestionCount(
  domainSlug: string,
  moduleSlug: string,
): number {
  if (!_g._ie_moduleQuestionCount) _g._ie_moduleQuestionCount = new Map();
  const key = `${domainSlug}::${moduleSlug}`;
  const cached = _g._ie_moduleQuestionCount.get(key);
  if (cached !== undefined) return cached;
  const subcats = getSubcategoriesWithQuestions(domainSlug, moduleSlug);
  const total = subcats.reduce((s, sc) => s + sc.questions.length, 0);
  _g._ie_moduleQuestionCount.set(key, total);
  return total;
}

function buildHomeStandoutPicks(): HomeStandoutPick[] {
  if (_g._ie_homeStandoutPicks) return _g._ie_homeStandoutPicks;

  const jbi = "java-backend-intermediate";
  const jfi = "java-fullstack-intermediate";
  const goi = "go-intermediate";
  const coreJava = getCachedQuestionCount(jbi, "core-java");
  const javaOop = getCachedQuestionCount(jbi, "java-oop");
  const javaConcurrency = getCachedQuestionCount(jbi, "java-concurrency");
  const sqlDb = getCachedQuestionCount(jbi, "sql-databases");
  const springBoot = getCachedQuestionCount(jbi, "spring-boot");
  const restApi = getCachedQuestionCount(jbi, "rest-api");
  const microservices = getCachedQuestionCount(jbi, "microservices");
  const messaging = getCachedQuestionCount(jbi, "messaging-events");
  const kubernetes = getCachedQuestionCount(jbi, "kubernetes");
  const lld = getCachedQuestionCount(jbi, "low-level-design");
  const systemDesign =
    getCachedQuestionCount(jbi, "system-design") +
    getCachedQuestionCount(jbi, "system-design-cases");
  const reactCore = getCachedQuestionCount(jfi, "react-core");
  const typescript = getCachedQuestionCount(jfi, "typescript-essentials");
  const javascriptCore = getCachedQuestionCount(jfi, "javascript-core");
  const goConcurrency = getCachedQuestionCount(goi, "goroutines-channels");
  const goCore = getCachedQuestionCount(goi, "core-go");

  const picks: HomeStandoutPick[] = [
    {
      headline: "Top core Java interview questions",
      tagline:
        "Exceptions, generics, strings, I/O — the language fundamentals interviewers open with.",
      href: "/core-java-interview-questions#all-questions",
      questionCount: coreJava,
      icon: "java",
    },
    {
      headline: "Top Java OOP & SOLID interview questions",
      tagline:
        "Encapsulation, polymorphism, SOLID in Java, and the comparisons that show up in every loop.",
      href: "/java-oop-interview-questions#all-questions",
      questionCount: javaOop,
      icon: "braces",
    },
    {
      headline: "Top Java concurrency interview questions",
      tagline:
        "Threads, locks, the memory model, executors, and the scenario questions seniors get.",
      href: "/java-concurrency-interview-questions#all-questions",
      questionCount: javaConcurrency,
      icon: "zap",
    },
    {
      headline: "Top SQL interview questions",
      tagline:
        "Indexes, joins, transactions, isolation, and the database round beyond ORM trivia.",
      href: "/sql-interview-questions#all-questions",
      questionCount: sqlDb,
      icon: "sql",
    },
    {
      headline: "Top Spring Boot interview questions",
      tagline:
        "Auto-config, starters, profiles, actuator, and production follow-ups.",
      href: "/spring-boot-interview-questions#all-questions",
      questionCount: springBoot,
      icon: "spring",
    },
    {
      headline: "Top REST API & Spring MVC interview questions",
      tagline:
        "Controllers, HTTP semantics, validation, error handling, and API design trade-offs.",
      href: "/rest-api-interview-questions#all-questions",
      questionCount: restApi,
      icon: "layers",
    },
    {
      headline: "Top microservices interview questions",
      tagline:
        "Discovery, resilience, sagas, idempotency, and how services fail at scale.",
      href: "/microservices-interview-questions#all-questions",
      questionCount: microservices,
      icon: "link2",
    },
    {
      headline: "Top Kafka & event-driven interview questions",
      tagline:
        "Ordering, delivery guarantees, outbox, and the event-driven questions interviewers love.",
      href: "/kafka-interview-questions#all-questions",
      questionCount: messaging,
      icon: "radio",
    },
    {
      headline: "Top Kubernetes interview questions",
      tagline:
        "Pods, services, ingress, rollouts, probes, and the ops round for backend roles.",
      href: "/kubernetes-interview-questions#all-questions",
      questionCount: kubernetes,
      icon: "cloud",
    },
    {
      headline: "Top low-level design (LLD) interview questions",
      tagline:
        "Parking lot, elevator, vending machine — object design under time pressure.",
      href: "/low-level-design-interview-questions#all-questions",
      questionCount: lld,
      icon: "layout",
    },
    {
      headline: "Top system design interview questions",
      tagline:
        "Full hub: fundamentals, case studies, capacity, caching, and distributed trade-offs.",
      href: "/system-design#all-modules",
      questionCount: systemDesign,
      icon: "network",
    },
    {
      headline: "Top Python interview prep",
      tagline:
        "Backend, fullstack, ML, and data-engineering paths — pick your domain and level.",
      href: "/domains?language=Python",
      questionCount: null,
      icon: "python",
    },
    {
      headline: "Top React interview questions",
      tagline:
        "Hooks, JSX, state, effects, and performance from the fullstack track.",
      href: "/react-interview-questions#all-questions",
      questionCount: reactCore,
      icon: "react",
    },
    {
      headline: "Top TypeScript interview questions",
      tagline:
        "Types, generics, narrowing, and utility types — what frontend + fullstack loops ask.",
      href: "/typescript-interview-questions#all-questions",
      questionCount: typescript,
      icon: "typescript",
    },
    {
      headline: "Top JavaScript interview questions",
      tagline:
        "ES6+, closures, async/await, and the event loop — core JS before the framework layer.",
      href: "/javascript-interview-questions#all-questions",
      questionCount: javascriptCore,
      icon: "javascript",
    },
    {
      headline: "Top Go interview questions",
      tagline:
        "Interfaces, goroutines, channels, and the idiomatic patterns every Go interview probes.",
      href: "/go-intermediate#pillar-P01",
      questionCount: goCore,
      icon: "go",
    },
    {
      headline: "Top Go concurrency interview questions",
      tagline:
        "Goroutines, channels, select, context, and the race conditions that trip up candidates.",
      href: "/golang-goroutines-interview-questions#all-questions",
      questionCount: goConcurrency,
      icon: "zap",
    },
  ];

  _g._ie_homeStandoutPicks = picks;
  return picks;
}

const WHY_DIFFERENT = [
  { icon: Brain,      title: "Domain-Specific Content",  desc: "Java Backend ≠ Python Backend. Every question is tailored to your exact technology stack and patterns.",                gradient: "from-blue-50 dark:from-blue-950/400 to-indigo-600" },
  { icon: TrendingUp, title: "Experience-Level Aware",   desc: "Juniors get solid foundations with examples. Seniors get architecture patterns and scalability challenges.",            gradient: "from-purple-50 dark:from-purple-950/400 to-pink-600" },
  { icon: Target,     title: "Real Interview Focus",     desc: "Practice questions modeled on top tech company interviews. Learn what recruiters expect at your level, not theory.",    gradient: "from-orange-50 dark:from-orange-950/400 to-red-600" },
  { icon: Rocket,     title: "Progressive Learning",     desc: "Master basics, tackle intermediate, conquer advanced. Track your journey across every topic.",                           gradient: "from-cyan-50 dark:from-cyan-950/400 to-blue-600" },
];

export default function HomePage() {
  const standoutPicks = buildHomeStandoutPicks();

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-surface">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full px-6 sm:px-12 lg:px-20 relative z-10">
          <div className="w-full min-w-0">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-8 shadow-sm animate-fade-in-up anim-delay-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-primary">Built for developers, by developers</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6 leading-[1.05] animate-fade-in-up anim-delay-3">
                  Interview Prep That
                  <span className="block mt-2 text-primary">
                    Knows Your Stack
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-in-up anim-delay-4">
                  Get <span className="font-bold text-foreground">domain-specific questions</span> that match your{" "}
                  <span className="font-bold text-foreground">tech stack</span> and{" "}
                  <span className="font-bold text-foreground">experience level</span>. No generic content.
                </p>

                <div className="animate-fade-in-up anim-delay-5">
                  <HeroActions />
                </div>

                <div className="flex flex-wrap items-center gap-4 animate-fade-in-up anim-delay-6">
                  {["100% Free to Browse", `${(ENABLED_LANGUAGES as readonly string[]).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ')} Content Live`, "Sign up to track progress"].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                      <span className="font-semibold">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block animate-fade-in-scale anim-delay-3">
                <HeroDashboardVisual />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars (only shown if we've enabled more than Interview Q&A) ── */}
      {PILLARS.length > 1 && (
        <section className="py-20 bg-background">
          <div className="w-full px-6 sm:px-12 lg:px-20">
            <div className="w-full min-w-0">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                  <Layers className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold text-primary">Everything You Need</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
                  One Platform. Complete Prep.
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Stop juggling 5 different sites. We cover every dimension of the technical interview.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. DSA Problems */}
                <FeatureCard href="/dsa">
                  <FeatureCardIcon
                    icon={<Code2 className="h-6 w-6 text-white" />}
                    gradient="from-violet-50 dark:from-violet-950/400 to-purple-600"
                  />
                  <FeatureCardHeader>DSA Problems</FeatureCardHeader>
                  <FeatureCardDescription>
                    Pattern-based coding practice organized by core patterns — two pointers, sliding window, DP, graphs.
                  </FeatureCardDescription>
                  <FeatureCardFooter stat="450+ Problems" />
                </FeatureCard>

                {/* 2. Java Learning Paths */}
                <FeatureCard href="/java-backend-intermediate">
                  <FeatureCardIcon
                    icon={<TechIcon name="java" className="h-6 w-6 brightness-0 invert" />}
                    gradient="from-orange-50 dark:from-orange-950/400 to-red-600"
                  />
                  <FeatureCardHeader>Java Learning Paths</FeatureCardHeader>
                  <FeatureCardDescription>
                    Structured roadmaps covering Core Java, Backend Development, Spring Boot, System Design, Microservices, and Full Stack preparation.
                  </FeatureCardDescription>
                  <FeatureCardFooter stat="4 Learning Paths" />
                </FeatureCard>

                {/* 3. Interview Q&A */}
                <FeatureCard href="/domains">
                  <FeatureCardIcon
                    icon={<BookOpen className="h-6 w-6 text-white" />}
                    gradient="from-blue-50 dark:from-blue-950/400 to-indigo-600"
                  />
                  <FeatureCardHeader>Interview Q&A</FeatureCardHeader>
                  <FeatureCardDescription>
                    Domain-specific questions tailored to your language, track, and experience level.
                  </FeatureCardDescription>
                  <FeatureCardFooter stat="400+ Questions" />
                </FeatureCard>
              </div>
            </div>
          </div>
        </section>
      )}

      {standoutPicks.length > 0 && <HomeStandoutPicks picks={standoutPicks} />}

      {/* ── Choose Language ── */}
      <section className="py-20 bg-surface">
        <div className="w-full px-6 sm:px-12 lg:px-20">
          <div className="w-full min-w-0">
            <div className="w-full min-w-0 mb-16">
              <div className="bg-card border border-primary/20 rounded-2xl p-8 shadow-lg">
                <p className="text-lg leading-relaxed text-foreground text-center">
                  <span className="font-bold text-foreground">InterviewExplainer</span> isn't just another question bank. Browse{" "}
                  <span className="font-bold text-primary">domain-specific questions</span> curated for your exact{" "}
                  <span className="font-bold text-primary">tech stack</span> and{" "}
                  <span className="font-bold text-primary">experience level</span>. Whether you are a junior Java developer or a senior Python architect, you get questions that match{" "}
                  <span className="font-bold text-foreground">what real interviewers actually ask</span>.
                  <span className="block mt-4 text-lg font-bold text-foreground">
                    No generic content. No irrelevant theory. Just focused, practical prep that gets you hired.
                  </span>
                </p>
              </div>
            </div>

            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <Code2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">Step 1: Choose Your Language</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Pick Your Programming Language</h2>
              <p className="text-xl text-muted-foreground">Start with your primary language, then explore tailored career paths</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {LANGUAGES.map((lang) =>
                lang.available ? (
                  <Link key={lang.name} href={`/domains?language=${lang.name}`}>
                    <div className="relative bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                      <TechIcon name={lang.icon} className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-center text-sm font-semibold text-foreground">{lang.name}</p>
                    </div>
                  </Link>
                ) : (
                  <div key={lang.name} className="relative bg-card/50 border border-border rounded-xl p-4 opacity-50 cursor-not-allowed">
                    <TechIcon name={lang.icon} className="h-12 w-12 mx-auto mb-2 grayscale" />
                    <p className="text-center text-sm font-semibold text-muted-foreground">{lang.name}</p>
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold text-muted-foreground bg-surface px-1.5 py-0.5 rounded-full">Soon</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Paths ── */}
      <section className="py-20 bg-background">
        <div className="w-full px-6 sm:px-12 lg:px-20">
          <div className="w-full min-w-0">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <Rocket className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">Step 2: Quick Start Paths</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Jump Into Popular Career Paths</h2>
              <p className="text-xl text-muted-foreground">Pre-built learning paths for high-demand tech roles</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {LAUNCH_QUICK_PATHS.map((path) => (
                <Link href={path.href} key={path.href}>
                  <div className="group relative bg-card border border-border rounded-xl p-5 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                    <div className={`absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b ${path.gradient} rounded-r-full opacity-60 group-hover:w-1.5 transition-all duration-300`} />
                    <div className="relative flex items-start gap-4 mb-3">
                      <div className={`w-14 h-14 bg-gradient-to-br ${path.gradient} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                        <TechIcon name={path.icon} className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">{path.title}</h3>
                        <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md border border-primary/20">{path.level}</span>
                      </div>
                    </div>
                    <p className="relative text-sm text-muted-foreground mb-4 pl-0.5">{path.topics}</p>
                    <div className="relative flex items-center text-primary text-sm font-semibold group-hover:gap-1 transition-all">
                      Start Learning
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/domains" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:shadow-xl hover:opacity-90 transition-all">
                Browse All Career Paths
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Different ── */}
      <section className="py-20 bg-surface">
        <div className="w-full px-6 sm:px-12 lg:px-20">
          <div className="w-full min-w-0">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <Lightbulb className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">Why InterviewExplainer</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Built Different. Designed Smart.</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Generic interview prep doesn't work. We adapt everything to you.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHY_DIFFERENT.map((feature) => (
                <div key={feature.title} className="group relative bg-card border border-border rounded-xl p-5 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 bg-primary">
        <div className="w-full px-6 sm:px-12 lg:px-20">
          <div className="w-full min-w-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
              {[
                { value: "Java & Python", label: "Live Today", Icon: BookOpen },
                { value: "3", label: "Experience Levels", Icon: Layers },
                { value: "100%", label: "Free to Browse", Icon: Target },
                { value: "∞", label: "Free Forever", Icon: Star },
              ].map((stat) => (
                <div key={stat.label}>
                  <stat.Icon className="h-10 w-10 text-primary-foreground/60 mx-auto mb-4" />
                  <div className="text-5xl font-black text-primary-foreground mb-2">{stat.value}</div>
                  <div className="text-base text-primary-foreground/80 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 bg-background">
        <div className="w-full px-6 sm:px-12 lg:px-20">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-black text-foreground mb-3">New domains launching soon</h2>
            <p className="text-muted-foreground mb-8">
              JavaScript, TypeScript, Go, Ruby, and Kotlin packs are in progress. Be first to know when they go live.
            </p>
            <NewsletterWidget heading="Get notified when new content drops" subheading="" />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 bg-surface">
        <div className="w-full px-6 sm:px-12 lg:px-20">
          <div className="w-full min-w-0 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-50 dark:to-orange-950/400 mb-8 shadow-xl">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-foreground mb-6">Ready to Ace Your Interview?</h2>
            <p className="text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Browse free. Sign up to track your progress and unlock personalized insights.
            </p>
            <FinalCTA />
          </div>
        </div>
      </section>
    </div>
  );
}
