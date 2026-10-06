// Tests of ws check canon-sync. Most drive compare() over README texts built in
// code; the rest build a small Althing root with git repositories in repos/
// and a sibling checkout, or hand the check a stub for GitHub, so every source
// is exercised without the network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compare, canonSync, command, familyMembers, canonHeadlines, extractBlock, rawUrl, readmeSection } from '../checks/canon-sync.mjs';
import { CANON_START, CANON_END } from '../../rails/canon.mjs';
import { main } from '../ws.mjs';

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const g = (cwd, ...args) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', ...args], { cwd, stdio: 'pipe' }).toString().trim();

// A registry shaped like the real one: two core tools, one add-on, and shared
// code that carries no family section.
const REGISTRY = {
  schema: 'family-registry/1',
  repos: {
    lib: { display: 'Lib', github: 'acme/Lib', kind: 'shared', build: [] },
    law: { display: 'Law', github: 'acme/Law', kind: 'core', build: [] },
    loop: { display: 'Loop', github: 'acme/LoopSkill', kind: 'core', build: [] },
    lens: { display: 'Lens', github: 'acme/LensSkill', kind: 'add-on', build: [] },
  },
  retired: ['Gone'],
};
const MEMBERS = familyMembers(REGISTRY);
const M = Object.fromEntries(MEMBERS.map((m) => [m.name, m]));
const HEADLINES = { law: '**Say it once.**', loop: '**One loop, many hands.**', lens: '**See before you change.**' };

const bl = (m) => `**[${m.display}](${m.url})**`;

// A block with every shape the substitution meets: linked names in prose, a
// table whose first cell is a linked name, and bold unlinked names.
function block() {
  return [
    `${bl(M.loop)} is the loop. ${bl(M.law)} is the law — exactly. ${bl(M.lens)} looks.`,
    '',
    '| Where it hurts | Start with |',
    '|---|---|',
    '| Too many issues | **Loop** |',
    '',
    '| Core | What it holds |',
    '|---|---|',
    `| ${bl(M.loop)} | The loop. |`,
    `| ${bl(M.law)} | The law. |`,
    '',
    '| Add-on | Stage |',
    '|---|---|',
    `| ${bl(M.lens)} | intent → code |`,
  ].join('\n');
}

function canonText({ body = block(), headlines = HEADLINES, markers = true } = {}) {
  const lines = ['# The canon', '', 'Intro.', ''];
  if (markers) lines.push(CANON_START, body, CANON_END, '');
  lines.push('## Per repository', '');
  for (const [name, h] of Object.entries(headlines)) lines.push(`**${M[name].display}.** Headline: "${h}" Description: "Something." Topics: none.`, '');
  return lines.join('\n');
}

// Independent of the check's own substitution, so the fixture never simply
// agrees with the code under test.
function selfReference(text, m) {
  return text.split(`| ${bl(m)} |`).join(`| **${m.display}** (this one) |`).split(bl(m)).join(`**${m.display}**`);
}

function readme(name, { section = null, headline = null, footer = false, omitSection = false } = {}) {
  const m = M[name];
  const lines = ['<div align="center">', '', `# ${m.display}`, '', headline ?? HEADLINES[name], '', 'An intro paragraph that is not part of the family section.', ''];
  if (!omitSection) lines.push('## The Yggdrasil family', '', section ?? selfReference(block(), m), '');
  if (footer) lines.push('---', '', '<div align="center">A discussions badge, outside the family section</div>', '');
  else lines.push('## License', '', 'MIT', '');
  return lines.join('\n');
}

function readmes(over = {}) {
  const out = {};
  for (const name of ['law', 'loop', 'lens']) out[name] = over[name] === undefined ? { text: readme(name), where: 'test' } : over[name];
  return out;
}

const run = (over = {}, canon = canonText()) => compare({ canonText: canon, registry: REGISTRY, readmes: readmes(over) });

