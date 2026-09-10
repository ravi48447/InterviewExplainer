/**
 * index.ts — Barrel for the canonical question page architecture (P06).
 */
export { QuestionHeader, type QuestionHeaderProps } from "./question-header";
export { AnswerRenderer, type AnswerRendererProps } from "./answer-renderer";
export {
  PrevNext,
  RelatedQuestions,
  FollowUpQuestions,
  type PrevNextProps,
  type RelatedQuestionsProps,
  type FollowUpQuestionsProps,
} from "./question-nav";
