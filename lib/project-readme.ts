// SERVER ONLY — read local markdown snapshots; do not import from Client Components.

import fs from "node:fs";
import path from "node:path";

const README_FETCH = path.join(process.cwd(), ".readme-fetch");
const README_PUBLIC = path.join(process.cwd(), "public", "project-readmes");

/** Safe GitHub-style repo names only (prevents path traversal). */
function isSafeReadmeBasename(name: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9_.-]{0,200}$/.test(name);
}

/**
 * Loads optional project write-up markdown.
 * Tries `.readme-fetch/{name}.md` then `public/project-readmes/{name}.md` (for deploy when fetch dir is absent).
 */
export function loadProjectReadmeMarkdown(projectName: string): string | null {
  if (!isSafeReadmeBasename(projectName)) return null;
  const file = `${projectName}.md`;
  const paths = [path.join(README_FETCH, file), path.join(README_PUBLIC, file)];
  for (const p of paths) {
    try {
      return fs.readFileSync(p, "utf8");
    } catch {
      /* try next */
    }
  }
  return null;
}
