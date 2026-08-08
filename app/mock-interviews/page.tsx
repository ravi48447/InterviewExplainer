/**
 * app/mock-interviews/page.tsx — Canonical mock interview landing (P10-WA).
 *
 * Server component. Renders the interview type catalog (from MOCK_TYPES) and
 * links into /mock-interviews/start for the setup flow. Indexable feature page.
 */

import Link from "next/link";
import { Zap, Video, Code2, GitBranch, MessageSquare, ArrowRight, Clock, Target } from "lucide-react";
import { MOCK_TYPES } from "@/lib/interview";
import type { InterviewType } from "@/lib/interview";
import { buildInterviewLandingMetadata } from "@/lib/interview";

export const metadata = buildInterviewLandingMetadata();

export const revalidate = 3600;

const ICONS: Record<InterviewType, typeof Zap> = {
  "partial-mock": Zap,
  "full-mock": Video,
  "coding-mock": Code2,
  "system-design-mock": GitBranch,
  "behavioral-mock": MessageSquare,
};

const FEATURES = [
  { icon: Clock, title: "Timed practice", desc: "Realistic per-question time limits." },
  { icon: Target, title: "AI feedback", desc: "Keyword coverage, strengths, and improvements." },
  { icon: Zap, title: "Instant review", desc: "Compare your answer to the expert response." },
] as const;

export default function MockInterviewsPage() {
  return (
    <main className="page-container py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-card text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-widest border border-border">
            <Zap className="h-3.5 w-3.5" />
            Mock Interviews
          </div>
          <h1 className="type-display text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
            Practice like it&apos;s the real thing
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Timed mock interviews with AI-powered feedback. Choose a format, pick your domain,
            and get instant scoring on keyword coverage and answer quality.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5 text-center">
              <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="text-sm font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {/* Type catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_TYPES.map((m) => {
            const Icon = ICONS[m.id] ?? Zap;
            return (
              <Link
                key={m.id}
                href={`/mock-interviews/start?type=${m.id}`}
                className="group flex flex-col p-6 rounded-xl border border-border bg-card hover:border-ring hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-foreground group-hover:text-primary">{m.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      {m.duration} · {m.difficulty}
                    </p>
                  </div>
                  {m.badge && (
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex-1">{m.description}</p>
                <span className="flex items-center gap-1 text-sm font-semibold text-primary mt-4">
                  Start now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
