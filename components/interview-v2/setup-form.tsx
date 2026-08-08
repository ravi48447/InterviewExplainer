/**
 * setup-form.tsx — Interview setup form (P10-WC..WD, T061..T120).
 *
 * Lets the user choose an interview type and domain before starting. The
 * canonical replacement for the inline setup UI in app/mock-interviews/start.
 */

"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Zap, Video, Code2, GitBranch, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { MOCK_TYPES, getMockType } from "@/lib/interview";
import type { InterviewType, MockTypeOption } from "@/lib/interview";

const ICONS: Record<InterviewType, typeof Zap> = {
  "partial-mock": Zap,
  "full-mock": Video,
  "coding-mock": Code2,
  "system-design-mock": GitBranch,
  "behavioral-mock": MessageSquare,
};

export interface SetupFormProps {
  domains: Array<{ slug: string; name: string }>;
  /** Called with the chosen config; the parent starts the session. */
  onStart: (type: InterviewType, domainSlug: string, questionCount: number) => Promise<boolean>;
  /** Loading state from the parent. */
  starting?: boolean;
}

export function SetupForm({ domains, onStart, starting = false }: SetupFormProps) {
  const router = useRouter();
  const [type, setType] = useState<InterviewType>("partial-mock");
  const [domainSlug, setDomainSlug] = useState(domains[0]?.slug ?? "");
  const [count, setCount] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!domainSlug) {
        setError("Choose a domain to start.");
        return;
      }
      setError(null);
      const ok = await onStart(type, domainSlug, count);
      if (!ok) {
        setError("No questions are available for that domain yet. Try another.");
      } else {
        router.push("/mock-interviews/start");
      }
    },
    [type, domainSlug, count, onStart, router],
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* Type selection */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Choose a format</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOCK_TYPES.map((m: MockTypeOption) => {
            const Icon = ICONS[m.id] ?? Zap;
            const selected = type === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setType(m.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selected
                    ? "border-primary bg-surface ring-1 ring-ring"
                    : "border-border bg-card hover:border-ring"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{m.title}</span>
                  {m.badge && (
                    <span className="ml-auto text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {m.duration} · {m.difficulty}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Domain + count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="domain" className="text-sm font-semibold text-foreground block mb-1.5">
            Domain
          </label>
          <select
            id="domain"
            value={domainSlug}
            onChange={(e) => setDomainSlug(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {domains.length === 0 && <option value="">No domains available</option>}
            {domains.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="count" className="text-sm font-semibold text-foreground block mb-1.5">
            Questions
          </label>
          <select
            id="count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={3}>3 questions</option>
            <option value={5}>5 questions</option>
            <option value={7}>7 questions</option>
            <option value={10}>10 questions</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={starting || !domainSlug}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
      >
        {starting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Start {getMockType(type)?.title}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
