import { SearchItem } from '../types/search.types';

export const searchService = {
  async searchAll(query: string, localData: {
    domains?: any[];
    bookmarks?: any[];
    achievements?: any[];
    recentActivity?: any[];
  } = {}): Promise<SearchItem[]> {
    if (!query || query.trim().length < 2) return [];
    
    const results: SearchItem[] = [];
    const lowerQuery = query.toLowerCase();

    // 1. Fetch Questions via NextJS API
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const questions = await res.json();
        questions.forEach((q: any) => {
          results.push({
            id: `q-${q.slug}`,
            title: q.title,
            type: 'question',
            category: q.stack || 'Interview Q&A',
            description: `${q.language} · ${q.level} · ${q.difficulty} · ${q.readingTime} min read`,
            href: q.domainSlug 
              ? `/${q.domainSlug}/${q.stackSlug}/${q.questionSlug}`
              : `/question/${q.questionSlug}`,
            difficulty: q.difficulty,
          });
        });
      }
    } catch (e) {
      console.error('Failed to fetch API search results:', e);
    }

    // 2. Filter Domains/Learning Paths
    if (localData.domains) {
      localData.domains.forEach((d: any) => {
        if (d.name.toLowerCase().includes(lowerQuery) || d.language.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: `d-${d.slug}`,
            title: d.name,
            type: 'domain',
            category: 'Learning Paths',
            description: `${d.language} · ${d.track} · ${d.questionCount} Questions`,
            href: `/domains?language=${d.language}`,
          });
        }
      });
    }

    // 3. Filter Bookmarks
    if (localData.bookmarks) {
      localData.bookmarks.forEach((b: any) => {
        const titleStr = b.title || b.question || '';
        if (titleStr.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: `b-${b.id || b.slug}`,
            title: titleStr,
            type: 'bookmark',
            category: 'Bookmarks',
            description: 'Saved question',
            href: b.href || `/question/${b.slug || b.id}`,
          });
        }
      });
    }

    // 4. Filter Achievements
    if (localData.achievements) {
      localData.achievements.forEach((a: any) => {
        if (a.title.toLowerCase().includes(lowerQuery) || (a.description && a.description.toLowerCase().includes(lowerQuery))) {
          results.push({
            id: `ac-${a.id || a.title}`,
            title: a.title,
            type: 'achievement',
            category: 'Achievements',
            description: a.description || 'Achievement badge',
            href: '/dashboard',
          });
        }
      });
    }

    return results;
  }
};
