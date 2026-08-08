/**
 * app/signup/page.tsx — Canonical signup route (P08-WB, T041..T090).
 *
 * Server component shell with a Suspense-wrapped client AuthForm (signup mode).
 */

import { Suspense } from "react";
import { AuthForm } from "@/components/user-v2";
import { buildSignupMetadata } from "@/lib/user";

export const metadata = buildSignupMetadata();

function SignupInner() {
  return <AuthForm mode="signup" />;
}

export default function SignupPage() {
  return (
    <main className="page-container flex flex-col items-center justify-center py-16 min-h-[60vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="type-display text-3xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Track progress, save bookmarks, and get a personalized dashboard.
          </p>
        </div>
        <Suspense fallback={<div className="py-6 text-center text-sm text-muted-foreground">Loading…</div>}>
          <SignupInner />
        </Suspense>
      </div>
    </main>
  );
}
