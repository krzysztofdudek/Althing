import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDigests, parseList } from '../names.mjs';

const ALTHING = fileURLToPath(new URL('../..', import.meta.url));
const ZERO = '0'.repeat(40);
const CANONICAL = 'https://github.com/krzysztofdudek/Althing.git';

// An invented list under a test key: the real key and the real list never enter a test.
const KEY = '5a'.repeat(32);
const WORD = ['Quill', 'mark'].join('');
const PAIR = ['Bexley', 'Oaks'];
const LIST = `${WORD}\n${PAIR.join(' ')}\n`;

const ID = ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null'];
const g = (cwd, ...args) => execFileSync('git', [...ID, ...args], { cwd, stdio: 'pipe' }).toString().trim();

let base;
let rails;
let n = 0;

// A copy of the rails with digests of the invented list, as Althing's checkout holds the real ones.
before(() => {
  base = mkdtempSync(join(tmpdir(), 'althing-rails-run-'));
  rails = join(base, 'Althing', 'rails');
  cpSync(join(ALTHING, 'rails'), rails, { recursive: true, filter: (src) => !/\/rails\/(names|test)$/.test(src) });
  mkdirSync(join(rails, 'names'));
  writeFileSync(join(rails, 'names', 'digests.json'), JSON.stringify(buildDigests(KEY, parseList(LIST))));
});
after(() => rmSync(base, { recursive: true, force: true }));

function repo() {
  const dir = join(base, `repo${++n}`);
  mkdirSync(dir);
  g(dir, 'init', '-q', '-b', 'main');
  writeFileSync(join(dir, 'README.md'), '# A thing\n\nIt does one thing.\n');
  g(dir, 'add', '.');
  g(dir, 'commit', '-q', '-m', 'docs: the first commit');
  return dir;
}

function write(dir, files) {
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), text);
  }
  g(dir, 'add', '.');
}

function commit(dir, files, message) {
  write(dir, files);
  g(dir, 'commit', '-q', '-m', message);
  return g(dir, 'rev-parse', 'HEAD');
}

function run(dir, args, { input, key = KEY, more = {} } = {}) {
  const env = { ...process.env, HOME: join(base, 'home'), ALTHING_NAMES_KEY: key || '', ...more };
  for (const k of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_GRAFT_FILE']) if (!(k in more)) delete env[k];
  const r = spawnSync(process.execPath, [join(rails, 'run.mjs'), ...args], { cwd: dir, input, encoding: 'utf8', env });
  return { status: r.status, text: `${r.stdout}${r.stderr}` };
}

const range = (dir, from, to) => run(dir, ['range', from, to, '--require-key']);
const pushed = (dir, lines, url = CANONICAL) => run(dir, ['range', '--stdin', '--require-key', '--remote', url], { input: lines });
const refusals = (text, rail = 'names') => text.split('\n').filter((l) => l.startsWith(`${rail}: `));
const at = (sha, where) => `commit ${sha.slice(0, 12)} ${where}: `;
const silent = (text) => {
  const low = text.toLowerCase();
  for (const w of [WORD, ...PAIR]) assert.ok(!low.includes(w.toLowerCase()), 'the output never carries the name');
};

// Two branches that change the same line of a file, and a merge whose resolution is the text given.
function mergeOf(dir, path, side, main, resolved) {
  g(dir, 'checkout', '-q', '-b', 'side');
  const onSide = commit(dir, { [path]: side }, 'docs: side');
  g(dir, 'checkout', '-q', 'main');
  commit(dir, { [path]: main }, 'docs: main');
  spawnSync('git', [...ID, 'merge', '-q', 'side'], { cwd: dir });
  const merge = commit(dir, { [path]: resolved }, 'merge: side');
  assert.equal(g(dir, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
  return { merge, onSide };
}

test('the added lines of a file whose path git quotes in a diff are read: a space, a non-ASCII letter, a quote', () => {
  const paths = ['docs/my notes.md', 'docs/café.md', 'docs/say "hi".md'];
  const dir = repo();
  commit(dir, Object.fromEntries(paths.map((p) => [p, 'One.\n'])), 'docs: three files');
  const start = g(dir, 'rev-parse', 'HEAD');
  write(dir, Object.fromEntries(paths.map((p) => [p, `One.\nBy ${WORD}.\n`])));
  let r = run(dir, ['staged']);
  assert.equal(r.status, 1, r.text);
  for (const p of paths) assert.ok(r.text.includes(`names: ${p}:2: `), `${p}: ${r.text}`);
  g(dir, 'commit', '-q', '-m', 'docs: they grow');
  const head = g(dir, 'rev-parse', 'HEAD');
  r = range(dir, start, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.equal(refusals(r.text).length, 3, r.text);
  for (const p of paths) assert.ok(r.text.includes(`names: ${at(head, `${p}:2`)}`), `${p}: ${r.text}`);
  silent(r.text);
});
