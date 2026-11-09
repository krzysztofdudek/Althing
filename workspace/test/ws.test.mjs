import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { jarl, brief, freeze, indexes, newManifest, doctor, main, loopCounts } from '../ws.mjs';
import { loadLocal, worktreeRoot } from '../lib/local.mjs';
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
if (args[0] === 'brief') console.log('TOOL ' + args.join(' '));
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
  writeFileSync(join(root, 'ws.local.json'), JSON.stringify({ schema: 'ws-local/1', sources: { jarl: { path: '../JarlSkill' }, box: { path: '../Box', exec: 'docker exec -w /workspaces/Box box-dev', worktrees: '/wt' } }, worktrees: '~/Worktrees' }));
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
    assert.match(goal, /^Check \(tool\): npm test$/m, 'a tool repository gets the grammar the tool reads');
    assert.match(goal, /^Check: yg check$/m, 'the loop\'s own repository stays bare');
    const calls = readFileSync(join(w.root, 'calls.log'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    assert.deepEqual(calls.map((c) => c[0]), ['init', 'new']);
    assert.ok(calls[0].includes('--permanent'));
    assert.ok(calls[1].includes('release,needs-owner'));
    for (const call of calls) assert.ok(call.includes('--by'), `${call[0]} names its writer`);
    const lines = calls[1].filter((_, i) => calls[1][i - 1] === '--acceptance');
    assert.equal(lines.length, 2);
    for (const line of lines) assert.match(line, /^\[(read|owner)\] /, 'every line carries a method');
    assert.match(lines[1], /· material: .* · check: /, 'an owner line says what he looks at');
    for (const n of ['release-1.1.0', 'release-1.1.0-loop', 'releases']) assert.ok(existsSync(join(w.root, '.yggdrasil', 'model', n, 'yg-node.yaml')), n);
    assert.match(readFileSync(join(w.root, '.yggdrasil', 'model', 'release-1.1.0', 'yg-node.yaml'), 'utf8'), /target: release-1\.0\.0/);
    assert.match(readFileSync(join(w.root, 'releases', 'INDEX.md'), 'utf8'), /\[1\.1\.0\]\(1\.1\.0\/family\.json\) \| open/);
    assert.equal(main(['release', 'open', '1.1.0', '--previous', '1.0.0', '--goal', 'again', '--driver-sibling', w.pinned], w.root), 1, 'one loop per directory');
  } finally {
    w.cleanup();
  }
});

// A second driver source in the world: a checkout with its own stub, in ws.local.json under name.
function addDriver(w, name, stub) {
  const repo = join(w.base, name);
  mkdirSync(join(repo, 'skills', 'jarl', 'scripts'), { recursive: true });
  writeFileSync(join(repo, 'skills', 'jarl', 'scripts', 'jarl.mjs'), stub);
  g(w.base, 'init', '-q', '-b', 'main', repo);
  g(repo, 'add', '.');
  g(repo, 'commit', '-q', '-m', 'stub');
  const local = join(w.root, 'ws.local.json');
  const doc = JSON.parse(readFileSync(local, 'utf8'));
  doc.sources[name] = { path: `../${name}` };
  writeFileSync(local, JSON.stringify(doc));
  return { repo, pinned: g(repo, 'rev-parse', 'HEAD') };
}

function setPrevDriver(w, driver) {
  const f = join(w.root, 'releases', '1.0.0', 'family.json');
  writeFileSync(f, JSON.stringify({ ...JSON.parse(readFileSync(f, 'utf8')), driver: { jarl: driver } }, null, 2));
}

const open = (w, commit, ...more) => main(['release', 'open', '1.1.0', '--previous', '1.0.0', '--goal', 'Ship 1.1.0.', '--driver-sibling', commit, ...more], w.root);
const leftovers = (w) => ['releases/1.1.0', '.yggdrasil/model/release-1.1.0', '.yggdrasil/model/release-1.1.0-loop'].filter((p) => existsSync(join(w.root, p)));
const REFUSES_BY = `if (process.argv.includes('--by')) { console.error('unknown flag --by'); process.exit(1); }\n${STUB}`;

test('release open runs the driver the previous release names, not the checkout called jarl', () => {
  const w = world();
  try {
    writeFileSync(join(w.jarlRepo, 'skills', 'jarl', 'scripts', 'jarl.mjs'), REFUSES_BY);
    const next = addDriver(w, 'jarl-next', STUB);
    setPrevDriver(w, { source: 'sibling', repo: 'jarl-next', commit: next.pinned });
    assert.equal(open(w, next.pinned), 0);
    const m = JSON.parse(readFileSync(join(w.root, 'releases', '1.1.0', 'family.json'), 'utf8'));
    assert.equal(m.driver.jarl.repo, 'jarl-next');
    assert.equal(m.driver.jarl.commit, next.pinned);
  } finally {
    w.cleanup();
  }
});

