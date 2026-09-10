/**
 * auth-form.tsx — Canonical login + signup form (P08-WB, T041..T090).
 *
 * A single client component used by both /login and /signup, switched by
 * `mode`. Consolidates the two legacy pages' duplicated form logic behind
 * one typed surface (useUserState) from lib/user (P08-T041).
 *
 * Reuses existing UI primitives (Button, Input, Label) and SocialButtons.
 */

"use client";

import { useState, useCallback, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Mail, User as UserIcon, Eye, EyeOff, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialButtons } from "@/components/auth/social-buttons";
import { useUserState, validateEmail, validatePassword } from "@/lib/user";

export type AuthMode = "login" | "signup";

export interface AuthFormProps {
  mode: AuthMode;
  /** Redirect target after success. */
  redirectTo?: string;
}

export function AuthForm({ mode, redirectTo = "/dashboard" }: AuthFormProps) {
  const isLogin = mode === "login";
  const { login, signup } = useUserState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get("redirect") || redirectTo;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    (isLogin || name.trim().length > 0) &&
    !submitting;

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!validateEmail(email)) {
        setError("Enter a valid email address.");
        return;
      }
      if (!isLogin) {
        const pw = validatePassword(password);
        if (!pw.ok) {
          setError(pw.reason ?? "Choose a stronger password.");
          return;
        }
      }

      setSubmitting(true);
      try {
        if (isLogin) {
          await login({ email, password });
        } else {
          await signup({ name, email, password });
        }
        router.push(target);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : isLogin
            ? "Invalid email or password."
            : "Could not create your account.";
        setError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [isLogin, email, password, name, login, signup, router, target],
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {!isLogin && (
          <div className="space-y-1.5">
            <Label htmlFor="auth-name">Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="pl-10"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="auth-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="auth-password">Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Your password" : "At least 8 characters"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" disabled={!canSubmit} className="w-full">
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              {isLogin ? "Log in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <SocialButtons />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>

      {isLogin && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link href="/forgot-password" className="hover:underline">
            Forgot your password?
          </Link>
        </p>
      )}
    </div>
  );
}
