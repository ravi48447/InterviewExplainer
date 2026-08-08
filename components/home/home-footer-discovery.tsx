import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { getHomeFooterLinks } from "@/lib/home/home-data";

/**
 * HomeFooterDiscovery — crawl distribution + exit paths (P04-T268..T278).
 *
 * A short, contextual list of canonical hub links (P04-T264/T268/T275) so
 * every major hub is crawlable from the homepage (P04-T443) and every section
 * leads somewhere meaningful (P04-T019). Anchor text is contextual
 * (P04-T277), links are server-rendered so they're crawlable without
 * interaction (P04-T278/T260), and the list is short — not a hidden link
 * directory (P04-T275/T276/T415). Also serves as the homepage's exit paths
 * (P04-T019/T020).
 */
export function HomeFooterDiscovery() {
  const links = getHomeFooterLinks();

  return (
    <nav aria-label="Explore the platform" className="border-b border-border bg-background">
      <PageContainer className="py-12">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Explore the platform
        </h2>
        {links.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Discovery links will appear here once available.
          </p>
        ) : (
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        )}
      </PageContainer>
    </nav>
  );
}
