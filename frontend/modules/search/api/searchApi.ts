/**
 * Search Module API Client
 * Handles search and recommendations
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const searchApi = {
  // Search
  searchQuestions: async (query: string) => {
    const res = await fetch(`${API_BASE}/api/search/questions?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Recommendations
  getRecommendations: async (questionId: number) => {
    const res = await fetch(`${API_BASE}/api/search/recommendations/${questionId}`);
    return res.json();
  },
};