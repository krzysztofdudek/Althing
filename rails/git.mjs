// Git plumbing for the hook rails: read-only, run in the repository of the
// current working directory. One reader serves Althing's own scans
// (rails/run.mjs) and the names range of another family repository
// (rails/names-range.mjs), so both read a commit, a tag, the index and a tree
// in the same way: as a push sends them.
//
// A commit and a tag are read from their own bytes, so no setting of the
// repository changes the text. A file is read by its blob, so no way of
// writing its name stands between the scan and its content. The lines a
// commit adds come from git's diff with --text and without the big file
// threshold, so no attribute and no setting hides them. A merge is read as an
// ordinary commit against each of its parents.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { isUtf8 } from 'node:buffer';
import { resolve as absolute } from 'node:path';
export const ZERO = '0000000000000000000000000000000000000000';

// A push sends each object as it is, so the rails read each object as it is: no replacement object of this machine stands in for one. A graft file is another matter: a push follows it when it picks what to send, and the rails do not, so they read nothing while one is in force (graftsInForce).
const AS_SENT = { GIT_NO_REPLACE_OBJECTS: '1' };

export function git(args, { cwd = process.cwd(), input, buffer = false, env = {} } = {}) {
  const out = execFileSync('git', args, { cwd, input, maxBuffer: 1 << 30, stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, ...env, ...AS_SENT } });
  return buffer ? out : out.toString('utf8');
}

export function tryGit(args, opts) {
  try { return git(args, opts); } catch { return null; }
}

const none = (id) => !id || /^0+$/.test(id);

// A graft file changes which commits and which files a push sends, and no scan here follows it, so nothing is read while one is in force: the repository's info/grafts, or the file GIT_GRAFT_FILE names. A file with no graft in it (empty, or comments alone) is not in force.
export function graftsInForce() {
  const common = (tryGit(['rev-parse', '--git-common-dir']) || '').trim();
  if (!common) return true;
  let text;
  try { text = readFileSync(process.env.GIT_GRAFT_FILE || absolute(common, 'info', 'grafts'), 'utf8'); } catch (e) { return e.code !== 'ENOENT' && e.code !== 'ENOTDIR'; }
  return text.split('\n').some((line) => line.trim() !== '' && !line.startsWith('#'));
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

// What a unified diff with zero context changes in each file's new version: `added` holds the added lines by number, and `seams` the line numbers after which lines were only removed, so that the two lines around the place now meet.
export function changedLines(diff) {
  const files = new Map();
  let cur = null;
  let n = 0;
  // A "+++ " line names a file only in a file's header, before its first hunk: inside a hunk it is an added line that begins "++ ".
  let header = true;
  for (const line of diff.split('\n')) {
    if (line.startsWith('diff --git ')) { header = true; cur = null; continue; }
    if (header && line.startsWith('+++ ')) {
      const path = diffPath(line.slice(4));
      cur = path === null ? null : files.get(path) || files.set(path, { added: new Map(), seams: new Set() }).get(path);
      continue;
    }
    const h = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (h) {
      n = Number(h[1]);
      header = false;
      if (cur && h[2] === '0') cur.seams.add(n);
      continue;
    }
    if (!cur || header) continue;
    if (line.startsWith('+')) { cur.added.set(n, line.slice(1)); n++; }
    else if (line.startsWith(' ')) n++;
  }
  return files;
}

// Added line numbers per file from a unified diff with zero context.
export function addedLines(diff) {
  return new Map([...changedLines(diff)].map(([path, c]) => [path, c.added]));
}

const UNCHANGED = { added: new Map(), seams: new Set() };

// Whether a finding that runs from line `from` to line `to` of a file's new version is new against one side: one of its lines is added, or lines were removed between two of them. A side of null stands for a file that was not there, where every line is new.
export function newAgainst(side, from, to = from) {
  if (!side) return true;
  for (let l = from; l <= to; l++) if (side.added.has(l)) return true;
  for (let l = from; l < to; l++) if (side.seams.has(l)) return true;
  return false;
}

// The text of a file, or null for a binary one. UTF-16 is read by its byte order mark, or without one when its NUL bytes sit on one side of nearly every pair, as they do in Latin text. `wide` says it was UTF-16.
export function textOf(buf) {
  const utf16 = (b, be) => { const even = Buffer.from(b.subarray(0, b.length & ~1)); return { text: (be ? even.swap16() : even).toString('utf16le'), wide: true }; };
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) return utf16(buf.subarray(2), false);
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) return utf16(buf.subarray(2), true);
  const head = buf.subarray(0, 8000);
  if (!head.includes(0)) return { text: buf.toString('utf8'), wide: false };
  let first = 0;
  let second = 0;
  const pairs = head.length >> 1;
  for (let i = 0; i + 1 < head.length; i += 2) { if (head[i] === 0) first++; if (head[i + 1] === 0) second++; }
  if (pairs >= 4 && second >= pairs * 0.6 && first <= pairs * 0.02) return utf16(buf, false);
  if (pairs >= 4 && first >= pairs * 0.6 && second <= pairs * 0.02) return utf16(buf, true);
  return null;
}

