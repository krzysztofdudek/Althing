import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildDigests, parseList } from '../../rails/names.mjs';
import { addedLines } from '../../rails/git.mjs';
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
  // Only local remotes answer in a test: no test reaches the network.
  const e = { ...process.env, HOME: join(base, 'home'), GIT_ALLOW_PROTOCOL: 'file', ...extra };
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
  assert.ok(text.includes('names --git-dir'));
  assert.ok(existsSync(HOOK));
});


const refusals = (text) => text.split('\n').filter((l) => /^names: (commit|tag|tree|a pushed)/.test(l) && l.includes('deny-list'));

test('a path git writes quoted or escaped is still read: a new file, a changed file and a merge resolution', () => {
  const paths = ['docs/my notes.md', 'docs/café.md', 'docs/say "hi".md'];
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  commit(dir, Object.fromEntries(paths.map((p) => [p, `One.\nBy ${WORD}.\n`])), 'docs: three files');
  let r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.equal(refusals(r.text).length, 3, r.text);
  for (const p of paths) assert.ok(r.text.includes(`${p}:2: `), p);
  silent(r.text);

  const second = tool();
  commit(second, Object.fromEntries(paths.map((p) => [p, 'One.\n'])), 'docs: three files');
  const mid = g(second, 'rev-parse', 'HEAD');
  commit(second, Object.fromEntries(paths.map((p) => [p, `One.\nTwo.\nFor ${PAIR.join(' ')}.\n`])), 'docs: they grow');
  r = ws(['--dir', second, `${mid}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.equal(refusals(r.text).length, 3, r.text);
  for (const p of paths) assert.ok(r.text.includes(`${p}:3: `), p);

  for (const p of paths) {
    const third = tool();
    commit(third, { [p]: 'A thing.\n' }, 'docs: a file');
    const t0 = g(third, 'rev-parse', 'HEAD');
    g(third, 'checkout', '-q', '-b', 'side');
    commit(third, { [p]: 'A thing, on the side.\n' }, 'docs: side');
    g(third, 'checkout', '-q', 'main');
    commit(third, { [p]: 'A thing, on main.\n' }, 'docs: main');
    spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '-q', 'side'], { cwd: third });
    const merge = commit(third, { [p]: `A thing, for ${WORD}.\n` }, 'merge: side');
    assert.equal(g(third, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
    r = ws(['--dir', third, `${t0}..HEAD`]);
    assert.equal(r.status, 1, `${p}: ${r.text}`);
    assert.ok(r.text.includes(`commit ${merge.slice(0, 12)} ${p}:1: `), `${p}: ${r.text}`);
  }
});

test('the paths of a diff are read as git writes them: with a trailing tab, quoted, escaped', () => {
  const diff = ['diff --git x', '+++ b/my notes.md\t', '@@ -0,0 +1 @@', '+a', 'diff --git x', '+++ "b/caf\\303\\251 \\"x\\".md"', '@@ -0,0 +1 @@', '+b', 'diff --git x', '+++ b/plain.md', '@@ -1 +1,2 @@', '+c'].join('\n');
  assert.deepEqual([...addedLines(diff).keys()], ['my notes.md', 'café "x".md', 'plain.md']);
});

test('a pushed annotated tag has its message and its tagger read', () => {
  const dir = tool();
  const head = g(dir, 'rev-parse', 'HEAD');
  g(dir, 'tag', '-a', 'v1', '-m', `The release for ${PAIR.join(' ')}.`);
  g(dir, 'tag', '-a', 'v2', '-m', 'A plain release.');
  const url = 'https://github.com/krzysztofdudek/Yggdrasil.git';
  let r = ws(['--dir', dir, '--stdin', '--remote', url], { input: `refs/tags/v1 ${g(dir, 'rev-parse', 'v1')} refs/tags/v1 ${ZERO}\n` });
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /names: tag object [0-9a-f]{12}: /);
  silent(r.text);
  r = ws(['--dir', dir, '--stdin', '--remote', url], { input: `refs/tags/v2 ${g(dir, 'rev-parse', 'v2')} refs/tags/v2 ${ZERO}\n` });
  assert.equal(r.status, 0, r.text);
  r = ws(['--dir', dir, `${head}..v1`]);
  assert.equal(r.status, 1, 'a tag named by hand is read too');
  silent(r.text);
});

test('a lockfile and a UTF-16 file are read, and a binary file is said to be unread', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  const integrity = `sha512-${'Qm9/kT+x7Zp2LwVn'.repeat(5)}Aa1==`;
  commit(dir, { 'package-lock.json': `{\n "a": { "resolved": "https://registry.npmjs.org/a/-/a-1.0.0.tgz", "integrity": "${integrity}" }\n}\n`, 'yarn.lock': `a@1:\n  integrity ${integrity}\n` }, 'build: locks');
  let r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 0, r.text);
  const mid = g(dir, 'rev-parse', 'HEAD');
  commit(dir, { 'package-lock.json': `{\n "a": { "resolved": "https://npm.${WORD.toLowerCase()}.example/a.tgz", "integrity": "${integrity}" }\n}\n`, 'yarn.lock': `a@1:\n  resolved "https://npm.${WORD.toLowerCase()}.example/a.tgz"\n  integrity ${integrity}\n` }, 'build: locks move');
  r = ws(['--dir', dir, `${mid}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /package-lock\.json:2: /);
  assert.match(r.text, /yarn\.lock:2: /);
  silent(r.text);

  const second = tool();
  const s0 = g(second, 'rev-parse', 'HEAD');
  writeFileSync(join(second, 'le.txt'), Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(`One.\nBy ${WORD}.\n`, 'utf16le')]));
  writeFileSync(join(second, 'be.txt'), Buffer.concat([Buffer.from([0xfe, 0xff]), Buffer.from(`One.\nTwo.\nBy ${WORD}.\n`, 'utf16le').swap16()]));
  g(second, 'add', '.');
  g(second, 'commit', '-q', '-m', 'docs: wide text');
  r = ws(['--dir', second, `${s0}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /le\.txt:2: /);
  assert.match(r.text, /be\.txt:3: /);
  silent(r.text);

  const third = tool();
  const t0 = g(third, 'rev-parse', 'HEAD');
  mkdirSync(join(third, WORD.toLowerCase()));
  writeFileSync(join(third, 'blob.bin'), Buffer.from([1, 2, 0, 3, 0, 0, 4]));
  writeFileSync(join(third, WORD.toLowerCase(), 'blob.bin'), Buffer.from([1, 2, 0, 3, 0, 0, 5]));
  g(third, 'add', '.');
  const bin = commit(third, { 'ok.md': 'Fine.\n' }, 'build: blobs');
  r = ws(['--dir', third, `${t0}..HEAD`]);
  assert.equal(r.status, 1, 'the path of the second file carries a name');
  assert.ok(r.text.includes(`names: commit ${bin.slice(0, 12)} blob.bin: a binary file, not scanned`), r.text);
  assert.equal(r.text.split('\n').filter((l) => l.includes('a binary file, not scanned')).length, 2, r.text);
  assert.match(r.text, /2 binary files not scanned/);
  silent(r.text);
});

// A bare remote whose address reads as a repository of the family, or as someone else's.
function bare(owner) {
  const dir = join(base, `remotes${++n}`, owner, 'Tool.git');
  mkdirSync(dir, { recursive: true });
  g(dir, 'init', '-q', '--bare', '-b', 'main');
  return dir;
}

function install(dir) {
  const to = join(dir, '.git', 'hooks', 'pre-push');
  mkdirSync(join(dir, '.git', 'hooks'), { recursive: true });
  cpSync(HOOK, to);
  chmodSync(to, 0o755);
}

// A real push through the installed hook, to a local bare remote.
function send(dir, args, { key = KEY, more = {} } = {}) {
  const extra = { ALTHING_ROOT: althing, ...more };
  if (key) extra.ALTHING_NAMES_KEY = key;
  const r = spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'push', ...args], { cwd: dir, encoding: 'utf8', env: env(extra) });
  return { status: r.status, text: `${r.stdout}${r.stderr}` };
}
const quiet = (dir, ...args) => g(dir, 'push', '-q', ...args);
const has = (remote, ref) => spawnSync('git', ['rev-parse', '--verify', '--quiet', ref], { cwd: remote }).status === 0;

test('a push leaves out only the commits the remote itself reports, and says how many it read', () => {
  const family = bare('krzysztofdudek');
  const dir = tool();
  install(dir);
  g(dir, 'remote', 'add', 'origin', family);
  const old = commit(dir, { 'old.md': `Long ago, ${WORD}.\n` }, 'docs: old');
  quiet(dir, 'origin', 'main');
  assert.ok(has(family, 'refs/heads/main'), 'the name is already public there');
  g(dir, 'checkout', '-q', '-b', 'topic');
  commit(dir, { 'new.md': 'New.\n' }, 'docs: new');
  let r = send(dir, ['origin', 'topic']);
  assert.equal(r.status, 0, r.text);
  assert.match(r.text, /names range \(1 commit\): clean/);
  assert.ok(has(family, 'refs/heads/topic'));
  commit(dir, { 'newer.md': `Again ${WORD}.\n` }, 'docs: newer');
  r = send(dir, ['origin', 'topic']);
  assert.notEqual(r.status, 0, r.text);
  assert.match(r.text, /names range \(1 commit\): 1 refusal/);
  silent(r.text);
  assert.equal(g(family, 'rev-list', '--count', 'topic'), '3', 'the refused commit did not arrive');
  assert.ok(old);
});

test('what was fetched from another address is never taken for what the remote has', () => {
  // The history went to a private remote; the remote's address then became a repository of the family.
  const priv = bare('someone');
  const family = bare('krzysztofdudek');
  const dir = tool();
  install(dir);
  commit(dir, { 'a.md': `By ${WORD}.\n` }, 'docs: a');
  g(dir, 'remote', 'add', 'origin', priv);
  quiet(dir, '-u', 'origin', 'main');
  g(dir, 'fetch', '-q', 'origin');
  g(dir, 'remote', 'set-url', 'origin', family);
  let r = send(dir, ['origin', 'main']);
  assert.notEqual(r.status, 0, r.text);
  assert.match(r.text, /names range \(2 commits\): 1 refusal/);
  assert.ok(!has(family, 'refs/heads/main'), 'nothing arrived');
  silent(r.text);

  // A remote that fetches from a mirror and pushes to the family's repository.
  const mirror = bare('someone');
  const family2 = bare('krzysztofdudek');
  const second = tool();
  install(second);
  commit(second, { 'a.md': `By ${WORD}.\n` }, 'docs: a');
  g(second, 'remote', 'add', 'origin', mirror);
  quiet(second, 'origin', 'main');
  g(second, 'fetch', '-q', 'origin');
  g(second, 'remote', 'set-url', '--push', 'origin', family2);
  r = send(second, ['origin', 'main']);
  assert.notEqual(r.status, 0, r.text);
  assert.match(r.text, /names range \(2 commits\): 1 refusal/);
  assert.ok(!has(family2, 'refs/heads/main'));

  // A leaked commit was removed from the family's repository; a clone that had fetched it brings it back.
  const family3 = bare('krzysztofdudek');
  const third = tool();
  install(third);
  const clean = g(third, 'rev-parse', 'HEAD');
  g(third, 'remote', 'add', 'origin', family3);
  commit(third, { 'a.md': `By ${WORD}.\n` }, 'docs: a');
  quiet(third, 'origin', 'main');
  g(third, 'fetch', '-q', 'origin');
  g(family3, 'update-ref', 'refs/heads/main', clean);
  g(third, 'checkout', '-q', '-b', 'again');
  commit(third, { 'b.md': 'B.\n' }, 'docs: b');
  r = send(third, ['origin', 'again']);
  assert.notEqual(r.status, 0, r.text);
  assert.match(r.text, /names range \(2 commits\): 1 refusal/);
  assert.ok(!has(family3, 'refs/heads/again'));
  silent(r.text);
});

test('a remote that cannot be asked means the whole range, said in one line', () => {
  const dir = tool();
  commit(dir, { 'a.md': 'A.\n' }, 'docs: a');
  const head = commit(dir, { 'b.md': 'B.\n' }, 'docs: b');
  g(dir, 'update-ref', 'refs/remotes/origin/main', head);
  const input = `refs/heads/topic ${head} refs/heads/topic ${ZERO}\n`;
  for (const url of ['https://github.com/krzysztofdudek/Yggdrasil.git', join(base, 'krzysztofdudek', 'Nowhere.git'), '']) {
    const r = ws(['--dir', dir, '--stdin', '--remote', url], { input });
    assert.equal(r.status, 0, r.text);
    assert.equal(r.text.split('\n').filter((l) => /could not be asked what it has/.test(l)).length, 1, r.text);
    assert.match(r.text, /names range \(3 commits\): clean/);
  }
});

test('git attributes and the big file threshold do not hide a file\'s lines', () => {
  const settings = [
    (dir) => commit(dir, { '.gitattributes': '*.md -diff\n' }, 'build: attributes'),
    (dir) => commit(dir, { '.gitattributes': 'a.md binary\n' }, 'build: attributes'),
    (dir) => { mkdirSync(join(dir, '.git', 'info'), { recursive: true }); writeFileSync(join(dir, '.git', 'info', 'attributes'), 'a.md binary\n'); },
    (dir) => g(dir, 'config', 'core.bigFileThreshold', '1'),
  ];
  for (const [i, set] of settings.entries()) {
    const dir = tool();
    set(dir);
    commit(dir, { 'a.md': 'One.\n' }, 'docs: a');
    const start = g(dir, 'rev-parse', 'HEAD');
    const bad = commit(dir, { 'a.md': `One.\nBy ${WORD}.\n` }, 'docs: a grows');
    const r = ws(['--dir', dir, `${start}..HEAD`]);
    assert.equal(r.status, 1, `setting ${i}: ${r.text}`);
    assert.ok(r.text.includes(`commit ${bad.slice(0, 12)} a.md:2: `), `setting ${i}: ${r.text}`);
    silent(r.text);
  }
  const dir = tool();
  commit(dir, { '.gitattributes': '*.md -diff\n', 'a.md': 'Side or main.\n' }, 'docs: a');
  const start = g(dir, 'rev-parse', 'HEAD');
  g(dir, 'checkout', '-q', '-b', 'side');
  commit(dir, { 'a.md': 'Side.\n' }, 'docs: side');
  g(dir, 'checkout', '-q', 'main');
  commit(dir, { 'a.md': 'Main.\n' }, 'docs: main');
  spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '-q', 'side'], { cwd: dir });
  const merge = commit(dir, { 'a.md': `Both, for ${WORD}.\n` }, 'merge: side');
  assert.equal(g(dir, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
  const r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`commit ${merge.slice(0, 12)} a.md:1: `), r.text);
});

test('an added line that looks like a file header does not end the file', () => {
  const diff = ['diff --git a/a.md b/a.md', '--- a/a.md', '+++ b/a.md', '@@ -1,0 +2,3 @@', '+first', '+++ b/other.md', '+last', 'diff --git a/b.md b/b.md', '--- a/b.md', '+++ b/b.md', '@@ -0,0 +1 @@', '+x'].join('\n');
  const m = addedLines(diff);
  assert.deepEqual([...m.keys()], ['a.md', 'b.md']);
  assert.deepEqual([...m.get('a.md')], [[2, 'first'], [3, '++ b/other.md'], [4, 'last']]);
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  const bad = commit(dir, { 'a.md': `One.\n++ b/other.md\nBy ${WORD}.\n` }, 'docs: a');
  const r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`commit ${bad.slice(0, 12)} a.md:3: `), r.text);
});

test('every header of a commit is read, a tag message carried by a merge among them', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  commit(dir, { 'a.md': 'A.\n' }, 'docs: a');
  const raw = execFileSync('git', ['cat-file', 'commit', 'HEAD'], { cwd: dir }).toString();
  const cut = raw.indexOf('\n\n');
  const carried = `mergetag object ${start}\n type commit\n tag v1\n tagger Test <test@example.com> 0 +0000\n \n The release for ${PAIR.join(' ')}.\n`;
  const crafted = execFileSync('git', ['hash-object', '-t', 'commit', '-w', '--stdin'], { cwd: dir, input: `${raw.slice(0, cut + 1)}${carried}${raw.slice(cut + 1)}` }).toString().trim();
  const r = ws(['--dir', dir, `${start}..${crafted}`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${crafted.slice(0, 12)} author or committer, or another header of the commit`));
  silent(r.text);
});

