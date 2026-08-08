import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { PageContainer } from "@/components/page-container";
import { TechIcon } from "@/components/tech-icon";
import { HOME_TECHNOLOGIES } from "@/lib/home/home-data";

/**
 * HomeTechnologies — technology & stack discovery (P04-T079..T090).
 *
 * High-value entry points only (P04-T080), each linking to a canonical stack
 * hub (P04-T086), not a mini dashboard (P04-T083). Consistent visual
 * treatment — no logo wall (P04-T084/T088), no unique colours (T072/T194).
 * Server-visible links (P04-T089/T260). An "explore all" path is provided
 * (P04-T087). Mobile-friendly 2-col grid (P04-T090).
 */
export function HomeTechnologies() {
  return (
    <section
      aria-labelledby="home-technologies-heading"
      className="border-b border-border bg-surface"
    >
      <PageContainer className="py-16 sm:py-20">
        <SectionHeader
          as="h2"
          title="Explore by technology"
          description="Domain-specific questions for your primary language and track."
          actions={
            <Link href="/domains" className="text-sm font-medium text-primary hover:underline">
              Explore all domains
            </Link>
          }
        />

        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {HOME_TECHNOLOGIES.map((tech) => (
            <li key={tech.name}>
              <Link
                href={tech.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-150 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface">
                  <TechIcon name={tech.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {tech.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {tech.blurb}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </PageContainer>
    </section>
  );
}
