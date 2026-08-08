/**
 * Phase 12 — Tools: canonical types.
 *
 * Hoists the TOOL_CATEGORIES map + the per-tool question rollup shape
 * out of `app/tools/**` into a typed, importable layer.
 */
import type { Level } from "@/lib/contentV2-types"
import type { V2QuestionEntry } from "@/lib/contentV2-types"

/** A tool with its rolled-up question/level counts (rendered as a card). */
export interface ToolCardData {
  slug: string
  name: string
  questionCount: number
  levelCount: number
}

/** A categorized group of tools on the /tools hub. */
export interface ToolCategoryGroup {
  key: string
  label: string
  iconKey: string
  color: string
  bg: string
  tools: ToolCardData[]
}

/** A level section on the /tools/[tool] page. */
export interface ToolLevelSection {
  level: Level
  questions: V2QuestionEntry[]
}

/** The /tools/[tool] page payload. */
export interface ToolHubPageData {
  slug: string
  name: string
  levels: ToolLevelSection[]
  totalQuestions: number
}
