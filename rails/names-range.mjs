// The keyed names rail over a commit range of another family repository, on
// the maintainer's machine: the leak gate a tool repository's pre-push hook
// calls (the template is workspace/hooks/pre-push) and the scan a maintainer
// runs by hand (node workspace/ws.mjs names). Only the names rail runs here:
// the English, path and binary rails are Althing's own rules, and a tool
// repository has its own.
//
// It reads the repository of the current working directory and the digests
// next to this file, with Althing's key. Per commit it reads the message, the
// author, the committer and every other header, every line the commit adds,
// and the path of every file it adds; in the pre-push form also the name of
// each pushed ref, and the message and tagger of a pushed annotated tag. A
// finding gives the commit, the file and the line, never the name: a path or
// a ref that carries a name is itself not printed.
//
// A commit is read by the reader in git.mjs, which Althing's own scans share:
// from its own bytes, in UTF-8 and in the encoding it declares, so no setting
// of the repository changes the text. A merge is read as an ordinary commit
// against each of its parents, and a name counts when it is new against every
// one of them.
//
// A graft file of this machine (.git/info/grafts) changes which commits and
// which files a push sends. The scan does not follow it: while one is in
// force nothing is read, and the push is refused in one line.
//
// A lockfile is read as text here, with its integrity hashes dropped: a
// registry URL can carry a name. UTF-16 text is decoded by its byte order
// mark. A true binary file cannot be read, and is not refused either, because
// a tool repository may hold some (an image, a compiled grammar): each one
// gets a line saying it was not scanned, and its path is still read.
//
// A push is scanned for the commits its remote does not have yet: the range
// git hands the hook, less what the remote itself reports when it is asked at
// the address of the push (git ls-remote of its branches and tags, with the
// rules that would send the question to another address set aside). A new branch of a long history is
// then a few commits, and a name that is already public there does not refuse
// every later push. The remote's tracking refs on this machine are never
// used for this: they say what was last fetched, from whatever address the
// remote had then, and not what the remote of this push holds now. A remote
// that cannot be asked, or that a git setting of this machine would have
// answered from another place, means the whole range, said in one line.
//
// The diff is read with --text and without the big file threshold, so a git
// attribute or a setting never hides a file's added lines.

import { spawnSync } from 'node:child_process';
import { git, tryGit, ZERO, graftsInForce, newAgainst, readCommit, readTree, throughTags, typeOf, resolve, commitsOf } from './git.mjs';
import { namesState, describeName, skippedForNames } from './names.mjs';

const GRAFTS = 'names range: a graft file is in force in this repository (info/grafts in its git directory, or the file GIT_GRAFT_FILE names), so the commits a push sends cannot be read; nothing was scanned. Remove the graft file, or turn it into replacement refs with git replace --convert-graft-file, and run this again.';

// A remote counts as a family remote when its URL's path ends in <owner>/<repository> for an owner the registry names, on any host or alias, with or without ".git". It fails closed: an absent or empty URL counts, and so does every URL when no owner is known.
export function isFamilyRemote(url, owners) {
  const u = String(url || '').trim();
  if (u === '' || !owners || !owners.length) return true;
  const m = /[/:]([^/:]+)\/[^/:]+?(?:\.git)?\/?$/.exec(u);
  return Boolean(m) && owners.some((o) => o.toLowerCase() === m[1].toLowerCase());
}

const UNSCANNED = 'names: this push is unscanned for private names: this machine cannot run the scan, and the remote is not a repository of the family.';
const HIDDEN_PATH = 'a file whose path carries a name (not printed)';

// Every file is read. A lockfile's integrity hashes go first, so that a fragment of one never meets a short entry.
function scanFile(scanner, text, path) {
  return scanner.scan(skippedForNames(path) ? text.replace(/\bsha\d+-[A-Za-z0-9+/]+={0,2}/g, (m) => ' '.repeat(m.length)) : text, '');
}

const block = (out, line) => { if (!out.blocks.includes(line)) out.blocks.push(line); };

