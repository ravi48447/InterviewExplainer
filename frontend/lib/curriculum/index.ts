/** Phase 14 — Curriculum V2 barrel. */
export type {
  LevelMeta,
  StackPreviewData,
  StackPreviewQuestion,
  InterviewHubLangData,
  LangTrackRef,
  LangHubData,
  TrackHubData,
  LevelHubData,
  StackHubData,
  ComingSoonTopic,
  RolePageData,
} from "./curriculum-types";
export {
  LEVEL_META,
  curriculumToTitle,
  difficultyColor,
  difficultyLabel,
  loadInterviewHub,
  loadLangHub,
  loadTrackHub,
  loadLevelHub,
  loadStackHub,
  loadRolePage,
  rolePageSlugs,
} from "./curriculum-data";
export {
  buildInterviewHubMetadata,
  buildLangHubMetadata,
  buildTrackHubMetadata,
  buildLevelHubMetadata,
  buildStackHubMetadata,
  buildRolePageMetadata,
} from "./curriculum-seo";
