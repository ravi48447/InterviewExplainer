/**
 * contribution-form.tsx — Submit a community contribution (P13-WB..WD, T041..T180).
 *
 * Multi-field form for reporting an interview question / experience. The
 * parent owns the submit network call; this component owns field state + validation.
 */

"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ContributionType } from "@/lib/community";

export interface ContributionFormProps {
  onSubmit: (input: {
    type: ContributionType;
    company: string;
    role: string;
    content: string;
    difficulty: "easy" | "medium" | "hard";
    round: string;
    tags: string[];
  }) => void | Promise<void>;
  busy?: boolean;
}

const TYPES: { value: ContributionType; label: string }[] = [
  { value: "reported-question", label: "Reported question" },
  { value: "experience-report", label: "Experience report" },
  { value: "salary-report", label: "Salary report" },
  { value: "interview-tip", label: "Interview tip" },
];

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export function ContributionForm({ onSubmit, busy }: ContributionFormProps) {
  const [type, setType] = useState<ContributionType>("reported-question");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [round, setRound] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleSubmit = async () => {
    if (!company.trim() || !role.trim() || !content.trim()) {
      setError("Company, role, and content are required.");
      return;
    }
    setError(null);
    await onSubmit({ type, company, role, content, difficulty, round, tags });
    setCompany("");
    setRole("");
    setContent("");
    setRound("");
    setTags([]);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
              type === t.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Company">
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="e.g. Swiggy"
          />
        </Field>
        <Field label="Role">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="e.g. Backend Engineer"
          />
        </Field>
      </div>

      <Field label={type === "reported-question" ? "Question" : "Details"}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[100px] rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder={
            type === "reported-question"
              ? "What were you asked?"
              : "Share your experience…"
          }
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Difficulty">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d} className="capitalize">
                {d}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Round (optional)">
          <input
            value={round}
            onChange={(e) => setRound(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="e.g. Technical round 2"
          />
        </Field>
      </div>

      <Field label="Tags (optional)">
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Add a tag and press Enter"
          />
          <button
            onClick={addTag}
            className="rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground hover:bg-muted/40"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((t) => (
              <Badge
                key={t}
                variant="default"
                className="cursor-pointer"
              >
                <button
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  aria-label={`Remove ${t}`}
                >
                  {t} ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </Field>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit contribution
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
