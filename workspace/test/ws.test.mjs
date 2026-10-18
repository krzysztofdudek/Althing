import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { jarl, brief, freeze, indexes, newManifest, doctor, main } from '../ws.mjs';
import { parseFreeze, checkFreeze } from '../../rails/freeze.mjs';
import { validateManifest } from '../../rails/manifest.mjs';

const g = (cwd, ...args) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', ...args], { cwd, stdio: 'pipe' }).toString().trim();

// A stub of the driver Jarl: it records its arguments and writes the files
// init would, so ws can be tested without a sibling checkout.
const STUB = `import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const args = process.argv.slice(2);
const root = args[args.indexOf('--root') + 1];
const pos = args.filter((a, i) => a !== '--root' && args[i - 1] !== '--root');
appendFileSync(join(root, '..', '..', 'calls.log'), JSON.stringify(args) + '\\n');
if (args[0] === 'init') { mkdirSync(join(root, '.jarl', 'issues'), { recursive: true }); writeFileSync(join(root, '.jarl', 'goal.md'), pos[1]); writeFileSync(join(root, '.jarl', '.permanent'), ''); }
if (args[0] === 'status') console.log(JSON.stringify({ open: 1, inFlight: 0, waiting: 0, done: 0, deferred: 0, questions: 0, ratify: 0 }));
`;

function world() {
  const base = mkdtempSync(join(tmpdir(), 'althing-ws-'));
  const root = join(base, 'Althing');
  const jarlRepo = join(base, 'JarlSkill');
  mkdirSync(join(jarlRepo, 'skills', 'jarl', 'scripts'), { recursive: true });
  writeFileSync(join(jarlRepo, 'skills', 'jarl', 'scripts', 'jarl.mjs'), STUB);
  g(base, 'init', '-q', '-b', 'main', jarlRepo);
  g(jarlRepo, 'add', '.');
  g(jarlRepo, 'commit', '-q', '-m', 'stub');
  const pinned = g(jarlRepo, 'rev-parse', 'HEAD');
  mkdirSync(join(root, 'releases', '1.0.0'), { recursive: true });
  g(base, 'init', '-q', '-b', 'main', root);
  writeFileSync(join(root, 'ws.local.json'), JSON.stringify({ schema: 'ws-local/1', sources: { jarl: { path: '../JarlSkill' }, box: { path: '../Box', exec: 'docker exec -w /workspaces/Box box-dev', worktrees: '/wt' } }, worktrees: '~/.jarl-wt' }));
  const prev = { schema: 'family-release/1', release: '1.0.0', state: 'published', previous: null, repos: { tool: { version: '1.0.0', branch: 'release/1.0.0', commit: 'b'.repeat(40), tag: 'v1.0.0', npm: '@x/tool@1.0.0', check: 'npm test' }, lib: { version: '2.3.0', commit: 'c'.repeat(40) }, althing: { branch: 'main', check: 'yg check' } } };
  writeFileSync(join(root, 'releases', '1.0.0', 'family.json'), JSON.stringify(prev, null, 2));
  return { base, root, jarlRepo, pinned, cleanup: () => rmSync(base, { recursive: true, force: true }) };
}

function openRelease(w) {
  const code = main(['release', 'open', '1.1.0', '--previous', '1.0.0', '--goal', 'Ship 1.1.0.', '--driver-sibling', w.pinned], w.root);
  assert.equal(code, 0);
}

test('a new manifest moves the release-numbered repositories and keeps the others', () => {
  const prev = { release: '1.0.0', repos: { tool: { version: '1.0.0', npm: '@x/tool@1.0.0', check: 'npm test' }, lib: { version: '2.3.0' }, althing: { branch: 'main' } } };
  const m = newManifest(prev, { version: '1.1.0', previous: '1.0.0', versions: { lib: '2.4.0' }, driver: { jarl: { source: 'release', release: '1.0.0' } } });
  assert.deepEqual(m.repos.tool, { version: '1.1.0', branch: 'release/1.1.0', commit: null, tag: 'v1.1.0', npm: '@x/tool@1.1.0', check: 'npm test' });
  assert.equal(m.repos.lib.version, '2.4.0');
  assert.deepEqual(validateManifest(m, { dir: '1.1.0', previousExists: () => true }), []);
});

