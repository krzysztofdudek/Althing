// The keyed names rail. Althing names no client, no client project, system or
// person, no private server and no private repository. The list of those names
// is private: it lives only on the owner's machine (~/.config/althing/deny-list.txt).
// What is committed is rails/names/digests.json: an HMAC-SHA256 of every entry
// under a secret key, truncated to 128 bits and padded with random decoys to a
// fixed size, so the file reveals neither the names nor how many there are. A
// plain salted hash would fall to anyone hashing a list of company names.
//
// The key lives in ~/.config/althing/names.key (32 random bytes, hex), backed up
// by the owner, and as the CI secret ALTHING_NAMES_KEY on Althing only.
//
// Matching. Entries and text are folded the same way: Polish and other letters
// to ASCII (including the l with stroke, which Unicode does not decompose),
// lower case, split into tokens at every character that is not a letter or a
// digit (spaces, line breaks, "@", ".", apostrophes, hyphens, underscores,
// slashes) and at camelCase boundaries. An entry's digest is taken over its
// tokens joined by one space, and over the same tokens written together, so
// "Acme Corp", "acme-corp", "AcmeCorp", "acmecorp" and "acme.corp@example"
// all meet one entry. The scanner takes every window of one to four tokens
// inside a paragraph (a multi-word name may cross a line break) in both forms.
// Long hexadecimal or base64 runs are dropped before tokenising, and lockfiles
// are not read, so a short entry never collides with a hash. An entry flagged
// "cap" matches only where the text was capitalised (its first letter upper
// case, or all caps): it is for a name that is also an everyday word. A finding names the file, the line
// and the window size, never the entry.
//
// States: "not initialised" (no digests.json yet), "no key" (digests, but no
// key on this machine), "key mismatch", "ready". Only "ready" scans. Pre-commit
// says an unscanned commit is unscanned; pre-push and CI refuse anything but
// "ready", because an unscanned push is the one thing never allowed.

import { createHmac, randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync, chmodSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDirectly } from './direct.mjs';
import { fold } from './markdown.mjs';

export const SCHEMA = 'althing-names/1';
export const PAD = 512;
const KEY_CHECK = 'althing-names/key-check';
const MAX_WINDOW = 4;

export const DIGESTS_PATH = join(dirname(fileURLToPath(import.meta.url)), 'names', 'digests.json');
export const CONFIG_DIR = join(homedir(), '.config', 'althing');
export const KEY_PATH = join(CONFIG_DIR, 'names.key');
export const LIST_PATH = join(CONFIG_DIR, 'deny-list.txt');

const keyBuffers = new Map();
export function hmac(keyHex, text) {
  let k = keyBuffers.get(keyHex);
  if (!k) { k = Buffer.from(keyHex, 'hex'); keyBuffers.set(keyHex, k); }
  return createHmac('sha256', k).update(text, 'utf8').digest('hex').slice(0, 32);
}

// Long runs that look like hashes, keys or encoded blobs: 16 or more
// hexadecimal characters, or a base64 run of 24 or more characters holding
// upper case, lower case and at least two digits. A slug or a path is never
// such a run (it has hyphens, dots or slashes), so a name inside one is read.
const BLOB = /\b[0-9a-fA-F]{16,}\b|\b[A-Za-z0-9+]{24,}={0,2}/g;
function dropBlobs(text) {
  return text.replace(BLOB, (m) => {
    const hex = /^[0-9a-fA-F]+$/.test(m);
    const b64 = /[A-Z]/.test(m) && /[a-z]/.test(m) && (m.match(/\d/g) || []).length >= 2;
    return hex || b64 ? ' '.repeat(m.length) : m;
  });
}

// Tokens of a text with their line and whether they were capitalised.
export function tokenize(text) {
  const out = [];
  const lines = dropBlobs(text).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) { out.push({ break: true }); continue; }
    const re = /[\p{L}\p{M}\p{N}]+/gu;
    let m;
    while ((m = re.exec(lines[i])) !== null) {
      for (const part of m[0].split(/(?<=[\p{Ll}\p{N}])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}\p{Ll})/u)) {
        const t = fold(part).replace(/[^a-z0-9]/g, '');
        if (t) out.push({ t, line: i + 1, cap: /^\p{Lu}/u.test(part) });
      }
    }
  }
  return out;
}

