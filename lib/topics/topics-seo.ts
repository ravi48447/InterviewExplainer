/**
 * Phase 13 — Topics V2 canonical SEO.
 *
 * Metadata builders for the topics hub and per-concept detail pages.
 * There is no RouteFamily for the /topics hub, so the hub builds a plain
 * Metadata object with a canonical URL. The concept detail page uses the
 * registered `topic` RouteFamily (/topics/:concept) via buildMetadata.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getCanonicalOrigin } from "@/lib/seo/config";
import type { TopicConceptPageData } from "./topics-types";
import { topicToTitle, TOPIC_CONCEPT_META } from "./topics-data";

/** Metadata for the /topics hub (no registered RouteFamily → plain Metadata). */
export function buildTopicsHubMetadata(): Metadata {
  const origin = getCanonicalOrigin();
  const title =
    "Technical Concepts — System Design, Microservices, Caching & More | InterviewExplainer";
  const description =
    "Browse interview questions by core concept. System design, microservices, distributed systems, caching, API design, concurrency — across all languages and levels.";
  return {
    title,
    description,
    alternates: { canonical: `${origin}/topics` },
  };
}

/** Metadata for /topics/:concept (registered `topic` family). */
export function buildTopicConceptMetadata(data: TopicConceptPageData): Metadata {
  // Use buildMetadata against the registered `topic` family so the canonical
  // URL and metadata are contract-driven. Fall back to a title-cased name
  // when the concept is not in TOPIC_CONCEPT_META.
  const name = data.meta?.name ?? topicToTitle(data.concept);
  const title = `${name} Interview Questions — All Languages | InterviewExplainer`;
  const description =
    data.meta?.desc ??
    `Complete ${name} interview preparation — concepts, patterns, trade-offs across all languages and experience levels.`;
  return buildMetadata({
    family: "topic",
    params: { concept: data.concept },
    title,
    description,
  });
}

/** Fallback metadata for an unknown concept (not in TOPIC_CONCEPT_META). */
export function buildTopicConceptFallbackMetadata(concept: string): Metadata {
  const name = TOPIC_CONCEPT_META[concept]?.name ?? topicToTitle(concept);
  const title = `${name} Interview Questions — All Languages | InterviewExplainer`;
  const description = `Complete ${name} interview preparation — concepts, patterns, trade-offs across all languages and experience levels.`;
  return buildMetadata({
    family: "topic",
    params: { concept },
    title,
    description,
  });
}
