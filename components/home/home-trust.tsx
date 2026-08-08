import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { PageContainer } from "@/components/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { getHomeContentStats, getHomePrepHubs } from "@/lib/home/home-data";

/**
 * HomeTrust — restrained trust & credibility (P04-T130..T138, T139..T145).
 *
 * Uses product depth as the trust signal (P04-T135) — content counts derived
 * from canonical data (P04-T142), never hard-coded (P04-T143/T304), never
 * animated counters (P04-T144), never the primary homepage message
 * (P04-T145). No unsupported user counts, success claims, fake social proof,
 * or fake testimonials (P04-T131/T132/T133/T134). Prep hubs are now clickable
 * (the data already carried href — the UI was a dead end). Falls back to null
 * if no stats are available (P04-T305/T343).
 */
export function HomeTrust() {
  const stats = getHomeContentStats();
  const hubs = getHomePrepHubs();

  return (
    <section
      aria-labelledby="home-trust-heading"
      className="border-b border-border/60 bg-surface"
    >
      <PageContainer className="py-14 sm:py-16">
        <SectionHeader
          as="h2"
          title="Built on real content depth"
          description="Every question is tailored to a language, track, and experience level — not recycled generic theory."
        />

        {stats.length === 0 && hubs.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck aria-hidden="true" />}
            title="Trust signals coming soon"
            description="Content statistics and preparation hub details are being assembled. Check back shortly."
            className="mt-10"
          />
        ) : (
        <>
        {/* P04-T145: stats are a restrained signal, not the primary message.
            Grouped in a hairline-bordered band so they read as a real stat
            strip, not loose typography. */}
        {stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col bg-card p-5">
                <dt className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-foreground tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* P04-T135: product depth surfaced as clickable prep hubs. */}
        {hubs.length > 0 && (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hubs.map((hub) => (
              <li key={hub.href}>
                <Link
                  href={hub.href}
                  className="group flex h-full flex-col rounded-lg border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                    {hub.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed flex-1">
                    {hub.tagline}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        </>
        )}
      </PageContainer>
    </section>
  );
}