// The digests of one entry: its tokens spaced and joined.
export function entryForms(entry) {
  const toks = tokenize(entry).filter((x) => !x.break).map((x) => x.t);
  if (!toks.length) return [];
  const spaced = toks.join(' ');
  const joined = toks.join('');
  return spaced === joined ? [spaced] : [spaced, joined];
}

// Deny-list file: one entry per line; a line starting with "#" is a comment;
// an entry may end with " | cap": it then matches only where the scanned text
// is capitalised (its first letter upper case, or all caps). Without the flag
// an entry matches in any case.
export function parseList(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = /^(.*?)\s*\|\s*cap\s*$/i.exec(line);
    out.push({ entry: (m ? m[1] : line).trim(), cap: Boolean(m) });
  }
  return out.filter((e) => e.entry);
}

export function buildDigests(keyHex, list, { pad = PAD, random = randomBytes } = {}) {
  const real = new Map();
  for (const { entry, cap } of list) {
    for (const form of entryForms(entry)) {
      const d = hmac(keyHex, form);
      if (!real.has(d) || !cap) real.set(d, cap ? 'cap' : '');
    }
  }
  const size = Math.max(pad, Math.ceil(real.size / pad) * pad);
  const entries = [...real].map(([d, f]) => ({ d, f }));
  const capShare = entries.length ? entries.filter((e) => e.f).length / entries.length : 0.25;
  while (entries.length < size) {
    const b = random(17);
    entries.push({ d: b.subarray(0, 16).toString('hex'), f: b[16] / 256 < Math.max(capShare, 0.1) ? 'cap' : '' });
  }
  entries.sort((a, b) => (a.d < b.d ? -1 : 1));
  return { schema: SCHEMA, keyCheck: hmac(keyHex, KEY_CHECK), entries };
}

export function readKey({ env = process.env, keyPath = KEY_PATH } = {}) {
  const fromEnv = (env.ALTHING_NAMES_KEY || '').trim();
  if (fromEnv) return fromEnv;
  if (existsSync(keyPath)) return readFileSync(keyPath, 'utf8').trim();
  return null;
}

// { state, message, scanner? }
export function namesState({ digestsPath = DIGESTS_PATH, env = process.env, keyPath = KEY_PATH } = {}) {
  if (!existsSync(digestsPath)) {
    return { state: 'not-initialised', message: 'names: not initialised: rails/names/digests.json does not exist yet, so no private name can be checked. The owner initialises it once (node rails/names.mjs init); until then commits are unscanned and every push is refused.' };
  }
  let doc;
  try { doc = JSON.parse(readFileSync(digestsPath, 'utf8')); } catch (e) { return { state: 'broken', message: `names: rails/names/digests.json does not parse (${e.message}).` }; }
  if (doc.schema !== SCHEMA || !Array.isArray(doc.entries)) return { state: 'broken', message: `names: rails/names/digests.json is not ${SCHEMA}.` };
  const key = readKey({ env, keyPath });
  if (!key) return { state: 'no-key', message: 'names: no key on this machine (~/.config/althing/names.key or ALTHING_NAMES_KEY); this machine cannot check private names. The key comes from the owner; never generate one here.' };
  if (!/^[0-9a-fA-F]{64}$/.test(key)) return { state: 'key-mismatch', message: 'names: the key is not 32 bytes of hex.' };
  if (hmac(key, KEY_CHECK) !== doc.keyCheck) return { state: 'key-mismatch', message: 'names: the key on this machine does not match rails/names/digests.json.' };
  return { state: 'ready', message: 'names: ready.', scanner: makeScanner(key, doc) };
}

const SKIP = [/(^|\/)package-lock\.json$/, /(^|\/)npm-shrinkwrap\.json$/, /(^|\/)pnpm-lock\.yaml$/, /\.lock$/, /(^|\/)rails\/names\/digests\.json$/, /^\.yggdrasil\/yg-lock\.[a-z]+\.json$/];
export function skippedForNames(path) {
  return SKIP.some((re) => re.test(path || ''));
}

