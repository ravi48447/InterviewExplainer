import dynamic from "next/dynamic";
import {
  HomeHero,
  HomePathways,
  HomeTechnologies,
  HomeDSA,
  HomeFeaturedQuestions,
  HomeCapabilities,
  HomeTrust,
  HomeFooterDiscovery,
} from "@/components/home";

/**
 * Homepage — V2 public entry experience (P04-T031..T479).
 *
 * The homepage is an *orientation layer* (P04 §10-18): it helps a visitor
 * understand what Interview Explainer is, who it's for, and what they can do
 * next. It is NOT "everything on one page" — the V1 anti-pattern of a 90vh
 * gradient hero, an animated dashboard visual, feature-card walls, an
 * 8-language grid, a "Built Different" superlative section, a newsletter
 * capture, and a giant final CTA has been removed (P04-T014/T037/T038/T039/
 * T040/T094/T126/T128/T131..134/T144/T180..190/T193/T346..348/T386..T395).
 *
 * Section order (P04-T015) follows the target journey:
 *   LAND (hero) → CHOOSE A PATH (pathways) → DISCOVER (technologies,
 *   featured questions) → UNDERSTAND VALUE (capabilities) → TRUST (trust) →
 *   CONTINUE (footer discovery). Every section leads somewhere meaningful
 *   (P04-T019) with no dead ends (P04-T020).
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

      {/* P04-T017: mid-page discovery helps users explore preparation paths. */}
      <HomePathways />
      <HomeTechnologies />
      <HomeDSA />
      <HomeFeaturedQuestions />

      {/* P04-T125: capabilities explained through user outcomes. */}
      <HomeCapabilities />

      {/* P04-T018/T135: lower-page trust supports credibility without
          overwhelming the primary experience. */}
      <HomeTrust />

      {/* P04-T019/T268: exit paths + crawl distribution to major hubs. */}
      <HomeFooterDiscovery />
    </main>
  );
}