test('a file whose name is not valid UTF-8 is read, and UTF-16 without a mark is read or named', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  writeFileSync(Buffer.concat([Buffer.from(`${dir}/odd-`), Buffer.from([0xff, 0xfe]), Buffer.from('.md')]), `One.\nBy ${WORD}.\n`);
  g(dir, 'add', '.');
  const bad = commit(dir, { 'ok.md': 'Fine.\n' }, 'docs: an odd name');
  let r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${bad.slice(0, 12)} odd-[^:]*\\.md:2: `));
  silent(r.text);

  const second = tool();
  const s0 = g(second, 'rev-parse', 'HEAD');
  writeFileSync(join(second, 'le.txt'), Buffer.from(`One line of plain text.\nBy ${WORD}.\n`, 'utf16le'));
  writeFileSync(join(second, 'be.txt'), Buffer.from(`One line of plain text.\nTwo.\nBy ${WORD}.\n`, 'utf16le').swap16());
  g(second, 'add', '.');
  g(second, 'commit', '-q', '-m', 'docs: wide text without a mark');
  r = ws(['--dir', second, `${s0}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /le\.txt:2: /);
  assert.match(r.text, /be\.txt:3: /);
  silent(r.text);
});

test('an empty push is a stated no-op, never a silent clean', () => {
  const dir = tool();
  const head = g(dir, 'rev-parse', 'HEAD');
  const url = 'https://github.com/krzysztofdudek/Yggdrasil.git';
  for (const input of ['', '\n', `(delete) ${ZERO} refs/heads/gone ${head}\n`]) {
    const r = ws(['--dir', dir, '--stdin', '--remote', url], { input });
    assert.equal(r.status, 0, r.text);
    assert.match(r.text, /nothing to scan/);
    assert.ok(!/clean/.test(r.text), r.text);
  }
});