function scanCommit(out, sha, scanner) {
  const short = sha.slice(0, 12);
  const refuse = (where, h) => block(out, `names: commit ${short} ${where}: ${describeName(h)}`);
  const { texts, unread, files } = readCommit(sha);
  if (unread) block(out, `names: commit ${short}: ${unread}`);
  for (const { message } of texts) for (const h of scanner.scan(message, '')) refuse(`message:${h.line}`, h);
  // Every header leaves with the commit: the author, the committer, and whatever else it carries (a merged tag's message among them).
  const inHeaders = texts.flatMap(({ headers }) => scanner.scan(headers, ''))[0];
  if (inHeaders) refuse('author or committer, or another header of the commit', inHeaders);
  for (const { path, isNew, gitlink, sides, read } of files) {
    const inPath = scanner.scanName(path);
    const shown = inPath.length ? HIDDEN_PATH : path;
    if (isNew && inPath.length) refuse("a new file's path (not printed)", inPath[0]);
    if (gitlink) continue;
    if (read === null) { out.binaries.push(`names: commit ${short} ${shown}: a binary file, not scanned.`); continue; }
    // A window counts when one of its lines is added, or when lines were removed between two of them. In a merge it counts when it is new against every parent, so a line taken from one of them does not. Every line of a UTF-16 file counts: its diff is bytes, not lines of text.
    for (const h of scanFile(scanner, read.text, path)) if (read.wide || sides.every((side) => newAgainst(side, h.line, h.end))) refuse(`${shown}:${h.line}`, h);
  }
}

function scanTree(out, ref, scanner) {
  const refuse = (where, h) => block(out, `names: tree ${where}: ${describeName(h)}`);
  for (const { path, gitlink, read } of readTree(ref)) {
    const inPath = scanner.scanName(path);
    const shown = inPath.length ? HIDDEN_PATH : path;
    if (inPath.length) refuse("a file's path (not printed)", inPath[0]);
    if (gitlink) { out.submodules++; continue; }
    if (read === null) { out.binaries.push(`names: tree ${shown}: a binary file, not scanned.`); continue; }
    for (const h of scanFile(scanner, read.text, path)) refuse(`${shown}:${h.line}`, h);
  }
}

// An annotated tag is an object of its own: its name, its tagger and its message leave the machine with it. Returns the commit it ends in, or null.
function headOf(out, id, scanner) {
  const { head, tags } = throughTags(id);
  for (const tag of tags) {
    if (tag.unread) block(out, `names: tag object ${tag.id.slice(0, 12)}: ${tag.unread}`);
    for (const h of scanner.scan(tag.text, '').slice(0, 1)) block(out, `names: tag object ${tag.id.slice(0, 12)}: its name, its tagger or its message: ${describeName(h)}`);
  }
  return head;
}

const NOT_ASKED = 'names: the remote could not be asked what it has, so every commit of the pushed range is read.';
const ASKS_ELSEWHERE = 'names: a git setting of this machine changes where a question for the address of this push goes (a url.<base>.insteadOf rule, or a remote set up under that address), so the remote was not asked what it has and every commit of the pushed range is read.';

// Runs one command in a process group of its own, with no terminal, and ends the whole group at the limit or when the scan is interrupted: git and the transport it started.
const BOUNDED = `const { spawn } = require('node:child_process');
const [limit, command, ...args] = process.argv.slice(1);
const child = spawn(command, args, { detached: true, stdio: ['ignore', 'inherit', 'ignore'] });
const end = () => { try { process.kill(-child.pid, 'SIGKILL'); } catch {} process.exit(1); };
setTimeout(end, Number(limit));
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(signal, end);
child.on('error', () => process.exit(1));
child.on('exit', (code) => process.exit(code === 0 ? 0 : 1));`;

// ssh is told not to ask for a passphrase or a password. A transport command that is not ssh keeps its own options: it too runs with no terminal and inside the limit.
function unprompted() {
  const own = process.env.GIT_SSH_COMMAND || (tryGit(['config', '--get', 'core.sshCommand']) || '').trim();
  if (!own && process.env.GIT_SSH) return {};
  const command = own || 'ssh';
  return /^(\S*\/)?ssh(\s|$)/.test(command) ? { GIT_SSH_COMMAND: `${command} -o BatchMode=yes` } : {};
}

