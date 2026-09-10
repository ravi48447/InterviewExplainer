/**
 * index.ts — Barrel for the canonical question layer (P06).
 */
export type {
  QuestionPageData,
  QuestionIdentity,
  AnswerSection,
  QuestionMetadata,
  RelatedQuestion,
  FollowUpQuestion,
  PrevNextNav,
  QuestionPageState,
} from "./question-types";

export {
  resolveQuestionPageData,
} from "./question-data";

export {
  buildQuestionMetadata,
  buildQuestionStructuredData,
  buildQuestionBreadcrumbStructuredData,
  buildQuestionSpeakable,
} from "./question-seo";
