import type { ExperienceLevelKey } from '@/lib/levels';

/**
 * Shape of a single domain card returned by `/api/content/all-domains`.
 *
 * Kept in a stand-alone, Node-free module so that client components
 * (e.g. `app/domains/page.tsx`, `components/selection-wizard.tsx`) can
 * import the type without dragging `fs`, `path`, and the entire
 * `contentV2` graph into the client bundle / dev compile graph.
 */
export interface ContentDomain {
  slug: string;
  name: string;
  language: string;
  languageSlug: string;
  track: string;
  trackSlug: string;
  level: ExperienceLevelKey;
  levelLabel: string;
  levelRange: string;
  levelDisplay: string;
  levelColor: string;
  levelColorClass: string;
  stackCount: number;
  questionCount: number;
  contentPath: string;
  hasContent: boolean;
}
