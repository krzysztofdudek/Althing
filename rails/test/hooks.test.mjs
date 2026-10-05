import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanMessageRail, scanBranch } from '../messages.mjs';
import { newProperNouns, parseNouns } from '../nouns.mjs';
import { checkHooks, checkCi } from '../hooks.mjs';
import { addedLines } from '../git.mjs';

const POLISH = readFileSync(new URL('./fixtures/english/polish.md', import.meta.url), 'utf8').split('\n')[2];

const RUN = fileURLToPath(new URL('../run.mjs', import.meta.url));
const TRAILER = 'Co-Authored-By: A Model <noreply@example.com>';

test('a clean English message with the attribution trailer passes', () => {
  assert.deepEqual(scanMessageRail(`rails: a fix\n\nThe body says why, with a link to https://github.com/krzysztofdudek/Althing and https://chrisdudek.com.\n\n${TRAILER}\n`), []);
});

test('session links, private hosts, local paths and extra trailers are refused', () => {
  const session = ['https://', 'claude', '.ai/code/session_x'].join('');
  assert.equal(scanMessageRail(`x: y\n\nSee ${session} for context.\n\n${TRAILER}\n`).length, 1);
  assert.equal(scanMessageRail(`x: y\n\nOn http://intranet.example.lan/wiki.\n`).length, 1);
  assert.equal(scanMessageRail(`x: y\n\nRan in ${'/'}Users/someone/x.\n`).length, 1);
  assert.equal(scanMessageRail(`x: y\n\nBody.\n\n${TRAILER}\nClaude-Session: abc\n`).length, 1);
  assert.equal(scanMessageRail(`x: y\n\nBody.\n\nSigned-off-by: A <a@b.c>\n`).length, 1);
  assert.deepEqual(scanMessageRail('x: y\n\nNote: this line is prose inside the body.\nIt goes on.\n\nLast paragraph.\n'), []);
});

test('Polish in a message or a branch name is refused', () => {
  assert.ok(scanMessageRail(`x: y

${POLISH}
`).length >= 1);
  assert.equal(scanBranch(`jarl/123-${'pop' + 'rawka'}`).length, 1);
  assert.deepEqual(scanBranch('jarl/123-fix'), []);
});

test('the proper-noun glance skips sentence starts and known words', () => {
  const known = parseNouns('# family\nYggdrasil\nGitHub\n');
  const lines = [{ path: 'a.md', line: 1, text: 'Yggdrasil runs on GitHub, and Quorvant reviews it. Then it ships.' }, { path: 'a.mjs', line: 1, text: 'const Zeta = 1' }];
  assert.deepEqual(newProperNouns(lines, known).map((x) => x.word), ['Quorvant']);
});

const HOOK = (body) => `#!/bin/sh\n${body}\n`;
const GOOD = {
  '.githooks/pre-commit': HOOK('if command -v yg >/dev/null 2>&1; then yg check; else npx --yes @chrisdudek/yg@6.1.0 check; fi\nexec node rails/run.mjs staged'),
  '.githooks/commit-msg': HOOK('exec node rails/run.mjs message "$1"'),
  '.githooks/pre-push': HOOK('exec node rails/run.mjs range --stdin --require-key'),
  '.githooks/post-merge': HOOK('exec npx --yes @chrisdudek/yg@6.1.0 log merge-resolve'),
};
const CI = 'run: node --test x\nrun: npx --yes @chrisdudek/yg@6.1.0 check --approve --only-deterministic\nrun: npx --yes @chrisdudek/yg@6.1.0 check --no-approve\nALTHING_NAMES_KEY: ${{ secrets.ALTHING_NAMES_KEY }}\nrun: node ../base/rails/run.mjs range "$B" HEAD --tree --require-key\nrun: node rails/run.mjs history --require-key\n';

test('the hooks and rails.yml are wired with one yg pin', () => {
  assert.deepEqual(checkHooks(GOOD, CI), []);
  assert.deepEqual(checkCi('.github/workflows/rails.yml', CI), []);
  assert.equal(checkHooks({ ...GOOD, '.githooks/pre-push': HOOK('exec node rails/run.mjs range --stdin') }, CI).length, 1);
  assert.equal(checkHooks(GOOD, CI.replaceAll('6.1.0', '6.2.0')).length, 1, 'the CI pin disagrees with the hooks');
  assert.equal(checkHooks(GOOD, null).length, 1);
  assert.equal(checkCi('rails.yml', CI.replace('history', 'tree')).length, 1);
});