// A file's content is read when it is asked for (`read` on a file below), one file at a time, so a commit or a tree of many large files is never held in memory whole.
const blob = (id) => textOf(git(['cat-file', 'blob', id], { buffer: true }));

// Nothing in a repository's attributes or settings may hide added lines: --text reads a file marked binary or -diff, the threshold is lifted, and no outside diff program or text conversion runs.
const SEEN = ['-c', 'core.bigFileThreshold=1024g'];
const AS_TEXT = ['--no-color', '--text', '--no-ext-diff', '--no-textconv', '-U0'];

// What one blob changes over another, by git's diff of the two. No path takes part, so no attribute and no way of writing a name stands between the scan and the lines. Null when git cannot compare the two, which a caller reads as every line being new.
function changedOver(from, to) {
  if (from === to) return UNCHANGED;
  const diff = tryGit([...SEEN, 'diff', ...AS_TEXT, '--inter-hunk-context=0', from, to]);
  return diff === null ? null : [...changedLines(diff).values()][0] || UNCHANGED;
}

// The files a commit changes, with the blob each one holds: read by its id, so a name that is not valid UTF-8 never stands between the scan and the content.
function filesOf(sha, merge) {
  const parts = git(['diff-tree', '--no-commit-id', '-r', '-z', '--raw', '--no-abbrev', ...(merge ? ['-c'] : ['--root', '-M']), sha]).split('\0');
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const m = /^(:+)(.*)$/.exec(parts[i]);
    if (!m) continue;
    const n = m[1].length;
    const f = m[2].split(' ');
    const mode = f[n];
    const ids = f.slice(n + 1, 2 * n + 2);
    const status = f[2 * n + 2] || '';
    const path = !merge && /^[RC]/.test(status) ? parts[(i += 2)] : parts[++i];
    const id = ids[n];
    if (none(id)) continue;
    // A parent that holds a submodule at the path holds no file there: its id is a commit's, and stands as absent.
    out.push({ path, id, parents: ids.slice(0, n).map((x, k) => (f[k] === '160000' ? ZERO : x)), gitlink: mode === '160000', isNew: merge ? ids.slice(0, n).every(none) : /^[ARC]/.test(status) });
  }
  return out;
}

// The files of a commit that git sees as renamed from one parent: the path each has now, and the blob it was there.
function renamedFrom(parent, sha) {
  const parts = git(['diff-tree', '-r', '-M', '-z', '--raw', '--no-abbrev', '--diff-filter=R', parent, sha]).split('\0');
  const was = new Map();
  for (let i = 0; i + 2 < parts.length; i += 3) was.set(parts[i + 2], parts[i].split(' ')[2]);
  return was;
}

export function parentsOf(sha, opts) {
  return git(['rev-list', '--parents', '-1', sha], opts).trim().split(/\s+/).slice(1);
}

const NOT_UTF8 = 'its bytes are not UTF-8 and it declares no encoding that reads them, so its text cannot be read as git shows it. Write it again in UTF-8.';
const NO_DECODER = 'it declares an encoding this scan cannot decode, so its message, its author and its committer cannot be read as git shows them. Write the commit again in UTF-8.';

// Whether bytes are OpenPGP signature packets and nothing else: each packet's own length leads exactly to the next, and the last one ends the bytes.
function pgpSignature(b) {
  let i = 0;
  while (i < b.length) {
    const first = b[i++];
    let tag;
    let len;
    if ((first & 0xc0) === 0xc0) {
      tag = first & 0x3f;
      const o = b[i++];
      if (o < 192) len = o;
      else if (o < 224) len = ((o - 192) << 8) + b[i++] + 192;
      else if (o === 255) { len = b.readUInt32BE(i); i += 4; } else return false;
    } else if (first & 0x80) {
      tag = (first >> 2) & 0x0f;
      const kind = first & 3;
      if (kind === 0) len = b[i++];
      else if (kind === 1) { len = b.readUInt16BE(i); i += 2; } else if (kind === 2) { len = b.readUInt32BE(i); i += 4; } else return false;
    } else return false;
    if (tag !== 2 || !Number.isInteger(len)) return false;
    i += len;
  }
  return b.length > 0 && i === b.length;
}

