import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { isHubEnabled, type HubKey } from "@/lib/launch-config";

const allPlatformLinks: Array<{ href: string; label: string; hub: HubKey }> = [
  { href: "/domains",         label: "Browse Domains",   hub: "interviewQA"    },
  { href: "/dashboard",       label: "Dashboard",        hub: "dashboard"      },
  { href: "/mock-interviews", label: "Mock Interviews",  hub: "mockInterviews" },
  { href: "/search",          label: "Search Questions", hub: "search"         },
];

const platformLinks = allPlatformLinks.filter(l => isHubEnabled(l.hub));

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <PageContainer className="py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
                  <path d="M8 4L2 12L8 20M16 4L22 12L16 20M14 2L10 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-black text-foreground">InterviewExplainer</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm leading-relaxed">
              Master your tech interviews with domain-specific questions tailored to your exact stack and experience level.
            </p>
            {/* Social links — update hrefs to real accounts when available */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:support@interviewexplainer.com"
                aria-label="Email support"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Platform</h3>
            <nav className="flex flex-col gap-2">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span>{link.label}</span>
                  {link.href === "/mock-interviews" && (
                    <span className="text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 whitespace-nowrap">Soon</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Company</h3>
            <nav className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Legal</h3>
            <nav className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            &copy; {new Date().getFullYear()} InterviewExplainer. Made with{" "}
            <Heart className="h-3 w-3 text-red-500 fill-red-500 mx-0.5" /> for developers.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Content-first interview prep platform
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
