#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/behavioral-and-fresher-qa";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "fresher-self-introduction": {
    answerSize: "compact",
    direct: "A useful fresher introduction is a short, relevant story: your present role or education, the backend skills you can demonstrate, one project with a concrete contribution, and the reason this role is the next logical step. It should sound like a person explaining their direction, not a list of every course or a memorised slogan. Around one minute is usually enough, and every claim should open a follow-up you are prepared to answer.",
    quick: [
      "Open with your current education, role, or recent transition.",
      "Name two or three relevant skills you can prove with work.",
      "Use one project contribution and its result as evidence.",
      "Connect that experience to the specific role you want next.",
      "Keep only claims you can explain naturally in a follow-up.",
    ],
    interview: [
      "- I recently completed my computer science degree, where I became most interested in backend development because I enjoy turning a requirement into clear data and application behaviour. Over the last year I have worked mainly with Ruby, Rails, PostgreSQL, Git, and automated tests rather than trying to list every technology I have touched.",
      "- My main project is a small appointment-booking API. I designed the Rails models and REST endpoints, added validation to prevent overlapping slots, and wrote request tests for successful bookings and conflicts. For example, the first version allowed two requests to reserve the same slot, so I added a database constraint and handled that failure as a conflict response instead of relying only on an application check.",
      "- That project taught me that a feature is more than the happy-path code. I had to think about migrations, error responses, test data, logs, and how another developer would run the application. I also used pull requests for my changes and kept the setup documented so the project was reproducible.",
      "- I am now looking for a junior backend role where I can contribute this foundation to a real product, learn from code review, and improve how I design and operate Rails services. This position is relevant to me because it combines the Ruby work I have practised with the team-based engineering experience I want to develop next.",
    ],
    deepTitle: "Choose evidence that creates the right follow-up conversation",
    deep: [
      "An introduction is a relevance filter. The listener already has the resume; the spoken version should connect its strongest evidence into one direction. Present context explains where the candidate is now, a project proves applied ability, and the final connection explains why this role follows naturally.",
      "Specific nouns make an introduction credible. “A Rails appointment API with PostgreSQL” gives a clearer picture than “several innovative projects.” One decision—preventing overlapping bookings, reducing a slow query, or designing an error response—shows ownership without turning the opening into a full project presentation.",
      "Every detail creates a likely question. Mentioning Sidekiq means being ready to explain what ran in the job, how failure was handled, and why it was asynchronous. Removing a technology from the opening is better than planting a claim supported only by a tutorial.",
      "The closing connection should be genuine and role-specific: backend product work, Rails maintenance, API development, or learning within an experienced team. Personal biography, marks, hobbies, and unrelated tools belong only when they explain a useful strength or the interviewer explicitly asks for them.",
    ],
    visualType: "flow_diagram",
    visualTitle: "A one-minute introduction with evidence at the centre",
    visual: fence("mermaid", [
      "flowchart LR",
      "  P[present: current direction] --> S[relevant skills]",
      "  S --> E[one project decision and result]",
      "  E --> L[what the work taught you]",
      "  L --> N[why this role is the next step]",
    ]),
    exampleTitle: "Adapt the evidence, not the wording",
    example: "**Weak:** “I am passionate about coding and know many technologies.” Nothing can be verified or explored.\n\n**Stronger:** “I built a Rails booking API and fixed a duplicate-reservation race with a database constraint and a conflict response.” The sentence shows the system, the candidate's action, and a useful follow-up.\n\nReplace the project, decision, and next step with facts from your own work; do not copy an experience you did not have.",
    followups: [
      "Why did you choose the project mentioned in your introduction?",
      "What technical decision in that project would you change now?",
      "Which part of this backend role do you most want to learn?",
    ],
  },
  "fresher-project-stories": {
    answerSize: "standard",
    direct: "A strong project story explains the problem, your own responsibility, the important technical decision, the evidence that it worked, and what you learned. STAR—Situation, Task, Action, Result—keeps the story ordered, but the Action should contain most of the detail. Separate personal work from team work, use real numbers or observable outcomes when available, and be ready to trace one request, failure, or trade-off through the system rather than only naming the technology stack.",
    quick: [
      "State the user or engineering problem before naming the stack.",
      "Separate your responsibility from what the whole team delivered.",
      "Spend most of the answer on decisions, actions, and trade-offs.",
      "Use an observable result: behaviour, test, measurement, or feedback.",
      "Finish with one honest lesson and the next improvement you would make.",
    ],
    interview: [
      "- My project was an appointment-booking API for a small clinic. The first goal was simple—show open slots and create a booking—but the important constraint was that two users could not reserve the same doctor and time. I owned the Rails API, PostgreSQL schema, and request tests; another teammate built the client.",
      "- I modelled doctors, slots, and bookings, exposed resource-based endpoints, and returned validation errors as consistent JSON. Initially I checked availability in Ruby before inserting a booking. During a concurrent-request test, both requests could pass that check before either saved, so the design still allowed a duplicate.",
      "- I changed the database model to represent the real invariant with a unique index on the doctor and time slot. The controller caught the resulting record conflict and returned `409 Conflict`, while the client refreshed availability. For example, a test issued competing booking attempts and proved that exactly one record remained instead of asserting only a message from a single request.",
      "- After that change, the duplicate path was reproducible and protected at the point every application instance shared. I also added structured logging around rejected bookings and documented the migration and endpoint response so the client developer could handle it predictably.",
      "- The main lesson was that an application-level check can improve the user message but cannot alone protect a concurrency invariant. If I extended the project, I would add idempotency for repeated client submissions and measure query behaviour on the availability endpoint before adding caching.",
    ],
    deepTitle: "A project answer is a chain of evidence, not a feature inventory",
    deep: [
      "Situation establishes why the work mattered and the constraint that shaped it. One or two sentences are enough. A long product history leaves little room for the candidate's engineering contribution. The task then names personal responsibility precisely: schema and API, test automation, deployment, performance investigation, or another owned boundary.",
      "Action is where technical depth lives. Explain the first model, the failure it produced, alternatives considered, and the reason for the final choice. A request path, data transition, or bug timeline is easier to understand than a list of Rails, Redis, Docker, and AWS without relationships.",
      "A result does not need a large business metric. A passing concurrency test, removal of duplicate rows, a measured response-time change, fewer manual steps, or feedback from a user is still evidence. If no measurement was taken, say what observable behaviour changed instead of inventing a percentage.",
      "Reflection distinguishes learning from storytelling. A useful lesson identifies the boundary that was misunderstood and a concrete next step. It should not erase the original decision with hindsight; it shows how new evidence changed the mental model.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Turn one project incident into an interview-ready story",
    visual: fence("mermaid", [
      "flowchart LR",
      "  S[problem and constraint] --> T[your responsibility]",
      "  T --> A[first approach]",
      "  A --> F[evidence of failure or risk]",
      "  F --> D[decision and implementation]",
      "  D --> R[observable result]",
      "  R --> L[lesson and next improvement]",
    ]),
    exampleTitle: "Evidence ladder for a project claim",
    example: "**Claim:** “I prevented duplicate bookings.”\n\n**Mechanism:** a composite unique index protected doctor and slot at the database boundary.\n\n**Evidence:** a competing-request test left exactly one booking and the losing request received `409`.\n\n**Boundary:** the friendly pre-check remained useful, but only the constraint made the invariant safe across processes.\n\nThis ladder gives a listener four levels to explore without forcing the opening story to contain every implementation detail.",
    followups: [
      "Why was an application availability check insufficient by itself?",
      "How did you test the most important failure path?",
      "What would you measure before scaling this project?",
    ],
  },
  "fresher-behavioral-questions": {
    answerSize: "standard",
    direct: "A behavioral answer should use one real event to show how you acted and what changed. Briefly set the situation and your responsibility, explain the choices and communication in enough detail to reveal judgment, state the result without exaggeration, and finish with a specific lesson. STAR is a useful order, but evidence matters more than the acronym. Use “I” for your contribution and “we” for the team result, and never turn a conflict answer into blame.",
    quick: [
      "Choose one real event that matches the behaviour being asked about.",
      "Keep situation and task short; make actions and judgment concrete.",
      "Separate your contribution from the team's shared result.",
      "Use evidence without inventing numbers or making another person the villain.",
      "End with the lesson that changed your later behaviour.",
    ],
    interview: [
      "- In a college project, a teammate and I disagreed about whether the client should call the database service directly or whether our Rails API should remain the only data boundary. The disagreement started delaying the feature, and I was responsible for the endpoint that both designs affected.",
      "- I first asked us to write down what each option was trying to optimise. The direct call looked faster to implement, while the API boundary kept authorization and validation in one place. I drew the two request flows, identified where credentials and booking rules would live, and asked our mentor to review the security assumption rather than decide whose preference was better.",
      "- For example, we traced a cancellation request and found that the direct path would duplicate the ownership check already enforced by Rails. We agreed to keep the API boundary and reduced the extra work by defining the response shape together before I implemented it.",
      "- The feature was completed without two versions of the authorization rule, and the client developer could work against the agreed contract while I finished the endpoint. I documented the decision so the same debate did not restart on the next feature.",
      "- I learned to turn a disagreement into explicit constraints and a small piece of evidence. Since then, I try to clarify the shared goal, compare consequences, and bring in a reviewer for a specific unknown instead of allowing a technical discussion to become personal.",
    ],
    deepTitle: "Reveal behaviour through decisions, not adjectives",
    deep: [
      "Words such as collaborative, responsible, and adaptable are conclusions. A listener can believe them only after seeing an action: asking for missing context, changing a plan after evidence, documenting a decision, owning an error, or helping unblock another person. One complete incident is stronger than several unsupported qualities.",
      "The selected story must match the signal in the question. A conflict story needs disagreement and resolution; an ownership story needs a gap the candidate chose to close; a failure story needs an actual consequence and changed behaviour. Reusing one project is fine when different events genuinely prove different skills.",
      "Team language needs precision. “We delivered” credits shared work, while “I reproduced the bug and added the constraint” identifies personal contribution. Claiming an entire group result as individual work harms credibility; describing only “we” leaves the candidate's behaviour invisible.",
      "Reflection closes the evidence loop. It should name a changed practice rather than a generic promise to communicate better. Writing assumptions before a design debate, adding a pre-merge checklist, or asking for early feedback are behaviours that can be observed in the next story too.",
    ],
    visualType: "comparison_table",
    visualTitle: "What each part of a behavioral answer must prove",
    visual: "| Part | Purpose | Useful evidence |\n|---|---|---|\n| Situation | establish the relevant constraint | one event, not full project history |\n| Responsibility | show what was yours to handle | decision, deliverable, or risk |\n| Action | reveal judgment and communication | sequence, alternative, and reason |\n| Result | show what changed | behaviour, feedback, or honest measurement |\n| Reflection | show reusable learning | one later practice you changed |",
    exampleTitle: "Replace labels with observable evidence",
    example: "**Label only:** “I am good at handling conflict.”\n\n**Evidence:** “I wrote down the two competing constraints, traced one request through both designs, and asked a mentor to review the security assumption. We agreed on the API boundary and documented why.”\n\nThe second version lets a reader infer collaboration, analysis, and ownership from actions rather than accepting adjectives on trust.",
    followups: [
      "What would you have done if the teammate still disagreed after the review?",
      "How do you describe a team result without hiding your own contribution?",
      "Which later behaviour changed because of this experience?",
    ],
  },
  "fresher-handling-unknown-questions": {
    answerSize: "compact",
    direct: "When you do not know an interview answer, state the limit honestly, clarify the term or scenario, connect it to knowledge you do have, and separate facts from assumptions. If useful, reason through a small example and explain exactly how you would verify the uncertain part with documentation, a focused experiment, logs, or a test. Do not bluff or fill space with unrelated facts. A partial but traceable answer is more useful than confident misinformation.",
    quick: [
      "Say clearly which fact or term is unfamiliar; do not bluff.",
      "Clarify the scenario before assuming what the question means.",
      "Reason from related concepts while labelling every assumption.",
      "Use a small example to expose what is known and still uncertain.",
      "Name a concrete verification step: docs, test, logs, or experiment.",
    ],
    interview: [
      "- I have not used that specific Rails cache store, so I do not want to invent its eviction behaviour. I understand the surrounding role: a cache keeps a reusable result behind a key, and correctness depends on expiry and invalidation when the source data changes.",
      "- Could I clarify whether the question is about how Rails chooses the store, or what happens when several processes update the same cached value? Those are different boundaries, and I can reason more accurately once the failure being discussed is clear.",
      "- For example, if the concern is stale product data, I would trace where the key is written, which updates should invalidate it, and what a miss does. I would not assume an in-memory store behaves like Redis across multiple application processes.",
      "- My current hypothesis would be that the application can tolerate a miss but must define how much staleness is acceptable. I would confirm the store's atomic operations and expiration semantics in the Rails adapter documentation, then reproduce the update and read with two processes or a focused integration test.",
      "- So I cannot give the store-specific guarantee yet, but I can identify the relevant contract, the unsafe assumption, and the evidence needed to answer it. If the exact recall is required, I would rather state that gap than present a guess as production behaviour.",
    ],
    deepTitle: "Turn an unknown into a bounded investigation",
    deep: [
      "Not knowing can mean several things: an unfamiliar name, a forgotten API detail, no production experience with a tool, or a concept that is entirely new. Naming the boundary prevents a narrow recall gap from sounding like total confusion and prevents broad familiarity from being presented as specific experience.",
      "Clarification discovers the contract under discussion. A question about a queue may concern delivery guarantee, ordering, retry, throughput, or application use. Answering the wrong dimension at length creates more risk than asking one precise question.",
      "Reasoning is valuable only when assumptions stay visible. A nearby concept can supply a starting model, but product-specific behaviour must not be inferred as fact. Drawing one input, transition, and expected output often reveals exactly where documentation or an experiment is needed.",
      "Verification should be executable. “I would research it” is vague; reading the official adapter contract, writing a two-process reproduction, checking an execution plan, or capturing a failing request identifies evidence and a stopping condition. This method is also how engineers handle unknowns after the interview.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Move from an unknown term to verifiable evidence",
    visual: fence("mermaid", [
      "flowchart LR",
      "  U[name the exact unknown] --> C[clarify the scenario]",
      "  C --> K[state related known facts]",
      "  K --> A[label assumptions]",
      "  A --> X[try one small example]",
      "  X --> V[verify with docs, test, or logs]",
      "  V --> B[report the bounded conclusion]",
    ]),
    exampleTitle: "A bounded answer is better than a confident guess",
    example: "**Unsafe:** “Rails probably makes that operation atomic.”\n\n**Bounded:** “I do not know whether this adapter guarantees atomicity. The application needs one winner across processes, so I would check the adapter's documented operation and reproduce two competing writes. A local mutex would not prove that distributed guarantee.”\n\nThe second response supplies useful reasoning without changing an assumption into a fact.",
    followups: [
      "How do you distinguish a forgotten detail from an unknown concept?",
      "What makes a verification step concrete rather than vague?",
      "When should you stop reasoning and state that you need documentation?",
    ],
  },
};

let curated = 0;
for (const topicDirectory of fs.readdirSync(root)) {
  const file = path.join(root, topicDirectory, "complete-qa.json");
  if (!fs.existsSync(file)) continue;
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [index, question] of document.questions.entries()) {
    const lesson = lessons[question.slug];
    if (!lesson) throw new Error(`${file}: no lesson for ${question.slug}`);
    question.direct_answer = lesson.direct;
    question.last_updated = "2026-09-07";
    question.reading_time_minutes = lesson.answerSize === "standard" ? 8 : 6;
    question.order = index + 1;
    question.answer = {
      ...(question.answer ?? {}),
      sections: [
        { type: "key_points", title: "Quick Revision", content: lesson.quick.map((point) => `- ${point}`).join("\n") },
        { type: "speakable_answer", title: "Interview Answer", answerSize: lesson.answerSize, content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n") },
        { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep.join("\n\n") },
        { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
        { type: "real_world_example", title: lesson.exampleTitle, content: lesson.example },
      ],
    };
    question.followup_questions = lesson.followups;
    question.seo = {
      ...(question.seo ?? {}),
      metaDescription: `Learn ${question.question} through a direct framework, realistic example, reflection boundary, and focused follow-up questions.`,
    };
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} behavioral lessons`);
}

console.log(`Curated ${curated} canonical Ruby behavioral questions.`);