test('a merge that adds an empty file whose path carries a name is refused', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  g(dir, 'checkout', '-q', '-b', 'side');
  commit(dir, { 'side.md': 'Side.\n' }, 'docs: side');
  g(dir, 'checkout', '-q', 'main');
  commit(dir, { 'main.md': 'Main.\n' }, 'docs: main');
  spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '-q', '--no-commit', 'side'], { cwd: dir });
  const merge = commit(dir, { [`${WORD.toLowerCase()}/empty.txt`]: '' }, 'merge: side');
  assert.equal(g(dir, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
  const r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${merge.slice(0, 12)} a new file's path`));
  silent(r.text);
});

test('a submodule in the tree is passed over with one line that does not print its path', () => {
  const dir = tool();
  const head = g(dir, 'rev-parse', 'HEAD');
  g(dir, 'update-index', '--add', '--cacheinfo', `160000,${head},vendor/${WORD.toLowerCase()}`);
  g(dir, 'commit', '-q', '-m', 'build: a submodule');
  const r = ws(['--dir', dir, 'HEAD', '--tree']);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /1 submodule not read/);
  assert.match(r.text, /a file's path \(not printed\)/);
  silent(r.text);
});

test('the remote is asked at the address of the push, whatever rule rewrites a fetch', () => {
  // Fetches go through a mirror and pushes stay on the family's repository. A leaked commit was removed from that repository and is still on the mirror.
  const set = (exact) => {
    const family = bare('krzysztofdudek');
    const mirror = bare('someone');
    const dir = tool();
    install(dir);
    const clean = g(dir, 'rev-parse', 'HEAD');
    commit(dir, { 'a.md': `By ${WORD}.\n` }, 'docs: a');
    quiet(dir, family, 'main');
    quiet(dir, mirror, 'main');
    g(family, 'update-ref', 'refs/heads/main', clean);
    g(dir, 'remote', 'add', 'origin', family);
    const [from, to] = exact ? [family, mirror] : [`${dirname(family)}/`, `${dirname(mirror)}/`];
    g(dir, 'config', `url.${to}.insteadOf`, from);
    g(dir, 'config', `url.${from}.pushInsteadOf`, from);
    g(dir, 'fetch', '-q', 'origin');
    assert.equal(g(dir, 'rev-parse', 'origin/main'), g(dir, 'rev-parse', 'main'), 'the fetch came from the mirror');
    g(dir, 'checkout', '-q', '-b', 'again');
    commit(dir, { 'b.md': 'B.\n' }, 'docs: b');
    return { family, dir };
  };
  const elsewhere = (text) => text.split('\n').filter((l) => /insteadOf/.test(l));

  // A rule on a prefix of the address: the family's repository itself answers, so only its two missing commits are read.
  let { family, dir } = set(false);
  let r = send(dir, ['origin', 'again']);
  assert.notEqual(r.status, 0, r.text);
  assert.match(r.text, /names range \(2 commits\): 1 refusal/);
  assert.equal(elsewhere(r.text).length, 0, r.text);
  assert.ok(!/could not be asked/.test(r.text), r.text);
  assert.ok(!has(family, 'refs/heads/again'), 'nothing arrived');
  silent(r.text);

  // A rule on the whole address cannot be set aside: the remote is not asked, one line says so, and the whole range is read.
  ({ family, dir } = set(true));
  r = send(dir, ['origin', 'again']);
  assert.notEqual(r.status, 0, r.text);
  assert.equal(elsewhere(r.text).length, 1, r.text);
  assert.match(r.text, /names range \(3 commits\): 1 refusal/);
  assert.ok(!has(family, 'refs/heads/again'), 'nothing arrived');
  silent(r.text);
});

