import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";
import "highlight.js/styles/atom-one-dark.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "InterviewExplainer — Structured Interview Preparation for Developers",
    template: "%s | InterviewExplainer",
  },
  description:
    "Browse real interview questions and structured answers for Java, System Design, SQL, and more. Free to read. Sign up to track your progress.",
  keywords: ["interview preparation", "Java interview questions", "system design", "coding interviews", "developer interviews"],
  authors: [{ name: "InterviewExplainer" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "InterviewExplainer",
    title: "InterviewExplainer — Structured Interview Preparation for Developers",
    description:
      "Browse real interview questions and structured answers for Java, System Design, SQL, and more. Free to read. Sign up to track your progress.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "InterviewExplainer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InterviewExplainer — Structured Interview Preparation for Developers",
    description:
      "Browse real interview questions and answers for Java, System Design, SQL, and more.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#111318" },
  ],
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en" suppressHydrationWarning>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            <SiteHeader />
            <div className="min-w-0 flex-1">
              {children}
            </div>
          </AuthProvider>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
