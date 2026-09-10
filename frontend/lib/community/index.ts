/**
 * lib/community barrel — Phase 13 canonical community knowledge & interview
 * intelligence layer.
 */
export type {
  ContributionType,
  ContributionStatus,
  Contribution,
  QuestionCategory,
  ReportedQuestion,
  EvidenceType,
  EvidenceRecord,
  CompanyInterviewIntelligence,
  ModerationAction,
  ModerationLogEntry,
  CommunityFilter,
} from "./community-types";

export {
  fetchReportedQuestions,
  fetchQuestion,
  fetchContributions,
  submitContribution,
  upvoteContribution,
  fetchCompanyIntelligence,
  fetchFeaturedCompanies,
  fetchEvidence,
  moderateContribution,
  statusForAction,
  aggregateCompanyIntelligence,
  filterContributions,
} from "./community-data";

export {
  buildCommunityLandingMetadata,
  buildCompanyIntelligenceMetadata,
  buildReportedQuestionMetadata,
  buildContributionFormMetadata,
  buildModerationMetadata,
} from "./community-seo";
