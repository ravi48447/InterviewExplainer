/**
 * Auth Module API Client
 * Handles authentication, signup, login
 */

import { axiosClient } from '@/shared/lib/api-client';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  experienceBand: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    experienceBand: string;
  };
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post('/api/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post('/api/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosClient.get('/api/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};