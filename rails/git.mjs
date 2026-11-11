// Git plumbing for the hook rails: read-only, run in the repository of the
// current working directory.

import { execFileSync } from 'node:child_process';

export const ZERO = '0000000000000000000000000000000000000000';

export function git(args, { cwd = process.cwd(), input, buffer = false } = {}) {
  const out = execFileSync('git', args, { cwd, input, maxBuffer: 1 << 30, stdio: ['pipe', 'pipe', 'pipe'] });
  return buffer ? out : out.toString('utf8');
}

export function tryGit(args, opts) {
  try { return git(args, opts); } catch { return null; }
}

// Added line numbers per file from a unified diff with zero context.
export function addedLines(diff) {
  const files = new Map();
  let cur = null;
  let n = 0;
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) {
      const p = line.slice(4);
      cur = p === '/dev/null' ? null : p.replace(/^b\//, '');
      if (cur && !files.has(cur)) files.set(cur, new Map());
      continue;
    }
    const h = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (h) { n = Number(h[1]); continue; }
    if (!cur) continue;
    if (line.startsWith('+')) { files.get(cur).set(n, line.slice(1)); n++; }
    else if (line.startsWith(' ')) n++;
  }
  return files;
}

// Changed files of a commit: [{ status, path }] (renames as their new path).
export function changedFiles(sha, opts) {
  const raw = git(['diff-tree', '--root', '--no-commit-id', '-r', '-z', '--name-status', '-M', sha], opts);
  const parts = raw.split('\0').filter((x) => x !== '');
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const st = parts[i];
    if (/^[RC]/.test(st)) { out.push({ status: st[0], path: parts[i + 2] }); i += 2; } else { out.push({ status: st[0], path: parts[i + 1] }); i += 1; }
  }
  return out;
}

export function binaryPaths(sha, opts) {
  const raw = git(['diff-tree', '--root', '--no-commit-id', '-r', '-z', '--numstat', '-M', sha], opts);
  const set = new Set();
  const parts = raw.split('\0');
  for (let i = 0; i < parts.length; i++) {
    const m = /^(-|\d+)\t(-|\d+)\t(.*)$/.exec(parts[i]);
    if (!m) continue;
    let p = m[3];
    if (p === '') { p = parts[i + 2]; i += 2; } // a rename: old\0new follow
    if (m[1] === '-' && m[2] === '-') set.add(p);
  }
  return set;
}

export function commitsIn(base, head, opts) {
  const range = !base || base === ZERO ? [head] : [`${base}..${head}`];
  const raw = tryGit(['rev-list', '--reverse', ...range], opts);
  return raw ? raw.split('\n').filter(Boolean) : [];
}

export function parentsOf(sha, opts) {
  return git(['rev-list', '--parents', '-1', sha], opts).trim().split(/\s+/).slice(1);
}

// The lines a merge commit adds over every parent, from a combined diff with
// zero context (git diff-tree --cc -U0): a line of the result that carries "+"
// in every parent's column came from none of them.
export function mergeAddedLines(diff) {
  const files = new Map();
  let cur = null;
  let n = 0;
  let parents = 0;
  for (const line of diff.split('\n')) {
    if (line.startsWith('diff --')) { cur = null; parents = 0; continue; }
    if (!parents && line.startsWith('+++ ')) {
      const p = line.slice(4);
      cur = p === '/dev/null' ? null : p.replace(/^b\//, '');
      continue;
    }
    const h = /^(@{3,}) (?:-\d+(?:,\d+)? )+\+(\d+)(?:,\d+)? @{3,}/.exec(line);
    if (h) { parents = h[1].length - 1; n = Number(h[2]); continue; }
    if (!cur || !parents) continue;
    const mark = line.slice(0, parents);
    if (mark.length < parents || mark.includes('-')) continue;
    if (mark === '+'.repeat(parents)) {
      if (!files.has(cur)) files.set(cur, new Map());
      files.get(cur).set(n, line.slice(parents));
    }
    n++;
  }
  return files;
}
