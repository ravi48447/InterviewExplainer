/**
 * Analytics Module API Client
 * Handles dashboard, insights, activity logs
 */

import { axiosClient } from '@/shared/lib/api-client';

export const analyticsApi = {
  // Dashboard
  getDashboard: async () => {
    const response = await axiosClient.get('/api/analytics/dashboard');
    return response.data;
  },

  getWeakAreas: async () => {
    const response = await axiosClient.get('/api/analytics/weak-areas');
    return response.data;
  },

  // Activity
  getActivity: async (limit: number = 10) => {
    const response = await axiosClient.get(`/api/analytics/activity?limit=${limit}`);
    return response.data;
  },
};