/**
 * app/forgot-password/page.tsx — Canonical forgot-password route (P08-WB, T091..T105).
 */

import { PasswordResetForm } from "@/components/user-v2";
import { buildForgotPasswordMetadata } from "@/lib/user";

export const metadata = buildForgotPasswordMetadata();

export default function ForgotPasswordPage() {
  return (
    <main className="page-container flex flex-col items-center justify-center py-16 min-h-[60vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="type-display text-3xl font-bold text-foreground">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>
        <PasswordResetForm mode="request" />
      </div>
    </main>
  );
}
