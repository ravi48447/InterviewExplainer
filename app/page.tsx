import dynamic from "next/dynamic";
import {
  HomeHero,
  HomeUSPPillars,
  HomePathways,
  HomeTechnologies,
  HomeDSA,
  HomeFeaturedQuestions,
  HomeMockShowcase,
  HomeResumeShowcase,
  HomeTrust,
  HomeFooterDiscovery,
} from "@/components/home";

/**
 * Homepage — V2 public entry experience (P04-T031..T479).
 *
 * The homepage is an *orientation layer* (P04 §10-18): it helps a visitor
 * understand what Interview Explainer is, who it's for, and what they can do
 * next. It is NOT "everything on one page".
 *
 * Section order (P04-T015) follows the psychological arc:
 *   LAND (hero) → DIFFERENTIATE (USP pillars) → CHOOSE A PATH (pathways) →
 *   DISCOVER (technologies, DSA, featured questions) → SEE THE PRODUCTS
 *   (mock showcase, resume showcase) → TRUST (trust) → CONTINUE
 *   (footer discovery). Every section leads somewhere meaningful (P04-T019)
 *   with no dead ends (P04-T020).
 *
 * Background rhythm: sections alternate bg-background ↔ bg-surface so the eye
 * moves down the page instead of seeing a flat card wall. Featured-product
 * bands (mock + resume) use a primary-tinted band to read as products, not
 * catalog entries.
 *
 * Server component: all discovery sections are server-rendered (P04-T047/
 * T260/T278/T282) so the homepage is indexable without JS and the major hubs
 * are crawlable (P04-T264/T443). The only client island is the search entry,
 * dynamically imported with no SSR so it never blocks first render and adds
 * zero JS when the search hub is disabled (P04-T065/T283/T289/T290).
 */
const HomeSearchEntry = dynamic(
  () => import("@/components/home/home-search-entry").then((m) => m.HomeSearchEntry),
  { ssr: false, loading: () => null },
);

export default function HomePage() {
  return (
    <main id="main" className="flex-1 bg-background">
      {/* P04-T016: only essential orientation appears above the fold. */}
      <HomeHero />

      {/* Search is a secondary discovery aid, gated by the search hub. */}
      <HomeSearchEntry />

      {/* DIFFERENTIATE: why this, not a generic prep site. */}
      <HomeUSPPillars />

      {/* CHOOSE A PATH + DISCOVER CONTENT. */}
      <HomePathways />
      <HomeTechnologies />
      <HomeDSA />
      <HomeFeaturedQuestions />

      {/* SEE THE PRODUCTS: featured bands for the flagship USPs. */}
      <HomeMockShowcase />
      <HomeResumeShowcase />

      {/* TRUST + CONTINUE. */}
      <HomeTrust />
      <HomeFooterDiscovery />
    </main>
  );
}
