import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider } from "@/context/auth-context";
import { GlobalLoginPrompt } from "@/components/global-login-prompt";
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
  alternates: {
    canonical: "./",
  },
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
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "InterviewExplainer",
              "url": SITE_URL,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
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
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <AuthProvider>
            <GlobalLoginPrompt />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 font-medium transition-all"
            >
              Skip to content
            </a>
            <SiteHeader />
            <main id="main-content" className="min-w-0 flex-1">
              {children}
            </main>
          </AuthProvider>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
