import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { PageContainer } from "@/components/page-container";
import { TechIcon } from "@/components/tech-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { getHomePathways } from "@/lib/home/home-data";

/**
 * HomePathways — canonical preparation pathways (P04-T067..T078).
 *
 * A curated subset of career paths (P04-T068/T088), not all twelve. Each
 * pathway is an accessible whole-card link (P04-T074) to a canonical
 * destination (P04-T075/T076). Consistent visual treatment — no unique
 * colour per pathway (P04-T071/T072), no excessive icons (P04-T073). Mobile
 * layout is a single column that never becomes an endless card stream
 * (P04-T078/T217/T223). An "explore all" path is provided (P04-T087).
 */
export function HomePathways() {
  const pathways = getHomePathways();

  return (
    <section
      id="preparation-paths"
      aria-labelledby="home-pathways-heading"
      className="border-b border-border bg-surface"
    >
      <PageContainer className="py-16 sm:py-20">
        <SectionHeader
          as="h2"
          title="Choose a preparation path"
          description="Pre-built learning paths for high-demand tech roles. Start with your primary language."
          actions={
            <Link
              href="/domains"
              className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              Browse all career paths
            </Link>
          }
        />

        {/* P04-T070/T071/T184/T189: consistent cards, restrained borders. */}
        {pathways.length === 0 ? (
          <EmptyState
            icon={<Compass aria-hidden="true" />}
            title="No preparation paths available yet"
            description="Career pathway content is being prepared. Check back soon for curated learning paths."
            className="mt-10"
          />
        ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((path) => (
            <li key={path.href}>
              <Link
                href={path.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
                    <TechIcon name={path.icon} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground leading-tight">
                      {path.title}
                    </h3>
                    <p className="mt-1.5">
                      <Badge variant="outline" className="text-xs font-medium">{path.level}</Badge>
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                  {path.topics}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Start learning
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        )}
      </PageContainer>
    </section>
  );
}
