import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(scriptsDirectory, "..");
const domainRoot = path.join(repoRoot, "content/frontend-fresher");
const domainIndex = JSON.parse(fs.readFileSync(path.join(domainRoot, "_index.json"), "utf8"));
const generatedQuestionPatterns = [
  /^what is .+, and when would you use it\?$/i,
  /^when would you use .+ in a real project\?$/i,
  /^what is a common mistake when using .+\?$/i,
  /^how would you compare .+ with an alternative\?$/i,
  /^how would you debug a problem involving .+\?$/i,
];

export const paragraphs = (...parts) => parts.flat().filter(Boolean).join("\n\n");

export function markdownTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `|${headers.map(() => "---").join("|")}|`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function wordCount(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\]()-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function assertLesson(moduleSlug, topicSlug, lesson) {
  if (!lesson.question || generatedQuestionPatterns.some((pattern) => pattern.test(lesson.question))) {
    throw new Error(`${moduleSlug}/${topicSlug}: generated or missing question: ${lesson.question}`);
  }
  if (!lesson.title || !lesson.direct || lesson.direct.length < 24) {
    throw new Error(`${moduleSlug}/${topicSlug}/${lesson.question}: title or direct answer is missing`);
  }
  if (!Array.isArray(lesson.quick) || lesson.quick.length < 3 || lesson.quick.length > 7) {
    throw new Error(`${moduleSlug}/${topicSlug}/${lesson.question}: Quick revision must contain 3–7 points`);
  }
  if (!Array.isArray(lesson.interview) || lesson.interview.length < 3 || lesson.interview.length > 5) {
    throw new Error(`${moduleSlug}/${topicSlug}/${lesson.question}: Interview answer must contain 3–5 paragraphs`);
  }
  if (!lesson.deepTitle || !Array.isArray(lesson.deep) || lesson.deep.length < 2) {
    throw new Error(`${moduleSlug}/${topicSlug}/${lesson.question}: independent Deep Dive is incomplete`);
  }
  const interview = paragraphs(lesson.interview);
  if (/^\s*[-*+]\s/m.test(interview)) {
    throw new Error(`${moduleSlug}/${topicSlug}/${lesson.question}: Interview answer starts a bullet list`);
  }
}

function answerSizeFor(interview) {
  const words = wordCount(interview);
  if (words <= 240) return "compact";
  if (words <= 360) return "standard";
  return "deep";
}

export function curateIndexedModule({ moduleSlug, topicPacks, defaultLayout = "concept-explanation" }) {
  const indexedModule = (domainIndex.modules ?? []).find((entry) => entry.moduleSlug === moduleSlug);
  if (!indexedModule || indexedModule.contentSource) {
    throw new Error(`${moduleSlug} is not a local indexed Frontend module`);
  }

  const indexedTopics = new Set(indexedModule.topics ?? []);
  const packTopics = Object.keys(topicPacks);
  for (const topicSlug of packTopics) {
    if (!indexedTopics.has(topicSlug)) throw new Error(`${moduleSlug}/${topicSlug} is not indexed`);
    if (topicPacks[topicSlug].length !== 5) {
      throw new Error(`${moduleSlug}/${topicSlug} must define exactly five canonical lessons`);
    }
  }

  let questionCount = 0;
  for (const topicSlug of packTopics) {
    const file = path.join(domainRoot, moduleSlug, topicSlug, "complete-qa.json");
    if (!fs.existsSync(file)) throw new Error(`Missing indexed topic file: ${file}`);
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    const questions = Array.isArray(document) ? document : document.questions;
    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error(`${moduleSlug}/${topicSlug} must contain exactly five existing questions`);
    }

    const lessons = topicPacks[topicSlug];
    const identities = questions.map(({ id, slug, order }) => ({ id, slug, order }));
    const revised = questions.map((original, index) => {
      const lesson = lessons[index];
      assertLesson(moduleSlug, topicSlug, lesson);
      const interview = paragraphs(lesson.interview);
      const sections = [
        { type: "key_points", title: "Quick revision", items: lesson.quick },
        {
          type: "speakable_answer",
          title: "Interview answer",
          answerSize: lesson.answerSize ?? answerSizeFor(interview),
          content: interview,
        },
        {
          type: "deep_explanation",
          title: lesson.deepTitle,
          content: paragraphs(lesson.deep),
        },
        ...(lesson.support ? [{
          type: lesson.support.type,
          title: lesson.support.title,
          content: lesson.support.content,
        }] : []),
        ...(lesson.practice ? [{
          type: "practice_prompt",
          title: lesson.practice.title,
          content: lesson.practice.content,
        }] : []),
      ];

      const updated = {
        ...original,
        question: lesson.question,
        title: lesson.title,
        direct_answer: lesson.direct,
        layout_type: lesson.layout ?? defaultLayout,
        difficulty: lesson.difficulty ?? original.difficulty ?? "easy",
        importance: lesson.importance ?? "high",
        reading_time_minutes: lesson.minutes ?? 7,
        answer: { ...original.answer, sections },
        followup_questions: lesson.followups ?? [],
        seo: {
          ...original.seo,
          metaTitle: `${lesson.title} | InterviewExplainer`,
          metaDescription: lesson.direct.length > 157
            ? `${lesson.direct.slice(0, 154).trimEnd()}...`
            : lesson.direct,
        },
      };
      delete updated.interviewer_intent;
      delete updated.speakable_v2;
      delete updated.answer_sections;
      return updated;
    });

    const revisedIdentities = revised.map(({ id, slug, order }) => ({ id, slug, order }));
    if (JSON.stringify(identities) !== JSON.stringify(revisedIdentities)) {
      throw new Error(`${moduleSlug}/${topicSlug}: identity or order changed`);
    }

    if (Array.isArray(document)) {
      fs.writeFileSync(file, `${JSON.stringify(revised, null, 2)}\n`);
    } else {
      document.questions = revised;
      document.last_updated = "2026-09-08";
      fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
    }
    questionCount += revised.length;
  }

  console.log(`Curated ${questionCount} canonical questions in ${moduleSlug}; preserved IDs, slugs, order, and routes.`);
}
