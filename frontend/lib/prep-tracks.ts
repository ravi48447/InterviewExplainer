/**
 * Prep "tracks" — how we surface independent interview surfaces on /prep and
 * the home page. Pillar slugs reference `PILLAR_HUBS` in seo-pillars.ts.
 */

/** Topic hubs that read as stack-agnostic (design, architecture, APIs). */
export const SYSTEM_ARCHITECTURE_PILLAR_SLUGS: ReadonlySet<string> = new Set([
  "system-design",
  "low-level-design",
  "architecture-design",
  "distributed-systems",
  "microservices-architecture",
]);

export function isSystemArchitecturePillarSlug(slug: string): boolean {
  return SYSTEM_ARCHITECTURE_PILLAR_SLUGS.has(slug);
}

export interface PrepTrackCard {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Optional hash on /prep for in-page jump */
  prepHash?: string;
  icon: "network" | "java" | "python" | "react";
  accent: string;
}

/**
 * Primary entry points — each card is a first-class surface, not a subset
 * of "Java prep only".
 */
export const STANDALONE_PREP_TRACKS: readonly PrepTrackCard[] = [
  {
    id: "system-architecture",
    title: "System design & architecture",
    description:
      "Scalability, trade-offs, LLD, distributed systems, and microservices — interview-ready hubs that stand alone from any language track.",
    href: "/system-design",
    prepHash: "#track-architecture",
    icon: "network",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    id: "java-backend",
    title: "Java backend",
    description:
      "Spring, JVM, data layer, DevOps, cloud, and security — the full curriculum and topic hubs for Java backend interviews.",
    href: "/java-backend-intermediate",
    prepHash: "#track-java",
    icon: "java",
    accent: "from-orange-500 to-red-600",
  },
  {
    id: "python",
    title: "Python",
    description:
      "Backend, fullstack, ML, and data tracks with the same structured Q&A format — pick your path from the domain browser.",
    href: "/domains?language=Python",
    icon: "python",
    accent: "from-blue-500 to-cyan-600",
  },
  {
    id: "frontend",
    title: "Frontend & fullstack",
    description:
      "JavaScript, TypeScript, React, Angular, and web foundations — lives on the fullstack track with its own module tree.",
    href: "/java-fullstack-intermediate",
    prepHash: "#track-frontend",
    icon: "react",
    accent: "from-violet-500 to-purple-600",
  },
] as const;
