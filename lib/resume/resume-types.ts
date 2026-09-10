/**
 * resume-types.ts — Canonical resume & job-match model (P11-WA..BH, T001..T700).
 *
 * One typed model for resume documents, structured candidate profiles,
 * skill-gap analysis, and resume-to-preparation bridging that replaces the
 * ad-hoc types scattered across any legacy resume routes.
 *
 * The model is storage-shape-agnostic: backend endpoints (P11-BA) own
 * persistence; the frontend consumes these contracts through the data
 * adapter in resume-data.ts.
 */

// ─── Resume document (P11-F, T063..T072) ─────────────────────────────────────

export type ResumeFileType = "pdf" | "docx" | "txt" | "md" | "html";

export type ProcessingStatus =
  | "queued"
  | "extracting"
  | "parsing"
  | "analyzing"
  | "ready"
  | "failed";

export interface ResumeDocument {
  id: string;
  userId: string;
  originalFilename: string;
  /** Storage reference (signed URL, object key, or blob id). Never the raw bytes. */
  storageRef: string;
  fileType: ResumeFileType;
  fileSizeBytes: number;
  uploadedAt: string;
  status: ProcessingStatus;
  /** Parser version that produced the structured profile, if any. */
  parserVersion?: string;
  isActive: boolean;
  errorMessage?: string;
}

// ─── Candidate claim model (P11-J, T107..T118) ───────────────────────────────

export type ClaimType =
  | "skill"
  | "responsibility"
  | "achievement"
  | "project"
  | "technology"
  | "leadership"
  | "domain-experience";

export type ClaimSource =
  | "summary"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "certifications";

export interface ResumeClaim {
  id: string;
  type: ClaimType;
  text: string;
  sourceSection: ClaimSource;
  associatedRole?: string;
  associatedProject?: string;
  associatedSkills: string[];
  /** 0..1 parser confidence in the extracted claim. */
  confidence: number;
}

// ─── Structured candidate profile (P11-I, T094..T106) ────────────────────────

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  summary: string;
  highlights: string[];
  skillsUsed: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  role?: string;
  technologies: string[];
  outcomes: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string | null;
  endDate: string | null;
}

export interface CandidateProfile {
  resumeId: string;
  fullName: string | null;
  headline: string | null;
  summary: string | null;
  totalYearsExperience: number | null;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  skills: string[];
  claims: ResumeClaim[];
  /** ISO timestamp of the last successful parse. */
  parsedAt: string;
}

// ─── Skill taxonomy (P11-V, T215..T230) ──────────────────────────────────────

export type SkillCategory =
  | "language"
  | "framework"
  | "database"
  | "cloud"
  | "devops"
  | "data"
  | "security"
  | "architecture"
  | "domain"
  | "soft-skill";

export interface CanonicalSkill {
  id: string;
  name: string;
  category: SkillCategory;
  aliases: string[];
}

// ─── Job description & requirements (P11-S/T/U, T478..T520) ──────────────────

export interface JobTarget {
  id: string;
  title: string;
  company?: string;
  description: string;
  createdAt: string;
}

export type RequirementType =
  | "must-have"
  | "nice-to-have"
  | "preferred"
  | "minimum-experience";

export interface JobRequirement {
  id: string;
  type: RequirementType;
  text: string;
  /** Canonical skill id when the requirement maps to the taxonomy. */
  skillId?: string;
  minimumYears?: number;
}

export interface ParsedJobDescription {
  jobId: string;
  requirements: JobRequirement[];
  responsibilities: string[];
  technologies: string[];
  seniority: string | null;
  parsedAt: string;
}

// ─── Resume-to-job matching & gap analysis (P11-X/Y/Z, T621..T700) ───────────

export type MatchStatus =
  | "strong"
  | "moderate"
  | "weak"
  | "no-match";

export type GapSeverity =
  | "critical"
  | "moderate"
  | "minor";

export type GapKind =
  | "preparation-gap"
  | "eligibility-gap";

export interface RequirementMapping {
  requirementId: string;
  requirementText: string;
  matchedClaimIds: string[];
  matchStatus: MatchStatus;
  evidence: string[];
}

export interface SkillGap {
  id: string;
  requirementText: string;
  skillId?: string;
  severity: GapSeverity;
  kind: GapKind;
  recommendation: string;
}

export interface InterviewRiskArea {
  id: string;
  area: string;
  riskLevel: "high" | "medium" | "low";
  reason: string;
  relatedGapIds: string[];
}

export interface JobMatchResult {
  matchId: string;
  resumeId: string;
  jobId: string;
  overallMatchScore: number; // 0..100
  mappings: RequirementMapping[];
  gaps: SkillGap[];
  riskAreas: InterviewRiskArea[];
  /** Ranked preparation priorities derived from gaps + risk. */
  preparationPriorities: PreparationPriority[];
  computedAt: string;
}

// ─── Resume-to-preparation bridge (P11-AF/AG, T584..T620) ────────────────────

export type PriorityLevel = "P0" | "P1" | "P2";

export interface PreparationPriority {
  id: string;
  title: string;
  rationale: string;
  priority: PriorityLevel;
  /** Optional canonical question/stack link for targeted practice. */
  targetSlug?: string;
  targetDomain?: string;
  estimatedEffortHours: number;
}

export interface PersonalizedPrepPlan {
  planId: string;
  resumeId: string;
  jobId?: string;
  priorities: PreparationPriority[];
  generatedAt: string;
}

// ─── Resume quality & score (P11-P/Q/R, T451..T520) ──────────────────────────

export type ResumeAnalysisDimension =
  | "clarity"
  | "impact"
  | "ats-compatibility"
  | "skill-coverage"
  | "experience-articulation"
  | "formatting";

export interface ResumeAnalysisFinding {
  dimension: ResumeAnalysisDimension;
  score: number; // 0..100
  status: "good" | "needs-work" | "critical";
  summary: string;
  improvements: string[];
}

export interface ResumeAnalysisResult {
  analysisId: string;
  resumeId: string;
  overallScore: number;
  findings: ResumeAnalysisFinding[];
  topImprovements: string[];
  analyzedAt: string;
}
