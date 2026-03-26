'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  domainSlug: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (userData: any) => Promise<User>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const signup = async (userData: any) => {
    const res = await apiClient.post('/auth/signup', userData);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  };

  const refreshUser = async () => {
    try {
      const res = await apiClient.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
