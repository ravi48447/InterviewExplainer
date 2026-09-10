/**
 * password-reset-form.tsx — Forgot + reset password forms (P08-WB, T091..T120).
 *
 * Two modes in one component:
 *  - "request": email → POST /api/auth/reset (sends reset link)
 *  - "reset": token + new password → POST /api/auth/reset/confirm
 *
 * Uses the canonical validatePassword helper from lib/user.
 */

"use client";

import { useState, useCallback, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, Eye, EyeOff, Loader2, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/api-client";
import { validateEmail, validatePassword } from "@/lib/user";

export type ResetMode = "request" | "reset";

export interface PasswordResetFormProps {
  mode: ResetMode;
  /** Token from the email link URL (reset mode only). */
  token?: string;
}

export function PasswordResetForm({ mode, token }: PasswordResetFormProps) {
  const isRequest = mode === "request";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (isRequest) {
        if (!validateEmail(email)) {
          setError("Enter a valid email address.");
          return;
        }
      } else {
        const pw = validatePassword(password);
        if (!pw.ok) {
          setError(pw.reason ?? "Choose a stronger password.");
          return;
        }
        if (password !== confirm) {
          setError("Passwords do not match.");
          return;
        }
        if (!token) {
          setError("This reset link is missing a token. Request a new one.");
          return;
        }
      }

      setSubmitting(true);
      try {
        if (isRequest) {
          await apiClient.post("/auth/reset", { email });
          setDone(true);
        } else {
          await apiClient.post("/auth/reset/confirm", { token, password });
          setDone(true);
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [isRequest, email, password, confirm, token, router],
  );

  if (done) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-3">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
        <p className="text-sm text-foreground">
          {isRequest
            ? "If an account exists for that email, a reset link is on its way."
            : "Your password has been reset. Redirecting to login…"}
        </p>
        {isRequest && (
          <Link
            href="/login"
            className="inline-block text-sm font-semibold text-primary hover:underline"
          >
            Back to login
          </Link>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4" noValidate>
      {isRequest ? (
        <div className="space-y-1.5">
          <Label htmlFor="reset-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="reset-email"
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
      ) : (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
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
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />
          </div>
        </>
      )}

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            {isRequest ? "Send reset link" : "Reset password"}
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
