/**
 * lib/opportunity barrel — Phase 12 canonical job discovery & application layer.
 */
export type {
  CareerTarget,
  SeniorityBand,
  OpportunitySource,
  WorkMode,
  Compensation,
  Opportunity,
  ApplicationStatus,
  ApplicationEvent,
  Application,
  PipelineColumn,
  OpportunityFilter,
  OpportunitySearchResult,
} from "./opportunity-types";

export {
  PIPELINE_ORDER,
  STATUS_LABEL,
} from "./opportunity-types";

export {
  fetchCareerTarget,
  saveCareerTarget,
  fetchOpportunities,
  fetchOpportunity,
  fetchApplications,
  createApplication,
  saveOpportunity,
  updateApplicationStatus,
  buildPipeline,
  computePipelineStats,
  withEvent,
} from "./opportunity-data";

export {
  buildOpportunitiesMetadata,
  buildOpportunityDetailMetadata,
  buildPipelineMetadata,
} from "./opportunity-seo";
