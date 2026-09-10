#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = path.join(repoRoot, "content/python-backend-fresher/sql-basics");
const mermaidBundle = path.join(repoRoot, "node_modules/mermaid/dist/mermaid.min.js");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const diagrams = [];

for (const topic of fs.readdirSync(moduleRoot, { withFileTypes: true })) {
  if (!topic.isDirectory()) continue;
  const file = path.join(moduleRoot, topic.name, "complete-qa.json");
  if (!fs.existsSync(file)) continue;
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const question of document.questions ?? []) {
    const deep = question.answer?.sections?.find((section) => section.type === "deep_explanation")?.content ?? "";
    for (const match of deep.matchAll(/```mermaid\n([\s\S]*?)```/g)) {
      diagrams.push({ slug: question.slug, source: match[1] });
    }
  }
}

if (diagrams.length === 0) throw new Error("No SQL Basics Mermaid diagrams were found");

const launchOptions = { headless: true };
if (fs.existsSync(chromePath)) launchOptions.executablePath = chromePath;
const browser = await chromium.launch(launchOptions);

try {
  const page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ path: mermaidBundle });
  await page.evaluate(() => mermaid.initialize({ startOnLoad: false, securityLevel: "strict" }));
  const failures = [];

  for (const [index, diagram] of diagrams.entries()) {
    try {
      await page.evaluate(async ({ renderId, source }) => {
        await mermaid.parse(source);
        const result = await mermaid.render(renderId, source);
        if (!result.svg.includes("<svg")) throw new Error("render returned no SVG");
      }, { renderId: `sql-basics-${index}`, source: diagram.source });
    } catch (error) {
      failures.push(`${diagram.slug}: ${String(error)}`);
    }
  }

  if (failures.length > 0) throw new Error(failures.join("\n"));
  console.log(`Mermaid diagrams: ${diagrams.length}/${diagrams.length} parsed and rendered in headless Chrome.`);
} finally {
  await browser.close();
}
