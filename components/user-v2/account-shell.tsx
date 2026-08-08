/**
 * account-shell.tsx — Account/profile page architecture (P08-WF, T241..T280).
 *
 * The shared layout for /account and /profile. Shows the authenticated user's
 * identity card, domain switcher, and tabs (Bookmarks / Progress / Settings).
 * Redirects unauthenticated users to /login?redirect=... (P08-T245).
 *
 * Client component — needs useUserState + interactive tabs.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, Mail, Target, Calendar, Shield, Bookmark, BarChart3, Settings, ArrowRight, LogOut } from "lucide-react";
import { useUserState, useGuestData } from "@/lib/user";
import { BookmarkList } from "./bookmark-list";

export type AccountTab = "bookmarks" | "progress" | "settings";

export interface AccountShellProps {
  /** Which tab to show by default. */
  defaultTab?: AccountTab;
  /** Profile variant shows read-only identity; account shows editable. */
  variant?: "account" | "profile";
}

export function AccountShell({ defaultTab = "bookmarks", variant = "account" }: AccountShellProps) {
  const { user, status, ready, logout } = useUserState();
  const { guest, hasGuest } = useGuestData();
  const router = useRouter();
  const [tab, setTab] = useState<AccountTab>(defaultTab);

  useEffect(() => {
    if (ready && status === "unauthenticated") {
      router.replace(`/login?redirect=${variant === "account" ? "/account" : "/profile"}`);
    }
  }, [ready, status, variant, router]);

  if (!ready) {
    return (
      <div className="page-container py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-24 rounded-xl bg-card border border-border animate-pulse" />
          <div className="h-12 rounded-lg bg-card border border-border animate-pulse" />
          <div className="h-64 rounded-lg bg-card border border-border animate-pulse" />
        </div>
      </div>
    );
  }

  // Guest state — show a prompt to merge or sign up.
  if (status === "guest" || hasGuest) {
    return (
      <div className="page-container py-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <UserIcon className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="type-display text-2xl font-bold text-foreground">
            You have {guest?.bookmarks.length ?? 0} bookmarked and {guest?.completed.length ?? 0} completed
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a free account to save your progress across devices and unlock your dashboard.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href={`/signup?redirect=${variant === "account" ? "/account" : "/profile"}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90"
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/login?redirect=${variant === "account" ? "/account" : "/profile"}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-surface"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Should be caught by the redirect above, but guard anyway.
    return null;
  }

  const TABS: Array<{ key: AccountTab; label: string; icon: typeof Bookmark }> = [
    { key: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { key: "progress", label: "Progress", icon: BarChart3 },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="page-container py-12">
      <div className="max-w-3xl mx-auto">
        {/* Identity card */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
              <UserIcon className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                {user.targetRole && (
                  <span className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    {user.targetRole}
                  </span>
                )}
                {user.interviewDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {user.interviewDate}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  <span className="capitalize">{user.plan}</span>
                </span>
              </div>
              {user.domains.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.domains.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/${d.slug}`}
                      className={`px-2.5 py-1 text-xs rounded-md border ${
                        d.slug === user.activeDomain
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-surface text-foreground border-border hover:border-ring"
                      }`}
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {variant === "account" && (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "bookmarks" && <BookmarkList isAuthenticated />}
        {tab === "progress" && (
          <div className="text-center py-10 rounded-lg border border-border bg-card">
            <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground font-semibold">Progress overview</p>
            <p className="text-xs text-muted-foreground mt-1">
              Detailed progress charts are part of the dashboard.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Go to dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
        {tab === "settings" && (
          <div className="space-y-4">
            {variant === "account" ? (
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Account settings</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Name, email, password, and domain preferences are managed here.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Profile</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This is a read-only view of your public profile.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
