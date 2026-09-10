import type { Metadata } from "next";
import Link from "next/link";
import { Target, BookOpen, Users, Zap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About | InterviewExplainer",
  description:
    "Learn about the mission, story, and team behind InterviewExplainer — structured interview preparation for software developers.",
};

const VALUES = [
  {
    icon: Target,
    title: "Precision over volume",
    desc: "Every question is chosen because real interviewers ask it. We do not pad the library with theory that never comes up in an interview.",
  },
  {
    icon: BookOpen,
    title: "Depth over breadth",
    desc: "A thorough answer to one question beats five shallow ones. Our answers explain the why, not just the what.",
  },
  {
    icon: Zap,
    title: "Stack-specific, not generic",
    desc: "A Java backend interview is fundamentally different from a Python backend interview. Content is curated to your exact stack and experience level.",
  },
  {
    icon: Users,
    title: "Built by developers, for developers",
    desc: "We have sat on both sides of the interview table. Everything we build comes from that lived experience.",
  },
];

export default function AboutPage() {
  return (
    <main className="w-full min-w-0 px-6 py-16">
      {/* Hero */}
      <div className="mb-16 text-center">
        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
          Our Story
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-5 leading-tight">
          Interview Prep That Knows Your Stack
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          InterviewExplainer was built out of frustration with generic interview content that wastes
          developers&rsquo; time. We believe preparation should be targeted, honest, and free to access.
        </p>
      </div>

      {/* The Problem */}
      <section className="mb-14 p-8 rounded-2xl border border-border bg-muted/20">
        <h2 className="text-2xl font-bold text-foreground mb-4">The Problem We Solve</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Most interview prep platforms treat &ldquo;software developer&rdquo; as a single category.
          They give a Java engineer the same questions as a Python engineer, and a junior developer
          the same content as a staff engineer. The result? Candidates over-prepare in areas that
          will not come up, and under-prepare in the areas that matter most.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          InterviewExplainer is different. Every question, answer, and learning path is scoped to a
          specific programming language, career track, and experience level. You only study what is
          actually relevant to your next interview.
        </p>
      </section>

      {/* Values */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">What We Stand For</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="flex gap-4 p-6 rounded-xl border border-border bg-background">
              <div className="mt-0.5 shrink-0">
                <v.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1.5">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current State & Roadmap */}
      <section className="mb-14 p-8 rounded-2xl border border-border bg-muted/20">
        <h2 className="text-2xl font-bold text-foreground mb-4">Where We Are Today</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We are in active development. Java (Backend, Full-Stack) and Python (Backend, Full-Stack)
          content is live across four experience levels. We are continuously adding questions,
          refining answers, and expanding to new technology stacks.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          JavaScript, TypeScript, Go, and DevOps domains are in progress and will be released soon.
          If you want to suggest a topic or report a content issue, we genuinely want to hear from you.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Prepare Smarter?</h2>
        <p className="text-muted-foreground mb-8">
          Browse free, sign up to track your progress, and get interview-ready on your terms.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Browse Content
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
