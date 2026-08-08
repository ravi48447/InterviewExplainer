/**
 * app/robots.ts — Rebuilt from lib/seo/robots (P02-T144–T159)
 *
 * robots.txt is now generated from the route registry + indexability
 * engine. No more hardcoded SITE_URL or hardcoded disallow paths.
 * All logic lives in lib/seo/robots.ts → buildRobotsMetadata().
 */

import type { MetadataRoute } from 'next'
import { buildRobotsMetadata } from '@/lib/seo/robots'

export default function robots(): MetadataRoute.Robots {
  return buildRobotsMetadata() as MetadataRoute.Robots
}
