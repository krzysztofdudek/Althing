// The hook and CI entry point for the rails that need git history or a secret,
// and the leak gate before anything leaves the machine.
//
//   node rails/run.mjs staged                     pre-commit: names over the staged lines, loop placement, the proper-noun glance
//   node rails/run.mjs message <file>             commit-msg: the message rail and the names scan over the message
//   node rails/run.mjs range <base> <head> [--tree] [--require-key]
//   node rails/run.mjs range --stdin --require-key
//                                                 pre-push and CI: every commit in the range (a zero base means the whole
//                                                 history of head): its message, its branch name, and the English, path,
//                                                 secret, binary and names rails over every line it adds; --tree adds a
//                                                 full scan of the tree at head
//   node rails/run.mjs tree [--require-key]       every tracked file at HEAD
//   node rails/run.mjs history [--require-key]    every commit reachable from any ref (nightly)
//
// It reads the repository of the current working directory and the digests
// next to this file, so CI can run the scanner from the base commit's checkout
// against a pull request's tree.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { git, tryGit, ZERO, addedLines, changedFiles, binaryPaths, commitsIn } from './git.mjs';
import { scanEnglish, describe } from './english.mjs';
import { scanPaths, describePath } from './paths.mjs';
import { scanSecrets, describeSecret } from './secrets.mjs';
import { scanBinary, describeBinary, hasNul } from './binaries.mjs';
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
  block(rail, where, message) { this.blocking.push(`${rail}: ${where}: ${message}`); }
  note(text) { this.notes.push(text); }
  print(label) {
    for (const n of this.notes) process.stderr.write(`${n}\n`);
    for (const b of this.blocking) process.stderr.write(`${b}\n`);
    process.stderr.write(this.blocking.length ? `rails ${label}: ${this.blocking.length} refusal(s). The fix for each rail is in rails/README.md.\n` : `rails ${label}: clean.\n`);
    return this.blocking.length ? 1 : 0;
  }
}

function names(report, requireKey) {
  const s = namesState();
  if (s.state === 'ready') return s.scanner;
  if (requireKey) report.block('names', 'this machine', `${s.message} Nothing leaves the machine unscanned.`);
  else report.note(`${s.message} This commit is unscanned for private names.`);
  return null;
}

