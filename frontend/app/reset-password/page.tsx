/**
 * app/reset-password/page.tsx — Canonical reset-password route (P08-WB, T106..T120).
 *
 * Server component shell. The token comes from the URL searchParams (passed
 * as a prop to the client ResetInner which forwards it to PasswordResetForm).
 * Suspense-wrapped because useSearchParams requires it.
 */

import { Suspense } from "react";
import { ResetTokenReader } from "@/components/user-v2";
import { buildResetPasswordMetadata } from "@/lib/user";

export const metadata = buildResetPasswordMetadata();

function ResetInner() {
  return <ResetTokenReader />;
}

export default function ResetPasswordPage() {
  return (
    <main className="page-container flex flex-col items-center justify-center py-16 min-h-[60vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="type-display text-3xl font-bold text-foreground">Set a new password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Choose a new password for your account.
          </p>
        </div>
        <Suspense fallback={<div className="py-6 text-center text-sm text-muted-foreground">Loading…</div>}>
          <ResetInner />
        </Suspense>
      </div>
    </main>
  );
}
