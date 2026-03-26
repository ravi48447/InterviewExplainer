import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row lg:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
          <span>&copy; {new Date().getFullYear()} InterviewExplainer</span>
        </div>
        <nav className="flex items-center gap-6">
          {[
            { href: "/about", label: "About" },
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/support", label: "Support" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
