/**
 * skill-taxonomy.ts — Canonical skill entity + normalization (P11-V, T215..T230).
 *
 * One canonical skill list with aliases so resume claims and job requirements
 * resolve to the same entity regardless of surface wording ("JS" / "JavaScript"
 * / "ECMAScript" → one id). Java vs JavaScript is handled explicitly (T219).
 *
 * Pure data — server-safe, tree-shakeable.
 */

import type { CanonicalSkill, SkillCategory } from "./resume-types";

export const SKILL_TAXONOMY: CanonicalSkill[] = [
  // Languages
  { id: "java", name: "Java", category: "language", aliases: ["java se", "java ee"] },
  { id: "javascript", name: "JavaScript", category: "language", aliases: ["js", "ecmascript", "vanilla js"] },
  { id: "typescript", name: "TypeScript", category: "language", aliases: ["ts"] },
  { id: "python", name: "Python", category: "language", aliases: ["py", "python3"] },
  { id: "go", name: "Go", category: "language", aliases: ["golang"] },
  { id: "csharp", name: "C#", category: "language", aliases: ["c sharp", "dotnet"] },
  { id: "cpp", name: "C++", category: "language", aliases: ["c plus plus"] },
  { id: "ruby", name: "Ruby", category: "language", aliases: [] },
  { id: "kotlin", name: "Kotlin", category: "language", aliases: [] },
  { id: "swift", name: "Swift", category: "language", aliases: [] },
  { id: "sql", name: "SQL", category: "language", aliases: ["structured query language"] },

  // Frameworks
  { id: "spring", name: "Spring", category: "framework", aliases: ["spring boot", "spring framework"] },
  { id: "react", name: "React", category: "framework", aliases: ["reactjs", "react.js"] },
  { id: "angular", name: "Angular", category: "framework", aliases: ["angularjs"] },
  { id: "vue", name: "Vue", category: "framework", aliases: ["vuejs", "vue.js"] },
  { id: "nextjs", name: "Next.js", category: "framework", aliases: ["next js"] },
  { id: "node", name: "Node.js", category: "framework", aliases: ["node", "nodejs"] },
  { id: "express", name: "Express", category: "framework", aliases: ["expressjs"] },
  { id: "django", name: "Django", category: "framework", aliases: [] },
  { id: "flask", name: "Flask", category: "framework", aliases: [] },
  { id: "rails", name: "Ruby on Rails", category: "framework", aliases: ["ror"] },

  // Databases
  { id: "postgresql", name: "PostgreSQL", category: "database", aliases: ["postgres"] },
  { id: "mysql", name: "MySQL", category: "database", aliases: [] },
  { id: "mongodb", name: "MongoDB", category: "database", aliases: ["mongo"] },
  { id: "redis", name: "Redis", category: "database", aliases: [] },
  { id: "elasticsearch", name: "Elasticsearch", category: "database", aliases: ["es"] },
  { id: "dynamodb", name: "DynamoDB", category: "database", aliases: ["dynamo"] },

  // Cloud
  { id: "aws", name: "AWS", category: "cloud", aliases: ["amazon web services"] },
  { id: "gcp", name: "Google Cloud", category: "cloud", aliases: ["google cloud platform", "gcp"] },
  { id: "azure", name: "Azure", category: "cloud", aliases: ["microsoft azure"] },

  // DevOps
  { id: "docker", name: "Docker", category: "devops", aliases: ["containers"] },
  { id: "kubernetes", name: "Kubernetes", category: "devops", aliases: ["k8s"] },
  { id: "ci-cd", name: "CI/CD", category: "devops", aliases: ["ci", "cd", "continuous integration"] },
  { id: "terraform", name: "Terraform", category: "devops", aliases: ["iac"] },

  // Data
  { id: "kafka", name: "Kafka", category: "data", aliases: ["apache kafka"] },
  { id: "spark", name: "Spark", category: "data", aliases: ["apache spark"] },
  { id: "airflow", name: "Airflow", category: "data", aliases: ["apache airflow"] },

  // Architecture
  { id: "system-design", name: "System Design", category: "architecture", aliases: ["distributed systems"] },
  { id: "microservices", name: "Microservices", category: "architecture", aliases: ["microservice"] },
  { id: "rest", name: "REST", category: "architecture", aliases: ["rest api"] },
  { id: "graphql", name: "GraphQL", category: "architecture", aliases: [] },

  // Security
  { id: "security", name: "Security", category: "security", aliases: ["appsec", "infosec"] },

  // Soft skills
  { id: "leadership", name: "Leadership", category: "soft-skill", aliases: ["mentoring"] },
  { id: "communication", name: "Communication", category: "soft-skill", aliases: [] },
  { id: "problem-solving", name: "Problem Solving", category: "soft-skill", aliases: [] },
];

const ALIAS_INDEX: Map<string, CanonicalSkill> = (() => {
  const idx = new Map<string, CanonicalSkill>();
  for (const skill of SKILL_TAXONOMY) {
    idx.set(normalizeKey(skill.name), skill);
    for (const a of skill.aliases) idx.set(normalizeKey(a), skill);
  }
  return idx;
})();

export function normalizeKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Resolve a free-text skill mention to a canonical skill.
 * Explicitly guards the Java/JavaScript collision (P11-T219): "java" never
 * resolves to JavaScript and vice versa.
 */
export function resolveSkill(raw: string): CanonicalSkill | null {
  const key = normalizeKey(raw);
  if (!key) return null;
  // Exact alias match first.
  const direct = ALIAS_INDEX.get(key);
  if (direct) return direct;
  // Guard Java vs JavaScript: only substring-match when unambiguous.
  if (key === "java") return ALIAS_INDEX.get("java") ?? null;
  return null;
}

export function categorizeSkill(name: string): SkillCategory | null {
  return resolveSkill(name)?.category ?? null;
}
