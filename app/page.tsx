import {
  HomeCoverageProof,
  HomeDomainSection,
  HomeHero,
  HomeLearningJourney,
  HomePersonalizedPath,
  HomeTrustStrip,
} from "@/components/home";

/**
 * Public visual baseline: promise → domain → journey → proof → path.
 * Deeper products remain available through their canonical destination pages
 * instead of competing as a long stack of homepage panels.
 */
export default function HomePage() {
  return (
    <div id="main" className="min-h-screen overflow-x-clip bg-background">
      <HomeHero />
      <HomeDomainSection />
      <HomeLearningJourney />
      <HomeCoverageProof />
      <HomePersonalizedPath />
      <HomeTrustStrip />
    </div>
  );
}
