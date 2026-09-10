import Link from 'next/link'
import { BrandMark } from '@/components/shell/brand-mark'
import { buildFooterGroups } from '@/lib/shell/navigation-data'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

/**
 * PublicFooter — canonical public-site footer (P03-T197..T216).
 *
 * Consumes buildFooterGroups (Phase 02 SEO + launch-config gating) so every
 * link is canonical and hub-gated in one place — no hand-added links (T201,
 * T203, T205). Server-rendered crawlable anchors (T207, Z057). Only renders
 * on public shell variants (shellHasFooter) — auth/dashboard render their own
 * minimal footer or none (T198).
 *
 * IA (T199): brand block + Platform/Company/Legal groups. Product-discovery
 * links (domains, dsa, prep) live in the Platform group, not duplicated
 * elsewhere (T202). No decorative excess (T212) — one brand block, three
 * tight groups, one copyright row.
 */
export function PublicFooter({ compact = false }: { compact?: boolean }) {
  const groups = buildFooterGroups()

  if (compact) {
    return (
      <footer className="mt-auto border-t border-border bg-background" role="contentinfo">
        <div className="mx-auto flex w-full max-w-[75rem] flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark size="sm" withWordmark={false} />
            <p className="text-xs leading-5 text-muted-foreground">
              &copy; {new Date().getFullYear()} InterviewExplainer. Clear learning for real interviews.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { href: '/about', label: 'About' },
              { href: '/support', label: 'Support' },
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className="mt-auto border-t border-border/60 bg-background"
      role="contentinfo"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {/* Brand block */}
          <div className="col-span-2 sm:col-span-1">
            <BrandMark size="md" withWordmark={false} />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Interview prep that respects your time. Real questions, clear answers,
              structured paths.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/"
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                aria-label="GitHub"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com/"
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                aria-label="Twitter"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/"
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                aria-label="LinkedIn"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="mailto:hello@interviewexplainer.com"
                className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Link groups */}
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {group.items.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
                    >
                      {link.label}
                      {link.badge === 'Soon' && (
                        <span className="ml-1.5 text-[0.6rem] font-semibold uppercase text-primary/80">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} InterviewExplainer. Built for people who&rsquo;d
            rather prep than guess.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with care, not clutter.
          </p>
        </div>
      </div>
    </footer>
  )
}
