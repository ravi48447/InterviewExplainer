import Link from "next/link";
import { ArrowRight, Boxes } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { PageContainer } from "@/components/page-container";
import { TechIcon } from "@/components/tech-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { HOME_TECHNOLOGIES } from "@/lib/home/home-data";

/**
 * HomeTechnologies — technology & stack discovery (P04-T079..T090).
 *
 * High-value entry points only (P04-T080), each linking to a canonical stack
 * hub (P04-T086). Consistent visual treatment — no logo wall (P04-T084/T088),
 * no unique colours (T072/T194). Server-visible links (P04-T089/T260). An
 * "explore all" path with arrow (P04-T087). Empty-state handled for
 * consistency with sibling sections. Mobile-friendly 2-col grid (P04-T090).
 */
export function HomeTechnologies() {
  return (
    <section
      aria-labelledby="home-technologies-heading"
      className="border-b border-border bg-background"
    >
      <PageContainer className="py-16 sm:py-20">
        <SectionHeader
          as="h2"
          title="Explore by technology"
          description="Domain-specific questions for your primary language and track."
          actions={
            <Link
              href="/domains"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 ease-out hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explore all domains
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        {HOME_TECHNOLOGIES.length === 0 ? (
          <EmptyState
            icon={<Boxes aria-hidden="true" />}
            title="No technologies available yet"
            description="Technology content is being prepared. Check back soon for domain-specific questions."
            className="mt-10"
          />
        ) : (
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {HOME_TECHNOLOGIES.map((tech) => (
              <li key={tech.name}>
                <Link
                  href={tech.href}
                  className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface">
                    <TechIcon name={tech.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-foreground">
                    {tech.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed flex-1">
                    {tech.blurb}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {tech.count} questions
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Practice
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </section>
  );
}
