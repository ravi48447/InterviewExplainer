/**
 * content-schema.ts — The interview-path metadata layer.
 *
 * Every question carries:
 *   priority:       must-prepare | frequent | extended
 *   role:          anchor | follow-up | practical
 *   anchorSlug:     parent question slug (when role=follow-up)
 *   interviewStage: fundamentals | framework | practical | project
 *   answerProfile: definition | comparison | mechanism | debugging | implementation | design
 *   sourceReviewed: boolean (technically validated)
 *
 * The UI surfaces "Must prepare" and "Frequently asked" as the curated
 * interview path; follow-ups nest under their anchor, not shown as equal
 * lessons; "Deep learning" and "Practical round" stay in the LMS.
 */

export type Priority = 'must-prepare' | 'frequent' | 'extended';
export type Role = 'anchor' | 'follow-up' | 'practical';
export type InterviewStage = 'fundamentals' | 'framework' | 'practical' | 'project';
export type AnswerProfile =
  | 'definition'      // "What is X?"
  | 'comparison'       // "X vs Y?"
  | 'mechanism'       // "How does X work internally?"
  | 'debugging'       // "Why does X fail?"
  | 'implementation'  // "How do you implement X?"
  | 'design';         // "Should you use X or Y?"

export interface QuestionMetadata {
  priority: Priority;
  role: Role;
  /** Set when role === 'follow-up' — the anchor's slug */
  anchorSlug?: string;
  interviewStage: InterviewStage;
  answerProfile: AnswerProfile;
  /** Technical validation status — set true after review */
  sourceReviewed: boolean;
}

/** Classify a question text into its answerProfile */
export function classifyAnswerProfile(questionText: string): AnswerProfile {
  const q = questionText.toLowerCase();
  if (/(difference|vs\b|versus|compare|better than)/.test(q)) return 'comparison';
  if (/(how does.*work|what happens when|internally|under the hood|mechanism)/.test(q)) return 'mechanism';
  if (/(debug|why.*fail|troubleshoot|fix|broken|error.*when)/.test(q)) return 'debugging';
  if (/(implement|write|build|create|code|build a)/.test(q)) return 'implementation';
  if (/(when should|should you|choose|pick|which.*use|design decision)/.test(q)) return 'design';
  return 'definition';
}

/** Classify a topic into its interviewStage */
export function classifyInterviewStage(moduleName: string, topicSlug: string): InterviewStage {
  const mod = moduleName.toLowerCase();
  if (/(scenario|project|practical|coding|build|create)/.test(mod + topicSlug)) return 'practical';
  if (/(docker|kubernetes|cloud|deployment|monitoring|logging)/.test(mod + topicSlug)) return 'project';
  if (/(spring|rails|gin|framework|http|api|middleware|rest)/.test(mod + topicSlug)) return 'framework';
  return 'fundamentals';
}

/**
 * Auto-classify a full question record.
 * Called during content build/index to retroactively apply the schema
 * to questions that don't yet have explicit metadata.
 */
export function autoClassify(question: any, moduleName: string): QuestionMetadata {
  const answerProfile = classifyAnswerProfile(question.question || '');
  const interviewStage = classifyInterviewStage(moduleName, question.slug || '');
  return {
    priority: question.importance === 'high' ? 'must-prepare'
             : question.importance === 'medium' ? 'frequent'
             : 'extended',
    role: 'anchor',  // default: every question starts as an anchor
    interviewStage,
    answerProfile,
    sourceReviewed: false,
  };
}
