import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/shell/public-shell";
import { AuthProvider } from "@/context/auth-context";
import { GlobalLoginPrompt } from "@/components/global-login-prompt";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import "highlight.js/styles/atom-one-dark.css";
import {
  buildHomepageMetadata,
  getTitleTemplate,
  buildGlobalStructuredData,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// P02-T005: Metadata now comes from the centralized SEO factory.
// No more hardcoded SITE_URL — all URLs flow through lib/seo/config.
const seoMetadata = buildHomepageMetadata();
const titleTemplate = getTitleTemplate();

export const metadata: Metadata = {
  ...seoMetadata,
  title: {
    default: titleTemplate.default,
    template: titleTemplate.template,
  },
  keywords: ["interview preparation", "Java interview questions", "system design", "coding interviews", "developer interviews"],
  authors: [{ name: "InterviewExplainer" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1117" },
  ],
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  // P02-T411: Structured data from the centralized system (no inline hardcoded URLs).
  const globalSchemas = buildGlobalStructuredData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {globalSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {/*
         * P03-T001..T031: Canonical application shell.
         * Providers → AppShell (resolves variant → header/footer). The shell
         * owns the skip-link, main landmark, header, and footer so they stay
         * consistent across every route (T013, T014). AuthProvider wraps the
         * shell so the header user-actions island can read auth state, but a
         * failed/unknown auth state never blocks the shell (T051, T118).
         */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <AuthProvider>
            <GlobalLoginPrompt />
            <AppShell>{children}</AppShell>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
