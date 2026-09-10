#!/usr/bin/env node
/**
 * curate-frontend-final-pattern.mjs — apply the final interview-path pattern
 * to the remaining frontend-fresher topic files.
 *
 * Final pattern per topic file:
 *   - anchor question(s): rewritten with deep, code-verified content and the
 *     plan metadata layer (priority / role / interviewStage / answerProfile)
 *     Sections: interviewer_expectation → speakable_answer → flow_diagram → deep_explanation
 *   - template follow-ups (when-to-use / common-mistake / compare / debug):
 *     interviewer_expectation → speakable_answer → deep_explanation → code_example
 *
 * The anchor lessons are authored per topic; the template follow-ups are
 * generated from the anchor's one-liner, matching the structure applied by the
 * cc22c09d/0b414c65/5360236 lineage of commits.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const repoRoot = path.resolve(scriptsDir, "..");
const domainRoot = path.join(repoRoot, "content/frontend-fresher");

/** Build the four template follow-up questions from an anchor's identity. */
function templateQuestions(anchorSlug, moduleSlug, topicSlug, topicTitle, anchorQuestion, anchorSummary, anchorMistake, anchorCode, anchorLanguage) {
  const lang = anchorLanguage ?? "jsx";
  const code = anchorCode ?? "";
  const suffix = `${moduleSlug}-${topicSlug}`;
  const mk = (kind) => {
    if (kind === "when-to-use") {
      return {
        slug: `${suffix}-when-to-use`,
        question: `When would you use ${topicTitle} in a real project?`,
        title: `When would you use ${topicTitle} in a real project`,
        direct: `I would use ${anchorQuestion} when the problem matches its main benefit. ${anchorSummary} In a real project, I would confirm that benefit on a small example before applying it broadly, and I would keep the simpler option whenever it is just as clear.`,
        expectation: `Start by defining ${anchorQuestion} in one sentence, then connect it to a decision: what kind of input or behaviour makes it a good fit. The interviewer is looking for a practical reason, not a list of buzzwords. ${anchorSummary}`,
        speakable: `I use ${anchorQuestion} when its rule makes the code safer, clearer, or more efficient for the actual problem. ${anchorSummary} I would first check the input and constraints, use a small example to confirm the behaviour, and then add a test for the boundary case. If the simpler option is just as clear and fast, I would choose that instead.`,
      };
    }
    if (kind === "common-mistake") {
      return {
        slug: `${suffix}-common-mistake`,
        question: `What is a common mistake when using ${topicTitle}?`,
        title: `a common mistake when using ${topicTitle}`,
        direct: `A common mistake with ${anchorQuestion} is using the rule without checking its boundary conditions. ${anchorSummary} That can make a valid-looking answer wrong under an edge case, so I state the assumption, handle the edge case, and add a small regression test.`,
        expectation: `Name one mistake, show why it happens, and explain the guard you would add. Avoid saying only "be careful"; connect the mistake to the behaviour of ${anchorQuestion}. ${anchorSummary}`,
        speakable: `The mistake I watch for with ${anchorQuestion} is assuming the happy path is the whole rule. ${anchorSummary} For example, the normal case may work while the zero, empty, duplicate, or error case behaves differently. I make the assumption explicit, add a focused test for it, and verify the result with a small input before shipping.`,
      };
    }
    if (kind === "compare") {
      return {
        slug: `${suffix}-compare`,
        question: `How would you compare ${topicTitle} with an alternative?`,
        title: `compare ${topicTitle} with an alternative`,
        direct: `I compare ${anchorQuestion} with the simpler alternative by looking at correctness first, then time, memory, and readability. ${anchorSummary} I normally choose the simplest option that meets the requirement, and I can say why the alternative is not needed for this case.`,
        expectation: `A strong comparison names the rule, the alternative, and the condition that changes the choice. Use the same input for both approaches so the trade-off is concrete. ${anchorSummary}`,
        speakable: `I would compare ${anchorQuestion} with the straightforward alternative on the same example. ${anchorSummary} If it removes repeated work or makes an important guarantee explicit, I would choose it when that benefit matters. Otherwise, I would keep the simpler version because fewer moving parts are easier to test and maintain. I would mention both complexity and the edge case that separates them.`,
      };
    }
    return {
      slug: `${suffix}-scenario`,
      question: `How would you debug a problem involving ${topicTitle}?`,
      title: `debug a problem involving ${topicTitle}`,
      direct: `I would debug a problem involving ${anchorQuestion} by reproducing it with the smallest input first. ${anchorSummary} Then I would inspect the intermediate values, compare them with the expected rule, fix the first incorrect step, and add a regression test.`,
      expectation: `Explain a repeatable debugging sequence: reproduce, isolate, observe, fix, and prove the fix. Tie each step to what ${anchorQuestion} is supposed to guarantee. ${anchorSummary}`,
      speakable: `I would start by reproducing the bug with the smallest input that still fails. I would log or inspect the state before and after the key operation, then compare it with the expected rule: ${anchorSummary} Once I find the first incorrect value, I would make the smallest fix, add a regression test, and run the boundary cases. I would also check the change under realistic load before calling it done.`,
    };
  };
  return [mk("when-to-use"), mk("common-mistake"), mk("compare"), mk("scenario")].map((t) => ({
    ...t,
    deep: `${anchorSummary}\n\n${anchorMistake}`,
    code,
    lang,
    intent: {
      testing: `Whether you can explain ${anchorQuestion} in plain language and apply it to a small example.`,
      common_mistake: `Giving a slogan about ${anchorQuestion} without checking its scope, boundary cases, or trade-offs.`,
      to_stand_out: "State the rule, walk through one concrete example, and name the test or edge case you would verify.",
    },
    followups: [
      `When would you use ${topicTitle} in a real project?`,
      `How would you compare ${topicTitle} with an alternative?`,
      `What is a common mistake when using ${topicTitle}?`,
    ],
  }));
}

