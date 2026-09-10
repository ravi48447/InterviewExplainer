/**
 * lib/resume barrel — Phase 11 canonical resume intelligence layer.
 */
export type {
  ResumeFileType,
  ProcessingStatus,
  ResumeDocument,
  ClaimType,
  ClaimSource,
  ResumeClaim,
  ExperienceEntry,
  ProjectEntry,
  EducationEntry,
  CandidateProfile,
  SkillCategory,
  CanonicalSkill,
  JobTarget,
  RequirementType,
  JobRequirement,
  ParsedJobDescription,
  MatchStatus,
  RequirementMapping,
  GapSeverity,
  GapKind,
  SkillGap,
  InterviewRiskArea,
  JobMatchResult,
  PriorityLevel,
  PreparationPriority,
  PersonalizedPrepPlan,
  ResumeAnalysisDimension,
  ResumeAnalysisFinding,
  ResumeAnalysisResult,
} from "./resume-types";

export {
  fetchResumes,
  fetchActiveResume,
  fetchCandidateProfile,
  parseJobDescription,
  fetchJobMatch,
  fetchResumeAnalysis,
  computeMatchLocally,
  buildPrepPlan,
  saveJobTarget,
} from "./resume-data";

export {
  SKILL_TAXONOMY,
  resolveSkill,
  categorizeSkill,
  normalizeKey,
} from "./skill-taxonomy";

export {
  buildResumeDashboardMetadata,
  buildResumeAnalysisMetadata,
  buildJobMatchMetadata,
} from "./resume-seo";
