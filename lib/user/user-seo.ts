/**
 * user-seo.ts — SEO metadata builders for auth/account routes (P08-WF, T241..T260).
 *
 * Auth pages are noindex (login/signup/reset are not content pages) but still
 * need a title + description. Account/profile are indexable user dashboards.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export function buildLoginMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "question",
      params: {},
      title: "Log in",
      description: "Log in to InterviewExplainer to track progress and save bookmarks.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildSignupMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "question",
      params: {},
      title: "Create your account",
      description: "Sign up to track interview prep progress across learning paths.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildForgotPasswordMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "question",
      params: {},
      title: "Reset your password",
      description: "Get a password reset link sent to your email.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildResetPasswordMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "question",
      params: {},
      title: "Set a new password",
      description: "Choose a new password for your InterviewExplainer account.",
    }),
    robots: { index: false, follow: true },
  };
}

export function buildAccountMetadata(user?: { name?: string } | null): Metadata {
  return buildMetadata({
    family: "question",
    params: {},
    title: user?.name ? `${user.name} — Account` : "Your Account",
    description: "Manage your InterviewExplainer account, domains, and preferences.",
  });
}

export function buildProfileMetadata(user?: { name?: string } | null): Metadata {
  return buildMetadata({
    family: "question",
    params: {},
    title: user?.name ? `${user.name} — Profile` : "Your Profile",
    description: "View your interview prep profile, bookmarks, and progress.",
  });
}
