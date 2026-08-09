/**
 * setup-form.tsx — Interview setup form (P10-WC..WD, T061..T120).
 *
 * Lets the user choose an interview type and domain before starting. The
 * canonical replacement for the inline setup UI in app/mock-interviews/start.
 */

"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Zap, Video, Code2, GitBranch, MessageSquare, ArrowRight } from "lucide-react";
import { MOCK_TYPES, getMockType } from "@/lib/interview";
import type { InterviewType, MockTypeOption } from "@/lib/interview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
                aria-pressed={selected}
                className={`text-left p-4 rounded-xl border transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selected
                    ? "border-primary bg-surface ring-1 ring-ring"
                    : "border-border bg-card hover:border-primary"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{m.title}</span>
                  {m.badge && (
                    <Badge variant="primary" className="ml-auto text-[10px] uppercase">
                      {m.badge}
                    </Badge>
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
          <Select value={domainSlug} onValueChange={setDomainSlug}>
            <SelectTrigger id="domain" className="w-full">
              <SelectValue placeholder={domains.length === 0 ? "No domains available" : "Select a domain"} />
            </SelectTrigger>
            <SelectContent>
              {domains.map((d) => (
                <SelectItem key={d.slug} value={d.slug}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="count" className="text-sm font-semibold text-foreground block mb-1.5">
            Questions
          </label>
          <Select value={String(count)} onValueChange={(v) => setCount(Number(v))}>
            <SelectTrigger id="count" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 questions</SelectItem>
              <SelectItem value="5">5 questions</SelectItem>
              <SelectItem value="7">7 questions</SelectItem>
              <SelectItem value="10">10 questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

      <Button
        type="submit"
        disabled={starting || !domainSlug}
        loading={starting}
        className="w-full"
      >
        {!starting && (
          <>
            Start {getMockType(type)?.title}
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