// Whether bytes are an SSH signature and nothing else: its mark, its version, and five fields whose own lengths fill the rest exactly.
function sshSignature(b) {
  if (b.subarray(0, 6).toString('latin1') !== 'SSHSIG') return false;
  let i = 10;
  for (let field = 0; field < 5; field++) i += 4 + b.readUInt32BE(i);
  return i === b.length;
}

const SIGNATURES = { 'PGP SIGNATURE': pgpSignature, 'SSH SIGNATURE': sshSignature };

// The checksum an OpenPGP armor may close its encoded lines with (CRC-24, RFC 4880), as the four letters after its "=".
function armorChecksum(bytes) {
  let crc = 0xb704ce;
  for (const b of bytes) {
    crc ^= b << 16;
    for (let bit = 0; bit < 8; bit++) { crc <<= 1; if (crc & 0x1000000) crc ^= 0x1864cfb; }
  }
  return Buffer.from([(crc >> 16) & 255, (crc >> 8) & 255, crc & 255]).toString('base64');
}

// A signature is encoded bytes, and read as words its letters meet a short entry by chance. So the encoded lines of a signature's armor are left out of the text, in a commit's gpgsig header, in a tag a merge carries and at the end of a tag's message, and only when they are proved to be a signature: valid base64 whose bytes are OpenPGP signature packets or an SSH signature and nothing else, under the right checksum where the armor has one. Anything else between the armor's lines is read as text, and so are the armor's own lines (a comment among them). The lines keep their place, so line numbers hold.
export function withoutSignatures(text) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const open = /^(?:gpgsig(?:-sha256)? | )?-----BEGIN ([A-Z ]+)-----$/.exec(lines[i]);
    if (!open || !SIGNATURES[open[1]]) continue;
    const bare = (line) => line.replace(/^ /, '');
    let end = i + 1;
    while (end < lines.length && bare(lines[end]) !== `-----END ${open[1]}-----`) end++;
    if (end === lines.length) continue;
    // An armor may open with "Key: value" lines and a blank one; the encoded lines follow, and OpenPGP may close them with a checksum line.
    let from = i + 1;
    while (from < end && /^[A-Za-z][A-Za-z0-9-]*: /.test(bare(lines[from]))) from++;
    if (from < end && bare(lines[from]) === '') from++;
    let to = end;
    const checksum = open[1] === 'PGP SIGNATURE' && to - 1 > from && /^=[A-Za-z0-9+/]{4}$/.test(bare(lines[to - 1])) ? bare(lines[--to]).slice(1) : null;
    const encoded = lines.slice(from, to).map(bare);
    if (!encoded.length || !encoded.every((line) => /^[A-Za-z0-9+/]+={0,2}$/.test(line))) continue;
    const bytes = Buffer.from(encoded.join(''), 'base64');
    let proved = bytes.toString('base64') === encoded.join('') && (checksum === null || checksum === armorChecksum(bytes));
    try { proved = proved && SIGNATURES[open[1]](bytes); } catch { proved = false; }
    if (proved) for (let l = from; l < end; l++) lines[l] = '';
    i = end;
  }
  return lines.join('\n');
}

// A commit as its bytes read in UTF-8 and, when it declares another encoding, in that one too, which is how git and a host show it: { headers, message } of each reading, the last one as git shows it. The object itself is read, so no setting of the repository changes the text (git log follows i18n.logOutputEncoding). `unread` says why a commit's text cannot be read: an encoding that cannot be decoded here, or bytes that are neither UTF-8 nor in a declared encoding. A signature's encoded lines are left out of the headers.
function commitTexts(sha) {
  const bytes = git(['cat-file', 'commit', sha], { buffer: true });
  const parted = (text) => { const cut = text.indexOf('\n\n'); return cut < 0 ? { headers: withoutSignatures(text), message: '' } : { headers: withoutSignatures(text.slice(0, cut)), message: text.slice(cut + 2) }; };
  const texts = [parted(bytes.toString('utf8'))];
  const declared = (/^encoding (.+)$/m.exec(texts[0].headers) || [])[1];
  let decoder = null;
  if (declared) {
    try { decoder = new TextDecoder(declared.trim(), { fatal: true }); } catch { return { texts, unread: NO_DECODER }; }
  }
  if (!decoder || decoder.encoding === 'utf-8') return isUtf8(bytes) ? { texts } : { texts, unread: NOT_UTF8 };
  try { texts.push(parted(decoder.decode(bytes))); } catch { return { texts, unread: NOT_UTF8 }; }
  return { texts };
}

