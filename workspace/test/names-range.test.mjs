import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDigests, parseList } from '../../rails/names.mjs';
import { mergeAddedLines } from '../../rails/git.mjs';
import { isFamilyRemote } from '../../rails/names-range.mjs';

const ALTHING = fileURLToPath(new URL('../..', import.meta.url));
const HOOK = join(ALTHING, 'workspace', 'hooks', 'pre-push');
const ZERO = '0'.repeat(40);

// An invented list under a test key: the real key and the real list never enter a test.
const KEY = '5a'.repeat(32);
const WORD = ['Quill', 'mark'].join('');
const PAIR = ['Bexley', 'Oaks'];
const LIST = `${WORD}\n${PAIR.join(' ')}\n`;

const g = (cwd, ...args) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', ...args], { cwd, stdio: 'pipe' }).toString().trim();

let base;
let althing;
let n = 0;

// A copy of Althing's code with digests of the invented list, as a maintainer's checkout would hold the real ones.
before(() => {
  base = mkdtempSync(join(tmpdir(), 'althing-names-range-'));
  althing = join(base, 'Althing');
  mkdirSync(join(althing, 'family'), { recursive: true });
  cpSync(join(ALTHING, 'package.json'), join(althing, 'package.json'));
  cpSync(join(ALTHING, 'family', 'registry.json'), join(althing, 'family', 'registry.json'));
  cpSync(join(ALTHING, 'workspace'), join(althing, 'workspace'), { recursive: true });
  cpSync(join(ALTHING, 'rails'), join(althing, 'rails'), { recursive: true, filter: (src) => !/\/rails\/(names|test)$/.test(src) });
  mkdirSync(join(althing, 'rails', 'names'));
  writeFileSync(join(althing, 'rails', 'names', 'digests.json'), JSON.stringify(buildDigests(KEY, parseList(LIST))));
});
after(() => rmSync(base, { recursive: true, force: true }));

function tool(parent = base) {
  const dir = join(parent, `Tool${++n}`);
  mkdirSync(dir, { recursive: true });
  g(dir, 'init', '-q', '-b', 'main');
  writeFileSync(join(dir, 'README.md'), '# A tool\n\nIt does one thing.\n');
  g(dir, 'add', '.');
  g(dir, 'commit', '-q', '-m', 'tool: the first commit');
  return dir;
}

function commit(dir, files, message) {
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), text);
  }
  g(dir, 'add', '.');
  g(dir, 'commit', '-q', '-m', message);
  return g(dir, 'rev-parse', 'HEAD');
}

const env = (extra = {}) => {
  const e = { ...process.env, HOME: join(base, 'home'), ...extra };
  for (const k of ['ALTHING_NAMES_KEY', 'ALTHING_ROOT', 'GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) if (!(k in extra)) delete e[k];
  return e;
};

function ws(args, { key = KEY, input, cwd = base } = {}) {
  const r = spawnSync('node', [join(althing, 'workspace', 'ws.mjs'), 'names', ...args], { cwd, input, encoding: 'utf8', env: env(key ? { ALTHING_NAMES_KEY: key } : {}) });
  return { status: r.status, text: `${r.stdout}${r.stderr}` };
}

function hook(dir, url, input, { key = KEY, root = althing } = {}) {
  const extra = {};
  if (key) extra.ALTHING_NAMES_KEY = key;
  if (root) extra.ALTHING_ROOT = root;
  const r = spawnSync('sh', [HOOK, 'origin', url], { cwd: dir, input, encoding: 'utf8', env: env(extra) });
  return { status: r.status, text: `${r.stdout}${r.stderr}` };
}

const silent = (text) => {
  const low = text.toLowerCase();
  for (const w of [WORD, ...PAIR]) assert.ok(!low.includes(w.toLowerCase()), 'the output never carries the name');
};

test('a planted name in a file and in a commit message is refused with the file, the line and the commit, and never printed', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  const inFile = commit(dir, { 'docs/notes.md': `# Notes\n\nA line.\nWe met ${WORD} on site.\n` }, 'docs: the notes');
  const inMessage = commit(dir, { 'docs/more.md': 'More.\n' }, `docs: more\n\nAsked for by ${PAIR.join(' ')}.`);
  const r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`names: commit ${inFile.slice(0, 12)} docs/notes\\.md:4: `));
  assert.match(r.text, new RegExp(`names: commit ${inMessage.slice(0, 12)} message:3: `));
  assert.match(r.text, /2 commits\): 2 refusal/);
  silent(r.text);
});

