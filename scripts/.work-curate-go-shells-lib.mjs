import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const modes = ["fundamentals", "usage", "mistake", "comparison", "scenario"];

const modeTitles = {
  fundamentals: "The core model",
  usage: "The practical decision",
  mistake: "Why the failure happens",
  comparison: "The important trade-off",
  scenario: "A reliable diagnosis",
};

const modeLeads = {
  fundamentals: (spec) => `${spec.label} is easiest to understand by following the data or control from input to result. The details below form one connected model rather than a list of unrelated rules.`,
  usage: (spec) => `The useful question is not whether ${spec.label} can be used, but which requirement makes it the clearest and safest fit. That decision includes its cost and its failure boundary.`,
  mistake: (spec) => `Failures around ${spec.label} usually come from one incorrect assumption about ownership, state, ordering, or lifetime. Finding that assumption is more useful than adding a defensive line at random.`,
  comparison: (spec) => `${spec.label} and ${spec.alt} solve related problems, but they expose different guarantees. The best choice follows from the guarantee the program actually needs.`,
  scenario: (spec) => `A good investigation traces the first point where the real state differs from the expected state. With ${spec.label}, that means observing the relevant input, transition, and result rather than guessing from the final symptom.`,
};

const practicePrompts = {
  fundamentals: (spec) => `Explain ${spec.label} using the example above. Name the input, the rule that changes it, and the final result.`,
  usage: (spec) => `Write one requirement that favours ${spec.label} and one requirement that would make ${spec.alt} a better fit.`,
  mistake: (spec) => `Change the example so it shows the common failure. Then state the smallest correction that restores the intended rule.`,
  comparison: (spec) => `Apply both options to the same small input. Compare correctness, resource use, and clarity before selecting one.`,
  scenario: (spec) => `List the first three observations you would collect, the smallest reproducer, and the regression test that proves the fix.`,
};

