#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/ruby-backend-fresher/ruby-oop-basics/duck-typing/complete-qa.json",
);
const targetSlug = "ruby-duck-typing-basics";

const beats = [
  {
    cue: "Define duck typing through behaviour",
    stage: "Behaviour is the contract",
    spokenText: "Duck typing is Ruby's behaviour-first form of polymorphism. A method does not require an object to belong to one declared class or interface. It simply sends the messages needed for the job. Any object that understands those messages and follows their meaning can be used.",
  },
  {
    cue: "Show several receivers sharing one operation",
    stage: "Different objects, one message",
    spokenText: "Suppose `send_alert(notifier, message)` calls only `notifier.deliver(message)`. An email notifier, an SMS notifier, and a fake used in a test can all take that place. They do not need a common parent class; each one only needs to honour the small `deliver` contract.",
    support: {
      type: "comparison",
      title: "One caller can use several receivers",
      items: [
        {
          label: "EmailNotifier",
          value: "deliver",
          detail: "Sends the message by email.",
          tone: "blue",
        },
        {
          label: "SmsNotifier",
          value: "deliver",
          detail: "Sends the same message by SMS.",
          tone: "green",
        },
        {
          label: "FakeNotifier",
          value: "deliver",
          detail: "Records the call during a test.",
          tone: "neutral",
        },
      ],
    },
  },
  {
    cue: "Demonstrate the contract with working Ruby",
    stage: "The caller stays unchanged",
    spokenText: "The caller below knows only about `deliver`. Changing the receiver changes the behaviour without adding a class check or changing `send_alert`. This keeps the caller small and also makes a test double easy to supply.",
    support: {
      type: "code",
      title: "A complete duck-typing example",
      language: "ruby",
      code: "class EmailNotifier\n  def deliver(message)\n    \"email: #{message}\"\n  end\nend\n\nclass SmsNotifier\n  def deliver(message)\n    \"sms: #{message}\"\n  end\nend\n\ndef send_alert(notifier, message)\n  notifier.deliver(message)\nend\n\nputs send_alert(EmailNotifier.new, \"build failed\")\nputs send_alert(SmsNotifier.new, \"build failed\")",
      caption: "Both objects work because both provide `deliver(message)` with the expected behaviour.",
    },
  },
  {
    cue: "Explain the runtime boundary",
    stage: "Ruby checks at runtime",
    spokenText: "The trade-off is that Ruby checks compatibility when the code runs. A missing method raises `NoMethodError`, and a method with the right name can still return the wrong result. Keep duck-typed interfaces small and cover every implementation with the same contract tests. Use `respond_to?` when a capability is genuinely optional, not before every required call.",
    recallRule: "Depend on the behaviour you need, keep that contract small, and test every object that claims to provide it.",
  },
];

const fallbackContent = beats.map((beat) => beat.spokenText.trim()).join("\n\n");
const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
const question = document.questions?.find((entry) => entry.slug === targetSlug);
if (!question) throw new Error(`Question not found: ${targetSlug}`);

const speaking = question.answer?.sections?.find((section) => section.type === "speakable_answer");
if (!speaking) throw new Error(`Interview answer not found: ${targetSlug}`);

speaking.answerSize = "compact";
speaking.beats = beats;
speaking.content = fallbackContent;

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated Interview Answer presentation for ${targetSlug}.`);