test('a clean range passes, and a name removed again later is still refused', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  commit(dir, { 'a.md': 'Plain text.\n' }, 'docs: plain');
  const clean = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(clean.status, 0, clean.text);
  assert.match(clean.text, /names range \(1 commit\): clean/);
  const mid = g(dir, 'rev-parse', 'HEAD');
  const bad = commit(dir, { 'a.md': `Plain text.\nFrom ${WORD.toUpperCase()}.\n` }, 'docs: a line');
  commit(dir, { 'a.md': 'Plain text.\n' }, 'docs: the line goes');
  const r = ws(['--dir', dir, mid, 'HEAD']);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${bad.slice(0, 12)} a\\.md:2`));
  silent(r.text);
});

test('a name in a path, a ref, an author or a merge resolution is refused, and the path and the ref are not printed', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  const inPath = commit(dir, { [`clients/${WORD.toLowerCase()}/plan.md`]: `For ${WORD}.\n` }, 'docs: a plan');
  let r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${inPath.slice(0, 12)} a new file's path`));
  silent(r.text);

  const other = tool();
  const head = g(other, 'rev-parse', 'HEAD');
  r = ws(['--dir', other, '--stdin', '--remote', 'https://github.com/krzysztofdudek/Yggdrasil.git'], { input: `refs/heads/${WORD.toLowerCase()}-work ${head} refs/heads/${WORD.toLowerCase()}-work ${ZERO}\n` });
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /names: a pushed ref's name: /);
  silent(r.text);

  const third = tool();
  const t0 = g(third, 'rev-parse', 'HEAD');
  writeFileSync(join(third, 'b.md'), 'B.\n');
  g(third, 'add', '.');
  execFileSync('git', ['-c', 'user.name=Test', '-c', `user.email=someone@${WORD.toLowerCase()}.example`, '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', 'commit', '-q', '-m', 'docs: b'], { cwd: third, stdio: 'pipe' });
  const byAuthor = g(third, 'rev-parse', 'HEAD');
  r = ws(['--dir', third, `${t0}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${byAuthor.slice(0, 12)} author or committer`));
  silent(r.text);

  const fourth = tool();
  const f0 = g(fourth, 'rev-parse', 'HEAD');
  g(fourth, 'checkout', '-q', '-b', 'side');
  commit(fourth, { 'README.md': '# A tool\n\nIt does one thing, on the side.\n' }, 'docs: side');
  g(fourth, 'checkout', '-q', 'main');
  commit(fourth, { 'README.md': '# A tool\n\nIt does one thing, on main.\n' }, 'docs: main');
  spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '-q', 'side'], { cwd: fourth });
  const merge = commit(fourth, { 'README.md': `# A tool\n\nIt does one thing, for ${PAIR.join(' ')}.\n` }, 'merge: side');
  assert.equal(g(fourth, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
  r = ws(['--dir', fourth, `${f0}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${merge.slice(0, 12)} README\\.md:3`));
  silent(r.text);
});

test('a name split over an old line and an added one is refused', () => {
  const dir = tool();
  commit(dir, { 'a.md': `The site at ${PAIR[0]}\n` }, 'docs: a');
  const start = g(dir, 'rev-parse', 'HEAD');
  commit(dir, { 'a.md': `The site at ${PAIR[0]}\n${PAIR[1]} opened.\n` }, 'docs: a grows');
  const r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /a\.md:1/);
  silent(r.text);
});

test('a range that cannot be read is refused, never passed as empty', () => {
  const dir = tool();
  let r = ws(['--dir', dir, 'no-such-ref..HEAD']);
  assert.notEqual(r.status, 0);
  assert.match(r.text, /no-such-ref/);
  r = ws(['--dir', join(base, 'nowhere'), 'HEAD']);
  assert.notEqual(r.status, 0);
  r = ws(['--dir', base, 'HEAD']);
  assert.notEqual(r.status, 0, 'not a repository');
  r = ws(['--dir', dir]);
  assert.equal(r.status, 2);
  r = ws(['--dir', dir, 'HEAD'], { key: null });
  assert.equal(r.status, 1, 'a scan by hand without the key is refused');
  assert.match(r.text, /no key/);
  r = ws(['--dir', dir, 'HEAD'], { key: 'ab'.repeat(32) });
  assert.equal(r.status, 1);
  assert.match(r.text, /does not match/);
});

test('a family remote is told from any other', () => {
  const owners = ['krzysztofdudek'];
  for (const u of ['', undefined, 'https://github.com/krzysztofdudek/Yggdrasil.git', 'git@github.com:KrzysztofDudek/Grain', 'ssh://git@ssh.github.com:443/krzysztofdudek/Runes.git/', 'gh-alias:krzysztofdudek/JarlSkill']) assert.equal(isFamilyRemote(u, owners), true, String(u));
  for (const u of ['https://github.com/someone/Yggdrasil.git', 'git@github.com:someone/krzysztofdudek', 'https://github.com/notkrzysztofdudek/Grain']) assert.equal(isFamilyRemote(u, owners), false, u);
  assert.equal(isFamilyRemote('https://github.com/someone/Yggdrasil.git', []), true, 'no known owner: every remote counts');
});