test('the canon and three matching READMEs: no difference', () => {
  assert.deepEqual(run(), []);
});

test('the READMEs checked are the registry\'s core and add-ons; shared code carries no family section', () => {
  assert.deepEqual(MEMBERS.map((m) => m.name), ['law', 'loop', 'lens']);
});

test('one changed line in one README is exactly one difference, naming the repository and its line', () => {
  const mutated = selfReference(block().replace('The law.', 'The law, mutated.'), M.law);
  const v = run({ law: { text: readme('law', { section: mutated }), where: 'test' } });
  assert.equal(v.length, 1);
  assert.equal(v[0].repo, 'Law');
  assert.equal(v[0].kind, 'section-drift');
  const line = readme('law', { section: mutated }).split('\n').findIndex((l) => l.includes('mutated')) + 1;
  assert.match(v[0].message, new RegExp(`^Law/README\\.md:${line} `));
});

test('a README\'s own unlinked name with "(this one)" is never drift, in prose or in a table', () => {
  for (const v of run()) assert.notEqual(v.kind, 'section-drift');
  const own = readme('loop');
  assert.match(own, /\| \*\*Loop\*\* \(this one\) \|/);
  assert.match(own, /^\*\*Loop\*\* is the loop\./m);
});

test('a README whose own row keeps its link instead of "(this one)" is drift', () => {
  const v = run({ lens: { text: readme('lens', { section: block() }), where: 'test' } });
  assert.deepEqual(v.map((x) => [x.repo, x.kind]), [['Lens', 'section-drift']]);
});

test('a footer after a --- rule is outside the section', () => {
  assert.deepEqual(run({ lens: { text: readme('lens', { footer: true }), where: 'test' } }), []);
});

test('a README with no family section is a difference naming the absence', () => {
  const v = run({ law: { text: readme('law', { omitSection: true }), where: 'test' } });
  assert.deepEqual(v.map((x) => [x.repo, x.kind]), [['Law', 'section-missing']]);
});

test('a canon without its markers is one refusal about the canon', () => {
  const v = run({}, canonText({ markers: false }));
  assert.deepEqual(v.map((x) => [x.repo, x.kind]), [[null, 'canon-block-missing']]);
});

test('a README that could not be read is a difference naming the repository, never a silent skip', () => {
  const v = run({ loop: { error: 'not found', where: 'repos/loop at main' } });
  assert.deepEqual(v.map((x) => [x.repo, x.kind]), [['Loop', 'readme-unread']]);
  assert.match(v[0].message, /repos\/loop at main: not found/);
});

test('a changed headline is a difference while the section still matches', () => {
  const v = run({ law: { text: readme('law', { headline: '**Say it twice, apparently.**' }), where: 'test' } });
  assert.deepEqual(v.map((x) => [x.repo, x.kind]), [['Law', 'headline-drift']]);
});

test('a member whose headline the canon does not record is named', () => {
  const v = run({}, canonText({ headlines: { law: HEADLINES.law, loop: HEADLINES.loop } }));
  assert.deepEqual(v.map((x) => [x.repo, x.kind]), [['Lens', 'headline-unrecorded']]);
});

test('trailing whitespace is not a difference', () => {
  const s = selfReference(block(), M.loop).split('\n').map((l, i) => (i === 0 ? `${l}   ` : l)).join('\n');
  assert.deepEqual(run({ loop: { text: readme('loop', { section: s }), where: 'test' } }), []);
});

test('quotes and dashes are compared exactly, never normalised', () => {
  const s = selfReference(block().replace('the law — exactly', 'the law - exactly'), M.law);
  const v = run({ law: { text: readme('law', { section: s }), where: 'test' } });
  assert.deepEqual(v.map((x) => [x.repo, x.kind]), [['Law', 'section-drift']]);
});

