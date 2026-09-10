/**
 * Phase 12 — Tools: canonical SEO builders.
 *
 * /tools has no registered RouteFamily, so the hub builds a plain
 * Metadata object. /tools/:tool uses the `tool` family via `buildMetadata`.
 */
import type { Metadata } from "next"
import { buildMetadata, getCanonicalOrigin } from "@/lib/seo"
import type { ToolHubPageData } from "./tools-types"
import { toolDisplayName } from "./tools-data"

const SITE_ORIGIN = getCanonicalOrigin()

/** Metadata for the /tools hub. */
export function buildToolsHubMetadata(): Metadata {
  return {
    title:
      "Tools & Technologies Interview Questions — Docker, Kafka, Redis, AWS & More",
    description:
      "Interview questions organized by tool and technology. Docker, Kafka, Redis, AWS, Kubernetes, PostgreSQL, and more. Universal content shared across Java, Python, Go, and every track.",
    alternates: { canonical: `${SITE_ORIGIN}/tools` },
  }
}

/** Metadata for /tools/:tool. */
export function buildToolMetadata(data: ToolHubPageData): Metadata {
  return buildMetadata({
    family: "tool",
    params: { tool: data.slug },
    title: `${data.name} Interview Questions — All Levels`,
    description: `${data.name} interview questions across beginner, intermediate, and advanced levels.`,
  })
}

/** Fallback metadata when a tool slug has no content (for generateMetadata). */
export function buildToolFallbackMetadata(slug: string): Metadata {
  const name = toolDisplayName(slug)
  return buildMetadata({
    family: "tool",
    params: { tool: slug },
    title: `${name} Interview Questions — All Levels`,
    description: `${name} interview questions across beginner, intermediate, and advanced levels.`,
  })
}
