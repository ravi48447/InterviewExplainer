import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { PageContainer } from "@/components/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { getHomeCapabilities } from "@/lib/home/home-data";

/**
 * HomeCapabilities — product capability presentation (P04-T120..T129).
 *
 * Capabilities are explained through *user outcomes* (P04-T125), not an
 * icon-grid feature wall (P04-T126/T127). Overlapping feature sections are
 * merged (P04-T123) into concise outcomes, each linked to a real product
 * experience (P04-T129). No unverified superlative claims (P04-T128). Flat
 * section with restrained borders (P04-T183/T184) — no nested cards
 * (P04-T186).
 */
export function HomeCapabilities() {
  const capabilities = getHomeCapabilities();

  return (
    <section
      aria-labelledby="home-capabilities-heading"
      className="border-b border-border bg-surface"
    >
      <PageContainer className="py-16 sm:py-20">
        <SectionHeader
          as="h2"
          title="What you can do here"
          description="Everything is organized around getting you interview-ready for your specific stack."
        />

        {capabilities.length === 0 ? (
          <EmptyState
            icon={<Sparkles aria-hidden="true" />}
            title="No capabilities available yet"
            description="We're putting the finishing touches on our feature showcases. Check back soon."
            className="mt-10"
          />
        ) : (
        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {capabilities.map((cap) => (
            <li key={cap.href} className="flex flex-col">
              <h3 className="text-lg font-semibold text-foreground">
                {cap.outcome}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {cap.detail}
              </p>
              <Link
                href={cap.href}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                {cap.linkLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        )}
      </PageContainer>
    </section>
  );
}
