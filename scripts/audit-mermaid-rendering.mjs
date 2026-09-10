#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requested = process.argv.slice(2).filter((value) => !value.startsWith("--"));
const roots = (requested.length > 0 ? requested : ["content/java-backend-fresher"])
  .map((value) => path.resolve(repoRoot, value));
const mermaidBundle = path.join(repoRoot, "node_modules/mermaid/dist/mermaid.min.js");
const macChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function collectFiles(target, result) {
  if (!fs.existsSync(target)) throw new Error(`Path does not exist: ${path.relative(repoRoot, target)}`);
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (path.basename(target) === "complete-qa.json") result.push(target);
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.name === ".archive" || entry.name === "node_modules" || entry.name.startsWith("_")) continue;
    collectFiles(path.join(target, entry.name), result);
  }
}

function collectMermaid(value, location, result) {
  if (typeof value === "string") {
    for (const match of value.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)) {
      result.push({ location, source: match[1].trim() });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectMermaid(item, `${location}[${index}]`, result));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      collectMermaid(child, `${location}.${key}`, result);
    }
  }
}

const files = [];
for (const root of roots) collectFiles(root, files);
const diagrams = [];
for (const file of [...new Set(files)].sort()) {
  const relative = path.relative(repoRoot, file);
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  collectMermaid(document, relative, diagrams);
}

if (diagrams.length === 0) {
  console.log(`Mermaid rendering audit: no diagrams found in ${files.length} complete-qa file(s).`);
  process.exit(0);
}
if (!fs.existsSync(mermaidBundle)) {
  throw new Error("Mermaid browser bundle is missing. Run the project dependency install first.");
}

const launchOptions = { headless: true };
if (fs.existsSync(macChrome)) launchOptions.executablePath = macChrome;
const browser = await chromium.launch(launchOptions);
const failures = [];

try {
  const page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ path: mermaidBundle });
  await page.evaluate(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      flowchart: {
        curve: "basis",
        padding: 16,
        htmlLabels: true,
        useMaxWidth: false,
      },
      themeVariables: {
        primaryColor: "#eff6ff",
        primaryTextColor: "#0f172a",
        primaryBorderColor: "#2563eb",
        lineColor: "#64748b",
        secondaryColor: "#f0fdf4",
        tertiaryColor: "#fff7ed",
        fontSize: "14px",
      },
    });
  });

  for (const [index, diagram] of diagrams.entries()) {
    try {
      await page.evaluate(async ({ id, source }) => {
        const parsed = await mermaid.parse(source, { suppressErrors: true });
        if (parsed === false) throw new Error("Mermaid parse returned false");
        const result = await mermaid.render(id, source);
        if (!result?.svg?.includes("<svg")) throw new Error("Mermaid render returned no SVG");
        document.body.innerHTML = "";
      }, { id: `content-diagram-${index}`, source: diagram.source });
    } catch (error) {
      failures.push(`${diagram.location}: ${String(error).replace(/\s+/g, " ").trim()}`);
    }
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error(`Mermaid rendering audit failed: ${failures.length}/${diagrams.length} diagram(s).`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Mermaid rendering audit: ${diagrams.length}/${diagrams.length} diagrams parsed and rendered in headless Chrome across ${files.length} file(s).`);
