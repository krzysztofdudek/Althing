// The keyed names rail over a commit range of another family repository, on
// the maintainer's machine: the leak gate a tool repository's pre-push hook
// calls (the template is workspace/hooks/pre-push) and the scan a maintainer
// runs by hand (node workspace/ws.mjs names). Only the names rail runs here:
// the English, path and binary rails are Althing's own rules, and a tool
// repository has its own.
//
// It reads the repository of the current working directory and the digests
// next to this file, with Althing's key. Per commit it reads the message, the
// author and the committer, every line the commit adds (for a merge, the lines
// it adds over every parent), and the path of every file it adds; in the
// pre-push form also the name of each pushed ref. A finding gives the commit,
// the file and the line, never the name: a path or a ref that carries a name
// is itself not printed.
//
// Nothing reaches a family remote unscanned: a push there in any state but
// "ready" is refused. A push to any other remote, such as a contributor's
// fork, goes through with one line saying it is unscanned. A scan by hand
// always needs the key.

import { git, tryGit, ZERO, addedLines, mergeAddedLines, changedFiles, parentsOf } from './git.mjs';
import { namesState, describeName } from './names.mjs';

// A remote counts as a family remote when its URL's path ends in <owner>/<repository> for an owner the registry names, on any host or alias, with or without ".git". It fails closed: an absent or empty URL counts, and so does every URL when no owner is known.
export function isFamilyRemote(url, owners) {
  const u = String(url || '').trim();
  if (u === '' || !owners || !owners.length) return true;
  const m = /[/:]([^/:]+)\/[^/:]+?(?:\.git)?\/?$/.exec(u);
  return Boolean(m) && owners.some((o) => o.toLowerCase() === m[1].toLowerCase());
}

const UNSCANNED = 'names: this push is unscanned for private names: this machine cannot run the scan, and the remote is not a repository of the family.';
const HIDDEN_PATH = 'a file whose path carries a name (not printed)';

function scanCommit(blocks, sha, scanner) {
  const short = sha.slice(0, 12);
  const block = (where, h) => blocks.push(`names: commit ${short} ${where}: ${describeName(h)}`);
  for (const h of scanner.scan(git(['log', '-1', '--format=%B', sha]), '')) block(`message:${h.line}`, h);
  for (const h of scanner.scan(git(['log', '-1', '--format=%an%n%ae%n%cn%n%ce', sha]), '').slice(0, 1)) block('author or committer', h);
  const parents = parentsOf(sha);
  let files;
  let added;
  if (parents.length > 1) {
    added = mergeAddedLines(git(['diff-tree', '--cc', '--no-commit-id', '-r', '-U0', '--no-color', sha]));
    files = [...added.keys()].map((path) => ({ path, isNew: parents.every((p) => tryGit(['cat-file', '-e', `${p}:${path}`]) === null) }));
  } else {
    added = addedLines(git(['diff-tree', '--root', '--no-commit-id', '-r', '-p', '-U0', '-M', '--no-color', sha]));
    files = changedFiles(sha).filter((f) => f.status !== 'D').map((f) => ({ path: f.path, isNew: f.status === 'A' || f.status === 'R' || f.status === 'C' }));
  }
  for (const { path, isNew } of files) {
    const inPath = scanner.scanName(path);
    const shown = inPath.length ? HIDDEN_PATH : path;
    if (isNew && inPath.length) block("a new file's path (not printed)", inPath[0]);
    const buf = tryGit(['show', `${sha}:${path}`], { buffer: true });
    if (buf === null || buf.subarray(0, 8000).includes(0)) continue;
    const lines = added.get(path) || new Map();
    // A window is reported at its first word's line, and may end on a later, added one.
    const touches = (h) => { for (let l = h.line; l < h.line + h.size; l++) if (lines.has(l)) return true; return false; };
    for (const h of scanner.scan(buf.toString('utf8'), path)) if (touches(h)) block(`${shown}:${h.line}`, h);
  }
}

