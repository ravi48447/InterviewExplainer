import type { DSADiagram, DSADryRun } from "@/lib/contentV2-types";

export type LiveDryRunResult = {
  run: DSADryRun;
  diagram?: DSADiagram;
};

type SimulatorKind = "two-sum-brute" | "two-sum-map" | "binary-tree-lca";

export function getLiveSimulatorKind(run: DSADryRun, diagram?: DSADiagram): SimulatorKind | null {
  const trace = run.steps.map((step) => `${step.step} ${step.action}`).join(" ");
  const hasArrayTarget = /\bnums\s*=\s*\[/.test(run.input) && /\btarget\s*=/.test(run.input);

  if (hasArrayTarget && /\bcomplement\b/i.test(trace)) {
    return "two-sum-map";
  }
  if (hasArrayTarget && /i=\d+\s*,\s*j=\d+/i.test(trace)) {
    return "two-sum-brute";
  }
  if (/\broot\s*=\s*\[/.test(run.input) && /\bp\s*=/.test(run.input) && /\bq\s*=/.test(run.input) && /\blca\s*\(/i.test(trace)) {
    return "binary-tree-lca";
  }
  return null;
}

export function simulateLiveDryRun(
  originalRun: DSADryRun,
  originalDiagram: DSADiagram | undefined,
  input: string,
): LiveDryRunResult {
  const kind = getLiveSimulatorKind(originalRun, originalDiagram);
  if (!kind) throw new Error("This walkthrough does not have a live simulator yet.");
  if (kind === "two-sum-brute" || kind === "two-sum-map") {
    const parsed = parseArrayTarget(input);
    return kind === "two-sum-map"
      ? simulateTwoSumMap(originalRun, originalDiagram, parsed.nums, parsed.target)
      : simulateTwoSumBrute(originalRun, originalDiagram, parsed.nums, parsed.target);
  }
  return simulateBinaryTreeLca(originalRun, input);
}

function parseArrayTarget(input: string): { nums: number[]; target: number } {
  const numsMatch = input.match(/\bnums\s*=\s*(\[[^\]]*\])/i);
  const targetMatch = input.match(/\btarget\s*=\s*(-?\d+(?:\.\d+)?)/i);
  if (!numsMatch || !targetMatch) throw new Error("Use: nums = [2, 7, 11, 15], target = 9");
  let nums: unknown;
  try {
    nums = JSON.parse(numsMatch[1]);
  } catch {
    throw new Error("The nums array must contain valid comma-separated numbers.");
  }
  if (!Array.isArray(nums) || nums.some((value) => typeof value !== "number" || !Number.isFinite(value))) {
    throw new Error("nums must be an array of finite numbers.");
  }
  if (nums.length < 2 || nums.length > 12) throw new Error("Use between 2 and 12 numbers for a readable visual trace.");
  return { nums, target: Number(targetMatch[1]) };
}

function simulateTwoSumBrute(
  originalRun: DSADryRun,
  originalDiagram: DSADiagram | undefined,
  nums: number[],
  target: number,
): LiveDryRunResult {
  const steps: DSADryRun["steps"] = [];
  const frames: Array<{
    step: string;
    action: string;
    values: string[];
    pointers: { name: string; index: number }[];
    highlight?: number[];
    dim?: number[];
  }> = [];
  let result = "No matching pair";
  let found = false;

  for (let i = 0; i < nums.length && !found; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      const sum = nums[i] + nums[j];
      const matches = sum === target;
      const step = `i=${i}, j=${j}`;
      const action = `${nums[i]} + ${nums[j]} = ${sum}`;
      const state = matches ? `match → return [${i}, ${j}]` : "no match → continue";
      steps.push({ step, action, state, note: matches ? "This pair reaches the target, so the search stops." : undefined });
      frames.push({
        step,
        action: `${action} — ${state}`,
        values: nums.map(String),
        pointers: [{ name: "i", index: i }, { name: "j", index: j }],
        highlight: matches ? [i, j] : undefined,
        dim: i > 0 ? Array.from({ length: i }, (_, index) => index) : undefined,
      });
      if (matches) {
        result = `[${i}, ${j}]`;
        found = true;
        break;
      }
      if (steps.length >= 50) throw new Error("This input creates too many frames. Try a shorter array.");
    }
  }

  const normalizedInput = `nums = [${nums.join(", ")}], target = ${target}`;
  return {
    run: { ...originalRun, input: normalizedInput, steps, result },
    diagram: {
      type: "array-state",
      title: originalDiagram?.title ?? "How the two pointers walk",
      caption: originalDiagram?.caption,
      input: normalizedInput,
      frames,
    },
  };
}

function simulateTwoSumMap(
  originalRun: DSADryRun,
  originalDiagram: DSADiagram | undefined,
  nums: number[],
  target: number,
): LiveDryRunResult {
  const seen = new Map<number, number>();
  const steps: DSADryRun["steps"] = [];
  const frames: Array<{
    step: string;
    action: string;
    entries: { key: string; value: string }[];
    highlightKey?: string;
    lookupKey?: string;
    found?: boolean;
  }> = [];
  let result = "No matching pair";

  for (let i = 0; i < nums.length; i += 1) {
    const num = nums[i];
    const complement = target - num;
    const matchIndex = seen.get(complement);
    const found = matchIndex !== undefined;
    const step = `i=${i}, num=${num}`;
    const action = found
      ? `complement = ${complement} — found at index ${matchIndex} → return [${matchIndex}, ${i}]`
      : `complement = ${complement} — not in map → insert ${num}`;

    if (!found) seen.set(num, i);
    const entries = [...seen.entries()].map(([key, value]) => ({ key: String(key), value: String(value) }));
    steps.push({
      step,
      action,
      state: found ? `match → return [${matchIndex}, ${i}]` : `map = {${entries.map((entry) => `${entry.key}: ${entry.value}`).join(", ")}}`,
      note: found ? "The complement was already stored, so these two indices form the answer." : undefined,
    });
    frames.push({
      step,
      action,
      entries,
      highlightKey: found ? undefined : String(num),
      lookupKey: String(complement),
      found,
    });
    if (found) {
      result = `[${matchIndex}, ${i}]`;
      break;
    }
  }

  const normalizedInput = `nums = [${nums.join(", ")}], target = ${target}`;
  return {
    run: { ...originalRun, input: normalizedInput, steps, result },
    diagram: {
      type: "hashmap-state",
      title: originalDiagram?.title ?? "How the hash map fills up",
      caption: originalDiagram?.caption,
      input: normalizedInput,
      frames,
    },
  };
}

type TreeNode = { id: number; value: number; left: TreeNode | null; right: TreeNode | null };

function simulateBinaryTreeLca(
  originalRun: DSADryRun,
  input: string,
): LiveDryRunResult {
  const rootMatch = input.match(/\broot\s*=\s*(\[[^\]]*\])/i);
  const pMatch = input.match(/\bp\s*=\s*(-?\d+)/i);
  const qMatch = input.match(/\bq\s*=\s*(-?\d+)/i);
  if (!rootMatch || !pMatch || !qMatch) throw new Error("Use: root = [3,5,1,null,2], p = 5, q = 1");

  let values: unknown;
  try {
    values = JSON.parse(rootMatch[1]);
  } catch {
    throw new Error("The root array must use valid numbers and null values.");
  }
  if (!Array.isArray(values) || values.length < 2 || values.length > 31) {
    throw new Error("Use a level-order tree containing between 2 and 31 entries.");
  }
  if (values.some((value) => value !== null && (typeof value !== "number" || !Number.isFinite(value)))) {
    throw new Error("The root array may contain only finite numbers and null.");
  }
  const numericValues = values.filter((value): value is number => typeof value === "number");
  if (new Set(numericValues).size !== numericValues.length) throw new Error("Tree values must be unique for this visual trace.");

  const p = Number(pMatch[1]);
  const q = Number(qMatch[1]);
  if (!numericValues.includes(p) || !numericValues.includes(q)) throw new Error("Both p and q must exist in the tree.");
  const root = buildLevelOrderTree(values as Array<number | null>);
  if (!root) throw new Error("The tree root cannot be null.");

  const steps: DSADryRun["steps"] = [];
  const visit = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    if (node.value === p || node.value === q) {
      steps.push({
        step: `lca(${node.value})`,
        action: `node ${node.value} matches ${node.value === p ? "p" : "q"} → return ${node.value}`,
        state: `returns ${node.value}`,
        note: "A target node reports itself to its parent.",
      });
      return node;
    }
    const left = visit(node.left);
    const right = visit(node.right);
    if (left && right) {
      steps.push({
        step: `lca(${node.value})`,
        action: `left=${left.value}, right=${right.value} → both non-null, so paths split here`,
        state: `return ${node.value} (LCA)`,
        note: "Both subtrees found a target; the current node is their lowest meeting point.",
      });
      return node;
    }
    const returned = left ?? right;
    steps.push({
      step: `lca(${node.value})`,
      action: returned ? `one side returned ${returned.value} → bubble it upward` : "both sides returned null → return null",
      state: returned ? `returns ${returned.value}` : "returns null",
    });
    return returned;
  };

  const answer = visit(root);
  const normalizedInput = `root = [${values.map((value) => value === null ? "null" : value).join(",")}], p = ${p}, q = ${q}`;
  return {
    run: { ...originalRun, input: normalizedInput, steps, result: answer ? String(answer.value) : "null" },
    diagram: buildTreeDiagram(root, p, q, answer?.value),
  };
}

