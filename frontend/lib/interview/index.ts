/**
 * lib/interview barrel — Phase 10 canonical mock interview layer.
 */
export type {
  InterviewType,
  QuestionCategory,
  SessionStatus,
  InterviewQuestion,
  SessionConfig,
  AnswerRecord,
  QuestionEvaluation,
  SessionEvaluation,
  InterviewSession,
  MockTypeOption,
} from "./interview-types";

export {
  MOCK_TYPES,
  getMockType,
  loadInterviewQuestions,
  evaluateSession,
} from "./interview-data";

export { useInterviewSession } from "./interview-session";
export type { UseInterviewSession } from "./interview-session";

export {
  buildInterviewLandingMetadata,
  buildInterviewSetupMetadata,
  buildInterviewHistoryMetadata,
} from "./interview-seo";