test('release open takes a driver source named on the command line', () => {
  const w = world();
  try {
    writeFileSync(join(w.jarlRepo, 'skills', 'jarl', 'scripts', 'jarl.mjs'), REFUSES_BY);
    const other = addDriver(w, 'jarl-other', STUB);
    assert.equal(open(w, other.pinned, '--driver-source', 'jarl-other'), 0);
    assert.equal(JSON.parse(readFileSync(join(w.root, 'releases', '1.1.0', 'family.json'), 'utf8')).driver.jarl.repo, 'jarl-other');
  } finally {
    w.cleanup();
  }
});

test('release open refuses a driver checkout that is not on the commit named, and writes nothing', () => {
  const w = world();
  try {
    const next = addDriver(w, 'jarl-next', STUB);
    writeFileSync(join(next.repo, 'NOTE.md'), 'moved');
    g(next.repo, 'add', '.');
    g(next.repo, 'commit', '-q', '-m', 'moved');
    assert.equal(open(w, next.pinned, '--driver-source', 'jarl-next'), 1);
    assert.deepEqual(leftovers(w), []);
  } finally {
    w.cleanup();
  }
});

test('a release open that fails leaves nothing behind, so a retry can run', () => {
  const w = world();
  try {
    const bad = addDriver(w, 'jarl-bad', `${STUB}\nif (args[0] === 'new') { console.error('refused'); process.exit(1); }\n`);
    assert.equal(open(w, bad.pinned, '--driver-source', 'jarl-bad'), 1);
    assert.deepEqual(leftovers(w), [], 'neither the directory, the loop nor the nodes stay');
    const good = addDriver(w, 'jarl-good', STUB);
    assert.equal(open(w, good.pinned, '--driver-source', 'jarl-good'), 0, 'the retry is not refused');
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
    assert.match(out, new RegExp(`and ${join(homedir(), 'Worktrees').replace(/[.]/g, '\\.')}\\.`), 'the default worktree root is ~/Worktrees');
    assert.doesNotMatch(out, /\.jarl-wt/);
    assert.match(out, /# 007/);
    assert.throws(() => brief(w.root, ['worker', '--repo', 'box', '--issue', '7']), /\{\{trailer\}\}/);
    assert.throws(() => brief(w.root, ['reviewer']), /no brief template/);
  } finally {
    w.cleanup();
  }
});

// A loop of the current format: its goal.md holds the Format line.
function formatFour(w) {
  const goal = join(w.root, 'releases', '1.1.0', '.jarl', 'goal.md');
  writeFileSync(goal, `${readFileSync(goal, 'utf8')}\n\nFormat: 4\n`);
}

test('on a loop of the current format, ws brief is the tool\'s brief, then the release\'s additions', () => {
  const w = world();
  try {
    openRelease(w);
    formatFour(w);
    mkdirSync(join(w.root, 'releases', '1.1.0', 'briefs'), { recursive: true });
    writeFileSync(join(w.root, 'releases', '1.1.0', 'briefs', 'worker-box.md'), '## Added\nIn {{repo:box}}, tool {{jarl}}.\n');
    const worker = brief(w.root, ['worker', '--issue', '7,8', '--repo', 'box']);
    assert.match(worker, /^TOOL brief 7,8 --root /, 'the tool assembles the brief');
    assert.ok(worker.indexOf('TOOL') < worker.indexOf('## Added'), 'the additions come after');
    assert.match(worker, /In .*Box, tool node /, 'the additions are rendered for this machine');
    const reviewer = brief(w.root, ['reviewer', '--issue', '7']);
    assert.match(reviewer, /^TOOL brief 7 --role reviewer --root /);
    const merger = brief(w.root, ['merger', '--slice', 'odin']);
    assert.match(merger, /^TOOL brief --role merger --slice odin --root /);
    assert.throws(() => brief(w.root, ['worker']), /needs --issue/);
    assert.throws(() => brief(w.root, ['scribe', '--issue', '7']), /no brief for role/);
  } finally {
    w.cleanup();
  }
});

test('a loop that holds no Format line keeps its template brief under its own driver', () => {
  const w = world();
  try {
    openRelease(w);
    mkdirSync(join(w.root, 'releases', '1.1.0', 'briefs'), { recursive: true });
    writeFileSync(join(w.root, 'releases', '1.1.0', 'briefs', 'worker.md'), 'Template {{root}} {{issue}}\n');
    writeFileSync(join(w.root, 'releases', '1.1.0', '.jarl', 'issues', '007-a-fix.md'), '# 007 · A fix\n');
    const out = brief(w.root, ['worker', '--issue', '7']);
    assert.match(out, /^Template /);
    assert.doesNotMatch(out, /TOOL/, 'the tool has no brief on this loop');
  } finally {
    w.cleanup();
  }
});

test('the writing guard follows the loop\'s format', () => {
  const w = world();
  try {
    openRelease(w);
    writeFileSync(join(w.jarlRepo, 'NOTE.md'), 'moved');
    g(w.jarlRepo, 'add', '.');
    g(w.jarlRepo, 'commit', '-q', '-m', 'moved');
    assert.throws(() => jarl(w.root, ['body', '7', '--what', 'x'], { spawn: false }), /refused/, 'body writes a loop of the older format');
    assert.ok(jarl(w.root, ['field', '7', 'Tags', 'a'], { spawn: false }).includes('field'), 'field is no command of the older driver the guard knows');
    formatFour(w);
    assert.throws(() => jarl(w.root, ['field', '7', 'Tags', 'a'], { spawn: false }), /refused/, 'field writes a loop of the current format');
    assert.throws(() => jarl(w.root, ['goal', '--set', 'Check: x'], { spawn: false }), /refused/, 'goal --set writes');
    assert.ok(jarl(w.root, ['goal'], { spawn: false }).includes('goal'), 'goal alone reads');
  } finally {
    w.cleanup();
  }
});

test('ws status prints the counts at the top level, and those a loop with a profile nests under statuses', () => {
  const flat = { open: 3, inFlight: 1, waiting: 2, done: 4, deferred: 5, questions: 6, ratify: 7 };
  assert.equal(loopCounts(flat), 'open 3, in flight 1, waiting 2, done 4, deferred 5, questions 6, to ratify 7');
  const nested = { statuses: { open: 3, 'in-progress': 1, done: 4, dropped: 9, deferred: 5, parked: 8 }, inFlight: 1, waiting: 2, questions: 6, ratify: 7 };
  assert.equal(loopCounts(nested), 'open 3, in flight 1, waiting 2, done 4, deferred 5, parked 8, questions 6, to ratify 7');
  assert.doesNotMatch(loopCounts(nested), /undefined/);
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

test('a worktree is <root>/<Repository>/<name> under a root that defaults to ~/Worktrees', () => {
  const w = world();
  try {
    openRelease(w);
    const defaults = { sources: { jarl: { path: '../JarlSkill' } }, worktrees: null };
    assert.equal(worktreeRoot(w.root, defaults, 'jarl'), join(homedir(), 'Worktrees'));
    writeFileSync(join(w.root, 'ws.local.json'), JSON.stringify({ schema: 'ws-local/1', sources: { jarl: { path: '../JarlSkill' } } }));
    assert.equal(loadLocal(w.root).worktrees, '~/Worktrees', 'a ws.local.json without a root gets the host place');
    mkdirSync(join(w.root, 'releases', '1.1.0', 'briefs'), { recursive: true });
    writeFileSync(join(w.root, 'releases', '1.1.0', 'briefs', 'worker.md'), 'Worktree {{wt:jarl}}/JarlSkill/7-a-fix, driver {{wt:jarl}}/JarlSkill/driver.\n');
    const out = brief(w.root, ['worker']);
    assert.equal(out.trim(), `Worktree ${join(homedir(), 'Worktrees', 'JarlSkill', '7-a-fix')}, driver ${join(homedir(), 'Worktrees', 'JarlSkill', 'driver')}.`);
  } finally {
    w.cleanup();
  }
});

test('doctor warns when the worktree root is the old place and names the layout when it is not', () => {
  const w = world();
  try {
    const rowOf = () => doctor(w.root, { home: w.base }).find((r) => r.name === 'worktrees');
    const set = (worktrees) => writeFileSync(join(w.root, 'ws.local.json'), JSON.stringify({ schema: 'ws-local/1', sources: { jarl: { path: '../JarlSkill' } }, worktrees }));
    set('~/.jarl-wt');
    assert.equal(rowOf().level, 'warn');
    assert.match(rowOf().detail, /old place/);
    assert.match(rowOf().detail, /~\/Worktrees\/<Repository>\/<name>/);
    set(join(w.base, 'Worktrees'));
    assert.equal(rowOf().level, 'warn', 'a root that does not exist yet');
    assert.match(rowOf().detail, /does not exist yet; a worktree goes in .*\/Worktrees\/<Repository>\/<name>/);
    mkdirSync(join(w.base, 'Worktrees'));
    assert.equal(rowOf().level, 'ok');
    assert.match(rowOf().detail, /exists; a worktree goes in .*\/Worktrees\/<Repository>\/<name>/);
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
