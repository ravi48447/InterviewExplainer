/**
 * Content Module API Client
 * Handles all content-related API calls (domains, stacks, questions)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const contentApi = {
  // Languages
  getLanguages: async () => {
    const res = await fetch(`${API_BASE}/api/content/languages`);
    return res.json();
  },

  // Domains
  getDomains: async () => {
    const res = await fetch(`${API_BASE}/api/content/domains`);
    return res.json();
  },

  getDomain: async (slug: string) => {
    const res = await fetch(`${API_BASE}/api/content/domains/${slug}`);
    return res.json();
  },

  // Stacks
  getStacksByDomain: async (domainSlug: string) => {
    const res = await fetch(`${API_BASE}/api/content/domains/${domainSlug}/categories`);
    return res.json();
  },

  getStack: async (stackSlug: string) => {
    const res = await fetch(`${API_BASE}/api/content/stacks/${stackSlug}`);
    return res.json();
  },

  // Questions
  getQuestion: async (questionSlug: string) => {
    const res = await fetch(`${API_BASE}/api/content/questions/${questionSlug}`);
    return res.json();
  },

  getQuestionsByStack: async (stackSlug: string) => {
    const res = await fetch(`${API_BASE}/api/content/stacks/${stackSlug}/questions`);
    return res.json();
  },
};