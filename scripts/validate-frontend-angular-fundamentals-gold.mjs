#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = path.join(repoRoot, "content/frontend-fresher/angular-fundamentals-fresher");
const curator = path.join(repoRoot, "scripts/curate-frontend-angular-fundamentals-gold.mjs");
const ts = createRequire(import.meta.url)("typescript");
const expected = {
  "angular-architecture-overview": [
    ["angular-fundamentals-fresher-angular-architecture-overview-q001", "angular-fundamentals-fresher-angular-architecture-overview-interview-basics", "What is Angular, and how is an Angular application structured?"],
    ["angular-fundamentals-fresher-angular-architecture-overview-q002", "angular-fundamentals-fresher-angular-architecture-overview-when-to-use", "What are standalone components, and how does Angular bootstrap an application?"],
    ["angular-fundamentals-fresher-angular-architecture-overview-q003", "angular-fundamentals-fresher-angular-architecture-overview-common-mistake", "How does Angular render and update a component tree when state changes?"],
  ],
  "components-and-templates": [
    ["angular-fundamentals-fresher-components-and-templates-q001", "angular-fundamentals-fresher-components-and-templates-interview-basics", "What is an Angular component, and how does its template connect to the class?"],
    ["angular-fundamentals-fresher-components-and-templates-q002", "angular-fundamentals-fresher-components-and-templates-when-to-use", "What are interpolation, property binding, event binding, and two-way binding in Angular?"],
    ["angular-fundamentals-fresher-components-and-templates-q003", "angular-fundamentals-fresher-components-and-templates-common-mistake", "How do parent and child Angular components communicate with inputs and outputs?"],
  ],
  "directives-basics": [
    ["angular-fundamentals-fresher-directives-basics-q001", "angular-fundamentals-fresher-directives-basics-interview-basics", "What is an Angular directive, and what are its main types?"],
    ["angular-fundamentals-fresher-directives-basics-q002", "angular-fundamentals-fresher-directives-basics-when-to-use", "How do `@if`, `@for`, and `@switch` control template rendering in Angular?"],
    ["angular-fundamentals-fresher-directives-basics-q003", "angular-fundamentals-fresher-directives-basics-common-mistake", "How do you create and use a custom attribute directive in Angular?"],
  ],
  "services-and-di-basics": [
    ["angular-fundamentals-fresher-services-and-di-basics-q001", "angular-fundamentals-fresher-services-and-di-basics-interview-basics", "What is an Angular service, and how does dependency injection work?"],
    ["angular-fundamentals-fresher-services-and-di-basics-q002", "angular-fundamentals-fresher-services-and-di-basics-when-to-use", "How do root and component-level providers affect an Angular service's scope?"],
    ["angular-fundamentals-fresher-services-and-di-basics-q003", "angular-fundamentals-fresher-services-and-di-basics-common-mistake", "When can you use `inject()` in Angular, and what is an injection context?"],
  ],
  "forms-template-driven": [
    ["angular-fundamentals-fresher-forms-template-driven-q001", "angular-fundamentals-fresher-forms-template-driven-interview-basics", "What is a template-driven Angular form, and how do `FormsModule`, `NgForm`, and `NgModel` work together?"],
    ["angular-fundamentals-fresher-forms-template-driven-q002", "angular-fundamentals-fresher-forms-template-driven-when-to-use", "How do you validate a template-driven Angular form and show useful errors?"],
    ["angular-fundamentals-fresher-forms-template-driven-q003", "angular-fundamentals-fresher-forms-template-driven-common-mistake", "What is the difference between template-driven and reactive forms in Angular?"],
  ],
  "scenario-based": [
    ["angular-fundamentals-fresher-scenario-based-q001", "angular-fundamentals-fresher-scenario-based-interview-basics", "Why can an Angular component show stale data after an object is mutated, and how do you fix it?"],
    ["angular-fundamentals-fresher-scenario-based-q002", "angular-fundamentals-fresher-scenario-based-when-to-use", "Why is `track` important when rendering a dynamic list with Angular `@for`?"],
    ["angular-fundamentals-fresher-scenario-based-q003", "angular-fundamentals-fresher-scenario-based-common-mistake", "How do you prevent Observable subscription leaks when an Angular component is destroyed?"],
  ],
};

