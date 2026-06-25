'use client';

import React from 'react';

/**
 * Google / GitHub sign-in buttons. Each renders only when its provider is
 * configured (NEXT_PUBLIC_*_CLIENT_ID present). Clicking starts the server-side
 * OAuth flow which sets an httpOnly session cookie on success.
 */
export function SocialButtons() {
  const googleEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const githubEnabled = !!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

  if (!googleEnabled && !githubEnabled) return null;

  return (
    <div className="grid grid-cols-1 gap-2">
      {googleEnabled && (
        <a
          href="/api/auth/oauth/google/start"
          className="flex items-center justify-center gap-2.5 rounded-lg border border-border dark:border-border bg-background dark:dark:bg-surface py-2.5 text-sm font-semibold text-foreground dark:text-slate-200 hover:bg-surface dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
          </svg>
          Continue with Google
        </a>
      )}
      {githubEnabled && (
        <a
          href="/api/auth/oauth/github/start"
          className="flex items-center justify-center gap-2.5 rounded-lg border border-border dark:border-border bg-background dark:dark:bg-surface py-2.5 text-sm font-semibold text-foreground dark:text-slate-200 hover:bg-surface dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
          </svg>
          Continue with GitHub
        </a>
      )}
    </div>
  );
}
