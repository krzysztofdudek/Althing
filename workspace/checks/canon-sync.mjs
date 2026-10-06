// The canon drift check (ws check canon-sync). family/canon.md is the one
// place the family's wording is authored. Every core tool and add-on in
// family/registry.json copies the canon's block, between the
// <!-- CANON:FAMILY-SECTION:START --> and END markers, into its README's
// "## The Yggdrasil family" section, verbatim except for the self-reference
// convention: a README's own name loses its link everywhere and gains
// " (this one)" where it is the first cell of a table row. The README's
// headline (the first bold line after its "# " heading) is the one the canon's
// per-repository section records for it. This check derives each README's
// expected section from the canon, compares it and the headline with the
// README, and names the repository and the line where they part.
//
// It reads each README from a committed ref, never from a working tree:
//   repos    repos/<name>, the workspace's read-only clone (origin/<ref>, else <ref>)
//   local    the sibling checkout ws.local.json names for the repository
//   github   https://raw.githubusercontent.com/<owner>/<repo>/<ref>/README.md
// Without --source, a repository with a clone in repos/ is read there and any
// other from GitHub. The ref is main unless --ref says otherwise, for every
// repository (--ref <ref>) or one (--ref <name>=<ref>).

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CANON_START, CANON_END } from '../../rails/canon.mjs';
import { spawnSync } from 'node:child_process';
import { loadLocal, sourcePath } from '../lib/local.mjs';

export const CANON_FILE = 'family/canon.md';
export const REGISTRY_FILE = 'family/registry.json';
export const SECTION_HEADING = '## The Yggdrasil family';
export const SOURCES = ['repos', 'local', 'github'];
const DEFAULT_REF = 'main';
const FETCH_TIMEOUT_MS = 20000;

// The repositories that carry the family section: the registry's core and add-ons.
export function familyMembers(registry) {
  return Object.entries((registry && registry.repos) || {})
    .filter(([, r]) => r.kind === 'core' || r.kind === 'add-on')
    .map(([name, r]) => ({ name, display: r.display || name, github: r.github, url: `https://github.com/${r.github}` }));
}

// Trailing spaces and tabs are never a difference; nothing else is normalised
// (no quote, dash or Unicode folding).
function rstripLines(text) {
  return text.split('\n').map((l) => l.replace(/[ \t]+$/, ''));
}

// The block between the markers, with the one newline after the start marker
// and the one before the end marker dropped.
export function extractBlock(canonText) {
  const a = canonText.indexOf(CANON_START);
  const b = canonText.indexOf(CANON_END);
  if (a < 0 || b < a) return null;
  let block = canonText.slice(a + CANON_START.length, b);
  if (block.startsWith('\n')) block = block.slice(1);
  if (block.endsWith('\n')) block = block.slice(0, -1);
  return block;
}

// The canon's per-repository section records each headline on a line that
// starts: **<Name>.** Headline: "**…**"
export function canonHeadlines(canonText) {
  const out = new Map();
  for (const m of canonText.matchAll(/^\*\*([^*\n]+?)\.\*\* Headline: "(\*\*[^"\n]*?\*\*)"/gm)) out.set(m[1], m[2]);
  return out;
}

// The block as one repository's README carries it.
export function expectedFor(block, { display, url }) {
  const linked = `**[${display}](${url})**`;
  return block.split(`| ${linked} |`).join(`| **${display}** (this one) |`).split(linked).join(`**${display}**`);
}

// The README's family section: the lines strictly between the heading and the
// first of the next "## " heading, a bare "---" rule or the end of the file,
// with the blank lines at either end dropped. null when there is no heading.
export function readmeSection(text) {
  const lines = text.split('\n');
  const h = lines.findIndex((l) => l.trim() === SECTION_HEADING);
  if (h < 0) return null;
  let end = lines.length;
  for (let i = h + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t.startsWith('## ') || t === '---') { end = i; break; }
  }
  let start = h + 1;
  while (start < end && lines[start].trim() === '') start++;
  while (end > start && lines[end - 1].trim() === '') end--;
  return { lines: lines.slice(start, end), startLine: start + 1 };
}

