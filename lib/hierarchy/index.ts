/**
 * index.ts — Barrel for the canonical hierarchy layer (P05).
 */
export type {
  DomainEntity,
  StackEntity,
  PillarEntity,
  ModuleEntity,
  QuestionEntity,
  HierarchyPath,
  HierarchyCrumb,
  HierarchySlug,
  HierarchyValidationFinding,
} from "./hierarchy-types";

export {
  HierarchyResolver,
  resolveDomain,
  resolveStack,
  resolvePillar,
  resolvePillarHub,
  resolveModule,
  resolveChildren,
  resolveParent,
  resolveHierarchyPath,
  resolveBreadcrumbs,
  validateHierarchy,
} from "./hierarchy-resolver";

export {
  buildDomainMetadata,
  buildStackMetadata,
  buildPillarMetadata,
  buildModuleMetadata,
  buildBreadcrumbStructuredData,
  hierarchyUrl,
} from "./hierarchy-seo";
