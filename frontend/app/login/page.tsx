/**
 * app/login/page.tsx — Canonical login route (P08-WB, T041..T090).
 *
 * Server component shell with a Suspense-wrapped client AuthForm. Suspense
 * is required because the form reads `useSearchParams` for the redirect.
 */

import { Suspense } from "react";
import { AuthForm } from "@/components/user-v2";
import { buildLoginMetadata } from "@/lib/user";

export const metadata = buildLoginMetadata();

function LoginInner() {
  return <AuthForm mode="login" />;
}

export default function LoginPage() {
  return (
    <main className="page-container flex flex-col items-center justify-center py-16 min-h-[60vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="type-display text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Log in to continue your interview prep.
          </p>
        </div>
        <Suspense fallback={<div className="py-6 text-center text-sm text-muted-foreground">Loading…</div>}>
          <LoginInner />
        </Suspense>
      </div>
    </main>
  );
}
