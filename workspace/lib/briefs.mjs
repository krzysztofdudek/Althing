// Brief templates: one coherent file per role (and per repository where a
// worker's environment differs), with placeholders filled per machine. A
// committed brief carries no machine path and no trailer; the rendered text
// is what a spawn receives.
//
//   {{althing}}       this checkout of Althing
//   {{root}}          the release directory (the loop's --root)
//   {{jarl}}          the driver Jarl's command line
//   {{repo:<name>}}   a repository's sibling checkout
//   {{wt:<name>}}     the root of that repository's worker worktrees; on the host a worktree is {{wt:<name>}}/<Repository>/<name>
//   {{exec:<name>}}   the prefix that runs a command in that repository's environment (empty on the host)
//   {{env}}           the environment line of ws env (empty until the workspace packages add it)
//   {{trailer}}       the attribution trailer the session's harness provides (--trailer)
//   {{issue}}         the issue file, verbatim (--issue)

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { sourcePath, worktreeRoot } from './local.mjs';

export function templatePath(root, v, role, repo) {
  const dir = join(root, 'releases', v, 'briefs');
  for (const name of repo ? [`${role}-${repo}.md`, `${role}.md`] : [`${role}.md`]) {
    if (existsSync(join(dir, name))) return join(dir, name);
  }
  return null;
}

export function issueText(root, v, id) {
  const dir = join(root, 'releases', v, '.jarl', 'issues');
  const n = Number(id);
  const f = existsSync(dir) && readdirSync(dir).find((x) => {
    const m = /^(\d+)-/.exec(x);
    return m !== null && Number(m[1]) === n;
  });
  if (!f) throw new Error(`no issue ${n} in releases/${v}/.jarl/issues`);
  return readFileSync(join(dir, f), 'utf8');
}

// values: { althing, root, jarl, env, trailer, issue }; local: ws.local.json.
export function render(template, values, local, althingRoot) {
  const missing = new Set();
  const out = template.replace(/\{\{([a-z]+)(?::([a-z0-9-]+))?\}\}/g, (all, key, arg) => {
    if (arg) {
      if (key === 'repo') { const p = sourcePath(althingRoot, local, arg); if (p) return p; }
      else if (key === 'wt') { if (local.sources[arg] || local.worktrees) return worktreeRoot(althingRoot, local, arg); }
      else if (key === 'exec') { if (local.sources[arg]) return local.sources[arg].exec || ''; }
      missing.add(all);
      return all;
    }
    if (values[key] !== undefined && values[key] !== null) return values[key];
    missing.add(all);
    return all;
  });
  if (missing.size) throw new Error(`the brief needs ${[...missing].join(', ')}; give the value (--trailer, --issue, --repo) or add the source to ws.local.json`);
  return out;
}