// The headline: on the first line after the README's "# " heading that starts
// with "**", from that "**" to the next one.
export function readmeHeadline(text) {
  const lines = text.split('\n');
  const h = lines.findIndex((l) => /^# /.test(l));
  if (h < 0) return null;
  for (let i = h + 1; i < lines.length; i++) {
    if (!lines[i].startsWith('**')) continue;
    const close = lines[i].indexOf('**', 2);
    if (close < 0) continue;
    return { text: lines[i].slice(0, close + 2), line: i + 1 };
  }
  return null;
}

// Where two lines part, as text a reader can scan: a short line whole, a long
// one as a window around the first character that differs.
const WINDOW = 70;
export function describeDifference(expected, actual) {
  if (expected === null || actual === null || Math.max(expected.length, actual.length) <= 2 * WINDOW) {
    return `\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`;
  }
  let col = 0;
  while (col < expected.length && col < actual.length && expected[col] === actual[col]) col++;
  const cut = (s) => `${col > WINDOW ? '…' : ''}${s.slice(Math.max(0, col - WINDOW), col + WINDOW)}${s.length > col + WINDOW ? '…' : ''}`;
  return ` at column ${col + 1}\n    expected: ${JSON.stringify(cut(expected))}\n    actual:   ${JSON.stringify(cut(actual))}`;
}

function firstDifference(expected, actual) {
  for (let i = 0; i < Math.max(expected.length, actual.length); i++) {
    const e = expected[i] ?? null;
    const a = actual[i] ?? null;
    if (e !== a) return { index: i, expected: e, actual: a };
  }
  return null;
}

// compare({ canonText, registry, readmes }) -> violations
//   readmes: { <registry name>: { text, where } | { error, where } }
// Each violation is { repo, kind, message }; repo is null for the canon itself.
export function compare({ canonText, registry, readmes }) {
  const out = [];
  const block = extractBlock(canonText);
  if (block === null) return [{ repo: null, kind: 'canon-block-missing', message: `${CANON_FILE} has no block between ${CANON_START} and ${CANON_END}` }];
  const expectedBlock = rstripLines(block).join('\n');
  const headlines = canonHeadlines(canonText);
  for (const m of familyMembers(registry)) {
    const wanted = headlines.get(m.display);
    if (!wanted) out.push({ repo: m.display, kind: 'headline-unrecorded', message: `${CANON_FILE} records no headline for ${m.display} (a line starting **${m.display}.** Headline: "**…**" in its per-repository section)` });
    const r = readmes[m.name];
    if (!r || r.error) {
      out.push({ repo: m.display, kind: 'readme-unread', message: `${m.display}'s README could not be read${r && r.where ? ` from ${r.where}` : ''}: ${r ? r.error : 'no source'}` });
      continue;
    }
    const file = `${m.display}/README.md`;
    const section = readmeSection(r.text);
    if (!section) out.push({ repo: m.display, kind: 'section-missing', message: `${file} (${r.where}) has no "${SECTION_HEADING}" section` });
    else {
      const d = firstDifference(rstripLines(expectedFor(expectedBlock, m)), rstripLines(section.lines.join('\n')));
      if (d) out.push({ repo: m.display, kind: 'section-drift', message: `${file}:${section.startLine + d.index} (${r.where}) differs from the canon${describeDifference(d.expected, d.actual)}` });
    }
    if (!wanted) continue;
    const head = readmeHeadline(r.text);
    if (!head) out.push({ repo: m.display, kind: 'headline-missing', message: `${file} (${r.where}) has no headline (a bold line after its "# " heading)` });
    else if (head.text !== wanted) out.push({ repo: m.display, kind: 'headline-drift', message: `${file}:${head.line} (${r.where}) headline differs from the canon\n    expected: ${JSON.stringify(wanted)}\n    actual:   ${JSON.stringify(head.text)}` });
  }
  return out;
}

// A ref as a raw GitHub URL names it: a commit as it is, a full ref name as it
// is, anything else as a branch.
export function rawUrl(github, ref) {
  const r = /^[0-9a-f]{7,40}$/.test(ref) || ref.startsWith('refs/') ? ref : `refs/heads/${ref}`;
  return `https://raw.githubusercontent.com/${github}/${r}/README.md`;
}

// git show, untrimmed: the README's own first and last lines decide its line numbers.
function showReadme(dir, refs) {
  let last = null;
  for (const ref of refs) {
    const r = spawnSync('git', ['-C', dir, 'show', `${ref}:README.md`], { encoding: 'utf8', timeout: 30000, maxBuffer: 1 << 26 });
    if (r.status === 0) return { text: r.stdout, ref };
    last = (r.error ? r.error.message : r.stderr || '').trim().split('\n')[0];
  }
  return { error: last || 'git show failed' };
}

// readReadmes(root, registry, { source, refs, fetchImpl, timeoutMs }) -> { <name>: { text, where } | { error, where } }
export async function readReadmes(root, registry, { source = null, refs = {}, fetchImpl = globalThis.fetch, timeoutMs = FETCH_TIMEOUT_MS } = {}) {
  if (source && !SOURCES.includes(source)) throw new Error(`--source is one of ${SOURCES.join(', ')}`);
  const members = familyMembers(registry);
  for (const k of Object.keys(refs)) if (k !== '*' && !members.some((m) => m.name === k)) throw new Error(`--ref ${k}=…: "${k}" is not a core tool or add-on in ${REGISTRY_FILE} (${members.map((m) => m.name).join(', ')})`);
  let local = null;
  const jobs = members.map(async (m) => {
    const ref = refs[m.name] || refs['*'] || DEFAULT_REF;
    const clone = join(root, 'repos', m.name);
    const from = source || (existsSync(join(clone, '.git')) ? 'repos' : 'github');
    if (from === 'repos') {
      const where = `repos/${m.name} at ${ref}`;
      if (!existsSync(join(clone, '.git'))) return [m.name, { error: 'no clone in repos/', where }];
      const r = showReadme(clone, [`origin/${ref}`, ref]);
      return [m.name, r.error ? { error: r.error, where } : { text: r.text, where: `repos/${m.name} at ${r.ref}` }];
    }
    if (from === 'local') {
      local = local || loadLocal(root);
      const dir = sourcePath(root, local, m.name);
      const where = `the sibling checkout at ${ref}`;
      if (!dir || !existsSync(join(dir, '.git'))) return [m.name, { error: `ws.local.json names no sibling checkout for ${m.name}`, where }];
      const r = showReadme(dir, [ref]);
      return [m.name, r.error ? { error: r.error, where } : { text: r.text, where }];
    }
    const url = rawUrl(m.github, ref);
    const where = `GitHub at ${ref}`;
    try {
      const res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
      if (!res.ok) return [m.name, { error: `${url} answered ${res.status}`, where }];
      return [m.name, { text: await res.text(), where }];
    } catch (e) {
      return [m.name, { error: `${url}: ${e.message}`, where }];
    }
  });
  return Object.fromEntries(await Promise.all(jobs));
}

// canonSync(root, options) -> { violations, members }
export async function canonSync(root, options = {}) {
  const canonPath = join(root, CANON_FILE);
  const registryPath = join(root, REGISTRY_FILE);
  if (!existsSync(canonPath)) throw new Error(`${CANON_FILE} does not exist`);
  if (!existsSync(registryPath)) throw new Error(`${REGISTRY_FILE} does not exist`);
  const canonText = readFileSync(canonPath, 'utf8');
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  const readmes = await readReadmes(root, registry, options);
  return { violations: compare({ canonText, registry, readmes }), members: familyMembers(registry), readmes };
}

// The command: ws check canon-sync [--source repos|local|github] [--ref <ref> | --ref <name>=<ref>]...
export async function command(root, args, { out = process.stdout, fetchImpl } = {}) {
  const a = [...args];
  let source = null;
  const refs = {};
  while (a.length) {
    const flag = a.shift();
    if (flag === '--source') source = a.shift();
    else if (flag === '--ref') {
      const v = String(a.shift() || '');
      const eq = v.indexOf('=');
      if (eq > 0) refs[v.slice(0, eq)] = v.slice(eq + 1); else refs['*'] = v;
    } else throw new Error(`unknown argument "${flag}"; usage: ws check canon-sync [--source ${SOURCES.join('|')}] [--ref <ref> | --ref <name>=<ref>]...`);
  }
  const { violations, members, readmes } = await canonSync(root, { source, refs, ...(fetchImpl ? { fetchImpl } : {}) });
  for (const m of members) if (readmes[m.name] && !readmes[m.name].error) out.write(`read ${m.display} from ${readmes[m.name].where}\n`);
  for (const v of violations) out.write(`[${v.repo || 'canon'}] ${v.kind}: ${v.message}\n`);
  if (!violations.length) { out.write(`canon-sync: ${members.length} READMEs match the canon.\n`); return 0; }
  const repos = new Set(violations.map((v) => v.repo));
  out.write(`canon-sync: ${violations.length} difference(s) in ${repos.size} of ${members.length} READMEs.\n`);
  return 1;
}
