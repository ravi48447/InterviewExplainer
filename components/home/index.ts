/**
 * components/home/index.ts — Homepage section barrel (P04-T376..T385).
 *
 * Canonical surface for the rebuilt homepage sections. app/page.tsx imports
 * from here so the homepage is composed of named, bounded sections (P04-T377
 * — no monolithic homepage component) that reuse V2 primitives (P04-T383) and
 * avoid homepage-specific design-system forks (P04-T384). Legacy landing
 * components are NOT re-exported — they are removed (P04-T386..T395).
 */

export { HomeHero } from "./home-hero";
export { HomeUSPPillars } from "./home-usp-pillars";
export { HomeHowItWorks } from "./home-how-it-works";
export { HomePathways } from "./home-pathways";
export { HomeTechnologies } from "./home-technologies";
export { HomeDSA } from "./home-dsa";
export { HomeFeaturedQuestions } from "./home-featured-questions";
export { HomeMockShowcase } from "./home-mock-showcase";
export { HomeResumeShowcase } from "./home-resume-showcase";
export { HomeTrust } from "./home-trust";
export { HomeFinalCTA } from "./home-final-cta";
export { HomeFooterDiscovery } from "./home-footer-discovery";
export { HomeSearchEntry } from "./home-search-entry";
export {
  HomeCoverageProof,
  HomeDomainSection,
  HomeLearningJourney,
  HomePersonalizedPath,
  HomeTrustStrip,
} from "./home-reference-sections";