function normalizeSentence(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function paragraphs(parts) {
  return parts.map(normalizeSentence).filter(Boolean).join("\n\n");
}

function directFor(spec, mode) {
  if (spec.directByMode?.[mode]) return spec.directByMode[mode];
  const pairs = {
    fundamentals: [spec.definition, spec.mechanism],
    usage: [spec.use, spec.boundary],
    mistake: [spec.mistake, spec.repair],
    comparison: [spec.contrast, spec.boundary],
    scenario: [spec.scenario, spec.repair],
  };
  return pairs[mode].map(normalizeSentence).join(" ");
}

function interviewFor(spec, mode) {
  if (spec.interviewByMode?.[mode]) {
    const value = spec.interviewByMode[mode];
    return Array.isArray(value) ? paragraphs(value) : String(value).trim();
  }
  const parts = {
    fundamentals: [spec.definition, spec.mechanism, `For example, ${spec.example}`, spec.boundary, spec.use],
    usage: [spec.definition, spec.use, `For example, ${spec.example}`, spec.contrast, spec.boundary],
    mistake: [spec.definition, spec.mistake, `For example, ${spec.example}`, spec.repair, spec.boundary],
    comparison: [spec.definition, spec.contrast, spec.mechanism, `For example, ${spec.example}`, spec.boundary],
    scenario: [spec.definition, spec.scenario, `For example, ${spec.example}`, spec.repair, spec.boundary],
  };
  return paragraphs(parts[mode]);
}

function quickFor(spec, mode) {
  if (spec.quickByMode?.[mode]) return spec.quickByMode[mode].map(normalizeSentence);
  const facts = spec.quick.map(normalizeSentence);
  const extra = {
    fundamentals: [spec.definition, spec.mechanism],
    usage: [spec.use, spec.boundary],
    mistake: [spec.mistake, spec.repair],
    comparison: [spec.contrast, spec.boundary],
    scenario: [spec.scenario, spec.repair],
  }[mode].map(normalizeSentence);
  return [...extra, ...facts].filter(Boolean).slice(0, 6);
}

function questionsFor(spec) {
  return spec.questions ?? [
    `What should a Go developer know about ${spec.label}?`,
    `When is ${spec.label} the right choice?`,
    `What can go wrong with ${spec.label}?`,
    `How does ${spec.label} differ from ${spec.alt}?`,
    `How do you troubleshoot ${spec.label}?`,
  ];
}

function titleFor(prompt) {
  return prompt.replace(/\?$/, "");
}

function description(value) {
  const plain = value.replace(/[`*_#]/g, "").replace(/\s+/g, " ").trim();
  return plain.length <= 158 ? plain : `${plain.slice(0, 155).trimEnd()}...`;
}

function answerSizeFor(content) {
  const words = String(content)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\]()-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  if (words <= 240) return "compact";
  if (words <= 360) return "standard";
  return "deep";
}

export function curateModule(moduleSlug, specs) {
  let files = 0;
  let questions = 0;
  const moduleDirectory = path.join(repoRoot, "content/go-fresher", moduleSlug);

  for (const [topicSlug, spec] of Object.entries(specs)) {
    const file = path.join(moduleDirectory, topicSlug, "complete-qa.json");
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(document.questions) || document.questions.length !== modes.length) {
      throw new Error(`${file} must contain exactly ${modes.length} canonical questions`);
    }
    const prompts = questionsFor(spec);
    if (prompts.length !== modes.length) throw new Error(`${topicSlug} must provide five prompts`);

    document.questions.forEach((question, index) => {
      const mode = modes[index];
      const direct = directFor(spec, mode);
      const interview = interviewFor(spec, mode);
      const deepTitle = `${modeTitles[mode]}: ${spec.label}`;
      const deepBody = spec.deepByMode?.[mode] ?? spec.deep;
      const deepContent = `${modeLeads[mode](spec)}\n\n${deepBody}`;
      const code = spec.codeByMode?.[mode] ?? spec.code;
      const table = spec.tableByMode?.[mode] ?? spec.table;
      const flow = spec.flowByMode?.[mode] ?? spec.flow;
      const sections = [
        { type: "key_points", title: "Quick revision", items: quickFor(spec, mode) },
        {
          type: "speakable_answer",
          title: "Interview answer",
          answerSize: spec.answerSizeByMode?.[mode] ?? spec.answerSize ?? answerSizeFor(interview),
          content: interview,
        },
        { type: "deep_explanation", title: deepTitle, content: deepContent },
      ];
      if (flow) sections.push({ type: "flow_diagram", title: spec.flowTitleByMode?.[mode] ?? spec.flowTitle ?? `${spec.label} flow`, content: flow });
      if (code) sections.push({ type: "code_example", title: spec.codeTitleByMode?.[mode] ?? spec.codeTitle ?? `${spec.label} example`, content: code });
      if (table) sections.push({ type: "comparison_table", title: spec.tableTitleByMode?.[mode] ?? spec.tableTitle ?? `${spec.label} at a glance`, content: table });
      sections.push({ type: "practice_prompt", title: "Check the idea", content: practicePrompts[mode](spec) });

      question.question = prompts[index];
      question.title = titleFor(prompts[index]);
      question.direct_answer = direct;
      question.answer = { sections };
      question.interviewer_intent = {
        testing: spec.testing ?? `Whether the learner understands the real rules and trade-offs behind ${spec.label}.`,
        common_mistake: normalizeSentence(spec.mistake),
        to_stand_out: spec.strongAnswer ?? `Connect the rule to the concrete example and state its important boundary.`,
      };
      question.followup_questions = spec.followupsByMode?.[mode] ?? spec.followups ?? [
        `Which guarantee of ${spec.label} matters most in this example?`,
        `What boundary or failure case should be tested?`,
        `When would ${spec.alt} be a clearer choice?`,
      ];
      const words = [direct, interview, deepContent, code ?? "", table ?? ""]
        .join(" ").split(/\s+/).filter(Boolean).length;
      question.reading_time_minutes = Math.max(4, Math.ceil(words / 190));
      question.seo = {
        ...(question.seo ?? {}),
        metaTitle: `${titleFor(prompts[index])} | InterviewExplainer`,
        metaDescription: description(direct),
      };
      delete question.answer_sections;
      delete question.speakable_v2;
      questions += 1;
    });

    fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
    files += 1;
  }

  console.log(`Curated ${questions} questions across ${files} files in ${moduleSlug}`);
}