// A commit object written byte for byte, as a client set to another encoding writes it.
function craft(dir, edit) {
  const raw = execFileSync('git', ['cat-file', 'commit', 'HEAD'], { cwd: dir }).toString('latin1');
  return execFileSync('git', ['hash-object', '-t', 'commit', '-w', '--stdin'], { cwd: dir, input: Buffer.from(edit(raw), 'latin1') }).toString().trim();
}

test('a commit is read in the encoding it declares, and no setting of the repository changes what is read', () => {
  // The pair with a Polish letter (the l with stroke), which folds to the entry of the list; 0xb3 is that letter in ISO-8859-2.
  const polish = `${PAIR[0].replace('l', '\u0142')} ${PAIR[1]}`;
  const latin2 = polish.replace('\u0142', '\u00b3');
  const declare = (raw) => raw.replace('\n\n', '\nencoding ISO-8859-2\n\n');
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  commit(dir, { 'a.md': 'A.\n' }, 'docs: a');

  const byAuthor = craft(dir, (raw) => declare(raw).replace(/^author Test </m, `author ${latin2} <`));
  let r = ws(['--dir', dir, `${start}..${byAuthor}`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${byAuthor.slice(0, 12)} author or committer`));
  silent(r.text);

  const inMessage = craft(dir, (raw) => `${declare(raw)}\nAsked for by ${latin2}.\n`);
  r = ws(['--dir', dir, `${start}..${inMessage}`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${inMessage.slice(0, 12)} message:3: `));
  silent(r.text);

  const unknown = craft(dir, (raw) => raw.replace('\n\n', '\nencoding x-no-such-encoding\n\n'));
  r = ws(['--dir', dir, `${start}..${unknown}`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${unknown.slice(0, 12)}: it declares an encoding`));

  const second = tool();
  const s0 = g(second, 'rev-parse', 'HEAD');
  const plain = commit(second, { 'a.md': 'A.\n' }, `docs: a\n\nAsked for by ${polish}.`);
  g(second, 'config', 'i18n.logOutputEncoding', 'ISO-8859-2');
  r = ws(['--dir', second, `${s0}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, new RegExp(`commit ${plain.slice(0, 12)} message:3: `));
  silent(r.text);
});

// Two branches that change the same line of a.md, and a merge whose resolution is the text given.
function mergeOf(dir, side, main, resolved) {
  g(dir, 'checkout', '-q', '-b', 'side');
  commit(dir, { 'a.md': side }, 'docs: side');
  g(dir, 'checkout', '-q', 'main');
  commit(dir, { 'a.md': main }, 'docs: main');
  spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '-q', 'side'], { cwd: dir });
  const merge = commit(dir, { 'a.md': resolved }, 'merge: side');
  assert.equal(g(dir, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
  return merge;
}

test('a merge that brings two lines its parents hold apart next to each other is refused, as an ordinary commit is', () => {
  const filler = Array.from({ length: 12 }, (_, i) => `Paragraph ${i + 1} of the plan.\n`).join('\n');
  const apart = (end) => `The site at ${PAIR[0]}\n\n${filler}\n${PAIR[1]} opened.\n\n${end}\n`;
  const together = (end) => `The site at ${PAIR[0]}\n${PAIR[1]} opened.\n\n${filler}\n${end}\n`;

  const plain = tool();
  commit(plain, { 'a.md': apart('The end.') }, 'docs: a');
  const p0 = g(plain, 'rev-parse', 'HEAD');
  const moved = commit(plain, { 'a.md': together('The end.') }, 'docs: a line moves');
  let r = ws(['--dir', plain, `${p0}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`commit ${moved.slice(0, 12)} a.md:1: `), r.text);

  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  commit(dir, { 'a.md': apart('The end.') }, 'docs: a');
  const merge = mergeOf(dir, apart('The end, on the side.'), apart('The end, on main.'), together('The end, for both.'));
  r = ws(['--dir', dir, `${start}..${merge}^1`]);
  assert.equal(r.status, 0, `the first parent holds no name: ${r.text}`);
  r = ws(['--dir', dir, `${start}..${merge}^2`]);
  assert.equal(r.status, 0, `the second parent holds no name: ${r.text}`);
  r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`commit ${merge.slice(0, 12)} a.md:1: `), r.text);
  silent(r.text);
});

test('a merge does not count a line it takes from one parent', () => {
  const family = bare('krzysztofdudek');
  const dir = tool();
  install(dir);
  g(dir, 'remote', 'add', 'origin', family);
  commit(dir, { 'a.md': 'One.\n\nTwo.\n\nThree.\n' }, 'docs: a');
  // The side's line carries a name that is public already; the resolution keeps it and adds a line of its own.
  const merge = mergeOf(dir, `One.\n\nTwo, by ${WORD}.\n\nThree.\n`, 'One.\n\nTwo, on main.\n\nThree.\n', `One.\n\nTwo, by ${WORD}.\n\nThree.\n\nFour, new.\n`);
  quiet(dir, 'origin', `${merge}^1:refs/heads/main`, `${merge}^2:refs/heads/side`);
  const r = send(dir, ['origin', 'main']);
  assert.equal(r.status, 0, r.text);
  assert.match(r.text, /names range \(1 commit\): clean/);
  assert.equal(g(family, 'rev-parse', 'main'), merge, 'the merge arrived');
});

test('a merge across a rename does not count the lines one side already had, and a rename made by the merge adds none', () => {
  const body = Array.from({ length: 8 }, (_, i) => `Line ${i + 1} of the notes.\n`).join('');
  const family = bare('krzysztofdudek');
  const dir = tool();
  install(dir);
  g(dir, 'remote', 'add', 'origin', family);
  commit(dir, { 'a.md': body }, 'docs: a');
  g(dir, 'checkout', '-q', '-b', 'side');
  g(dir, 'mv', 'a.md', 'b.md');
  g(dir, 'commit', '-q', '-m', 'docs: a is b');
  g(dir, 'checkout', '-q', 'main');
  commit(dir, { 'a.md': `${body}By ${WORD}.\n` }, 'docs: a line');
  quiet(dir, 'origin', 'main', 'side');
  g(dir, 'merge', '-q', '-m', 'merge: side', 'side');
  assert.equal(g(dir, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
  assert.ok(readFileSync(join(dir, 'b.md'), 'utf8').includes(WORD), 'git carried the line into the renamed file');
  let r = send(dir, ['origin', 'main']);
  assert.equal(r.status, 0, r.text);
  assert.match(r.text, /names range \(1 commit\): clean/);

  g(dir, 'checkout', '-q', '-b', 'other');
  commit(dir, { 'c.md': 'C.\n' }, 'docs: c');
  g(dir, 'checkout', '-q', 'main');
  commit(dir, { 'd.md': 'D.\n' }, 'docs: d');
  quiet(dir, 'origin', 'main', 'other');
  g(dir, 'merge', '-q', '--no-commit', 'other');
  g(dir, 'mv', 'b.md', 'e.md');
  g(dir, 'commit', '-q', '-m', 'merge: other');
  assert.equal(g(dir, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
  r = send(dir, ['origin', 'main']);
  assert.equal(r.status, 0, r.text);
  assert.match(r.text, /names range \(1 commit\): clean/);
});

test('asking the remote ends at its limit with everything it started, and ssh is told not to prompt', async () => {
  const dir = tool();
  const bin = join(base, `bin${++n}`);
  mkdirSync(bin);
  // A transport that never answers. It stands in for ssh, so nothing leaves the machine.
  writeFileSync(join(bin, 'ssh'), `#!/bin/sh\necho $$ > '${join(bin, 'pid')}'\necho "$@" > '${join(bin, 'args')}'\nexec sleep 30\n`);
  chmodSync(join(bin, 'ssh'), 0o755);
  const script = `import { remoteHolds } from ${JSON.stringify(pathToFileURL(join(althing, 'rails', 'names-range.mjs')).href)}; const r = remoteHolds('ssh://git@nowhere.invalid/krzysztofdudek/Tool.git', { limit: 1500 }); console.log(JSON.stringify({ asked: Array.isArray(r.held) }));`;
  const t = Date.now();
  const r = spawnSync('node', ['--input-type=module', '-e', script], { cwd: dir, encoding: 'utf8', timeout: 100000, env: env({ GIT_ALLOW_PROTOCOL: 'ssh', GIT_SSH_COMMAND: join(bin, 'ssh'), GIT_SSH_VARIANT: 'ssh' }) });
  const pid = existsSync(join(bin, 'pid')) ? Number(readFileSync(join(bin, 'pid'), 'utf8')) : 0;
  const alive = () => { const s = spawnSync('ps', ['-o', 'stat=', '-p', String(pid)], { encoding: 'utf8' }).stdout.trim(); return s !== '' && !s.startsWith('Z'); };
  try {
    assert.equal(r.status, 0, `${r.stdout}${r.stderr}`);
    assert.deepEqual(JSON.parse(r.stdout), { asked: false });
    assert.ok(Date.now() - t < 20000, 'the limit ended the question');
    assert.ok(pid > 0, 'the transport was started');
    assert.match(readFileSync(join(bin, 'args'), 'utf8'), /-o BatchMode=yes/);
    for (let i = 0; i < 30 && alive(); i++) await new Promise((done) => setTimeout(done, 100));
    assert.ok(!alive(), 'the transport is gone with the question');
  } finally {
    if (pid > 0) try { process.kill(pid, 'SIGKILL'); } catch { /* gone already */ }
  }
});

test('the scan reads the objects a push sends, not what a local replacement shows in their place', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  const bad = commit(dir, { 'a.md': `By ${WORD}.\n` }, 'docs: a');
  const clean = g(dir, 'commit-tree', '-p', start, '-m', 'docs: a', `${start}^{tree}`);
  g(dir, 'replace', bad, clean);
  const r = ws(['--dir', dir, `${start}..${bad}`]);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`commit ${bad.slice(0, 12)} a.md:1: `), r.text);
  silent(r.text);
});