export function makeScanner(keyHex, doc) {
  const table = new Map(doc.entries.map((e) => [e.d, e.f]));
  const hit = (toks) => {
    const forms = toks.length === 1 ? [toks[0].t] : [toks.map((x) => x.t).join(' '), toks.map((x) => x.t).join('')];
    for (const form of forms) {
      const f = table.get(hmac(keyHex, form));
      if (f === undefined) continue;
      if (f === 'cap' && !toks[0].cap) continue;
      return true;
    }
    return false;
  };
  const scanTokens = (tokens) => {
    const out = [];
    const seen = new Set();
    let para = [];
    const flush = () => {
      for (let i = 0; i < para.length; i++) {
        for (let w = 1; w <= MAX_WINDOW && i + w <= para.length; w++) {
          const win = para.slice(i, i + w);
          if (hit(win)) {
            const k = `${win[0].line}|${w}`;
            if (!seen.has(k)) { seen.add(k); out.push({ line: win[0].line, size: w }); }
          }
        }
      }
      para = [];
    };
    for (const t of tokens) { if (t.break) flush(); else para.push(t); }
    flush();
    return out;
  };
  return {
    // scan(text, path) -> [{ line, size }]; a skipped file yields nothing
    scan(text, path = '') {
      if (skippedForNames(path)) return [];
      return scanTokens(tokenize(text));
    },
    // a file name or a ref name: [{ line: 0, size }]
    scanName(name) {
      return scanTokens(tokenize(name)).map((x) => ({ ...x, line: 0 }));
    },
  };
}

export function describeName(f) {
  return `a name on the private deny-list (a ${f.size}-word window). Change the text: describe the thing without naming it. A deny-list hit is never allow-listed. If the text is already committed, stop and follow the leak response in method/boundary.md.`;
}

// ---- command line: the owner's machine only ------------------------------------

function repoRoot() {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}

function walk(p, out = []) {
  const st = statSync(p);
  if (st.isFile()) { out.push(p); return out; }
  for (const e of readdirSync(p)) { if (e === '.git' || e === 'node_modules') continue; walk(join(p, e), out); }
  return out;
}

function main(argv) {
  const [cmd, ...rest] = argv;
  const opt = (name, dflt) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : dflt; };
  if (cmd === 'status') {
    const s = namesState();
    process.stdout.write(`${s.message}\n`);
    return s.state === 'ready' ? 0 : 1;
  }
  if (cmd === 'init') {
    const listPath = opt('--list', LIST_PATH);
    const keyPath = opt('--key', KEY_PATH);
    const out = opt('--out', DIGESTS_PATH);
    if (!existsSync(listPath)) { process.stderr.write(`names init: no deny-list at ${listPath}. The owner writes it first, one name per line.\n`); return 1; }
    let key = existsSync(keyPath) ? readFileSync(keyPath, 'utf8').trim() : null;
    if (!key) {
      key = randomBytes(32).toString('hex');
      mkdirSync(dirname(keyPath), { recursive: true });
      writeFileSync(keyPath, `${key}\n`, { mode: 0o600 });
      chmodSync(keyPath, 0o600);
      process.stdout.write(`names init: a new key was written to ${keyPath}. Back it up in a password manager and set it as the CI secret ALTHING_NAMES_KEY.\n`);
    }
    const list = parseList(readFileSync(listPath, 'utf8'));
    const doc = buildDigests(key, list);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${JSON.stringify(doc, null, 1)}\n`);
    process.stdout.write(`names init: ${list.length} entries, ${doc.entries.length} digests written to ${relative(repoRoot(), out) || out}.\n`);
    process.stdout.write('names init: commit rails/names/digests.json together with the rails/names/ entry in the mapping of .yggdrasil/model/rails-data/yg-node.yaml.\n');
    return 0;
  }
  if (cmd === 'scan') {
    const s = namesState();
    if (s.state !== 'ready') { process.stderr.write(`${s.message}\n`); return 1; }
    let n = 0;
    for (const root of rest) {
      for (const f of walk(root)) {
        let text;
        try { text = readFileSync(f, 'utf8'); } catch { continue; }
        for (const h of [...s.scanner.scanName(f), ...s.scanner.scan(text, f)]) { n++; process.stdout.write(`${f}:${h.line} (${h.size}-word window)\n`); }
      }
    }
    process.stdout.write(`names scan: ${n} places\n`);
    return 0;
  }
  process.stdout.write('usage: node rails/names.mjs status | init [--list <file>] [--key <file>] | scan <path>...\n');
  return cmd ? 1 : 0;
}

if (runDirectly(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
