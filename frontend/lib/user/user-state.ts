/**
 * user-state.ts — Canonical auth/client adapters (P08-WA..WC, T041..T120).
 *
 * Wraps the existing context/auth-context + lib/api-client + lib/guest-progress
 * behind a single typed surface so Phase 08 components do not reach into
 * three different modules. The underlying behavior (localStorage token,
 * httpOnly cookie for OAuth, guest merge on login) is preserved unchanged —
 * this layer only adds types and a uniform call shape (P08-T010).
 *
 * Client-only. "use client" is implicit via the imported context.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth as useLegacyAuth } from "@/context/auth-context";
import {
  getGuestData,
  clearGuestData,
  hasGuestData,
} from "@/lib/guest-progress";
import type {
  AuthState,
  AuthResult,
  LoginCredentials,
  SignupInput,
  User,
  GuestData,
} from "./user-types";
import { initialAuthState } from "./user-types";

// ─── useUserState: the canonical auth hook ──────────────────────────────────

export interface UseUserState extends AuthState {
  login: (creds: LoginCredentials) => Promise<User>;
  signup: (input: SignupInput) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
  /** True when the session-restore finished. */
  ready: boolean;
}

export function useUserState(): UseUserState {
  const ctx = useLegacyAuth();
  const [isLoading, setIsLoading] = useState(ctx.loading);

  useEffect(() => {
    setIsLoading(ctx.loading);
  }, [ctx.loading]);

  const status: AuthState["status"] = isLoading
    ? "loading"
    : ctx.user
    ? "authenticated"
    : hasGuestData()
    ? "guest"
    : "unauthenticated";

  return {
    status,
    user: ctx.user ?? null,
    isLoading,
    error: null,
    ready: !isLoading,
    login: (creds: LoginCredentials) => ctx.login(creds.email, creds.password),
    signup: ctx.signup,
    logout: ctx.logout,
    refresh: ctx.refreshUser,
  };
}

// ─── Guest merge lifecycle ───────────────────────────────────────────────────

export function useGuestData() {
  const [guest, setGuest] = useState<GuestData | null>(null);

  useEffect(() => {
    if (hasGuestData()) {
      setGuest(getGuestData());
    }
    const onChange = () => {
      setGuest(hasGuestData() ? getGuestData() : null);
    };
    window.addEventListener("ie-guest-change", onChange);
    return () => window.removeEventListener("ie-guest-change", onChange);
  }, []);

  const clear = useCallback(() => {
    clearGuestData();
    setGuest(null);
  }, []);

  return { guest, hasGuest: !!guest, clearGuest: clear };
}

// ─── Auth form helpers (validation) ──────────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password: string): {
  ok: boolean;
  reason?: string;
} {
  if (password.length < 8) return { ok: false, reason: "At least 8 characters" };
  if (!/[A-Za-z]/.test(password)) return { ok: false, reason: "Include a letter" };
  if (!/[0-9]/.test(password)) return { ok: false, reason: "Include a number" };
  return { ok: true };
}
