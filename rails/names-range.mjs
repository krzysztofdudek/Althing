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
// pre-push form also the name of each pushed ref, and the message and tagger
// of a pushed annotated tag. A finding gives the commit, the file and the
// line, never the name: a path or a ref that carries a name is itself not
// printed.
//
// A lockfile is read as text here, with its integrity hashes dropped: a
// registry URL can carry a name. UTF-16 text is decoded by its byte order
// mark. A true binary file cannot be read, and is not refused either, because
// a tool repository may hold some (an image, a compiled grammar): each one
// gets a line saying it was not scanned, and its path is still read.
//
// A push is scanned for the commits its remote does not have yet: the range
// git hands the hook, less everything the remote's tracking refs reach. A new
// branch of a long history is then a few commits, and a name that is already
// public does not refuse every later push. A remote with no tracking refs here
// means the whole range.
//
// Nothing reaches a family remote unscanned: a push there in any state but
// "ready" is refused. A push to any other remote, such as a contributor's
// fork, goes through with one line saying it is unscanned. A scan by hand
// always needs the key.

import { git, tryGit, ZERO, addedLines, mergeAddedLines, changedFiles, parentsOf } from './git.mjs';
import { namesState, describeName, skippedForNames } from './names.mjs';

// A remote counts as a family remote when its URL's path ends in <owner>/<repository> for an owner the registry names, on any host or alias, with or without ".git". It fails closed: an absent or empty URL counts, and so does every URL when no owner is known.
export function isFamilyRemote(url, owners) {
  const u = String(url || '').trim();
  if (u === '' || !owners || !owners.length) return true;
  const m = /[/:]([^/:]+)\/[^/:]+?(?:\.git)?\/?$/.exec(u);
  return Boolean(m) && owners.some((o) => o.toLowerCase() === m[1].toLowerCase());
}

const UNSCANNED = 'names: this push is unscanned for private names: this machine cannot run the scan, and the remote is not a repository of the family.';
const HIDDEN_PATH = 'a file whose path carries a name (not printed)';

// The text of a file, or null for a binary one: UTF-16 by its byte order mark, else UTF-8 unless a NUL comes early.
export function textOf(buf) {
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) return buf.subarray(2).toString('utf16le');
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) { const b = Buffer.from(buf.subarray(2, 2 + ((buf.length - 2) & ~1))); return b.swap16().toString('utf16le'); }
  return buf.subarray(0, 8000).includes(0) ? null : buf.toString('utf8');
}

// Every file is read. A lockfile's integrity hashes go first, so that a fragment of one never meets a short entry.
function scanFile(scanner, text, path) {
  return scanner.scan(skippedForNames(path) ? text.replace(/\bsha\d+-[A-Za-z0-9+/]+={0,2}/g, (m) => ' '.repeat(m.length)) : text, '');
}

function scanCommit(out, sha, scanner) {
  const short = sha.slice(0, 12);
  const block = (where, h) => out.blocks.push(`names: commit ${short} ${where}: ${describeName(h)}`);
  for (const h of scanner.scan(git(['log', '-1', '--format=%B', sha]), '')) block(`message:${h.line}`, h);
  for (const h of scanner.scan(git(['log', '-1', '--format=%an%n%ae%n%cn%n%ce', sha]), '').slice(0, 1)) block('author or committer', h);
  const parents = parentsOf(sha);
  let files;
  let added;
  if (parents.length > 1) {
    added = mergeAddedLines(git(['diff-tree', '--cc', '--no-commit-id', '-r', '-U0', '--no-color', sha]));
    const paths = git(['diff-tree', '-c', '--no-commit-id', '-r', '-z', '--name-only', sha]).split('\0').filter(Boolean);
    files = paths.filter((path) => tryGit(['cat-file', '-e', `${sha}:${path}`]) !== null).map((path) => ({ path, isNew: parents.every((p) => tryGit(['cat-file', '-e', `${p}:${path}`]) === null) }));
  } else {
    added = addedLines(git(['diff-tree', '--root', '--no-commit-id', '-r', '-p', '-U0', '-M', '--no-color', sha]));
    files = changedFiles(sha).filter((f) => f.status !== 'D').map((f) => ({ path: f.path, isNew: f.status === 'A' || f.status === 'R' || f.status === 'C' }));
  }
  for (const { path, isNew } of files) {
    const inPath = scanner.scanName(path);
    const shown = inPath.length ? HIDDEN_PATH : path;
    if (isNew && inPath.length) block("a new file's path (not printed)", inPath[0]);
    const buf = tryGit(['show', `${sha}:${path}`], { buffer: true });
    if (buf === null) continue;
    const text = textOf(buf);
    if (text === null) { out.binaries.push(`names: commit ${short} ${shown}: a binary file, not scanned.`); continue; }
    const lines = added.get(path) || new Map();
    // A window is reported at its first word's line, and may end on a later, added one.
    // Git diffs UTF-16 text as binary and names no added line, so every line of such a file counts.
    const wide = buf.length >= 2 && ((buf[0] === 0xff && buf[1] === 0xfe) || (buf[0] === 0xfe && buf[1] === 0xff));
    const touches = (h) => { if (wide) return true; for (let l = h.line; l < h.line + h.size; l++) if (lines.has(l)) return true; return false; };
    for (const h of scanFile(scanner, text, path)) if (touches(h)) block(`${shown}:${h.line}`, h);
  }
}

