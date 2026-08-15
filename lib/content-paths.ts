import fs from "fs";
import path from "path";

/**
 * Resolve the repository content directory in both supported app layouts:
 * the current root-level Next.js app and the historical frontend/ subfolder.
 */
export function resolveContentRoot(): string {
  const candidates = [
    path.join(process.cwd(), "content"),
    path.join(process.cwd(), "..", "content"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
}
