/**
 * resume-shell.tsx — Resume dashboard client shell (P11-WB..WH, T041..T700).
 *
 * Owns the resume dashboard client state: upload → processing → analysis →
 * job match. Composes the resume-v2 primitives. All data flows through
 * @/lib/resume loaders (P11-T001).
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, Target, FileText } from "lucide-react";
import {
  fetchActiveResume,
  fetchCandidateProfile,
  fetchResumeAnalysis,
  fetchJobMatch,
  computeMatchLocally,
  buildPrepPlan,
  saveJobTarget,
} from "@/lib/resume";
import type {
  ResumeDocument,
  CandidateProfile,
  ResumeAnalysisResult,
  JobMatchResult,
  ParsedJobDescription,
  JobMatchResult as JM,
} from "@/lib/resume";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CardSkeleton, TextSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ResumeUpload } from "./resume-upload";
import { AnalysisResults } from "./analysis-results";
import { JobMatchResults } from "./job-match-results";

const DEMO_USER = "demo-user";

export function ResumeShell() {
  const [resume, setResume] = useState<ResumeDocument | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [match, setMatch] = useState<JobMatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"analysis" | "match">("analysis");
  const [jdText, setJdText] = useState("");
  const [parsedJob, setParsedJob] = useState<ParsedJobDescription | null>(null);

  const loadAll = useCallback(async (signal: { cancelled: boolean }) => {
    setLoading(true);
    setLoadError(null);
    try {
      const active = await fetchActiveResume(DEMO_USER);
      if (signal.cancelled) return;
      setResume(active);
      if (active) {
        const [p, a] = await Promise.all([
          fetchCandidateProfile(active.id),
          fetchResumeAnalysis(active.id),
        ]);
        if (signal.cancelled) return;
        setProfile(p);
        setAnalysis(a);
      }
    } catch (err) {
      if (!signal.cancelled) setLoadError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  }, []);

  // Initial load — fetch the active resume + derived data.
  useEffect(() => {
    const signal = { cancelled: false };
    void loadAll(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [loadAll]);

  const handleUpload = useCallback(async () => {
    setBusy(true);
    try {
      const active = await fetchActiveResume(DEMO_USER);
      setResume(active);
      if (active) {
        const [p, a] = await Promise.all([
          fetchCandidateProfile(active.id),
          fetchResumeAnalysis(active.id),
        ]);
        setProfile(p);
        setAnalysis(a);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setBusy(false);
    }
  }, []);

  const handleParseJob = useCallback(async () => {
    if (!jdText.trim() || !resume) return;
    setBusy(true);
    setLoadError(null);
    try {
      // Save the JD as a job target, then parse.
      const job = await saveJobTarget({
        title: "Pasted job description",
        description: jdText,
      });
      if (job) {
        const parsed = await parseJobDescriptionLocal(job.id, jdText);
        setParsedJob(parsed);
        // Try backend match first; fall back to local computation.
        const backend = await fetchJobMatch(resume.id, job.id);
        if (backend) {
          setMatch(backend);
        } else if (parsed && profile) {
          const local = computeMatchLocally(profile, parsed);
          const plan = buildPrepPlan(resume.id, local, job.id);
          setMatch({
            matchId: `local-${job.id}`,
            resumeId: resume.id,
            jobId: job.id,
            overallMatchScore: local.overallMatchScore,
            mappings: local.mappings,
            gaps: local.gaps,
            riskAreas: [],
            preparationPriorities: plan.priorities,
            computedAt: new Date().toISOString(),
          } satisfies JM);
        }
        setTab("match");
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setBusy(false);
    }
  }, [jdText, resume, profile]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6" aria-live="polite" aria-busy="true">
        <CardSkeleton className="p-6" />
        <div className="space-y-3">
          <TextSkeleton lines={2} />
          <TextSkeleton lines={4} />
        </div>
      </div>
    );
  }

  if (loadError && !resume) {
    return (
      <ErrorState
        title="Could not load your resume"
        description="We were unable to fetch your resume data. Please try again."
        retryLabel="Retry"
        onRetry={() => void loadAll({ cancelled: false })}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb: Dashboard > Resume (C10) */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Resume</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ResumeUpload activeResume={resume} onUpload={handleUpload} busy={busy} />

      {/* JD paste → match */}
      {resume && resume.status === "ready" && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Match against a job description</h3>
          </div>
          <Textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste a job description here to see your match score and skill gaps…"
            className="min-h-[120px]"
          />
          <Button
            onClick={handleParseJob}
            disabled={busy || !jdText.trim()}
            loading={busy}
            className="mt-3"
          >
            {!busy && <Target className="h-4 w-4" />}
            Analyze match
          </Button>
        </div>
      )}

      {/* Tabs: analysis / match */}
      {(analysis || match) && (
        <div className="flex items-center gap-1 border-b border-border">
          <TabButton active={tab === "analysis"} onClick={() => setTab("analysis")} icon={BarChart3} label="Analysis" disabled={!analysis} />
          <TabButton active={tab === "match"} onClick={() => setTab("match")} icon={Target} label="Job match" disabled={!match} />
        </div>
      )}

      {/* Analysis / match results with aria-live (C9) */}
      <div aria-live="polite">
        {loadError && resume && (
          <ErrorState
            title="Analysis failed"
            description="Something went wrong while analyzing your resume or job match. Please try again."
            retryLabel="Retry"
            onRetry={() => void loadAll({ cancelled: false })}
          />
        )}
        {!loadError && tab === "analysis" && analysis && (
          <AnalysisResults result={analysis} claims={profile?.claims} />
        )}
        {!loadError && tab === "match" && match && <JobMatchResults result={match} />}
      </div>

      {/* Empty state when no resume uploaded (C8) */}
      {!resume && (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="No resume yet"
          description="Upload your resume to unlock evidence-backed analysis and job matching."
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Target;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`touch-target flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

/**
 * Local JD parser fallback (P11-WF). When the backend parse endpoint is
 * unavailable, we do a lightweight keyword extraction against the skill
 * taxonomy to produce a ParsedJobDescription.
 */
async function parseJobDescriptionLocal(
  jobId: string,
  text: string,
): Promise<ParsedJobDescription> {
  const { resolveSkill } = await import("@/lib/resume");
  const tokens = text.split(/[\s,.;:()\[\]/]+/).filter(Boolean);
  const seen = new Set<string>();
  const requirements = tokens
    .map((t) => resolveSkill(t))
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .filter((s) => {
      if (seen.has(s.name)) return false;
      seen.add(s.name);
      return true;
    })
    .slice(0, 20)
    .map((s, i) => ({
      id: `req-${i}`,
      text: s.name,
      skillId: s.name,
      type: "must-have" as const,
    }));

  return {
    jobId,
    requirements,
    responsibilities: [],
    technologies: seen.size > 0 ? Array.from(seen) : [],
    seniority: null,
    parsedAt: new Date().toISOString(),
  };
}
