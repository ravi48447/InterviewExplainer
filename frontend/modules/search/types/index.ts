/**
 * Search Module Types
 */

import { Question } from '@/modules/content/types';

export interface SearchResult {
  questions: Question[];
  totalCount: number;
  query: string;
}

export interface Recommendation {
  question: Question;
  score: number;
  reason?: string;
}