import { SectionHeader } from "@/components/ui/section-header";
import { PageContainer } from "@/components/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldCheck } from "lucide-react";
import { getHomeContentStats, getHomePrepHubs } from "@/lib/home/home-data";

/**
 * HomeTrust — restrained trust & credibility (P04-T130..T138, T139..T145).
 *
 * Uses product depth as the trust signal (P04-T135) — content counts derived
 * from canonical data (P04-T142), never hard-coded (P04-T143/T304), never
 * animated counters (P04-T144), never the primary homepage message
 * (P04-T145). No unsupported user counts, success claims, fake social proof,
 * or fake testimonials (P04-T131/T132/T133/T134). Visually restrained
 * (P04-T138). Falls back to null if no stats are available (P04-T305/T343).
 */
export function HomeTrust() {
  const stats = getHomeContentStats();
  const hubs = getHomePrepHubs();

  return (
    <section
      aria-labelledby="home-trust-heading"
      className="border-b border-border bg-background"
    >
      <PageContainer className="py-16 sm:py-20">
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
        {/* P04-T145: stats are a restrained signal, not the primary message. */}
        {stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* P04-T135: product depth surfaced as available prep hubs. */}
        {hubs.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {hubs.map((hub) => (
              <li key={hub.href} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{hub.title}</span>
                <span className="mx-2 text-border">·</span>
                {hub.tagline}
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
