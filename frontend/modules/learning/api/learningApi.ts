/**
 * Learning Module API Client
 * Handles progress tracking, bookmarks, streaks
 */

import { axiosClient } from '@/shared/lib/api-client';

export const learningApi = {
  // Progress
  getProgress: async () => {
    const response = await axiosClient.get('/api/learning/progress');
    return response.data;
  },

  markQuestionViewed: async (questionId: number) => {
    const response = await axiosClient.post(`/api/learning/progress/${questionId}/view`);
    return response.data;
  },

  markQuestionCompleted: async (questionId: number) => {
    const response = await axiosClient.post(`/api/learning/progress/${questionId}/complete`);
    return response.data;
  },

  // Bookmarks
  getBookmarks: async () => {
    const response = await axiosClient.get('/api/learning/bookmarks');
    return response.data;
  },

  addBookmark: async (questionId: number) => {
    const response = await axiosClient.post(`/api/learning/bookmarks/${questionId}`);
    return response.data;
  },

  removeBookmark: async (questionId: number) => {
    const response = await axiosClient.delete(`/api/learning/bookmarks/${questionId}`);
    return response.data;
  },

  // Streak
  getStreak: async () => {
    const response = await axiosClient.get('/api/learning/streak');
    return response.data;
  },
};