// One commit as a push sends it: the readings of its text, and each file it changes with the blob it holds now and what that blob changes over each parent's version. A file that is new against a parent has a side of null there. A submodule has no content to read.
export function readCommit(sha) {
  const { texts, unread } = commitTexts(sha);
  const commits = parentsOf(sha);
  const merge = commits.length > 1;
  const changed = merge ? null : changedLines(git([...SEEN, 'diff-tree', '--no-commit-id', '-r', ...AS_TEXT, '--root', '-p', '-M', sha]));
  const renames = commits.map(() => null);
  const files = filesOf(sha, merge).map(({ path, id, parents, gitlink, isNew }) => {
    if (gitlink) return { path, isNew, gitlink };
    // A merge is read as an ordinary commit against each parent: what it changes over that parent's version of the file, which may sit under another path there. In an ordinary commit the diff names each file by its path; a file whose content changed and that the diff does not name under that path counts as new, never as unchanged.
    const sides = merge
      ? parents.map((was, i) => { const from = none(was) ? (renames[i] ??= renamedFrom(commits[i], sha)).get(path) : was; return from ? changedOver(from, id) : null; })
      : [changed.get(path) || (parents[0] === id ? UNCHANGED : null)];
    return { path, id, isNew, gitlink, sides, get read() { return blob(id); } };
  });
  return { texts, unread, files };
}

// The files the index holds changed against HEAD, each with its blob and what it changes over the version HEAD holds (a side of null for a file that is new).
export function readStaged() {
  const parts = git(['diff', '--cached', '--raw', '-z', '--no-abbrev', '-M', '--diff-filter=ACMR']).split('\0');
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const m = /^:(\d+) (\d+) ([0-9a-f]+) ([0-9a-f]+) (\w)/.exec(parts[i]);
    if (!m) continue;
    const path = /[RC]/.test(m[5]) ? parts[(i += 2)] : parts[++i];
    const isNew = m[5] !== 'M' && m[5] !== 'T';
    if (m[2] === '160000') { out.push({ path, isNew, gitlink: true }); continue; }
    out.push({ path, id: m[4], isNew, gitlink: false, sides: [none(m[3]) || m[1] === '160000' ? null : changedOver(m[3], m[4])], get read() { return blob(m[4]); } });
  }
  return out;
}

// Every file of a tree, each with its blob: every line of it counts as new.
export function readTree(ref) {
  return git(['ls-tree', '-r', '-z', ref]).split('\0').filter(Boolean).map((entry) => {
    const tab = entry.indexOf('\t');
    const [, type, id] = entry.slice(0, tab).split(' ');
    const path = entry.slice(tab + 1);
    return type === 'blob' ? { path, id, isNew: true, gitlink: false, sides: [null], get read() { return blob(id); } } : { path, isNew: true, gitlink: true };
  });
}

export const typeOf = (id) => (tryGit(['cat-file', '-t', id]) || '').trim();
export const resolve = (ref) => (tryGit(['rev-parse', '--verify', '--quiet', '--end-of-options', ref]) || '').trim();

// An annotated tag is an object of its own: its name, its tagger and its message leave the machine with it. Returns { head, tags }: the commit the chain of tags ends in (null when it ends in anything else), and each tag object on the way with its text, a signature's encoded lines left out, and with `unread` when its bytes are not UTF-8: git writes no encoding into a tag, so its text can be read in no other.
export function throughTags(id) {
  const tags = [];
  for (let hops = 0; hops < 32; hops++) {
    const type = typeOf(id);
    if (type === 'commit') return { head: id, tags };
    if (type !== 'tag') break;
    const bytes = git(['cat-file', 'tag', id], { buffer: true });
    const text = withoutSignatures(bytes.toString('utf8'));
    const cut = text.indexOf('\n\n');
    tags.push({ id, text, message: cut < 0 ? '' : text.slice(cut + 2), unread: isUtf8(bytes) ? null : NOT_UTF8 });
    id = (/^object ([0-9a-f]+)$/m.exec(cut < 0 ? text : text.slice(0, cut)) || [])[1] || '';
  }
  return { head: null, tags };
}

// The commits of a range, oldest first: those `head` reaches and none of `not` does.
export function commitsOf(head, not = []) {
  return git(['rev-list', '--reverse', head, ...(not.length ? ['--not', ...not] : [])]).split('\n').filter(Boolean);
}