test('release open writes the manifest, the loop with its Check lines, the release issue, the nodes and the index', () => {
  const w = world();
  try {
    openRelease(w);
    const m = JSON.parse(readFileSync(join(w.root, 'releases', '1.1.0', 'family.json'), 'utf8'));
    assert.equal(m.state, 'open');
    assert.equal(m.driver.jarl.commit, w.pinned);
    const goal = readFileSync(join(w.root, 'releases', '1.1.0', '.jarl', 'goal.md'), 'utf8');
    assert.match(goal, /^Check: npm test \(in tool\)$/m);
    assert.match(goal, /^Check: yg check \(in althing\)$/m);
    const calls = readFileSync(join(w.root, 'calls.log'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    assert.deepEqual(calls.map((c) => c[0]), ['init', 'new']);
    assert.ok(calls[0].includes('--permanent'));
    assert.ok(calls[1].includes('release,needs-owner'));
    for (const n of ['release-1.1.0', 'release-1.1.0-loop', 'releases']) assert.ok(existsSync(join(w.root, '.yggdrasil', 'model', n, 'yg-node.yaml')), n);
    assert.match(readFileSync(join(w.root, '.yggdrasil', 'model', 'release-1.1.0', 'yg-node.yaml'), 'utf8'), /target: release-1\.0\.0/);
    assert.match(readFileSync(join(w.root, 'releases', 'INDEX.md'), 'utf8'), /\[1\.1\.0\]\(1\.1\.0\/family\.json\) \| open/);
    assert.equal(main(['release', 'open', '1.1.0', '--previous', '1.0.0', '--goal', 'again', '--driver-sibling', w.pinned], w.root), 1, 'one loop per directory');
  } finally {
    w.cleanup();
  }
});

test('ws jarl sets --root, and refuses a write when the driver checkout left its pin', () => {
  const w = world();
  try {
    openRelease(w);
    const argv = jarl(w.root, ['new', 'A title', '--tags', 'bug'], { spawn: false });
    assert.equal(argv[1], 'new');
    assert.deepEqual(argv.slice(2, 4), ['--root', join(w.root, 'releases', '1.1.0')]);
    writeFileSync(join(w.jarlRepo, 'NOTE.md'), 'moved');
    g(w.jarlRepo, 'add', '.');
    g(w.jarlRepo, 'commit', '-q', '-m', 'moved');
    assert.throws(() => jarl(w.root, ['new', 'A title'], { spawn: false }), /refused: the driver checkout/);
    assert.ok(jarl(w.root, ['status'], { spawn: false }).includes('status'), 'reads still run');
  } finally {
    w.cleanup();
  }
});

test('a brief renders this machine\'s values and refuses a missing one', () => {
  const w = world();
  try {
    openRelease(w);
    mkdirSync(join(w.root, 'releases', '1.1.0', 'briefs'), { recursive: true });
    writeFileSync(join(w.root, 'releases', '1.1.0', 'briefs', 'worker.md'), 'Loop {{root}} via {{jarl}}; code in {{repo:box}}, worktrees {{wt:box}}, run with "{{exec:box}}" and {{wt:jarl}}.\n{{issue}}\n{{trailer}}\n');
    writeFileSync(join(w.root, 'releases', '1.1.0', '.jarl', 'issues', '007-a-fix.md'), '# 007 \u00b7 A fix\n');
    const out = brief(w.root, ['worker', '--repo', 'box', '--issue', '7', '--trailer', 'Co-Authored-By: X <x@example.com>']);
    assert.match(out, new RegExp(`Loop ${join(w.root, 'releases', '1.1.0').replace(/[.]/g, '\\.')} via node `));
    assert.match(out, /run with "docker exec -w \/workspaces\/Box box-dev"/);
    assert.match(out, /worktrees \/wt,/);
    assert.match(out, /\.jarl-wt\./);
    assert.match(out, /# 007/);
    assert.throws(() => brief(w.root, ['worker', '--repo', 'box', '--issue', '7']), /\{\{trailer\}\}/);
    assert.throws(() => brief(w.root, ['reviewer']), /no brief template/);
  } finally {
    w.cleanup();
  }
});

test('freeze writes hashes the freeze rail accepts, and indexes render from the tree', () => {
  const w = world();
  try {
    const dir = join(w.root, 'research', '2026-10-05-a-study');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'README.md'), '**Question:** Q?\n**Method:** M.\n**Status:** open\n**Conclusion:** none yet.\n');
    writeFileSync(join(dir, 'report.md'), 'A report.\n');
    const r = freeze(w.root, 'research/2026-10-05-a-study');
    assert.equal(r.count, 2);
    const list = parseFreeze(readFileSync(join(dir, 'FROZEN.sha256'), 'utf8'));
    const files = ['README.md', 'report.md'].map((f) => ({ path: `research/2026-10-05-a-study/${f}`, content: readFileSync(join(dir, f), 'utf8') }));
    assert.deepEqual(checkFreeze({ root: 'research/2026-10-05-a-study', list, files }), []);
    assert.throws(() => freeze(w.root, 'method'), /takes releases/);
    const idx = indexes(w.root);
    assert.match(idx['research/INDEX.md'], /\| \[2026-10-05-a-study\]\(2026-10-05-a-study\/README\.md\) \| Q\? \| open \|/);
    assert.match(idx['releases/INDEX.md'], /\[1\.0\.0\]/);
  } finally {
    w.cleanup();
  }
});

test('doctor fails when a names key is present but does not match', () => {
  const w = world();
  try {
    mkdirSync(join(w.base, '.config', 'althing'), { recursive: true });
    writeFileSync(join(w.base, '.config', 'althing', 'names.key'), 'ab'.repeat(32));
    const by = Object.fromEntries(doctor(w.root, { home: w.base }).map((r) => [r.name, r]));
    assert.equal(by.names.level, 'FAIL');
    assert.match(by.names.detail, /does not match/);
  } finally {
    w.cleanup();
  }
});

test('doctor names what is missing on a bare machine', () => {
  const w = world();
  try {
    const rows = doctor(w.root, { home: w.base });
    const by = Object.fromEntries(rows.map((r) => [r.name, r]));
    assert.equal(by.hooks.level, 'FAIL');
    assert.equal(by.names.level, 'warn', 'no key is a contributor mode, not a failure');
    assert.match(by.names.detail, /cannot run the private-name scan/);
    assert.match(by.names.detail, /push to your own fork/);
    assert.match(by.names.detail, /maintainer scans a pull request's commits with the key before merging it, and CI scans every push to the canonical repository/);
    assert.doesNotMatch(by.names.detail, /Ask the owner/);
    assert.match(by['merge driver yg-log'].detail, /git config merge\.yg-log\.driver "git merge-file/);
    assert.match(by['merge driver yg-lock'].detail, /git config merge\.yg-lock\.driver "git merge-file/);
    assert.match(by['merge driver yg-log'].detail, /AGENTS\.md/);
    assert.equal(by['source box'].level, 'FAIL', 'a source that is not a checkout');
    assert.equal(by['source jarl'].level, 'ok');
    const fixed = Object.fromEntries(doctor(w.root, { fix: true, home: w.base }).map((r) => [r.name, r]));
    assert.equal(fixed.hooks.level, 'ok');
  } finally {
    w.cleanup();
  }
});