test('added line numbers come from a zero-context diff', () => {
  const diff = 'diff --git a/x.md b/x.md\n--- a/x.md\n+++ b/x.md\n@@ -1,0 +2,2 @@\n+two\n+three\n@@ -9 +11 @@\n-old\n+eleven\n';
  assert.deepEqual([...addedLines(diff).get('x.md')], [[2, 'two'], [3, 'three'], [11, 'eleven']]);
});

function repo() {
  const dir = mkdtempSync(join(tmpdir(), 'althing-run-'));
  const g = (...args) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', ...args], { cwd: dir, stdio: 'pipe' }).toString();
  g('init', '-q', '-b', 'main');
  return { dir, g, run: (...args) => spawnSync(process.execPath, [RUN, ...args], { cwd: dir, encoding: 'utf8', env: { ...process.env, ALTHING_NAMES_KEY: '' } }) };
}

test('range: a commit that adds Polish, a secret and a binary is refused; a clean one passes', () => {
  const r = repo();
  try {
    writeFileSync(join(r.dir, 'README.md'), '# Clean\n\nAn English line.\n');
    r.g('add', '.');
    r.g('commit', '-q', '-m', `docs: a clean start\n\n${TRAILER}`);
    const base = r.g('rev-parse', 'HEAD').trim();
    const clean = r.run('range', '0000000000000000000000000000000000000000', base);
    assert.equal(clean.status, 0, clean.stderr);
    writeFileSync(join(r.dir, 'README.md'), `# Clean

An English line.
${POLISH}
${['AKIA', 'Q'.repeat(16)].join('')}\n`);
    writeFileSync(join(r.dir, 'shot.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1, 2]));
    r.g('add', '.');
    r.g('commit', '-q', '-m', 'docs: more');
    const head = r.g('rev-parse', 'HEAD').trim();
    const bad = r.run('range', base, head);
    assert.equal(bad.status, 1);
    for (const rail of ['lang/english', 'secrets-range', 'boundary/no-binaries']) assert.match(bad.stderr, new RegExp(`${rail}: commit `), rail);
    assert.doesNotMatch(bad.stderr, /README\.md:3:/, 'the unchanged line is not reported again');
  } finally {
    rmSync(r.dir, { recursive: true, force: true });
  }
});

test('range --require-key refuses when the names rail cannot run here', () => {
  const r = repo();
  try {
    writeFileSync(join(r.dir, 'a.md'), 'English.\n');
    r.g('add', '.');
    r.g('commit', '-q', '-m', 'docs: a');
    const head = r.g('rev-parse', 'HEAD').trim();
    const out = spawnSync(process.execPath, [RUN, 'range', '--stdin', '--require-key'], { cwd: r.dir, encoding: 'utf8', input: `refs/heads/main ${head} refs/heads/main 0000000000000000000000000000000000000000\n`, env: { ...process.env, ALTHING_NAMES_KEY: '', HOME: r.dir } });
    assert.equal(out.status, 1);
    assert.match(out.stderr, /names: .*(not initialised|no key)/);
  } finally {
    rmSync(r.dir, { recursive: true, force: true });
  }
});

test('message and staged modes', () => {
  const r = repo();
  try {
    const msg = join(r.dir, 'MSG');
    writeFileSync(msg, `rails: a fix\n\nWhy it matters.\n\n${TRAILER}\n`);
    assert.equal(r.run('message', msg).status, 0);
    writeFileSync(msg, 'rails: a fix\n\nClaude-Session: x\n');
    assert.equal(r.run('message', msg).status, 1);
    mkdirSync(join(r.dir, 'notes', '.jarl'), { recursive: true });
    writeFileSync(join(r.dir, 'notes', '.jarl', 'goal.md'), '# Goal\n');
    r.g('add', '.');
    const st = r.run('staged');
    assert.equal(st.status, 1);
    assert.match(st.stderr, /loop\/shape: .*outside releases/);
  } finally {
    rmSync(r.dir, { recursive: true, force: true });
  }
});
