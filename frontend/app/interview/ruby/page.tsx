import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  title: "Ruby Interview Questions — Backend, Rails, RSpec | InterviewExplainer",
  description: "Ruby on Rails, Sidekiq, ActiveRecord, RSpec, REST API interview questions. Beginner to advanced, all levels covered.",
  alternates: { canonical: `${SITE_URL}/interview/ruby` },
};

const TRACKS = [
  {
    slug: "backend",
    name: "Ruby Backend",
    emoji: "💎",
    desc: "Ruby on Rails, Sinatra, ActiveRecord, Sidekiq, REST API, RSpec, Devise",
    stacks: ["ruby-fundamentals", "rails", "activerecord", "rspec", "sidekiq", "devise", "rest-api", "postgresql", "redis"],
    live: false,
  },
  {
    slug: "fullstack",
    name: "Ruby Fullstack",
    emoji: "⚡",
    desc: "Rails + Hotwire, Turbo, React front-end with Rails API",
    stacks: ["rails", "hotwire", "turbo", "react"],
    live: false,
  },
];

export default function RubyHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-rose-50/20 dark:from-background dark:to-background/50 dark:via-background/80">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/interview" className="hover:text-foreground">Interview Questions</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Ruby</span>
        </nav>

        <header className="mb-10">
          <div className="text-5xl mb-4">💎</div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">
            Ruby Interview Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Ruby on Rails, Sidekiq, ActiveRecord, RSpec, REST APIs — all interview questions for Ruby engineers.
            Content launching soon.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {TRACKS.map(track => (
            <div key={track.slug}
              className="relative rounded-2xl border border-red-200 dark:border-red-500/20 bg-gradient-to-br from-red-50 to-rose-50 p-6 opacity-70 dark:from-background dark:to-background/50">
              <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 bg-slate-200 dark:bg-slate-800 text-muted-foreground rounded-full">Coming Soon</span>
              <div className="text-2xl mb-3">{track.emoji}</div>
              <h2 className="text-xl font-black text-foreground mb-2">{track.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{track.desc}</p>
              <div className="flex flex-wrap gap-1">
                {track.stacks.map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 bg-background/70 rounded-full border border-border text-muted-foreground">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/interview" className="px-4 py-2 dark:bg-surface text-white rounded-lg text-sm font-bold hover:bg-slate-700 dark:bg-slate-800 transition-colors">
            ← Browse All Languages
          </Link>
          <Link href="/interview/python/backend/intermediate" className="px-4 py-2 border border-border text-foreground rounded-lg text-sm font-bold hover:bg-surface transition-colors">
            Try Python Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
