/**
 * Phase 15 — Learning surfaces V2 canonical layer barrel.
 *
 *   lib/learning/learning-types.ts   — type definitions
 *   lib/learning/learning-data.ts    — static catalog arrays (roadmaps,
 *                                      cheatsheets, behavioral, career)
 *   lib/learning/learning-loaders.ts — prep hub dynamic loader
 *   lib/learning/learning-seo.ts     — Metadata builders for all 5 hubs
 */

/* Types */
export type {
  BehavioralCategory,
  CareerSection,
  CheatsheetEntry,
  CompanySpecific,
  DsaPlan,
  DomainRoadmap,
  IconComponent,
  LearningIconKey,
  ModuleCount,
  ModulePillarGroup,
  PillarWithStats,
  PrepHubData,
  QuickGuide,
  StarStep,
  TimelinePlan,
} from "./learning-types";

/* Data */
export {
  BEHAVIORAL_CATEGORIES,
  CAREER_SECTIONS,
  CATEGORY_COLORS,
  COMPANY_SPECIFIC,
  CONCEPT_CHEATSHEETS,
  DOMAIN_ROADMAPS,
  DSA_PLANS,
  LANGUAGE_CHEATSHEETS,
  QUICK_GUIDES,
  STAR_STEPS,
  TIMELINE_PLANS,
  TOOL_CHEATSHEETS,
  TOTAL_BEHAVIORAL_QUESTIONS,
  TOTAL_CAREER_ARTICLES,
  TOTAL_CHEATSHEETS,
} from "./learning-data";

/* Loader */
export { loadPrepHub } from "./learning-loaders";

/* SEO */
export {
  buildBehavioralHubMetadata,
  buildCareerHubMetadata,
  buildCheatsheetsHubMetadata,
  buildPrepHubMetadata,
  buildRoadmapsHubMetadata,
} from "./learning-seo";