const holds = (remote, id) => spawnSync('git', ['cat-file', '-e', id], { cwd: remote }).status === 0;

test('nothing is scanned or pushed while a graft file is in force', () => {
  const refused = (r) => {
    assert.notEqual(r.status, 0, r.text);
    assert.equal(r.text.split('\n').filter((l) => /^names range: a graft file is in force/.test(l)).length, 1, r.text);
    assert.match(r.text, /git replace --convert-graft-file/);
    assert.ok(!/names range \(\d+ commit/.test(r.text), r.text);
    silent(r.text);
  };
  // A private history with a name, on no branch that is pushed: two commits, the name in the first.
  const beside = (dir) => {
    g(dir, 'checkout', '-q', '--orphan', 'private');
    const first = commit(dir, { 'p.md': `By ${WORD}.\n` }, 'docs: private');
    const last = commit(dir, { 'q.md': 'Q.\n' }, 'docs: more');
    g(dir, 'checkout', '-q', 'main');
    return { first, last, blob: g(dir, 'rev-parse', `${first}:p.md`) };
  };
  const set = () => {
    const family = bare('krzysztofdudek');
    const dir = tool();
    install(dir);
    g(dir, 'remote', 'add', 'origin', family);
    mkdirSync(join(dir, '.git', 'info'), { recursive: true });
    return { family, dir, root: g(dir, 'rev-parse', 'HEAD'), grafts: join(dir, '.git', 'info', 'grafts') };
  };

  // The first publication of a repository whose root is grafted onto that history.
  let t = set();
  let priv = beside(t.dir);
  writeFileSync(t.grafts, `${t.root} ${priv.last}\n`);
  refused(send(t.dir, ['origin', 'main']));
  assert.ok(!has(t.family, 'refs/heads/main') && !holds(t.family, priv.blob), 'nothing arrived');

  // The same, with a second line that cuts the private history's own first commit off: the push sends that history's whole tree as one commit.
  t = set();
  priv = beside(t.dir);
  writeFileSync(t.grafts, `${t.root} ${priv.last}\n${priv.last}\n`);
  refused(send(t.dir, ['origin', 'main']));
  assert.ok(!has(t.family, 'refs/heads/main') && !holds(t.family, priv.blob), 'nothing arrived');

  // A new commit that a graft makes descend from that history.
  t = set();
  quiet(t.dir, 'origin', 'main');
  priv = beside(t.dir);
  const next = commit(t.dir, { 'b.md': 'B.\n' }, 'docs: b');
  writeFileSync(t.grafts, `${next} ${t.root} ${priv.last}\n`);
  refused(send(t.dir, ['origin', 'main']));
  assert.equal(g(t.family, 'rev-parse', 'main'), t.root, 'nothing arrived');
  assert.ok(!holds(t.family, priv.blob));

  // A graft file named by the environment, outside the repository.
  t = set();
  priv = beside(t.dir);
  const outside = join(base, `grafts${++n}`);
  writeFileSync(outside, `${t.root} ${priv.last}\n`);
  refused(send(t.dir, ['origin', 'main'], { more: { GIT_GRAFT_FILE: outside } }));
  assert.ok(!has(t.family, 'refs/heads/main') && !holds(t.family, priv.blob), 'nothing arrived');

  // A scan by hand, where a graft hides a commit of the range.
  t = set();
  commit(t.dir, { 'a.md': `By ${WORD}.\n` }, 'docs: a');
  const head = commit(t.dir, { 'a.md': 'A.\n' }, 'docs: a again');
  writeFileSync(t.grafts, `${head}\n`);
  refused(ws(['--dir', t.dir, `${t.root}..${head}`]));

  // A graft file with no graft in it is not in force.
  t = set();
  writeFileSync(t.grafts, '# no graft here\n\n');
  const r = send(t.dir, ['origin', 'main']);
  assert.equal(r.status, 0, r.text);
  assert.match(r.text, /names range \(1 commit\): clean/);
  assert.ok(has(t.family, 'refs/heads/main'));
});

test('a remote set up under the address of the push is not asked: its settings may reach a mirror', () => {
  const family = bare('krzysztofdudek');
  const mirror = bare('someone');
  const dir = tool();
  install(dir);
  const clean = g(dir, 'rev-parse', 'HEAD');
  commit(dir, { 'a.md': `By ${WORD}.\n` }, 'docs: a');
  quiet(dir, family, 'main');
  quiet(dir, mirror, 'main');
  g(family, 'update-ref', 'refs/heads/main', clean);
  g(dir, 'remote', 'add', 'origin', family);
  // The program that answers a question for the family's address reads the mirror.
  const answer = join(base, `answer${++n}`);
  writeFileSync(answer, `#!/bin/sh\nexec git-upload-pack '${mirror}'\n`);
  chmodSync(answer, 0o755);
  g(dir, 'config', `remote.${family}.uploadpack`, answer);
  g(dir, 'checkout', '-q', '-b', 'again');
  commit(dir, { 'b.md': 'B.\n' }, 'docs: b');
  const r = send(dir, ['origin', 'again']);
  assert.notEqual(r.status, 0, r.text);
  assert.equal(r.text.split('\n').filter((l) => /was not asked what it has/.test(l)).length, 1, r.text);
  assert.match(r.text, /names range \(3 commits\): 1 refusal/);
  assert.ok(!has(family, 'refs/heads/again'), 'nothing arrived');
  silent(r.text);
});

test('a merge that turns a submodule of one parent into a file is read', () => {
  const dir = tool();
  const start = g(dir, 'rev-parse', 'HEAD');
  g(dir, 'checkout', '-q', '-b', 'side');
  g(dir, 'update-index', '--add', '--cacheinfo', `160000,${start},vendor/lib`);
  g(dir, 'commit', '-q', '-m', 'build: a submodule');
  g(dir, 'checkout', '-q', 'main');
  commit(dir, { 'main.md': 'Main.\n' }, 'docs: main');
  spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '-q', '--no-commit', 'side'], { cwd: dir });
  g(dir, 'rm', '-q', '--cached', 'vendor/lib');
  rmSync(join(dir, 'vendor'), { recursive: true, force: true });
  const merge = commit(dir, { 'vendor/lib': `One.\nBy ${WORD}.\n` }, 'merge: side');
  assert.equal(g(dir, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
  const r = ws(['--dir', dir, `${start}..HEAD`]);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`commit ${merge.slice(0, 12)} vendor/lib:2: `), r.text);
  assert.ok(!/usage: git/.test(r.text), r.text);
  silent(r.text);
});

