/**
 * Auth Module Types
 */

export interface User {
  id: string;
  name: string;
  email: string;
  experienceBand: ExperienceBand;
}

export type ExperienceBand = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
