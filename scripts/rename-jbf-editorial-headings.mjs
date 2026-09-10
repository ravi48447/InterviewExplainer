#!/usr/bin/env node

/**
 * Replace legacy author instructions inside the curated JVM mini-articles
 * with learner-facing concept headings. The replacements are exact and safe
 * to rerun; the source generators and generated JSON are kept in sync.
 */

import fs from "node:fs";

const files = [
  "scripts/curate-java-fresher-heap-stack-gold.mjs",
  "content/java-backend-fresher/java-jvm-memory/heap-vs-stack/complete-qa.json",
  "scripts/curate-java-fresher-jvm-architecture-gold.mjs",
  "content/java-backend-fresher/java-jvm-memory/jvm-architecture/complete-qa.json",
];

const replacements = new Map([
  ["**Separate the variable from its target**", "**Reference variables and their objects**"],
  ["**Prove that recursion makes progress**", "**Recursive progress and the base case**"],
  ["**Read the trace as a repeating pattern**", "**Repeated stack frames in the trace**"],
  ["**Know which values are interned automatically**", "**Automatic string interning**"],
  ["**Follow a tiny program**", "**From source code to JVM execution**"],
  ["**Trace one method call**", "**A method call through the JVM**"],
  ["**Use a plugin as the concrete example**", "**Class loaders in a plugin boundary**"],
  ["**Start with the two levels of meaning**", "**Method area and Metaspace**"],
  ["**Read bytecode as instructions for a virtual machine**", "**Bytecode instructions and native execution**"],
  ["**Use the failure message to locate the phase**", "**Java execution phases and their failures**"],
  ["**Trace a call and its object separately**", "**Call stacks and heap objects**"],
  ["**Use the areas to explain failures**", "**Memory areas and their common failures**"],
  ["**Keep the model logical**", "**Logical memory areas and runtime optimisations**"],
  ["**Trace references and lifetimes**", "**Reference paths and object lifetimes**"],
  ["**Follow reachability, not braces**", "**Reachability and object lifetime**"],
  ["**Watch values move through one invocation**", "**Values inside one method invocation**"],
  ["**Follow both completion paths**", "**Normal and exceptional method completion**"],
  ["**Trace two nested calls**", "**Nested method calls and stack frames**"],
  ["**Choose a structural fix**", "**Structural fixes for excessive recursion**"],
  ["**Separate containing object from referenced object**", "**Containing objects and referenced objects**"],
  ["**Use pooling only with controlled cardinality**", "**When string interning is appropriate**"],
  ["**Keep API guarantees separate from HotSpot history**", "**API guarantees and HotSpot implementation details**"],
  ["**Know where portability stops**", "**The boundary of JVM portability**"],
  ["**Separate portable and platform-specific parts**", "**Portable class files and platform-specific execution**"],
  ["**Keep logical areas separate from physical layout**", "**Logical JVM areas and physical memory**"],
  ["**Use failures as clues, not perfect diagnoses**", "**Runtime failures as memory-area evidence**"],
  ["**See which built-in loader defined each class**", "**Built-in class loaders and class identity**"],
  ["**Keep loading, linking, and initialization separate**", "**Loading, linking, and class initialization**"],
  ["**Separate startup from steady state**", "**JIT warm-up and steady-state execution**"],
  ["**Follow a redeployment leak**", "**A class-loader redeployment leak**"],
  ["**Choose evidence for the right area**", "**Evidence for Metaspace and heap usage**"],
  ["**Read the OutOfMemoryError detail**", "**Metaspace and heap OutOfMemoryError details**"],
]);

let changedFiles = 0;
let replacementCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;
  for (const [before, after] of replacements) {
    if (!content.includes(before)) continue;
    const occurrences = content.split(before).length - 1;
    content = content.split(before).join(after);
    replacementCount += occurrences;
  }
  if (content !== original) {
    fs.writeFileSync(file, content);
    changedFiles += 1;
  }
}

console.log(`Renamed ${replacementCount} editorial heading occurrence(s) in ${changedFiles} file(s).`);