function loopPlacement(report, path, where) {
  if (/(^|\/)\.jarl\//.test(path) && !LOOP_PLACE.test(path)) report.block('loop/shape', where, 'a .jarl/ directory outside releases/<version>/: Althing has one loop per release directory and no other.');
}

// The content rails over one file version; `added` limits findings to those
// lines (null: every line). `isNew` adds the checks on the file's own name.
function scanContent(report, { path, text, added, isNew, scanner, where }) {
  const keep = (line) => (line === 0 ? isNew : !added || added.has(line));
  const at = (line) => `${where ? `${where} ` : ''}${path}:${line}`;
  if (scanner) for (const h of scanner.scanName(path)) if (isNew) report.block('names', at(0), describeName(h));
  const binary = scanBinary(path, text);
  if (binary) { if (isNew || !added || added.size) report.block('boundary/no-binaries', at(1), describeBinary(binary)); return; }
  if (scanner) for (const h of scanner.scan(text, path)) if (keep(h.line)) report.block('names', at(h.line), describeName(h));
  if (!any(NOT_ENGLISH, path)) for (const f of scanEnglish(text, path)) if (keep(f.line)) report.block('lang/english', at(f.line), describe(f));
  if (!any(DATA, path)) {
    for (const f of scanPaths(text, path)) if (keep(f.line)) report.block('boundary/no-private-paths', at(f.line), describePath(f));
    for (const f of scanSecrets(text)) if (keep(f.line)) report.block('secrets-range', at(f.line), describeSecret(f));
  }
}

function scanMessage(report, text, scanner, where) {
  for (const f of scanMessageRail(text)) report.block('messages', `${where}:${f.line}`, f.message);
  if (scanner) for (const h of scanner.scan(text, '')) report.block('names', `${where}:${h.line}`, describeName(h));
}

function scanCommit(report, sha, scanner) {
  const short = sha.slice(0, 12);
  scanMessage(report, git(['log', '-1', '--format=%B', sha]), scanner, `commit ${short} message`);
  const added = addedLines(git(['diff-tree', '--root', '--no-commit-id', '-r', '-p', '-U0', '-M', '--no-color', sha]));
  const binaries = binaryPaths(sha);
  for (const { status, path } of changedFiles(sha)) {
    if (status === 'D') continue;
    loopPlacement(report, path, `commit ${short} ${path}`);
    const isNew = status === 'A' || status === 'R' || status === 'C';
    if (binaries.has(path)) { report.block('boundary/no-binaries', `commit ${short} ${path}`, describeBinary(scanBinary(path, '') || 'binary content')); continue; }
    const text = tryGit(['show', `${sha}:${path}`]);
    if (text === null) continue;
    scanContent(report, { path, text, added: added.get(path) || new Map(), isNew, scanner, where: `commit ${short}` });
  }
}

function scanTree(report, ref, scanner) {
  const files = git(['ls-tree', '-r', '-z', '--name-only', ref]).split('\0').filter(Boolean);
  for (const path of files) {
    loopPlacement(report, path, `${ref} ${path}`);
    const buf = git(['show', `${ref}:${path}`], { buffer: true });
    const text = buf.includes(0) ? '\u0000' : buf.toString('utf8');
    scanContent(report, { path, text, added: null, isNew: true, scanner, where: ref });
  }
}

function staged() {
  const report = new Report();
  const scanner = names(report, false);
  const diff = git(['diff', '--cached', '-U0', '-M', '--no-color', '--diff-filter=ACMR']);
  const added = addedLines(diff);
  const status = git(['diff', '--cached', '-z', '--name-status', '-M', '--diff-filter=ACMR']).split('\0').filter(Boolean);
  const nounLines = [];
  for (let i = 0; i < status.length; i++) {
    const st = status[i];
    const path = /^[RC]/.test(st) ? status[(i += 2)] : status[++i];
    loopPlacement(report, path, path);
    const lines = added.get(path) || new Map();
    for (const [n, text] of lines) nounLines.push({ path, line: n, text });
    if (!scanner) continue;
    const isNew = st[0] !== 'M';
    for (const h of scanner.scanName(path)) if (isNew) report.block('names', path, describeName(h));
    const text = tryGit(['show', `:${path}`]);
    if (text === null || hasNul(text)) continue;
    for (const h of scanner.scan(text, path)) if (lines.has(h.line)) report.block('names', `${path}:${h.line}`, describeName(h));
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
  const scanner = names(report, requireKey);
  const pairs = [];
  if (args.includes('--stdin')) {
    const input = readFileSync(0, 'utf8');
    for (const line of input.split('\n')) {
      const [localRef, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
      if (!localSha || localSha === ZERO) continue;
      const name = (remoteRef || localRef || '').replace(/^refs\/(heads|tags)\//, '');
      for (const f of scanBranch(name)) report.block('messages', `ref ${name}`, f.message);
      if (scanner) for (const h of scanner.scanName(name)) report.block('names', `ref ${name}`, describeName(h));
      pairs.push([remoteSha && tryGit(['cat-file', '-e', `${remoteSha}^{commit}`]) !== null ? remoteSha : ZERO, localSha]);
    }
  } else {
    const pos = args.filter((a) => !a.startsWith('--'));
    if (pos.length !== 2) { process.stderr.write('usage: node rails/run.mjs range <base> <head> [--tree] [--require-key] | range --stdin [--require-key]\n'); return 2; }
    pairs.push([pos[0] || ZERO, pos[1]]);
  }
  const seen = new Set();
  for (const [base, head] of pairs) {
    for (const sha of commitsIn(base, head)) {
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
  scanTree(report, 'HEAD', names(report, args.includes('--require-key')));
  return report.print('tree');
}

function history(args) {
  const report = new Report();
  const scanner = names(report, args.includes('--require-key'));
  const all = (tryGit(['rev-list', '--all', '--reverse']) || '').split('\n').filter(Boolean);
  for (const sha of all) scanCommit(report, sha, scanner);
  return report.print(`history (${all.length} commits)`);
}

export function main(argv) {
  const [cmd, ...rest] = argv;
  if (cmd === 'staged') return staged();
  if (cmd === 'message') return message(rest[0]);
  if (cmd === 'range') return range(rest);
  if (cmd === 'tree') return tree(rest);
  if (cmd === 'history') return history(rest);
  process.stdout.write('usage: node rails/run.mjs staged | message <file> | range <base> <head> [--tree] [--require-key] | range --stdin [--require-key] | tree [--require-key] | history [--require-key]\n');
  return cmd ? 2 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  process.exitCode = main(process.argv.slice(2));
}
