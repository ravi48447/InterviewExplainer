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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-rose-50/20">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/interview" className="hover:text-slate-700">Interview Questions</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-700 font-semibold">Ruby</span>
        </nav>

        <header className="mb-10">
          <div className="text-5xl mb-4">💎</div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-3">
            Ruby Interview Questions
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Ruby on Rails, Sidekiq, ActiveRecord, RSpec, REST APIs — all interview questions for Ruby engineers.
            Content launching soon.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {TRACKS.map(track => (
            <div key={track.slug}
              className="relative rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-6 opacity-70">
              <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 bg-slate-200 text-slate-600 rounded-full">Coming Soon</span>
              <div className="text-2xl mb-3">{track.emoji}</div>
              <h2 className="text-xl font-black text-slate-900 mb-2">{track.name}</h2>
              <p className="text-sm text-slate-600 mb-3">{track.desc}</p>
              <div className="flex flex-wrap gap-1">
                {track.stacks.map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 bg-white/70 rounded-full border border-slate-200 text-slate-500">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/interview" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors">
            ← Browse All Languages
          </Link>
          <Link href="/interview/python/backend/intermediate" className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
            Try Python Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