function scanTree(blocks, ref, scanner) {
  for (const path of git(['ls-tree', '-r', '-z', '--name-only', ref]).split('\0').filter(Boolean)) {
    const inPath = scanner.scanName(path);
    const block = (where, h) => blocks.push(`names: tree ${where}: ${describeName(h)}`);
    if (inPath.length) block("a file's path (not printed)", inPath[0]);
    const buf = git(['show', `${ref}:${path}`], { buffer: true });
    if (buf.subarray(0, 8000).includes(0)) continue;
    for (const h of scanner.scan(buf.toString('utf8'), path)) block(`${inPath.length ? HIDDEN_PATH : path}:${h.line}`, h);
  }
}

const isCommit = (ref) => tryGit(['rev-parse', '--verify', '--quiet', '--end-of-options', `${ref}^{commit}`]) !== null;

// { pairs: [[base, head]] } for a scan by hand, or { stdin: <the lines git hands a pre-push hook>, remote, owners }.
// Returns the exit code: 0 clean (or let through unscanned), 1 refused, 2 a range that cannot be read.
export function namesRange({ pairs = null, stdin = null, remote, owners = [], tree = false, write = (s) => process.stderr.write(s) } = {}) {
  if (tryGit(['rev-parse', '--git-dir']) === null) { write('names range: this directory is not a git repository.\n'); return 2; }
  const s = namesState();
  if (s.state !== 'ready') {
    if (stdin !== null && !isFamilyRemote(remote, owners)) { write(`${UNSCANNED}\n`); return 0; }
    write(`names: this machine: ${s.message} Nothing leaves the machine unscanned.\nnames range: refused, nothing was scanned.\n`);
    return 1;
  }
  const scanner = s.scanner;
  const blocks = [];
  const todo = [];
  if (stdin !== null) {
    for (const line of stdin.split('\n')) {
      if (!line.trim()) continue;
      const [localRef, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
      if (!localSha || !remoteSha) { write('names range: a line of the push is not "<local ref> <local commit> <remote ref> <remote commit>"; nothing was scanned.\n'); return 2; }
      if (localSha === ZERO) continue;
      if (!isCommit(localSha)) { write('names range: a pushed commit cannot be read here; nothing was scanned.\n'); return 2; }
      const name = (remoteRef || localRef || '').replace(/^refs\/(heads|tags)\//, '');
      const inRef = scanner.scanName(name);
      if (inRef.length) blocks.push(`names: a pushed ref's name: ${describeName(inRef[0])}`);
      todo.push([remoteSha !== ZERO && isCommit(remoteSha) ? remoteSha : ZERO, localSha]);
    }
  } else {
    for (const [base, head] of pairs || []) {
      for (const ref of [base, head]) if (ref && ref !== ZERO && !isCommit(ref)) { write(`names range: ${ref} is not a commit of this repository; nothing was scanned.\n`); return 2; }
      todo.push([base || ZERO, head]);
    }
    if (!todo.length) { write('names range: no range was given.\n'); return 2; }
  }
  const seen = new Set();
  for (const [base, head] of todo) {
    const range = base === ZERO ? [head] : [`${base}..${head}`];
    for (const sha of git(['rev-list', '--reverse', ...range]).split('\n').filter(Boolean)) {
      if (seen.has(sha)) continue;
      seen.add(sha);
      scanCommit(blocks, sha, scanner);
    }
    if (tree) scanTree(blocks, head, scanner);
  }
  for (const b of blocks) write(`${b}\n`);
  const label = `names range (${seen.size} commit${seen.size === 1 ? '' : 's'}${tree ? ' and the tree' : ''})`;
  write(blocks.length ? `${label}: ${blocks.length} refusal(s). Nothing was pushed by this command; the leak response is in Althing's method/boundary.md.\n` : `${label}: clean.\n`);
  return blocks.length ? 1 : 0;
}