test('the hook template scans a push and refuses one that carries a name', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  const url = 'https://github.com/krzysztofdudek/Yggdrasil.git';
  let r = hook(dir, url, `refs/heads/main ${start} refs/heads/main ${ZERO}\n`);
  assert.equal(r.status, 0, r.text);
  assert.match(r.text, /names range \(1 commit\): clean/);
  const bad = commit(dir, { 'a.md': `By ${WORD}.\n` }, 'docs: a');
  r = hook(dir, url, `refs/heads/main ${bad} refs/heads/main ${start}\n`);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${bad.slice(0, 12)} a\\.md:1`));
  silent(r.text);
  r = hook(dir, 'https://github.com/someone/Yggdrasil.git', `refs/heads/main ${bad} refs/heads/main ${start}\n`);
  assert.equal(r.status, 1, 'with the key, a push to a fork is scanned too');
  r = hook(dir, url, `refs/heads/main ${bad} refs/heads/main ${'1'.repeat(40)}\n`);
  assert.equal(r.status, 1, 'an unknown remote commit means the whole history is read');
  r = hook(dir, url, `(delete) ${ZERO} refs/heads/gone ${start}\n`);
  assert.equal(r.status, 0, r.text);
});

test('the hook template refuses a push without the key to the canonical remote and lets one through elsewhere with one line', () => {
  const dir = tool();
  const head = g(dir, 'rev-parse', 'HEAD');
  const line = `refs/heads/main ${head} refs/heads/main ${ZERO}\n`;
  for (const url of ['https://github.com/krzysztofdudek/Yggdrasil.git', 'git@github.com:krzysztofdudek/Grain.git', '']) {
    const r = hook(dir, url, line, { key: null });
    assert.equal(r.status, 1, `${url}: ${r.text}`);
    assert.match(r.text, /no key/);
    assert.match(r.text, /Nothing leaves the machine unscanned/);
  }
  const fork = hook(dir, 'https://github.com/someone/Yggdrasil.git', line, { key: null });
  assert.equal(fork.status, 0, fork.text);
  assert.equal(fork.text.trim().split('\n').length, 1, fork.text);
  assert.match(fork.text, /unscanned for private names/);
  const wrong = hook(dir, 'https://github.com/krzysztofdudek/Yggdrasil.git', line, { key: 'ab'.repeat(32) });
  assert.equal(wrong.status, 1);
});

test('the hook template without an Althing checkout refuses the canonical remote and lets any other through with one line', () => {
  const lonely = mkdtempSync(join(tmpdir(), 'althing-names-lonely-'));
  try {
    const dir = tool(lonely);
    const head = g(dir, 'rev-parse', 'HEAD');
    const line = `refs/heads/main ${head} refs/heads/main ${ZERO}\n`;
    for (const url of ['https://github.com/krzysztofdudek/Yggdrasil.git', 'git@github.com:KrzysztofDudek/Grain', '']) {
      const r = hook(dir, url, line, { root: null });
      assert.equal(r.status, 1, `${url}: ${r.text}`);
      assert.match(r.text, /refused/);
    }
    const fork = hook(dir, 'https://github.com/someone/Yggdrasil.git', line, { root: null });
    assert.equal(fork.status, 0, fork.text);
    assert.equal(fork.text.trim().split('\n').length, 1, fork.text);
    assert.match(fork.text, /unscanned for private names/);
    const missing = hook(dir, 'https://github.com/someone/Yggdrasil.git', line, { root: join(lonely, 'none') });
    assert.equal(missing.status, 0, 'a named checkout that is not there is no checkout');
    assert.match(missing.text, /unscanned for private names/);
    const sibling = join(lonely, 'Althing');
    cpSync(althing, sibling, { recursive: true });
    const found = hook(dir, 'https://github.com/krzysztofdudek/Yggdrasil.git', line, { root: null });
    assert.equal(found.status, 0, found.text);
    assert.match(found.text, /names range \(1 commit\): clean/, 'the sibling checkout is found without being named');
  } finally {
    rmSync(lonely, { recursive: true, force: true });
  }
});

test('the hook template names the owner the registry names, and writes nothing', () => {
  const text = readFileSync(HOOK, 'utf8');
  const owners = new Set(Object.values(JSON.parse(readFileSync(join(ALTHING, 'family', 'registry.json'), 'utf8')).repos).map((r) => r.github.split('/')[0].toLowerCase()));
  assert.deepEqual([...owners], ['krzysztofdudek']);
  assert.ok(text.includes('*[/:]krzysztofdudek/*'));
  assert.ok(text.includes('names --dir'));
  assert.ok(existsSync(HOOK));
});

test('lines a merge adds over every parent are found in a combined diff', () => {
  const diff = ['diff --cc a.md', 'index 1,2..3', '--- a/a.md', '+++ b/a.md', '@@@ -1,3 -1,3 +1,4 @@@', '  one', '- two', ' -deux', '++both', ' +theirs', '+ ours', '  three'].join('\n');
  const m = mergeAddedLines(diff);
  assert.deepEqual([...m.get('a.md')], [[2, 'both']]);
});
