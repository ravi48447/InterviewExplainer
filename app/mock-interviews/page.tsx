'use client';
/**
 * Mock Hub — rebuilt as a DECISION, not a catalog.
 *
 * The old hub listed 9 mode rows + 10 domain links + extras — a menu, not a
 * product. Best-practice pattern (progressive disclosure, one primary path):
 *
 *   1. ONE primary action — Start a mock (smart defaults, zero config)
 *   2. THREE round types (the real interview vocabulary, everything else
 *      lives under 'Advanced' inside the room itself)
 *   3. Domain as a single compact select — not 10 underlined links
 *
 * Everything on the token system; neutral until it means something.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mic, Code2, MessageSquare, Brain, ChevronRight, Settings2,
  Building2, Sparkles, ArrowRight,
} from 'lucide-react';

const DOMAINS = [
  { id: 'java-backend-fresher', label: 'Java Backend' },
  { id: 'python-backend-fresher', label: 'Python Backend' },
  { id: 'go-fresher', label: 'Go Backend' },
  { id: 'ruby-backend-fresher', label: 'Ruby Backend' },
  { id: 'frontend-fresher', label: 'Frontend' },
  { id: 'dsa', label: 'DSA (all patterns)' },
];

const ROUNDS = [
  {
    id: 'technical',
    title: 'Technical',
    desc: 'Adaptive Q&A with follow-up probes on your weakest concepts',
    icon: Brain,
    href: (d: string) => `/mock-interviews/audio?domain=${d}&mode=technical&preset=standard`,
  },
  {
    id: 'coding',
    title: 'Coding / DSA',
    desc: 'Real problem statements, editor, examples — then defend complexity',
    icon: Code2,
    href: (d: string) => `/mock-interviews/audio?domain=dsa&mode=coding&preset=deep`,
  },
  {
    id: 'behavioral',
    title: 'Behavioral',
    desc: 'STAR-tracked storytelling with a live structure detector',
    icon: MessageSquare,
    href: (d: string) => `/mock-interviews/audio?domain=${d}&mode=behavioral&preset=standard`,
  },
];

export default function MockHubPage() {
  const [domain, setDomain] = useState('java-backend-fresher');
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-14">
        {/* ============ header — one sentence, no editorial flourish ============ */}
        <header className="mb-10">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Practice interviews
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            The interviewer listens, adapts, and pushes back — like the real thing.
          </p>
        </header>

        {/* ============ the ONE primary action ============ */}
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Standard mock</div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  30 min · 10 questions · adaptive · voice + typing
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <label className="text-xs text-muted-foreground" htmlFor="hub-domain">Domain</label>
                  <select
                    id="hub-domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-foreground/40"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Link
                href={`/mock-interviews/audio?domain=${domain}&mode=technical&preset=standard`}
                className="flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Mic className="h-4 w-4" /> Start mock
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ============ round types — 3, not 9 ============ */}
        <section className="mb-10">
          <div className="mb-2.5 text-[11px] font-medium tracking-wide text-muted-foreground/80">
            Or focus a specific round
          </div>
          <div className="space-y-2">
            {ROUNDS.map((r) => (
              <Link
                key={r.id}
                href={r.href(domain)}
                className="group flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:bg-muted"
              >
                <r.icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{r.title}</div>
                  <div className="truncate text-sm text-muted-foreground">{r.desc}</div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-foreground" />
              </Link>
            ))}
          </div>
        </section>

        {/* ============ secondary surfaces — quiet, compact, collapsed ============ */}
        <section className="border-t border-border pt-6">
          <div className="grid gap-2 sm:grid-cols-3">
            <QuietLink
              href="/mock-interviews/company"
              icon={<Building2 className="h-3.5 w-3.5" />}
              label="Company loops"
              sub="Vetted round sequences"
            />
            <QuietLink
              href="/mock-interviews/history"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              label="History"
              sub="Past sessions & reports"
            />
            <QuietLink
              href="/offer-ready"
              icon={<ArrowRight className="h-3.5 w-3.5" />}
              label="Offer Ready"
              sub="30-day campaign"
            />
          </div>
        </section>

        {/* advanced — one quiet toggle, nothing visible by default */}
        <section className="mt-6">
          <button
            onClick={() => setAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Advanced (personas, durations, pressure tiers)
          </button>
          {advanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 overflow-hidden"
            >
              <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
                Persona, pressure tier and duration are set{' '}
                <span className="text-foreground">inside the room</span> before you start —
                start any round above and the full setup is the first screen.
              </div>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}

function QuietLink({
  href, icon, label, sub,
}: { href: string; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 rounded-lg border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-surface"
    >
      <span className="text-muted-foreground group-hover:text-foreground">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{sub}</span>
      </span>
    </Link>
  );
}
