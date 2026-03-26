/**
 * Auth Module Types
 */

export interface User {
  id: string;
  name: string;
  email: string;
  experienceBand: ExperienceBand;
}

export type ExperienceBand = 'E0_0_TO_1' | 'E1_1_TO_3' | 'E2_3_TO_5' | 'E3_5_PLUS';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
