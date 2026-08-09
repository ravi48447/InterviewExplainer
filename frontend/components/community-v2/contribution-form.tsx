/**
 * contribution-form.tsx — Submit a community contribution (P13-WB..WD, T041..T180).
 *
 * Multi-field form for reporting an interview question / experience. The
 * parent owns the submit network call; this component owns field state + validation.
 */

"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tag } from "@/components/ui/tag";
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
          <Button
            key={t.value}
            type="button"
            variant={type === t.value ? "primary" : "outline"}
            size="sm"
            onClick={() => setType(t.value)}
            aria-pressed={type === t.value}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Company">
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Swiggy"
            aria-label="Company"
          />
        </Field>
        <Field label="Role">
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Backend Engineer"
            aria-label="Role"
          />
        </Field>
      </div>

      <Field label={type === "reported-question" ? "Question" : "Details"}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
          placeholder={
            type === "reported-question"
              ? "What were you asked?"
              : "Share your experience…"
          }
          aria-label={type === "reported-question" ? "Question" : "Details"}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Difficulty">
          <Select
            value={difficulty}
            onValueChange={(v) => setDifficulty(v as "easy" | "medium" | "hard")}
          >
            <SelectTrigger aria-label="Difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d} className="capitalize">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Round (optional)">
          <Input
            value={round}
            onChange={(e) => setRound(e.target.value)}
            placeholder="e.g. Technical round 2"
            aria-label="Round (optional)"
          />
        </Field>
      </div>

      <Field label="Tags (optional)">
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            aria-label="Add a tag"
          />
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={addTag}
          >
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((t) => (
              <Tag key={t} variant="outline" className="cursor-pointer">
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  aria-label={`Remove ${t}`}
                  className="touch-target"
                >
                  {t} ×
                </button>
              </Tag>
            ))}
          </div>
        )}
      </Field>

      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={busy}
        loading={busy}
      >
        <Send />
        Submit contribution
      </Button>
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
