import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { getHomeFooterLinkGroups } from "@/lib/home/home-data";

/**
 * HomeFooterDiscovery — crawl distribution + exit paths (P04-T268..T278).
 *
 * A short, contextual sitemap of canonical hub links (P04-T264/T268/T275) so
 * every major hub is crawlable from the homepage (P04-T443) and every section
 * leads somewhere meaningful (P04-T019). Organized into labeled categories
 * (Practice / Tools / Explore) so the footer reads as an intentional site
 * map rather than a flat flex-wrap link directory — each group renders only
 * when it has live links. Anchor text is contextual (P04-T277), links are
 * server-rendered so they're crawlable without interaction (P04-T278/T260).
 */
export function HomeFooterDiscovery() {
  const groups = getHomeFooterLinkGroups();

  return (
    <nav aria-label="Explore the platform" className="border-b border-border/60 bg-surface">
      <PageContainer className="py-12">
        <h2 className="type-label text-muted-foreground">
          Explore the platform
        </h2>
        {groups.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Discovery links will appear here once available.
          </p>
        ) : (
          <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-foreground">{group.label}</p>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </nav>
  );
}
