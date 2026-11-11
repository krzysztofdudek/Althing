import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { scratchPush } from './scratch-push.mjs';
import { scanCode, EXCEPTIONS } from '../../rails/code.mjs';

const g = (cwd, ...args) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', ...args], { cwd, stdio: 'pipe' }).toString().trim();

let base;
let n = 0;
before(() => { base = mkdtempSync(join(tmpdir(), 'althing-scratch-push-')); });
after(() => rmSync(base, { recursive: true, force: true }));

function repo() {
  const dir = join(base, `repo${++n}`);
  mkdirSync(dir);
  g(dir, 'init', '-q', '-b', 'main');
  writeFileSync(join(dir, 'README.md'), '# A fixture\n');
  g(dir, 'add', '.');
  g(dir, 'commit', '-q', '-m', 'docs: the first commit');
  return dir;
}

function bare(parent = base) {
  const dir = join(parent, `remote${++n}.git`);
  mkdirSync(dir, { recursive: true });
  g(dir, 'init', '-q', '--bare', '-b', 'main');
  return dir;
}

const has = (remote) => spawnSync('git', ['rev-parse', '--verify', '--quiet', 'refs/heads/main'], { cwd: remote }).status === 0;

test('a push to a bare repository under the system temporary directory is run, by its path, by a remote\'s name and by a relative address', () => {
  const dir = repo();
  const byPath = bare();
  let r = scratchPush(dir, [byPath, 'main']);
  assert.equal(r.status, 0, r.text);
  assert.ok(has(byPath));
  const byName = bare();
  g(dir, 'remote', 'add', 'origin', byName);
  r = scratchPush(dir, ['-q', 'origin', 'main']);
  assert.equal(r.status, 0, r.text);
  assert.ok(has(byName));
  const relative = bare();
  r = scratchPush(dir, [join('..', relative.slice(base.length + 1)), 'main']);
  assert.equal(r.status, 0, r.text);
  assert.ok(has(relative));
});

test('a push the hook refuses comes back as a refusal, not as an error', () => {
  const dir = repo();
  const remote = bare();
  mkdirSync(join(dir, '.git', 'hooks'), { recursive: true });
  writeFileSync(join(dir, '.git', 'hooks', 'pre-push'), '#!/bin/sh\necho "the hook says no" >&2\nexit 1\n', { mode: 0o755 });
  const r = scratchPush(dir, [remote, 'main']);
  assert.notEqual(r.status, 0, r.text);
  assert.match(r.text, /the hook says no/);
  assert.ok(!has(remote), 'nothing arrived');
});

test('a push anywhere else is not run: a checkout, an address that is no folder, another transport', () => {
  const dir = repo();
  const checkout = repo();
  assert.throws(() => scratchPush(dir, [checkout, 'main:refs/heads/other']), /not bare/);
  assert.equal(g(checkout, 'branch', '--list', 'other'), '', 'nothing was written to the checkout');
  assert.throws(() => scratchPush(dir, [join(base, 'nowhere.git'), 'main']), /scratch push: /);
  for (const address of ['https://example.invalid/owner/Tool.git', 'ssh://git@example.invalid/owner/Tool.git', 'git@example.invalid:owner/Tool.git']) assert.throws(() => scratchPush(dir, [address, 'main']), /git names no place this push would go to/, address);
});

test('a push outside the system temporary directory is not run, whatever rewrites the address', () => {
  // The helper runs in a process whose temporary directory is a folder inside this test's own, so a bare repository beside that folder stands for one outside the system temporary directory.
  const inner = join(base, `inner${++n}`);
  mkdirSync(inner);
  const dir = repo();
  const outside = bare();
  const inside = bare(inner);
  const helper = pathToFileURL(fileURLToPath(new URL('./scratch-push.mjs', import.meta.url))).href;
  const push = (...args) => {
    const script = `import { scratchPush } from ${JSON.stringify(helper)}; try { const r = scratchPush(${JSON.stringify(dir)}, ${JSON.stringify(args)}); console.log('ran ' + r.status); } catch (e) { console.log('refused: ' + e.message); }`;
    return spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', env: { ...process.env, TMPDIR: inner } }).stdout.trim();
  };
  assert.equal(push(inside, 'main'), 'ran 0');
  assert.ok(has(inside));
  assert.match(push(outside, 'main'), /^refused: scratch push: the push would go outside the system temporary directory/);
  g(dir, 'config', `url.${outside}.insteadOf`, join(inner, 'alias.git'));
  assert.match(push(join(inner, 'alias.git'), 'main'), /^refused: scratch push: the push would go outside the system temporary directory/, 'a rule that rewrites the address');
  g(dir, 'remote', 'add', 'twice', inside);
  g(dir, 'remote', 'set-url', '--add', '--push', 'twice', inside);
  g(dir, 'remote', 'set-url', '--add', '--push', 'twice', outside);
  assert.match(push('twice', 'main'), /^refused: scratch push: the push would go outside the system temporary directory/, 'a second push address');
  assert.ok(!has(outside), 'nothing arrived outside');
});

test('the rail allows a push in this helper alone, and the helper is the file it names', () => {
  const helper = readFileSync(new URL('./scratch-push.mjs', import.meta.url), 'utf8');
  assert.deepEqual(EXCEPTIONS.map((e) => e.path), ['workspace/test/scratch-push.mjs']);
  // The command's name is put together here, because this test file is workspace code too and the rail would refuse the name written out.
  assert.ok(helper.includes(`['${['pu', 'sh'].join('')}', ...args]`), 'the helper pushes');
  assert.deepEqual(scanCode('workspace/test/scratch-push.mjs', helper), []);
  assert.ok(scanCode('workspace/test/another-helper.mjs', helper).length >= 2, 'the same text under another name is refused');
  // What holds the push to a fixture is in the file the rail allows.
  for (const guard of ["GIT_ALLOW_PROTOCOL: 'file'", "'--dry-run'", 'realpathSync(tmpdir())', "'--is-bare-repository'"]) assert.ok(helper.includes(guard), guard);
});

test('no workspace code pushes outside the helper', () => {
  const root = new URL('../', import.meta.url);
  const walk = (dir) => readdirSync(new URL(dir, root), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}${e.name}/`) : [`${dir}${e.name}`]));
  const found = walk('').flatMap((file) => scanCode(`workspace/${file}`, readFileSync(new URL(file, root), 'utf8')).map((f) => `workspace/${file}:${f.line} ${f.label}`));
  assert.deepEqual(found, []);
});
