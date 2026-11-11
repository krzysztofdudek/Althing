// Git plumbing for the hook rails: read-only, run in the repository of the
// current working directory.

import { execFileSync } from 'node:child_process';
export const ZERO = '0000000000000000000000000000000000000000';

// A push sends each object as it is, so the rails read each object as it is: no replacement object of this machine stands in for one. A graft file is left in force, because a push follows it when it picks the commits to send.
const AS_SENT = { GIT_NO_REPLACE_OBJECTS: '1' };

export function git(args, { cwd = process.cwd(), input, buffer = false, env = {} } = {}) {
  const out = execFileSync('git', args, { cwd, input, maxBuffer: 1 << 30, stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, ...env, ...AS_SENT } });
  return buffer ? out : out.toString('utf8');
}

export function tryGit(args, opts) {
  try { return git(args, opts); } catch { return null; }
}

// A path as git writes it on a "+++" line: a name with a space is followed by
// a tab, and a name with a quote, a backslash, a control character or (by
// default) a non-ASCII letter is written in double quotes with C escapes.
export function diffPath(raw) {
  let p = raw.replace(/\t$/, '');
  if (p.length > 1 && p.startsWith('"') && p.endsWith('"')) {
    const bytes = [];
    const body = p.slice(1, -1);
    const simple = { a: 7, b: 8, t: 9, n: 10, v: 11, f: 12, r: 13, '"': 34, '\\': 92 };
    for (let i = 0; i < body.length; i++) {
      if (body[i] !== '\\') { bytes.push(...Buffer.from(body[i], 'utf8')); continue; }
      const oct = /^[0-7]{3}/.exec(body.slice(i + 1));
      if (oct) { bytes.push(parseInt(oct[0], 8)); i += 3; } else { i++; bytes.push(simple[body[i]] ?? body.charCodeAt(i)); }
    }
    p = Buffer.from(bytes).toString('utf8');
  }
  return p === '/dev/null' ? null : p.replace(/^b\//, '');
}

// Added line numbers per file from a unified diff with zero context.
export function addedLines(diff) {
  const files = new Map();
  let cur = null;
  let n = 0;
  // A "+++ " line names a file only in a file's header, before its first hunk: inside a hunk it is an added line that begins "++ ".
  let header = true;
  for (const line of diff.split('\n')) {
    if (line.startsWith('diff --git ')) { header = true; cur = null; continue; }
    if (header && line.startsWith('+++ ')) {
      cur = diffPath(line.slice(4));
      if (cur && !files.has(cur)) files.set(cur, new Map());
      continue;
    }
    const h = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (h) { n = Number(h[1]); header = false; continue; }
    if (!cur || header) continue;
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
