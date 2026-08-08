export interface SearchItem {
  id: string;
  title: string;
  type: 'question' | 'topic' | 'domain' | 'bookmark' | 'roadmap' | 'achievement' | 'activity';
  category?: string;
  description?: string;
  href: string;
  difficulty?: string;
  progress?: number;
}

export type GroupedSearchResults = Record<string, SearchItem[]>;
