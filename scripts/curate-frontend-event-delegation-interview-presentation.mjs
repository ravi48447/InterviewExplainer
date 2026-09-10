#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const target = path.resolve(
  "content/frontend-fresher/browser-dom-basics/event-bubbling-delegation/complete-qa.json",
);

const presentations = {
  "browser-dom-basics-event-bubbling-delegation-interview-basics": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the pattern and its dependency on bubbling",
        stage: "One parent owns controls",
        spokenText:
          "Event delegation means placing one event listener on a stable parent instead of placing a listener on every child. When a child interaction bubbles to the parent, the parent reads the event target and decides which child action should run.",
      },
      {
        cue: "Walk through the path from the clicked node to the action",
        stage: "The event bubbles to the owner",
        spokenText:
          "Imagine a task list where each row has a remove button. A click may begin on an icon inside that button. The same click bubbles to the list, so the list listener can find the nearest element with `data-remove` and then remove the matching row.",
        support: {
          type: "trace",
          title: "One delegated click",
          items: [
            {
              label: "1 · Click",
              value: "icon",
              detail: "The deepest clicked element becomes the visible target.",
              tone: "neutral",
            },
            {
              label: "2 · Bubble",
              value: "task list",
              detail: "The event reaches the stable parent listener.",
              tone: "blue",
            },
            {
              label: "3 · Match",
              value: "closest('[data-remove]')",
              detail: "The handler resolves the real control.",
              tone: "green",
            },
            {
              label: "4 · Act",
              value: "remove row",
              detail: "Only the row owned by this list is changed.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Show the small core of the handler beside the explanation",
        stage: "Resolve the control safely",
        spokenText:
          "The important lines are `event.target.closest(...)` and the containment check. `closest` handles nested markup, while `list.contains(remove)` stops the search from escaping the component. The full runnable example remains in the deep dive.",
        support: {
          type: "code",
          title: "The relevant delegation lines",
          language: "javascript",
          code: "const remove = event.target.closest('[data-remove]');\nif (!remove || !list.contains(remove)) return;\nremove.closest('li')?.remove();",
          caption: "Find the semantic control, keep it inside the component, then perform the action.",
        },
      },
      {
        cue: "Explain when the pattern helps",
        stage: "Dynamic children need no setup",
        spokenText:
          "Delegation is useful for lists, menus, tables, and other components whose children are numerous or created later. The parent listener remains in place when rows are added or replaced, so listener setup does not have to follow every child lifecycle.",
      },
      {
        cue: "Close with the limits rather than presenting delegation as a rule",
        stage: "Use it where propagation helps",
        spokenText:
          "It is not automatically better for every control. The event must propagate in a useful way, the selector must stay local to one component, and a very large delegated handler can become hard to follow. For one or two fixed controls, direct listeners may be clearer.",
        recallRule:
          "Stable parent + bubbling event + closest match + containment check = safe event delegation.",
      },
    ],
  },
  "browser-dom-basics-event-bubbling-delegation-when-to-use": {
    answerSize: "standard",
    beats: [
      {
        cue: "Separate the event origin from the active listener",
        stage: "Origin vs active listener",
        spokenText:
          "`event.target` identifies where the event was dispatched. `event.currentTarget` identifies the object whose listener is running at that moment. They can be the same for a direct listener, but they are usually different in a delegated handler.",
        support: {
          type: "comparison",
          title: "Two properties, two jobs",
          items: [
            {
              label: "event.target",
              value: "event origin",
              detail: "Stays the visible target while the event travels along its path.",
              tone: "blue",
            },
            {
              label: "event.currentTarget",
              value: "listener owner",
              detail: "Changes to the node whose callback is executing.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Use one concrete nested-control example",
        stage: "A toolbar shows both",
        spokenText:
          "If a button sits inside a toolbar and the toolbar owns the listener, clicking the button gives `target = button` and `currentTarget = toolbar`. Clicking an icon inside the button may give `target = icon`, but `currentTarget` is still the toolbar.",
      },
      {
        cue: "Show how both properties take part in delegation",
        stage: "Find by target, bound by owner",
        spokenText:
          "Delegated code starts from `target` because that is where the interaction began. It uses `closest('button')` to resolve nested markup, then uses `currentTarget` to confirm that the button belongs to the listener's component.",
        support: {
          type: "code",
          title: "The relevant origin-and-owner check",
          language: "javascript",
          code: "const button = event.target.closest('button');\nif (!button || !event.currentTarget.contains(button)) return;\nconsole.log(button.dataset.action);",
          caption: "Target finds the intended control; currentTarget defines the component boundary.",
        },
      },
      {
        cue: "Cover the important runtime boundaries",
        stage: "Target may not be an Element",
        spokenText:
          "The event target is an `EventTarget`, so code should not assume that element methods always exist. Check that it is an `Element` before calling `closest`. Shadow DOM can also retarget an event for outside listeners; `composedPath()` is available when code truly needs the permitted propagation path.",
        recallRule:
          "Target tells where the event came from; currentTarget tells which listener is handling it now.",
      },
    ],
  },
};

const document = JSON.parse(fs.readFileSync(target, "utf8"));
const seen = new Set();

for (const question of document.questions ?? []) {
  const presentation = presentations[question.slug];
  if (!presentation) continue;
  const section = question.answer?.sections?.find(
    (candidate) => candidate.type === "speakable_answer",
  );
  if (!section) throw new Error(`Missing Interview Answer for ${question.slug}`);

  section.answerSize = presentation.answerSize;
  section.beats = presentation.beats;
  section.content = presentation.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");
  question.last_updated = "2026-09-09";
  seen.add(question.slug);
}

const missing = Object.keys(presentations).filter((slug) => !seen.has(slug));
if (missing.length) throw new Error(`Missing target questions: ${missing.join(", ")}`);

fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${seen.size} event-delegation Interview Answers.`);