test('a long line that differs is shown as a window around the first difference, with its column', () => {
  const long = `${'word '.repeat(60)}end.`;
  const body = `${long}\n\n| ${bl(M.law)} | x |`;
  const canon = canonText({ body });
  const s = selfReference(body.replace('end.', 'end, changed.'), M.law);
  const v = compare({ canonText: canon, registry: REGISTRY, readmes: { ...readmes(), law: { text: readme('law', { section: s }), where: 'test' } } }).filter((x) => x.repo === 'Law');
  assert.equal(v.length, 1);
  assert.match(v[0].message, /at column 304/);
  assert.ok(v[0].message.length < 600, v[0].message);
});

test('readmeSection keeps the section strictly between its heading and the next heading', () => {
  const s = readmeSection(readme('law'));
  assert.equal(s.lines[0].startsWith('**[Loop]'), true);
  assert.equal(s.lines.at(-1), `| ${bl(M.lens)} | intent → code |`);
});

test('a raw GitHub URL names a branch as a branch, and a commit or a full ref as it is', () => {
  assert.equal(rawUrl('acme/Law', 'main'), 'https://raw.githubusercontent.com/acme/Law/refs/heads/main/README.md');
  assert.equal(rawUrl('acme/Law', 'release/6.2.0'), 'https://raw.githubusercontent.com/acme/Law/refs/heads/release/6.2.0/README.md');
  assert.equal(rawUrl('acme/Law', 'refs/tags/v1.0.0'), 'https://raw.githubusercontent.com/acme/Law/refs/tags/v1.0.0/README.md');
  assert.equal(rawUrl('acme/Law', 'a'.repeat(40)), `https://raw.githubusercontent.com/acme/Law/${'a'.repeat(40)}/README.md`);
});

// ---- the sources ------------------------------------------------------------------

function world() {
  const base = mkdtempSync(join(tmpdir(), 'althing-canon-'));
  const root = join(base, 'Althing');
  mkdirSync(join(root, 'family'), { recursive: true });
  writeFileSync(join(root, 'family', 'canon.md'), canonText());
  writeFileSync(join(root, 'family', 'registry.json'), JSON.stringify(REGISTRY, null, 2));
  return { base, root, cleanup: () => rmSync(base, { recursive: true, force: true }) };
}

function repoWith(dir, files) {
  mkdirSync(dir, { recursive: true });
  g(dir, 'init', '-q', '-b', 'main');
  for (const [p, t] of Object.entries(files)) writeFileSync(join(dir, p), t);
  g(dir, 'add', '.');
  g(dir, 'commit', '-q', '-m', 'readme');
}

const sink = () => { let s = ''; return { write: (x) => { s += x; }, text: () => s }; };

test('from repos/ clones: the committed README is read, never the working tree', async () => {
  const w = world();
  try {
    for (const name of ['law', 'loop', 'lens']) repoWith(join(w.root, 'repos', name), { 'README.md': readme(name) });
    writeFileSync(join(w.root, 'repos', 'law', 'README.md'), readme('law', { omitSection: true }));
    const r = await canonSync(w.root, {});
    assert.deepEqual(r.violations, []);
    assert.equal(r.readmes.law.where, 'repos/law at main');
  } finally { w.cleanup(); }
});

test('from repos/ clones, a ref per repository: the release branch is read where it is named', async () => {
  const w = world();
  try {
    for (const name of ['law', 'loop', 'lens']) repoWith(join(w.root, 'repos', name), { 'README.md': readme(name) });
    const law = join(w.root, 'repos', 'law');
    g(law, 'checkout', '-q', '-b', 'release/2.0.0');
    writeFileSync(join(law, 'README.md'), readme('law', { headline: '**Say it again.**' }));
    g(law, 'commit', '-q', '-am', 'drift on the release branch');
    g(law, 'checkout', '-q', 'main');
    assert.deepEqual((await canonSync(w.root, {})).violations, []);
    const v = (await canonSync(w.root, { refs: { law: 'release/2.0.0' } })).violations;
    assert.deepEqual(v.map((x) => [x.repo, x.kind]), [['Law', 'headline-drift']]);
  } finally { w.cleanup(); }
});