const requiredFacts = {
  "angular-fundamentals-fresher-angular-architecture-overview-interview-basics": ["tree of components", "service", "dependency injection", "standalone by default"],
  "angular-fundamentals-fresher-angular-architecture-overview-when-to-use": ["bootstrapApplication", "imports", "providers", "NgModule"],
  "angular-fundamentals-fresher-angular-architecture-overview-common-mistake": ["signal", "notification", "bindings", "DOM"],
  "angular-fundamentals-fresher-components-and-templates-interview-basics": ["@Component", "selector", "template", "event"],
  "angular-fundamentals-fresher-components-and-templates-when-to-use": ["interpolation", "property binding", "event binding", "two-way binding"],
  "angular-fundamentals-fresher-components-and-templates-common-mistake": ["input.required", "output", "do not bubble", "data down"],
  "angular-fundamentals-fresher-directives-basics-interview-basics": ["attribute directive", "structural directive", "component", "@if"],
  "angular-fundamentals-fresher-directives-basics-when-to-use": ["@empty", "track", "strict equality", "$index"],
  "angular-fundamentals-fresher-directives-basics-common-mistake": ["@Directive", "selector", "host", "CSS"],
  "angular-fundamentals-fresher-services-and-di-basics-interview-basics": ["token", "provider", "hierarchical", "InjectionToken"],
  "angular-fundamentals-fresher-services-and-di-basics-when-to-use": ["shadows", "subtree", "destroyed", "narrowest injector"],
  "angular-fundamentals-fresher-services-and-di-basics-common-mistake": ["injection context", "field initializer", "provider factory", "synchronously"],
  "angular-fundamentals-fresher-forms-template-driven-interview-basics": ["FormsModule", "NgForm", "NgModel", "name"],
  "angular-fundamentals-fresher-forms-template-driven-when-to-use": ["required", "errors", "touched", "server"],
  "angular-fundamentals-fresher-forms-template-driven-common-mistake": ["implicit", "explicit", "synchronously", "same control"],
  "angular-fundamentals-fresher-scenario-based-interview-basics": ["same object reference", "Object.is", "new reference", "OnPush"],
  "angular-fundamentals-fresher-scenario-based-when-to-use": ["stable unique", "$index", "object identity", "correctness contract"],
  "angular-fundamentals-fresher-scenario-based-common-mistake": ["AsyncPipe", "takeUntilDestroyed", "DestroyRef", "HTTP"],
};

const implementationInterviewExamples = new Set([
  "angular-fundamentals-fresher-components-and-templates-when-to-use",
  "angular-fundamentals-fresher-components-and-templates-common-mistake",
  "angular-fundamentals-fresher-directives-basics-when-to-use",
  "angular-fundamentals-fresher-directives-basics-common-mistake",
  "angular-fundamentals-fresher-forms-template-driven-interview-basics",
  "angular-fundamentals-fresher-forms-template-driven-when-to-use",
  "angular-fundamentals-fresher-forms-template-driven-common-mistake",
  "angular-fundamentals-fresher-scenario-based-interview-basics",
  "angular-fundamentals-fresher-scenario-based-when-to-use",
  "angular-fundamentals-fresher-scenario-based-common-mistake",
]);

const fail = (label, message) => { throw new Error(`${label}: ${message}`); };
const wordCount = (value) => String(value)
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/[^\p{L}\p{N}'-]+/gu, " ")
  .trim().split(/\s+/).filter(Boolean).length;
const tokens = (value) => new Set(String(value).toLowerCase()
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/[^a-z0-9]+/g, " ")
  .split(/\s+/).filter((word) => word.length > 3));
const similarity = (left, right) => {
  const a = tokens(left);
  const b = tokens(right);
  const shared = [...a].filter((token) => b.has(token)).length;
  return shared / new Set([...a, ...b]).size;
};
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const visuals = new Set(["flow_diagram", "concept_map", "comparison_table"]);

