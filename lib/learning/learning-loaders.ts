/**
 * Phase 15 — Prep hub V2 loader.
 *
 * Hoists the globalThis-cached prep aggregation that previously lived inline in
 * app/prep/page.tsx so the route can stay a thin server shell. The prep hub is
 * dynamic (built from PILLAR_HUBS + SEO_MODULES + live question counts via
 * getSubcategoriesWithQuestions), unlike the other Phase 15 hubs which are
 * pure static catalogs.
 */

import {
  PILLAR_HUBS,
  type PillarHubEntry,
} from "@/lib/seo-pillars";
import { SEO_MODULES, type SeoModuleEntry } from "@/lib/seo-slugs";
import { getSubcategoriesWithQuestions } from "@/lib/content-reader";
import { isSystemArchitecturePillarSlug } from "@/lib/prep-tracks";
import type {
  ModuleCount,
  ModulePillarGroup,
  PillarWithStats,
  PrepHubData,
} from "./learning-types";

const _g = globalThis as typeof globalThis & {
  _ie_prepGroupModules?: ModulePillarGroup[];
  _ie_prepPillarStats?: PillarWithStats[];
};

function groupModulesByPillar(): ModulePillarGroup[] {
  if (_g._ie_prepGroupModules) return _g._ie_prepGroupModules;

  const order: string[] = [];
  const groups: Record<string, ModuleCount[]> = {};
  for (const entry of SEO_MODULES) {
    if (!groups[entry.pillarName]) {
      groups[entry.pillarName] = [];
      order.push(entry.pillarName);
    }
    const subcats = getSubcategoriesWithQuestions(
      entry.domainSlug,
      entry.moduleSlug,
    );
    const questionCount = subcats.reduce(
      (s, sc) => s + sc.questions.length,
      0,
    );
    groups[entry.pillarName].push({ entry, questionCount });
  }
  const result = order.map((pillarName) => ({
    pillarName,
    modules: groups[pillarName],
  }));
  _g._ie_prepGroupModules = result;
  return result;
}

function enrichPillars(): PillarWithStats[] {
  if (_g._ie_prepPillarStats) return _g._ie_prepPillarStats;

  const result = PILLAR_HUBS.map((pillar: PillarHubEntry) => {
    let questionCount = 0;
    let moduleCount = 0;
    for (const moduleSlug of pillar.moduleSlugs) {
      const entry = SEO_MODULES.find(
        (m: SeoModuleEntry) => m.moduleSlug === moduleSlug,
      );
      if (!entry) continue;
      moduleCount += 1;
      const subcats = getSubcategoriesWithQuestions(
        entry.domainSlug,
        entry.moduleSlug,
      );
      questionCount += subcats.reduce((s, sc) => s + sc.questions.length, 0);
    }
    return { pillar, moduleCount, questionCount };
  });
  _g._ie_prepPillarStats = result;
  return result;
}

function partitionModuleGroups(groups: ModulePillarGroup[]): {
  jfiGroups: ModulePillarGroup[];
  jbiGroups: ModulePillarGroup[];
} {
  const jfi: ModulePillarGroup[] = [];
  const jbi: ModulePillarGroup[] = [];
  for (const g of groups) {
    const domains = new Set(g.modules.map((m) => m.entry.domainSlug));
    const onlyJfi =
      domains.size === 1 && domains.has("java-fullstack-intermediate");
    if (onlyJfi) jfi.push(g);
    else jbi.push(g);
  }
  return { jfiGroups: jfi, jbiGroups: jbi };
}

/**
 * Build the full PrepHubData payload. Cached on globalThis so repeated renders
 * (generateMetadata + page render) share one pass.
 */
export function loadPrepHub(): PrepHubData {
  const pillarStats = enrichPillars();
  const moduleGroups = groupModulesByPillar();
  const { jfiGroups, jbiGroups } = partitionModuleGroups(moduleGroups);

  const architecturePillars = pillarStats.filter((s) =>
    isSystemArchitecturePillarSlug(s.pillar.pillarSlug),
  );
  const javaPlatformPillars = pillarStats.filter(
    (s) => !isSystemArchitecturePillarSlug(s.pillar.pillarSlug),
  );

  const totalModules = SEO_MODULES.length;
  const totalQuestions = moduleGroups.reduce(
    (s, g) => s + g.modules.reduce((ss, m) => ss + m.questionCount, 0),
    0,
  );

  return {
    pillarStats,
    moduleGroups,
    jfiGroups,
    jbiGroups,
    architecturePillars,
    javaPlatformPillars,
    totalModules,
    totalQuestions,
  };
}