test('the hook template scans a push from a bare repository, from another folder, from a linked worktree and to a relative address', () => {
  const landed = (r, count) => { assert.equal(r.status, 0, r.text); assert.match(r.text, new RegExp(`names range \\(${count} commits?\\): clean`)); assert.ok(!/usage|could not be asked/.test(r.text), r.text); };
  const kept = (r, bad, file) => { assert.notEqual(r.status, 0, r.text); assert.ok(r.text.includes(`commit ${bad.slice(0, 12)} ${file}:1: `), r.text); assert.ok(!/usage/.test(r.text), r.text); silent(r.text); };

  // A bare repository, as a mirror clone is: it has no working tree.
  const family = bare('krzysztofdudek');
  const src = tool();
  commit(src, { 'a.md': 'A.\n' }, 'docs: a');
  const mirror = join(base, `Mirror${++n}.git`);
  g(base, 'clone', '-q', '--bare', src, mirror);
  cpSync(HOOK, join(mirror, 'hooks', 'pre-push'));
  chmodSync(join(mirror, 'hooks', 'pre-push'), 0o755);
  landed(send(mirror, [family, 'main']), 2);
  assert.ok(has(family, 'refs/heads/main'));
  const before = g(family, 'rev-parse', 'main');
  let bad = commit(src, { 'b.md': `By ${WORD}.\n` }, 'docs: b');
  g(mirror, 'fetch', '-q', src, '+main:main');
  kept(send(mirror, [family, 'main']), bad, 'b.md');
  assert.equal(g(family, 'rev-parse', 'main'), before, 'nothing arrived');

  // A push run from another folder, with GIT_DIR naming the repository.
  const family2 = bare('krzysztofdudek');
  const dir = tool();
  install(dir);
  const away = join(base, `away${++n}`);
  mkdirSync(away);
  const from = { more: { GIT_DIR: join(dir, '.git') } };
  landed(send(away, [family2, 'main'], from), 1);
  bad = commit(dir, { 'b.md': `By ${WORD}.\n` }, 'docs: b');
  kept(send(away, [family2, 'main'], from), bad, 'b.md');
  assert.notEqual(g(family2, 'rev-parse', 'main'), bad, 'nothing arrived');

  // A linked worktree of the repository.
  const family3 = bare('krzysztofdudek');
  const third = tool();
  install(third);
  g(third, 'remote', 'add', 'origin', family3);
  quiet(third, 'origin', 'main');
  const linked = join(base, `linked${++n}`);
  g(third, 'worktree', 'add', '-q', '-b', 'topic', linked);
  commit(linked, { 'c.md': 'C.\n' }, 'docs: c');
  landed(send(linked, ['origin', 'topic']), 1);
  bad = commit(linked, { 'd.md': `By ${WORD}.\n` }, 'docs: d');
  kept(send(linked, ['origin', 'topic']), bad, 'd.md');

  // A remote given by a relative address is asked where git resolves it: only the new commit is read.
  const family4 = bare('krzysztofdudek');
  const fourth = tool();
  install(fourth);
  g(fourth, 'remote', 'add', 'origin', relative(fourth, family4));
  quiet(fourth, 'origin', 'main');
  commit(fourth, { 'e.md': 'E.\n' }, 'docs: e');
  landed(send(fourth, ['origin', 'main']), 1);

  // No repository that git can name: one line, and no usage text.
  const lost = spawnSync('sh', [HOOK, 'origin', 'https://github.com/krzysztofdudek/Yggdrasil.git'], { cwd: away, input: '', encoding: 'utf8', env: env({ ALTHING_NAMES_KEY: KEY, ALTHING_ROOT: althing, GIT_DIR: join(base, 'no-such-repository') }) });
  assert.equal(lost.status, 1, `${lost.stdout}${lost.stderr}`);
  assert.equal(`${lost.stdout}${lost.stderr}`.trim().split('\n').length, 1, `${lost.stdout}${lost.stderr}`);
  assert.match(lost.stderr, /git directory/);
});