test('from sibling checkouts named in ws.local.json', async () => {
  const w = world();
  try {
    const sources = {};
    for (const name of ['law', 'loop', 'lens']) { repoWith(join(w.base, M[name].display), { 'README.md': readme(name) }); sources[name] = { path: `../${M[name].display}` }; }
    writeFileSync(join(w.root, 'ws.local.json'), JSON.stringify({ schema: 'ws-local/1', sources }));
    const r = await canonSync(w.root, { source: 'local' });
    assert.deepEqual(r.violations, []);
    delete sources.lens;
    writeFileSync(join(w.root, 'ws.local.json'), JSON.stringify({ schema: 'ws-local/1', sources }));
    const v = (await canonSync(w.root, { source: 'local' })).violations;
    assert.deepEqual(v.map((x) => [x.repo, x.kind]), [['Lens', 'readme-unread']]);
  } finally { w.cleanup(); }
});

test('from GitHub: each README at its raw URL, and an answer that is not 200 is a refusal naming the repository', async () => {
  const w = world();
  try {
    const asked = [];
    const fetchImpl = async (url) => {
      asked.push(url);
      const name = Object.values(M).find((m) => url.includes(`/${m.github}/`)).name;
      if (name === 'lens') return { ok: false, status: 404, text: async () => '' };
      return { ok: true, status: 200, text: async () => readme(name) };
    };
    const out = sink();
    const code = await command(w.root, ['--source', 'github'], { out, fetchImpl });
    assert.equal(code, 1);
    assert.deepEqual(asked.sort(), ['https://raw.githubusercontent.com/acme/Law/refs/heads/main/README.md', 'https://raw.githubusercontent.com/acme/LensSkill/refs/heads/main/README.md', 'https://raw.githubusercontent.com/acme/LoopSkill/refs/heads/main/README.md']);
    assert.match(out.text(), /\[Lens\] readme-unread: .*answered 404/);
    assert.match(out.text(), /canon-sync: 1 difference\(s\) in 1 of 3 READMEs\./);
  } finally { w.cleanup(); }
});

test('without --source, a repository with a clone is read there and the others from GitHub', async () => {
  const w = world();
  try {
    repoWith(join(w.root, 'repos', 'law'), { 'README.md': readme('law') });
    const fetchImpl = async (url) => ({ ok: true, status: 200, text: async () => readme(Object.values(M).find((m) => url.includes(`/${m.github}/`)).name) });
    const out = sink();
    assert.equal(await command(w.root, [], { out, fetchImpl }), 0);
    assert.match(out.text(), /read Law from repos\/law at main/);
    assert.match(out.text(), /read Loop from GitHub at main/);
    assert.match(out.text(), /canon-sync: 3 READMEs match the canon\./);
  } finally { w.cleanup(); }
});

test('ws check names its checks, and refuses an unknown one', async () => {
  assert.equal(await main(['check', 'no-such-check'], ROOT), 2);
  const w = world();
  try {
    assert.equal(await main(['check', 'canon-sync', '--source', 'nowhere'], w.root), 1);
    assert.equal(await main(['check', 'canon-sync', '--ref', 'lwa=main'], w.root), 1, 'a ref for a name the registry does not hold is refused, not ignored');
  } finally { w.cleanup(); }
});

test('the real canon records a headline for every core tool and add-on in the real registry, and has its block', () => {
  const canon = readFileSync(join(ROOT, 'family', 'canon.md'), 'utf8');
  const registry = JSON.parse(readFileSync(join(ROOT, 'family', 'registry.json'), 'utf8'));
  const heads = canonHeadlines(canon);
  for (const m of familyMembers(registry)) assert.ok(heads.get(m.display), `the canon records no headline for ${m.display}`);
  assert.ok(extractBlock(canon));
});