function scanTree(out, ref, scanner) {
  const block = (where, h) => out.blocks.push(`names: tree ${where}: ${describeName(h)}`);
  for (const entry of git(['ls-tree', '-r', '-z', ref]).split('\0').filter(Boolean)) {
    const tab = entry.indexOf('\t');
    const [, type, id] = entry.slice(0, tab).split(' ');
    const path = entry.slice(tab + 1);
    const inPath = scanner.scanName(path);
    const shown = inPath.length ? HIDDEN_PATH : path;
    if (inPath.length) block("a file's path (not printed)", inPath[0]);
    if (type !== 'blob') { out.submodules++; continue; }
    const text = textOf(git(['cat-file', 'blob', id], { buffer: true }));
    if (text === null) { out.binaries.push(`names: tree ${shown}: a binary file, not scanned.`); continue; }
    for (const h of scanFile(scanner, text, path)) block(`${shown}:${h.line}`, h);
  }
}

const typeOf = (id) => (tryGit(['cat-file', '-t', id]) || '').trim();
const resolve = (ref) => (tryGit(['rev-parse', '--verify', '--quiet', '--end-of-options', ref]) || '').trim();

// An annotated tag is an object of its own: its name, its tagger and its message leave the machine with it. Returns the commit it ends in, or null.
function throughTags(out, id, scanner) {
  for (let hops = 0; hops < 32; hops++) {
    const type = typeOf(id);
    if (type === 'commit') return id;
    if (type !== 'tag') return null;
    const text = git(['cat-file', 'tag', id]);
    for (const h of scanner.scan(text, '').slice(0, 1)) out.blocks.push(`names: tag object ${id.slice(0, 12)}: its name, its tagger or its message: ${describeName(h)}`);
    id = (/^object ([0-9a-f]+)$/m.exec(text) || [])[1] || '';
  }
  return null;
}

// What the remote already has, as git's own tracking refs say: nothing when the name is not a plain remote name or has no refs here.
function remoteHas(name) {
  if (!name || !/^[A-Za-z0-9._-]+$/.test(name) || name.startsWith('-')) return [];
  return (tryGit(['for-each-ref', '--format=%(objectname)', `refs/remotes/${name}/`]) || '').trim() ? [`--remotes=${name}`] : [];
}

// { pairs: [[base, head]] } for a scan by hand, or { stdin: <the lines git hands a pre-push hook>, remote, remoteName, owners }.
// Returns the exit code: 0 clean (or let through unscanned), 1 refused, 2 a range that cannot be read.
export function namesRange({ pairs = null, stdin = null, remote, remoteName, owners = [], tree = false, write = (s) => process.stderr.write(s) } = {}) {
  if (tryGit(['rev-parse', '--git-dir']) === null) { write('names range: this directory is not a git repository.\n'); return 2; }
  const s = namesState();
  if (s.state !== 'ready') {
    if (stdin !== null && !isFamilyRemote(remote, owners)) { write(`${UNSCANNED}\n`); return 0; }
    write(`names: this machine: ${s.message} Nothing leaves the machine unscanned.\nnames range: refused, nothing was scanned.\n`);
    return 1;
  }
  const scanner = s.scanner;
  const out = { blocks: [], binaries: [], submodules: 0 };
  const todo = [];
  if (stdin !== null) {
    const known = remoteHas(remoteName);
    for (const line of stdin.split('\n')) {
      if (!line.trim()) continue;
      const [localRef, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
      if (!localSha || !remoteSha) { write('names range: a line of the push is not "<local ref> <local commit> <remote ref> <remote commit>"; nothing was scanned.\n'); return 2; }
      if (localSha === ZERO) continue;
      const name = (remoteRef || localRef || '').replace(/^refs\/(heads|tags)\//, '');
      const inRef = scanner.scanName(name);
      if (inRef.length) out.blocks.push(`names: a pushed ref's name: ${describeName(inRef[0])}`);
      const head = throughTags(out, localSha, scanner);
      if (!head) { write('names range: a pushed object is not a commit, or a tag of one, that can be read here; nothing was scanned.\n'); return 2; }
      todo.push([head, [...(remoteSha !== ZERO && typeOf(remoteSha) ? [remoteSha] : []), ...known]]);
    }
    if (!todo.length && !out.blocks.length) { write('names range: the push carries no commit and no tag; nothing to scan.\n'); return 0; }
  } else {
    for (const [base, head] of pairs || []) {
      for (const ref of [base, head]) if (ref && ref !== ZERO && !resolve(`${ref}^{commit}`)) { write(`names range: ${ref} is not a commit of this repository; nothing was scanned.\n`); return 2; }
      todo.push([throughTags(out, resolve(head), scanner), base && base !== ZERO ? [base] : []]);
    }
    if (!todo.length) { write('names range: no range was given.\n'); return 2; }
  }
  const seen = new Set();
  for (const [head, not] of todo) {
    for (const sha of git(['rev-list', '--reverse', head, ...(not.length ? ['--not', ...not] : [])]).split('\n').filter(Boolean)) {
      if (seen.has(sha)) continue;
      seen.add(sha);
      scanCommit(out, sha, scanner);
    }
    if (tree) scanTree(out, head, scanner);
  }
  for (const b of [...out.binaries, ...out.blocks]) write(`${b}\n`);
  const unread = [out.binaries.length ? `${out.binaries.length} binary file${out.binaries.length === 1 ? '' : 's'} not scanned` : '', out.submodules ? `${out.submodules} submodule${out.submodules === 1 ? '' : 's'} not read` : ''].filter(Boolean).join(', ');
  const label = `names range (${seen.size} commit${seen.size === 1 ? '' : 's'}${tree ? ' and the tree' : ''})`;
  write(out.blocks.length ? `${label}: ${out.blocks.length} refusal(s)${unread ? `; ${unread}` : ''}. Nothing was pushed by this command; the leak response is in Althing's method/boundary.md.\n` : `${label}: clean${unread ? `; ${unread}` : ''}.\n`);
  return out.blocks.length ? 1 : 0;
}