export function applyTopic({ moduleSlug, topicSlug, topicTitle, anchors, existing }) {
  const file = path.join(domainRoot, moduleSlug, topicSlug, "complete-qa.json");
  const doc = existing ?? JSON.parse(fs.readFileSync(file, "utf8"));
  const suffix = `${moduleSlug}-${topicSlug}`;
  const templateSet = templateQuestions(
    suffix, moduleSlug, topicSlug, topicTitle,
    anchors[0].question, anchors[0].summary, anchors[0].mistake,
    anchors[0].code, anchors[0].language,
  );

  // The final questions: anchors first (with metadata), then the four templates.
  const questions = [];
  let order = 1;
  for (const anchor of anchors) {
    const prior = doc.questions[order - 1] ?? {};
    questions.push({
      ...prior,
      id: prior.id ?? `${suffix}-q${String(order).padStart(3, "0")}`,
      slug: anchor.slug,
      question: anchor.question,
      title: anchor.title,
      direct_answer: anchor.direct,
      layout_type: "concept-explanation",
      difficulty: anchor.difficulty ?? "easy",
      importance: anchor.importance ?? "high",
      reading_time_minutes: anchor.minutes ?? 6,
      interviewer_intent: {
        testing: `Whether you understand ${anchor.slugName ?? anchor.title} beyond memorized syntax.`,
        common_mistake: "Giving a definition without explaining a practical trade-off.",
        to_stand_out: "Connect the concept to a small production example and state its failure mode.",
      },
      answer: {
        sections: [
          { type: "interviewer_expectation", title: "Quick Revision", content: anchor.direct },
          { type: "speakable_answer", title: "Interview Answer", content: anchor.speakable },
          ...(anchor.flow ? [{ type: "flow_diagram", title: "Mental Model", content: "```mermaid\n" + anchor.flow + "\n```" }] : []),
          { type: "deep_explanation", title: "Deep Dive", content: anchor.deep },
        ],
      },
      followup_questions: [
        `When would you use ${topicTitle} in a real project?`,
        `How would you compare ${topicTitle} with an alternative?`,
        `What is a common mistake when using ${topicTitle}?`,
      ],
      order: order,
      seo: {
        metaTitle: `${anchor.title} — frontend interview question | InterviewExplainer`,
        metaDescription: `Interview answer for ${anchor.question} with a clear explanation, practical example, common mistakes, and follow-up questions.`,
      },
      priority: anchor.priority ?? "frequent",
      role: "anchor",
      interviewStage: anchor.stage ?? "fundamentals",
      answerProfile: anchor.profile ?? "definition",
    });
    order += 1;
  }
  for (let i = 0; i < templateSet.length; i++) {
    const t = templateSet[i];
    const prior = doc.questions[anchors.length + i] ?? {};
    questions.push({
      ...prior,
      id: prior.id ?? `${suffix}-q${String(anchors.length + i + 1).padStart(3, "0")}`,
      slug: t.slug,
      question: t.question,
      title: t.title,
      direct_answer: t.direct,
      layout_type: "interview-practice",
      difficulty: "easy",
      importance: "medium",
      reading_time_minutes: 6,
      interviewer_intent: t.intent,
      answer: {
        sections: [
          { type: "interviewer_expectation", title: "What the interviewer wants", content: t.expectation },
          { type: "speakable_answer", title: "Interview answer", content: t.speakable },
          { type: "deep_explanation", title: "Build the mental model", content: t.deep },
          ...(t.code ? [{ type: "code_example", title: "Example", content: "```" + t.lang + "\n" + t.code + "\n```" }] : []),
        ],
      },
      followup_questions: t.followups,
      order: anchors.length + i + 1,
      seo: {
        metaTitle: `${t.title} — frontend interview question | InterviewExplainer`,
        metaDescription: `Interview answer for ${t.question} with a clear explanation, practical example, common mistakes, and follow-up questions.`,
      },
    });
    order += 1;
  }

  doc.topic = topicTitle;
  doc.topicSlug = topicSlug;
  doc.questions = questions;
  fs.writeFileSync(file, JSON.stringify(doc, null, 2) + "\n");
  return questions.length;
}
