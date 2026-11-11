// The hook and CI entry point for the rails that need git history or a secret,
// and the leak gate before anything leaves the machine.
//
//   node rails/run.mjs staged                     pre-commit: names over the staged lines, loop placement, the proper-noun glance
//   node rails/run.mjs message <file>             commit-msg: the message rail and the names scan over the message
//   node rails/run.mjs range <base> <head> [--tree] [--require-key]
//   node rails/run.mjs range --stdin --require-key --remote <url>
//                                                 the pre-push form: --remote is the URL git hands the hook; the key is
//                                                 required only when it is the canonical repository (krzysztofdudek/Althing),
//                                                 any other remote gets one line saying the push is unscanned
//                                                 pre-push and CI: every commit in the range (a zero base means the whole
//                                                 history of head): its message, its author, its committer and its other
//                                                 headers, its branch name, and the English, path, secret, binary and
//                                                 names rails over every line it adds, a merge's own lines among them;
//                                                 the name, the tagger and the message of each pushed annotated tag;
//                                                 --tree adds a full scan of the tree at head
//   node rails/run.mjs tree [--require-key]       every tracked file at HEAD
//   node rails/run.mjs history [--require-key]    every commit reachable from any ref, and every annotated tag (nightly)
//
// It reads the repository of the current working directory and the digests
// next to this file, so CI can run the scanner from the base commit's checkout
// against a pull request's tree. What it reads of a commit, the index and a
// tree comes from the reader in git.mjs, as a push sends it.
//
// Exit codes: 0 clean, 1 refused, 2 when a range, a history or a tree cannot
// be read (a ref that is no commit, a graft file in force, a git command that
// fails): nothing was scanned, and that is never reported as clean.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDirectly } from './direct.mjs';
import { git, tryGit, ZERO, graftsInForce, newAgainst, readCommit, readStaged, readTree, throughTags, resolve, commitsOf } from './git.mjs';
import { scanEnglish, describe } from './english.mjs';
import { scanPaths, describePath } from './paths.mjs';
import { scanSecrets, describeSecret } from './secrets.mjs';
import { scanBinary, describeBinary } from './binaries.mjs';
import { namesState, describeName } from './names.mjs';
import { scanMessageRail, scanBranch } from './messages.mjs';
import { newProperNouns, parseNouns } from './nouns.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// Regions the content rails do not read, mirroring the Yggdrasil node types:
// detector data must hold what the detectors detect.
const DATA = [/^rails\/lexicon\//, /^rails\/test\/fixtures\//, /^rails\/names\//];
const NOT_ENGLISH = [...DATA, /^workspace\/fixtures\//, /^\.claude\/settings\.json$/, /^\.githooks\//];
const LOOP_PLACE = /^releases\/\d+\.\d+\.\d+\/\.jarl\//;

const any = (res, p) => res.some((re) => re.test(p));

class Report {
  constructor() { this.blocking = []; this.notes = []; }
  block(rail, where, message) { const line = `${rail}: ${where}: ${message}`; if (!this.blocking.includes(line)) this.blocking.push(line); }
  note(text) { this.notes.push(text); }
  print(label) {
    for (const n of this.notes) process.stderr.write(`${n}\n`);
    for (const b of this.blocking) process.stderr.write(`${b}\n`);
    process.stderr.write(this.blocking.length ? `rails ${label}: ${this.blocking.length} refusal(s). The fix for each rail is in rails/README.md.\n` : `rails ${label}: clean.\n`);
    return this.blocking.length ? 1 : 0;
  }
}

// A range, a history or a tree that cannot be read is never reported as clean: one line says why, and the exit code is 2.
function unread(label, why) {
  process.stderr.write(`rails ${label}: ${why}; nothing was scanned.\n`);
  return 2;
}
const NO_REPOSITORY = 'no git repository can be read here';
const GRAFTS = 'a graft file is in force in this repository (info/grafts in its git directory, or the file GIT_GRAFT_FILE names), so the commits a push sends cannot be read. Remove the graft file, or turn it into replacement refs with git replace --convert-graft-file, and run this again';
const inRepository = () => tryGit(['rev-parse', '--git-dir']) !== null;

function names(report, requireKey) {
  const s = namesState();
  if (s.state === 'ready') return s.scanner;
  if (requireKey) report.block('names', 'this machine', `${s.message} Nothing leaves the machine unscanned.`);
  else report.note(`${s.message} This commit is unscanned for private names.`);
  return null;
}

// Fails closed: a URL whose path ends in krzysztofdudek/Althing counts as the canonical repository on any host or alias (an ssh alias, ssh.github.com:443, www.github.com), with or without ".git"; an absent or empty URL counts as canonical too. This is the one place that names the repository for the hooks; change it together with the `if:` of the names job in .github/workflows/rails.yml.
export function isCanonicalRemote(url) {
  const u = String(url || '').trim();
  return u === '' || /[/:]krzysztofdudek\/althing(?:\.git)?\/?$/i.test(u);
}

const HIDDEN_PATH = 'a file whose path carries a name (not printed)';

// The rails over one file as the reader hands it over: its path, its blob's text and what that blob changes over each side (a parent's version, or what HEAD holds). A finding counts when it is new against every side; a side of null means every line is new. `where` names the commit or the tree in each refusal. A path that carries a name is itself never printed.
function scanFile(report, { path, isNew, gitlink, sides, read }, scanner, where) {
  const inPath = scanner ? scanner.scanName(path) : [];
  const shown = inPath.length ? HIDDEN_PATH : path;
  const at = (line) => `${where} ${shown}:${line}`;
  if (isNew && inPath.length) report.block('names', `${where} ${where.startsWith('commit ') ? "a new file's path" : "a file's path"} (not printed)`, describeName(inPath[0]));
  loopPlacement(report, path, `${where} ${shown}`);
  if (gitlink) return;
  // Every line of a UTF-16 file counts as added: its diff is bytes, not lines of text.
  const added = (from, to) => read.wide || sides.every((side) => newAgainst(side, from, to));
  const keep = (line) => (line === 0 ? isNew : added(line));
  // A NUL byte in a file's first 8000 bytes makes it binary here, UTF-16 text included, as the tree's rule has it. A file that is binary by its name alone is refused when the commit adds it or adds a line to it.
  const text = read === null || read.wide ? '\u0000' : read.text;
  const binary = scanBinary(path, text);
  if (binary && (text === '\u0000' || isNew || sides.every((side) => !side || side.added.size > 0))) report.block('boundary/no-binaries', at(1), describeBinary(binary));
  if (read === null) return;
  if (scanner) for (const h of scanner.scan(read.text, path)) if (added(h.line, h.end)) report.block('names', at(h.line), describeName(h));
  if (read.wide) return;
  if (!any(NOT_ENGLISH, path)) for (const f of scanEnglish(text, path)) if (keep(f.line)) report.block('lang/english', at(f.line), describe(f));
  if (!any(DATA, path)) {
    for (const f of scanPaths(text, path)) if (keep(f.line)) report.block('boundary/no-private-paths', at(f.line), describePath(f));
    for (const f of scanSecrets(text)) if (keep(f.line)) report.block('secrets-range', at(f.line), describeSecret(f));
  }
}

function loopPlacement(report, path, where) {
  if (/(^|\/)\.jarl\//.test(path) && !LOOP_PLACE.test(path)) report.block('loop/shape', where, 'a .jarl/ directory outside releases/<version>/: Althing has one loop per release directory and no other.');
}

function scanMessage(report, text, scanner, where) {
  for (const f of scanMessageRail(text)) report.block('messages', `${where}:${f.line}`, f.message);
  if (scanner) for (const h of scanner.scan(text, '')) report.block('names', `${where}:${h.line}`, describeName(h));
}

function scanCommit(report, sha, scanner) {
  const where = `commit ${sha.slice(0, 12)}`;
  const { texts, unread: why, files } = readCommit(sha);
  if (why) report.block('messages', where, why);
  // The message rail reads the message as git shows it; the names rail reads every reading of it, and every header: the author, the committer, and whatever else the commit carries (a merged tag's message among them).
  for (const f of scanMessageRail(texts.at(-1).message)) report.block('messages', `${where} message:${f.line}`, f.message);
  if (scanner) {
    for (const { message } of texts) for (const h of scanner.scan(message, '')) report.block('names', `${where} message:${h.line}`, describeName(h));
    const inHeaders = texts.flatMap(({ headers }) => scanner.scan(headers, ''))[0];
    if (inHeaders) report.block('names', `${where} author or committer, or another header of the commit`, describeName(inHeaders));
  }
  for (const file of files) scanFile(report, file, scanner, where);
}

function scanTree(report, ref, scanner) {
  for (const file of readTree(ref)) scanFile(report, file, scanner, ref);
}

// An annotated tag is an object of its own: its name, its tagger and its message leave the machine with it, so the message rail and the names rail read each tag object on the way to the commit. Returns that commit, or null when the chain ends in anything else.
function scanTags(report, id, scanner) {
  const { head, tags } = throughTags(id);
  for (const tag of tags) {
    const where = `tag object ${tag.id.slice(0, 12)}`;
    for (const f of scanMessageRail(tag.message)) report.block('messages', `${where} message:${f.line}`, f.message);
    if (scanner) for (const h of scanner.scan(tag.text, '').slice(0, 1)) report.block('names', `${where}: its name, its tagger or its message`, describeName(h));
  }
  return head;
}

// Before a commit only the names rail and the loop placement read the staged files, with the proper-noun glance: the Yggdrasil gate, which the pre-commit hook runs first, holds the other rules over the tree.
function staged() {
  const report = new Report();
  const scanner = names(report, false);
  const nounLines = [];
  for (const { path, isNew, gitlink, sides, read } of readStaged()) {
    const inPath = scanner ? scanner.scanName(path) : [];
    const shown = inPath.length ? HIDDEN_PATH : path;
    if (isNew && inPath.length) report.block('names', "a new file's path (not printed)", describeName(inPath[0]));
    loopPlacement(report, path, shown);
    if (gitlink || read === null) continue;
    // A line that a refusal covers is left out of the glance, which prints words: a listed name is never printed.
    const refused = new Set();
    if (scanner) {
      for (const h of scanner.scan(read.text, path)) {
        if (!read.wide && !newAgainst(sides[0], h.line, h.end)) continue;
        report.block('names', `${shown}:${h.line}`, describeName(h));
        for (let l = h.line; l <= h.end; l++) refused.add(l);
      }
    }
    if (!read.wide && !inPath.length) read.text.split('\n').forEach((text, i) => { if (!refused.has(i + 1) && newAgainst(sides[0], i + 1)) nounLines.push({ path, line: i + 1, text }); });
  }
  const nounsFile = join(HERE, 'lexicon', 'proper-nouns.txt');
  const known = existsSync(nounsFile) ? parseNouns(readFileSync(nounsFile, 'utf8')) : new Set();
  const fresh = newProperNouns(nounLines, known);
  if (fresh.length) report.note(`proper-nouns (advisory, never blocks): new capitalised words for a glance: ${fresh.slice(0, 20).map((x) => `${x.word} (${x.where})`).join(', ')}${fresh.length > 20 ? `, and ${fresh.length - 20} more` : ''}. A real name of the family goes into rails/lexicon/proper-nouns.txt; a private one comes out of the text.`);
  return report.print('staged');
}

function message(file) {
  const report = new Report();
  const scanner = names(report, false);
  scanMessage(report, readFileSync(file, 'utf8'), scanner, 'message');
  return report.print('message');
}

function range(args) {
  const report = new Report();
  const requireKey = args.includes('--require-key');
  const at = args.indexOf('--remote');
  const pos = args.filter((a, i) => !a.startsWith('--') && i !== at + (at < 0 ? 0 : 1));
  if (args.includes('--stdin') ? pos.length !== 0 : pos.length !== 2) { process.stderr.write('usage: node rails/run.mjs range <base> <head> [--tree] [--require-key] [--remote <url>] | range --stdin [--require-key] [--remote <url>]\n'); return 2; }
  if (!inRepository()) return unread('range', NO_REPOSITORY);
  let scanner;
  if (at >= 0 && !isCanonicalRemote(args[at + 1])) {
    // A push to any other remote (a contributor's fork) is let through; the canonical repository is the one that must never see an unscanned commit.
    const s = namesState();
    scanner = s.state === 'ready' ? s.scanner : null;
    if (!scanner) report.note('this push is unscanned for private names: this machine cannot run the scan, and the maintainer scans a pull request\'s commits with the key before merging it, and CI scans every push to the canonical repository.');
  } else scanner = names(report, requireKey);
  if (graftsInForce()) return unread('range', GRAFTS);
  const todo = [];
  if (args.includes('--stdin')) {
    for (const line of readFileSync(0, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      const [localRef, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
      if (!localSha || !remoteSha) return unread('range', 'a line of the push is not "<local ref> <local commit> <remote ref> <remote commit>"');
      if (localSha === ZERO) continue;
      const name = (remoteRef || localRef || '').replace(/^refs\/(heads|tags)\//, '');
      // A ref whose name carries a name is refused without printing it, by any rail.
      const inRef = scanner ? scanner.scanName(name) : [];
      if (inRef.length) report.block('names', "a pushed ref's name (not printed)", describeName(inRef[0]));
      else for (const f of scanBranch(name)) report.block('messages', `ref ${name}`, f.message);
      const head = scanTags(report, localSha, scanner);
      if (!head) return unread('range', 'a pushed object is not a commit, or a tag of one, that can be read here');
      // A remote commit that is not in this repository excludes nothing: the whole history of the pushed commit is read.
      todo.push([head, remoteSha !== ZERO && resolve(`${remoteSha}^{commit}`) ? [remoteSha] : []]);
    }
    if (!todo.length && !report.blocking.length) {
      for (const n of report.notes) process.stderr.write(`${n}\n`);
      process.stderr.write('rails range: the push carries no commit and no tag; nothing to scan.\n');
      return 0;
    }
  } else {
    const [base, to] = [pos[0] && pos[0] !== ZERO ? pos[0] : '', pos[1]];
    for (const ref of [base, to]) if (ref && !resolve(`${ref}^{commit}`)) return unread('range', `${ref} is not a commit of this repository`);
    todo.push([scanTags(report, resolve(to), scanner), base ? [base] : []]);
  }
  const seen = new Set();
  for (const [head, not] of todo) {
    for (const sha of commitsOf(head, not)) {
      if (seen.has(sha)) continue;
      seen.add(sha);
      scanCommit(report, sha, scanner);
    }
    if (args.includes('--tree')) scanTree(report, head, scanner);
  }
  return report.print(`range (${seen.size} commit${seen.size === 1 ? '' : 's'})`);
}

function tree(args) {
  const report = new Report();
  if (!inRepository()) return unread('tree', NO_REPOSITORY);
  scanTree(report, 'HEAD', names(report, args.includes('--require-key')));
  return report.print('tree');
}

function history(args) {
  const report = new Report();
  if (!inRepository()) return unread('history', NO_REPOSITORY);
  const scanner = names(report, args.includes('--require-key'));
  if (graftsInForce()) return unread('history', GRAFTS);
  const all = git(['rev-list', '--all', '--reverse']).split('\n').filter(Boolean);
  for (const sha of all) scanCommit(report, sha, scanner);
  // Every tag object a ref names, and each one it points at in turn.
  for (const line of git(['for-each-ref', '--format=%(objecttype) %(objectname)']).split('\n')) if (line.startsWith('tag ')) scanTags(report, line.slice(4), scanner);
  return report.print(`history (${all.length} commits)`);
}

function command(cmd, rest) {
  if (cmd === 'staged') return staged();
  if (cmd === 'message') return message(rest[0]);
  if (cmd === 'range') return range(rest);
  if (cmd === 'tree') return tree(rest);
  if (cmd === 'history') return history(rest);
  return null;
}

export function main(argv) {
  const [cmd, ...rest] = argv;
  let code;
  // A scan that git cannot finish is never a pass: the first line of the failure is printed and the exit code is 2.
  try { code = command(cmd, rest); } catch (e) { return unread(cmd, `it could not be read (${String(e.message).split('\n')[0]})`); }
  if (code !== null) return code;
  process.stdout.write('usage: node rails/run.mjs staged | message <file> | range <base> <head> [--tree] [--require-key] [--remote <url>] | range --stdin [--require-key] [--remote <url>] | tree [--require-key] | history [--require-key]\n');
  return cmd ? 2 : 0;
}

if (runDirectly(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
