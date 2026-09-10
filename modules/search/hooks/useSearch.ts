'use client';

import { useState, useEffect } from 'react';
import { SearchItem, GroupedSearchResults } from '../types/search.types';
import { searchService } from '../services/search.service';

export function useSearch(query: string, localData: {
  bookmarks?: any[];
  achievements?: any[];
} = {}) {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [groupedResults, setGroupedResults] = useState<GroupedSearchResults>({});
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<any[]>([]);

  // Load domains list once for search indexing
  useEffect(() => {
    fetch('/api/content/all-domains')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDomains(data))
      .catch((e) => console.error('Failed to load domains for search index:', e));
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setGroupedResults({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const matches = await searchService.searchAll(trimmed, {
          domains,
          bookmarks: localData.bookmarks,
          achievements: localData.achievements,
        });

        // Group by category
        const groups = matches.reduce((acc, item) => {
          const cat = item.category || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        }, {} as GroupedSearchResults);

        setResults(matches);
        setGroupedResults(groups);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, domains, localData.bookmarks, localData.achievements]);

  return {
    results,
    groupedResults,
    loading,
  };
}
