'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api-client';
import { getGuestData, clearGuestData, hasGuestData } from '@/lib/guest-progress';

export interface SelectedDomain {
  slug: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  domainSlug: string | null;
  /** All domains the user has added (switchable dashboards). */
  domains: SelectedDomain[];
  activeDomain: string | null;
  experienceLevel: string | null;
  plan: 'free' | 'pro';
  targetRole: string | null;
  interviewDate: string | null;
  authProvider?: 'password' | 'google' | 'github' | 'magic';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
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
      // Works for both bearer-token sessions (localStorage) and httpOnly-cookie
      // sessions (OAuth / magic link) — the cookie is sent automatically.
      try {
        const res = await apiClient.get('/auth/me');
        setUser(res.data);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const guest = hasGuestData() ? getGuestData() : undefined;
    const res = await apiClient.post('/auth/login', { email, password, guest });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    if (guest) clearGuestData();
    setUser(user);
    // Sync any saved level preference to cookie so middleware can redirect immediately
    const savedLevel = localStorage.getItem('ie_level');
    if (savedLevel) {
      const maxAge = 60 * 60 * 24 * 30;
      document.cookie = `ie_level=${savedLevel};path=/;max-age=${maxAge};SameSite=Lax`;
    }
    return user;
  };

  const signup = async (userData: any) => {
    const guest = hasGuestData() ? getGuestData() : undefined;
    const res = await apiClient.post('/auth/signup', { ...userData, guest });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    if (guest) clearGuestData();
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
    // Clear level preference — anonymous users get intermediate (SEO default)
    localStorage.removeItem('ie_level');
    document.cookie = 'ie_level=;path=/;max-age=0';
    // Clear the httpOnly session cookie server-side (fire-and-forget).
    apiClient.post('/auth/logout').catch(() => {});
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
