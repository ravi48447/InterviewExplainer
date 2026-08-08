/**
 * Content Module Types
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export type AnswerSectionType =
  | 'interviewer_expectation'
  | 'core_concepts'
  | 'important_points'
  | 'code_example'
  | 'speakable_answer'
  | 'followup_questions';

export interface Language {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
}

export interface Track {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface ExperienceLevel {
  id: number;
  label: string;
  minYears: number | null;
  maxYears: number | null;
}

export interface Domain {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  language: string | null;
  languageSlug: string | null;
  track: string | null;
  trackSlug: string | null;
  experienceLabel: string | null;
}

export interface TechStack {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  questionCount?: number;
}

export interface Question {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  estimatedReadTime: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface AnswerSection {
  id: number;
  sectionType: AnswerSectionType;
  content: string;
  sectionOrder: number;
}

export interface QuestionDetail extends Question {
  sections: AnswerSection[];
  domainSlug?: string;
  stackSlug?: string;
  previousQuestion?: Question;
  nextQuestion?: Question;
  relatedQuestions?: Question[];
}