function buildLevelOrderTree(values: Array<number | null>): TreeNode | null {
  if (values[0] === null || values[0] === undefined) return null;
  let nextId = 0;
  const root: TreeNode = { id: nextId++, value: values[0], left: null, right: null };
  const queue = [root];
  let index = 1;
  while (queue.length && index < values.length) {
    const parent = queue.shift()!;
    const leftValue = values[index++];
    if (leftValue !== null && leftValue !== undefined) {
      parent.left = { id: nextId++, value: leftValue, left: null, right: null };
      queue.push(parent.left);
    }
    const rightValue = values[index++];
    if (rightValue !== null && rightValue !== undefined) {
      parent.right = { id: nextId++, value: rightValue, left: null, right: null };
      queue.push(parent.right);
    }
  }
  return root;
}

function buildTreeDiagram(
  root: TreeNode,
  p: number,
  q: number,
  answer: number | undefined,
): DSADiagram {
  const lines = ["graph TD"];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift()!;
    for (const child of [node.left, node.right]) {
      if (!child) continue;
      lines.push(`    N${node.id}((\"${node.value}\")) --> N${child.id}((\"${child.value}\"))`);
      queue.push(child);
    }
  }
  return {
    type: "mermaid",
    title: `Searching for LCA(${p}, ${q}) in your tree`,
    caption: answer === undefined ? "No common ancestor was found." : `The live trace returns ${answer} as the lowest node whose subtree contains both targets.`,
    source: lines.join("\n"),
  };
}