// What the remote of this push holds now: { held } with the tips of its branches and tags that are also objects here (only those: a host lists its pull-request refs to anyone and hides them from a push, so git sends their commits again), or { why } with the line to print when it was not asked. Tracking refs are never read for this.
// The address git hands the hook is already rewritten for the push, and git ls-remote would rewrite it once more by the url.<base>.insteadOf rules, which may name a mirror. So one rule is added for these calls alone: the address stands for itself. It is the longest prefix a rule can name, and it wins over every other rule except one that names the whole address too; --get-url shows which address git would ask, and any other than the push's own means the remote is not asked. So does any setting of a remote named by the address.
export function remoteHolds(url, { limit = 60000 } = {}) {
  const target = String(url || '');
  if (!target.trim()) return { why: NOT_ASKED };
  const n = Number(process.env.GIT_CONFIG_COUNT) || 0;
  const env = { GIT_CONFIG_COUNT: String(n + 1), [`GIT_CONFIG_KEY_${n}`]: `url.${target}.insteadOf`, [`GIT_CONFIG_VALUE_${n}`]: target, GIT_TERMINAL_PROMPT: '0', ...unprompted() };
  const asks = tryGit(['ls-remote', '--get-url', '--', target], { env });
  const settings = tryGit(['config', '--list', '-z'], { env });
  if (asks === null || settings === null) return { why: NOT_ASKED };
  // A remote set up under the address itself keeps the address and may still change who answers (the program that serves it, a helper, a proxy).
  if (asks !== `${target}\n` || settings.split('\0').some((entry) => entry.startsWith(`remote.${target}.`))) return { why: ASKS_ELSEWHERE };
  const listed = spawnSync(process.execPath, ['-e', BOUNDED, String(limit), 'git', 'ls-remote', '--heads', '--tags', '--', target], { env: { ...process.env, ...env }, timeout: limit + 10000, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] });
  if (listed.status !== 0) return { why: NOT_ASKED };
  const ids = [...new Set(listed.stdout.toString('utf8').split('\n').map((l) => l.split('\t')[0]).filter((x) => /^[0-9a-f]{40,64}$/.test(x)))];
  if (!ids.length) return { held: [] };
  const here = git(['cat-file', '--batch-check'], { input: `${ids.join('\n')}\n` });
  return { held: here.split('\n').map((l) => l.split(' ')).filter((f) => f[1] === 'commit' || f[1] === 'tag').map((f) => f[0]) };
}

// The hook template (workspace/hooks/pre-push) lets a push go on only when the last line printed here is one of the three that close a passed push: the clean line, the nothing-to-scan line and UNSCANNED. Change their wording together with the hook's patterns.
// { pairs: [[base, head]] } for a scan by hand, or { stdin: <the lines git hands a pre-push hook>, remote, owners }.
// Returns the exit code: 0 clean (or let through unscanned), 1 refused, 2 a range that cannot be read (a graft file in force among the reasons).
export function namesRange({ pairs = null, stdin = null, remote, owners = [], tree = false, write = (s) => process.stderr.write(s) } = {}) {
  if (tryGit(['rev-parse', '--git-dir']) === null) { write('names range: no git repository can be read here (the folder --dir names, or the git directory --git-dir names); nothing was scanned.\n'); return 2; }
  const s = namesState();
  if (s.state !== 'ready') {
    if (stdin !== null && !isFamilyRemote(remote, owners)) { write(`${UNSCANNED}\n`); return 0; }
    write(`names: this machine: ${s.message} Nothing leaves the machine unscanned.\nnames range: refused, nothing was scanned.\n`);
    return 1;
  }
  if (graftsInForce()) { write(`${GRAFTS}\n`); return 2; }
  const scanner = s.scanner;
  const out = { blocks: [], binaries: [], submodules: 0 };
  const todo = [];
  if (stdin !== null) {
    let known = null;
    for (const line of stdin.split('\n')) {
      if (!line.trim()) continue;
      const [localRef, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
      if (!localSha || !remoteSha) { write('names range: a line of the push is not "<local ref> <local commit> <remote ref> <remote commit>"; nothing was scanned.\n'); return 2; }
      if (localSha === ZERO) continue;
      const name = (remoteRef || localRef || '').replace(/^refs\/(heads|tags)\//, '');
      const inRef = scanner.scanName(name);
      if (inRef.length) out.blocks.push(`names: a pushed ref's name: ${describeName(inRef[0])}`);
      const head = headOf(out, localSha, scanner);
      if (!head) { write('names range: a pushed object is not a commit, or a tag of one, that can be read here; nothing was scanned.\n'); return 2; }
      if (known === null) {
        const asked = remoteHolds(remote);
        known = asked.held || [];
        if (!asked.held) write(`${asked.why}\n`);
      }
      todo.push([head, [...(remoteSha !== ZERO && typeOf(remoteSha) ? [remoteSha] : []), ...known]]);
    }
    if (!todo.length && !out.blocks.length) { write('names range: the push carries no commit and no tag; nothing to scan.\n'); return 0; }
  } else {
    for (const [base, head] of pairs || []) {
      for (const ref of [base, head]) if (ref && ref !== ZERO && !resolve(`${ref}^{commit}`)) { write(`names range: ${ref} is not a commit of this repository; nothing was scanned.\n`); return 2; }
      todo.push([headOf(out, resolve(head), scanner), base && base !== ZERO ? [base] : []]);
    }
    if (!todo.length) { write('names range: no range was given.\n'); return 2; }
  }
  const seen = new Set();
  for (const [head, not] of todo) {
    for (const sha of commitsOf(head, not)) {
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
