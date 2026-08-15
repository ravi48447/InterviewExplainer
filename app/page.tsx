import {
  HomeCareerToolkit,
  HomeCoverageProof,
  HomeDiscoveryFooter,
  HomeHero,
  HomeLearningExperience,
  HomeLearningJourney,
  HomePlatformDepth,
  HomePersonalizedPath,
  HomeTrustStrip,
} from "@/components/home";

/**
 * Public learning narrative: promise → domains → teaching proof →
 * journey → DSA depth → real content → career tools → trust.
 * Each section is backed by canonical repository data and links to the working
 * product surface instead of duplicating its implementation on the homepage.
 */
export default function HomePage() {
  return (
    <div id="main" className="min-h-screen overflow-x-clip bg-background">
      <HomeHero />
      <HomeLearningJourney />
      <HomeLearningExperience />
      <HomePlatformDepth />
      <HomeCareerToolkit />
      <HomeCoverageProof />
      <HomePersonalizedPath />
      <HomeTrustStrip />
      <HomeDiscoveryFooter />
    </div>
  );
}