function fenced(content, language, label) {
  const match = String(content).match(new RegExp(`^${"`".repeat(3)}${language}\\n([\\s\\S]*?)\\n${"`".repeat(3)}$`));
  if (!match) fail(label, `expected exactly one ${language} fence`);
  return match[1];
}

function checkVisual(section, label) {
  if (section.type === "comparison_table") {
    const rows = String(section.content).split("\n");
    if (rows.length < 4 || !/^\|(?:\s*:?-{3,}:?\s*\|)+$/.test(rows[1])) fail(label, "malformed comparison table");
    const width = rows[0].split("|").length;
    if (rows.some((row) => row.split("|").length !== width)) fail(label, "comparison table columns are uneven");
    return;
  }
  const diagram = fenced(section.content, "mermaid", label);
  if (!diagram.startsWith("flowchart ") || diagram.split("\n").length < 5) fail(label, "diagram is not a meaningful flowchart");
  if (!diagram.includes("-->") && !diagram.includes("-->|")) fail(label, "diagram has no relationships");
}

function checkTemplate(source, label) {
  for (const match of source.matchAll(/template:\s*`([\s\S]*?)`/g)) {
    const template = match[1];
    if (/\*(?:ngIf|ngFor|ngSwitch)/.test(template)) fail(label, "legacy structural syntax remains in a new example");
    if (/@for\s*\(/.test(template) && !/@for\s*\([^\n{]*;\s*track\s+/.test(template)) fail(label, "@for example is missing track");
    const open = [...template].filter((char) => char === "{").length;
    const close = [...template].filter((char) => char === "}").length;
    if (open !== close) fail(label, "template braces are unbalanced");
    if (/<form[\s\S]*?\[\(ngModel\)\][\s\S]*?<\/form>/.test(template)) {
      const controls = [...template.matchAll(/<(?:input|select|textarea)\b[^>]*\[\(ngModel\)\][^>]*>/g)].map((item) => item[0]);
      if (controls.some((control) => !/\bname=/.test(control))) fail(label, "registered ngModel control has no name");
    }
  }
}

function parseTypeScript(source, label) {
  const result = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, experimentalDecorators: true },
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  if (errors.length) fail(label, errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")).join("; "));
}

const stub = `
declare module '@angular/core' {
  export interface Signal<T> { (): T; }
  export interface WritableSignal<T> extends Signal<T> { set(value: T): void; update(update: (value: T) => T): void; }
  export interface OutputRef<T> { emit(value: T): void; }
  export interface InputFunction { <T>(value: T): Signal<T>; required<T>(): Signal<T>; }
  export const input: InputFunction;
  export function output<T>(): OutputRef<T>;
  export function signal<T>(value: T): WritableSignal<T>;
  export function computed<T>(compute: () => T): Signal<T>;
  export function Component(metadata: Record<string, unknown>): ClassDecorator;
  export function Directive(metadata: Record<string, unknown>): ClassDecorator;
  export function Injectable(metadata?: Record<string, unknown>): ClassDecorator;
  export function inject<T>(token: abstract new (...args: any[]) => T): T;
  export class DestroyRef {}
}
declare module '@angular/platform-browser' {
  export function bootstrapApplication(component: unknown, config?: { providers?: unknown[] }): Promise<void>;
}
declare module '@angular/forms' {
  export class FormsModule {}
  export class ReactiveFormsModule {}
  export class NgForm { valid: boolean; invalid: boolean; submitted: boolean; value: Record<string, unknown>; }
  export class FormControl<T> { constructor(value: T, options?: Record<string, unknown>); }
  export const Validators: { required: unknown };
}
declare module '@angular/common' { export class AsyncPipe {} }
declare module '@angular/core/rxjs-interop' { export function takeUntilDestroyed(destroyRef?: import('@angular/core').DestroyRef): unknown; }
declare module 'rxjs' {
  export class Observable<T> {
    pipe(...operators: unknown[]): Observable<T>;
    subscribe(next: (value: T) => void): { unsubscribe(): void };
  }
  export class Subject<T> extends Observable<T> {}
  export function interval(milliseconds: number): Observable<number>;
}
`;

function typecheckExample(source, label) {
  checkTemplate(source, label);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "angular-gold-"));
  try {
    const stubFile = path.join(temp, "angular-stubs.d.ts");
    const sourceFile = path.join(temp, "example.ts");
    fs.writeFileSync(stubFile, stub);
    fs.writeFileSync(sourceFile, `${source}\n`);
    const tsc = path.join(repoRoot, "node_modules/.bin/tsc");
    const result = spawnSync(tsc, [
      "--noEmit", "--strict", "--skipLibCheck", "--experimentalDecorators",
      "--target", "ES2022", "--module", "NodeNext", "--moduleResolution", "NodeNext",
      "--lib", "ES2022,DOM", stubFile, sourceFile,
    ], { cwd: repoRoot, encoding: "utf8", timeout: 20000 });
    if (result.error || result.status !== 0) fail(label, `TypeScript check failed\n${result.stdout}${result.stderr}${result.error ?? ""}`);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

const index = JSON.parse(fs.readFileSync(path.join(repoRoot, "content/frontend-fresher/_index.json"), "utf8"));
const moduleRecord = index.modules.find((module) => module.moduleSlug === "angular-fundamentals-fresher");
if (!moduleRecord) fail("source of truth", "Angular Fundamentals is not indexed");
const indexedTopics = moduleRecord.topics.map((topic) => typeof topic === "string" ? topic : topic.topicSlug);
if (JSON.stringify([...indexedTopics].sort()) !== JSON.stringify(Object.keys(expected).sort())) fail("source of truth", "indexed topics differ from the canonical six-topic contract");

const files = Object.keys(expected).map((topic) => path.join(moduleRoot, topic, "complete-qa.json"));
const corpus = [];
const deepCorpus = [];
let total = 0;
let mainExamples = 0;
let interviewExamples = 0;

for (const [topic, expectedQuestions] of Object.entries(expected)) {
  const document = JSON.parse(fs.readFileSync(path.join(moduleRoot, topic, "complete-qa.json"), "utf8"));
  if (!Array.isArray(document.questions) || document.questions.length !== 3) fail(topic, "expected exactly three retained lessons");
  const actual = document.questions.map((question) => [question.id, question.slug, question.question]);
  if (JSON.stringify(actual) !== JSON.stringify(expectedQuestions)) fail(topic, "ID, slug, question, or order drifted");
  for (const question of document.questions) {
    const label = `${topic}/${question.slug}`;
    const serialized = JSON.stringify(question);
    if (question.interviewer_intent || question.speakable_v2) fail(label, "legacy coaching metadata remains");
    if (/core interview concept|common programming problem|what the interviewer wants|to stand out|you should say|how to answer/i.test(serialized)) fail(label, "generated shell or coaching language remains");
    if (wordCount(question.direct_answer) < 18) fail(label, "direct answer does not independently define the answer");

    const sections = question.answer?.sections;
    if (!Array.isArray(sections) || sections.length !== 5) fail(label, "expected Quick, Interview, Deep, one visual, and one code support section");
    const [quick, interview, deep, visual, code] = sections;
    if (quick.type !== "key_points" || quick.title !== "Quick revision" || !Array.isArray(quick.items) || quick.items.length < 4 || quick.items.length > 6) fail(label, "Quick Revision contract failed");
    if (quick.items.some((item) => wordCount(item) < 5 || wordCount(item) > 24)) fail(label, "Quick Revision point is vague or overloaded");
    const interviewWords = wordCount(interview.content);
    const expectedSize = interviewWords < 220 ? "compact" : "standard";
    if (interview.type !== "speakable_answer" || interview.title !== "Interview answer" || interview.answerSize !== expectedSize) fail(label, "Interview Answer size classification or structure failed");
    if (interviewWords < 150 || String(interview.content).split("\n\n").length < 4) fail(label, "Interview Answer is not a complete independent explanation");
    if (!/For example|For instance|The same .* shows the difference/.test(interview.content)) fail(label, "Interview Answer has no concrete example");
    if (!/\b(?:but|however|only|not|boundary|trade-off|unsafe|problem|complex|depends)\b/i.test(interview.content)) fail(label, "Interview Answer has no boundary or trade-off");
    if (implementationInterviewExamples.has(question.slug)) {
      const fences = String(interview.content).match(/```typescript\n[\s\S]*?\n```/g) ?? [];
      if (fences.length !== 1) fail(label, "implementation question needs one useful Interview Answer code example");
      const interviewSource = fenced(fences[0], "typescript", `${label}/interview-example`);
      parseTypeScript(interviewSource, `${label}/interview-example`);
      checkTemplate(interviewSource, `${label}/interview-example`);
      interviewExamples += 1;
    }
    if (deep.type !== "deep_explanation" || wordCount(deep.content) < 180 || String(deep.content).split("\n\n").length < 4) fail(label, "Deep Dive is not an independent teaching explanation");
    if (similarity(interview.content, deep.content) > 0.62) fail(label, "Deep Dive repeats the Interview Answer instead of teaching independently");
    if (!visuals.has(visual.type) || sections.filter((section) => visuals.has(section.type)).length !== 1) fail(label, "expected exactly one purposeful visual");
    if (/^(?:start|begin|follow|see|know|remember|trace)\b/i.test(visual.title) || /^(?:start|begin|follow|see|know|remember|trace)\b/i.test(deep.title)) fail(label, "editorial mini-heading remains");
    checkVisual(visual, label);
    if (code.type !== "code_example" || sections.filter((section) => section.type === "code_example").length !== 1) fail(label, "expected one complete code support example");
    typecheckExample(fenced(code.content, "typescript", label), label);
    mainExamples += 1;
    if (!Array.isArray(question.followup_questions) || question.followup_questions.length !== 3 || new Set(question.followup_questions).size !== 3) fail(label, "follow-up questions are missing or duplicated");

    const allText = serialized.toLowerCase();
    for (const fact of requiredFacts[question.slug] ?? []) {
      if (!allText.includes(fact.toLowerCase())) fail(label, `missing checked fact: ${fact}`);
    }
    corpus.push([label, interview.content]);
    deepCorpus.push([label, deep.content]);
    total += 1;
  }
}

for (const collection of [corpus, deepCorpus]) {
  for (let left = 0; left < collection.length; left += 1) {
    for (let right = left + 1; right < collection.length; right += 1) {
      const score = similarity(collection[left][1], collection[right][1]);
      if (score > 0.68) fail(`${collection[left][0]} <> ${collection[right][0]}`, `cross-answer similarity is ${score.toFixed(2)}`);
    }
  }
}

const config = JSON.parse(fs.readFileSync(path.join(moduleRoot, "_config.json"), "utf8"));
if (config.questionCount !== 18 || config.status !== "gold-standard") fail("config", "gold status or question count is wrong");
const revision = JSON.parse(fs.readFileSync(path.join(moduleRoot, "_revision.json"), "utf8"));
if (revision.questionCount !== 18 || revision.moduleSlug !== config.moduleSlug) fail("revision", "revision metadata is inconsistent");

const idempotentFiles = [...files, path.join(moduleRoot, "_config.json"), path.join(moduleRoot, "_revision.json")];
const before = Object.fromEntries(idempotentFiles.map((file) => [file, digest(file)]));
const rerun = spawnSync(process.execPath, [curator], { cwd: repoRoot, encoding: "utf8", timeout: 20000 });
if (rerun.error || rerun.status !== 0) fail("idempotence", `${rerun.stdout}${rerun.stderr}${rerun.error ?? ""}`);
for (const file of idempotentFiles) if (digest(file) !== before[file]) fail("idempotence", `${path.relative(repoRoot, file)} changed on rerun`);

console.log(`Validated ${total} Angular lessons across 6 indexed topics: 18 complete TypeScript examples, ${interviewExamples} implementation snippets, independent three-phase teaching, semantic visuals, stable routes, checked facts, uniqueness, and curator idempotence.`);
