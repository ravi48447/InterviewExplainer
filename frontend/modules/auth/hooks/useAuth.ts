/**
 * useAuth Hook
 * Manages authentication state
 */

import { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const signup = async (name: string, email: string, password: string, experienceBand: string) => {
    const response = await authApi.signup({ name, email, password, experienceBand });
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    authApi.logout();
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };
};
