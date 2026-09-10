/**
 * resume-data.ts — Resume intelligence data layer (P11-WA..BH, T001..T700).
 *
 * Adapts backend resume APIs (P11-BA) to the canonical typed contracts.
 * All network calls go through the existing api-client (default axios
 * instance); this module is the ONE place that shapes resume / match /
 * analysis payloads so components never consume raw API responses.
 *
 * When a backend endpoint is absent (feature not yet live), the loaders
 * return graceful null/empty states rather than throwing — matching the
 * Phase 09/10 fallback convention.
 *
 * Client-safe (axios-based).
 */

import apiClient from "@/lib/api-client";
import type {
  CandidateProfile,
  JobMatchResult,
  JobTarget,
  PersonalizedPrepPlan,
  ParsedJobDescription,
  PreparationPriority,
  ResumeAnalysisResult,
  ResumeDocument,
  SkillGap,
  GapSeverity,
  GapKind,
  MatchStatus,
} from "./resume-types";
import { resolveSkill } from "./skill-taxonomy";

const RESUME_BASE = "/resume";

// ─── Resume documents ────────────────────────────────────────────────────────

export async function fetchResumes(userId: string): Promise<ResumeDocument[]> {
  try {
    const res = await apiClient.get<ResumeDocument[]>(RESUME_BASE, {
      params: { userId },
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

export async function fetchActiveResume(userId: string): Promise<ResumeDocument | null> {
  const docs = await fetchResumes(userId);
  return docs.find((d) => d.isActive) ?? docs[0] ?? null;
}

// ─── Candidate profile ───────────────────────────────────────────────────────

export async function fetchCandidateProfile(resumeId: string): Promise<CandidateProfile | null> {
  try {
    const res = await apiClient.get<CandidateProfile>(`${RESUME_BASE}/${resumeId}/profile`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ─── Job description parsing ─────────────────────────────────────────────────

export async function parseJobDescription(jobId: string): Promise<ParsedJobDescription | null> {
  try {
    const res = await apiClient.get<ParsedJobDescription>(`${RESUME_BASE}/jobs/${jobId}/parse`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ─── Job matching & gap analysis ─────────────────────────────────────────────

export async function fetchJobMatch(resumeId: string, jobId: string): Promise<JobMatchResult | null> {
  try {
    const res = await apiClient.get<JobMatchResult>(`${RESUME_BASE}/${resumeId}/match/${jobId}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ─── Resume analysis ─────────────────────────────────────────────────────────

export async function fetchResumeAnalysis(resumeId: string): Promise<ResumeAnalysisResult | null> {
  try {
    const res = await apiClient.get<ResumeAnalysisResult>(`${RESUME_BASE}/${resumeId}/analysis`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ─── Pure analysis helpers (client-safe, no network) ─────────────────────────

/**
 * Compute requirement mappings and gaps purely from a candidate profile and a
 * parsed job description. Used as the client-side fallback when the backend
 * match endpoint is unavailable, and as the basis for the preparation plan.
 */
export function computeMatchLocally(
  profile: CandidateProfile,
  job: ParsedJobDescription,
): Pick<JobMatchResult, "mappings" | "gaps" | "overallMatchScore"> {
  const claimText = profile.claims.map((c) => c.text.toLowerCase()).join(" ");
  const profileSkills = new Set(profile.skills.map((s) => s.toLowerCase()));

  const mappings = job.requirements.map((req) => {
    const skill = req.skillId ? resolveSkill(req.skillId) : resolveSkill(req.text);
    const matched = skill && profileSkills.has(skill.name.toLowerCase());
    const evidence = matched
      ? profile.claims.filter((c) => c.associatedSkills.includes(skill!.name)).map((c) => c.text)
      : [];
    let status: MatchStatus = "no-match";
    if (matched && evidence.length > 0) status = "strong";
    else if (matched || claimText.includes(req.text.toLowerCase().split(" ")[0]))
      status = "moderate";
    else if (claimText.includes(req.text.toLowerCase())) status = "weak";
    return {
      requirementId: req.id,
      requirementText: req.text,
      matchedClaimIds: profile.claims
        .filter((c) => c.text.toLowerCase().includes(req.text.toLowerCase().split(" ")[0]))
        .map((c) => c.id),
      matchStatus: status,
      evidence,
    };
  });

  const gaps: SkillGap[] = job.requirements
    .filter((req) => {
      const m = mappings.find((mm) => mm.requirementId === req.id);
      return m?.matchStatus === "no-match" || m?.matchStatus === "weak";
    })
    .map((req) => {
      const severity: GapSeverity =
        req.type === "must-have" ? "critical" : req.type === "minimum-experience" ? "moderate" : "minor";
      const kind: GapKind = req.type === "minimum-experience" ? "eligibility-gap" : "preparation-gap";
      return {
        id: `gap-${req.id}`,
        requirementText: req.text,
        skillId: req.skillId,
        severity,
        kind,
        recommendation:
          req.type === "must-have"
            ? `Strengthen coverage of "${req.text}" — it is a required skill.`
            : `Consider preparing for "${req.text}" to improve match.`,
      };
    });

  const matchedCount = mappings.filter(
    (m) => m.matchStatus === "strong" || m.matchStatus === "moderate",
  ).length;
  const overallMatchScore = job.requirements.length
    ? Math.round((matchedCount / job.requirements.length) * 100)
    : 0;

  return { mappings, gaps, overallMatchScore };
}

/**
 * Derive a preparation plan from a job match: gaps → ranked priorities
 * (P11-AE/AF/AG, T584..T620). Critical must-have gaps become P0.
 */
export function buildPrepPlan(
  resumeId: string,
  match: Pick<JobMatchResult, "gaps" | "overallMatchScore">,
  jobId?: string,
): PersonalizedPrepPlan {
  const priorities: PreparationPriority[] = match.gaps.map((gap) => {
    const priority = gap.severity === "critical" ? "P0" : gap.severity === "moderate" ? "P1" : "P2";
    return {
      id: `prep-${gap.id}`,
      title: gap.requirementText,
      rationale: gap.recommendation,
      priority,
      estimatedEffortHours: gap.severity === "critical" ? 8 : gap.severity === "moderate" ? 4 : 2,
      targetSlug: gap.skillId,
    };
  });
  // Sort P0 → P1 → P2.
  const order = { P0: 0, P1: 1, P2: 2 } as const;
  priorities.sort((a, b) => order[a.priority] - order[b.priority]);

  return {
    planId: `plan-${resumeId}${jobId ? `-${jobId}` : ""}`,
    resumeId,
    jobId,
    priorities,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Job target persistence ──────────────────────────────────────────────────

export async function saveJobTarget(job: Omit<JobTarget, "id" | "createdAt">): Promise<JobTarget | null> {
  try {
    const res = await apiClient.post<JobTarget>(`${RESUME_BASE}/jobs`, job);
    return res.data ?? null;
  } catch {
    return null;
  }
}
