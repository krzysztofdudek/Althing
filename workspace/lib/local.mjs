// This machine's view of the family: ws.local.json (gitignored) maps each
// repository's registry name to its sibling checkout, and says how it is run
// (an exec prefix for a repository that runs inside a container) and where its
// worker worktrees live. Paths are relative to Althing's root; "~" is home.
// The host's rules put worktrees under ~/Worktrees/<Repository>/<name>, so the
// "worktrees" root defaults to ~/Worktrees and a worktree is <root>/<Repository>/<name>
// (a container's own root holds them directly, as <root>/<name>).
//
// {
//   "schema": "ws-local/1",
//   "sources": {
//     "runes": { "path": "../Runes" },
//     "yggdrasil": { "path": "../Yggdrasil", "exec": "docker exec -w /workspaces/Yggdrasil yggdrasil-devcontainer", "worktrees": "<the container's worktree root>" },
//     "jarl": { "path": "../JarlSkill" }
//   },
//   "worktrees": "~/Worktrees"
// }

import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';

export const SCHEMA = 'ws-local/1';
export const DEFAULT_WORKTREES = '~/Worktrees';

export function expand(root, p) {
  if (!p) return p;
  if (p === '~') return homedir();
  if (p.startsWith('~/')) return join(homedir(), p.slice(2));
  return isAbsolute(p) ? p : resolve(root, p);
}

export function loadLocal(root) {
  const file = join(root, 'ws.local.json');
  if (!existsSync(file)) return { file, missing: true, sources: {}, worktrees: null };
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  if (doc.schema !== SCHEMA) throw new Error(`ws.local.json: "schema" must be "${SCHEMA}"`);
  return { file, missing: false, sources: doc.sources || {}, worktrees: doc.worktrees || DEFAULT_WORKTREES, raw: doc };
}

export function sourcePath(root, local, name) {
  const s = local.sources[name];
  return s && s.path ? expand(root, s.path) : null;
}

// The root under which a repository's worker worktrees go: its own (a
// container's) or the machine's. On the host a worktree is
// <root>/<Repository>/<name>.
export function worktreeRoot(root, local, name) {
  const s = local.sources[name] || {};
  if (s.worktrees) return s.worktrees.startsWith('~') || !s.exec ? expand(root, s.worktrees) : s.worktrees;
  return expand(root, local.worktrees || DEFAULT_WORKTREES);
}
