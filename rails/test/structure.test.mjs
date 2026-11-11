import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scanLinks, entryCovers, globToRegExp } from '../links.mjs';
import { checkRoot, checkKebab } from '../layout.mjs';
import { checkSkill } from '../skills.mjs';
import { scanCode, EXCEPTIONS } from '../code.mjs';
import { check as linksCheck } from '../aspects/links-resolve.mjs';

test('mapping entries: files, directories and globs', () => {
  assert.ok(entryCovers('*.md', 'README.md'));
  assert.ok(!entryCovers('*.md', 'method/a.md'));
  assert.ok(entryCovers('method/', 'method/language.md'));
  assert.ok(entryCovers('rails/aspects/', 'rails/aspects/x.mjs'));
  assert.ok(entryCovers('rails/test/*.test.mjs', 'rails/test/a.test.mjs'));
  assert.ok(!entryCovers('rails/test/*.test.mjs', 'rails/test/fixtures/a.test.mjs'));
  assert.ok(globToRegExp('research/**/README.md').test('research/2026-10-05-x/README.md'));
});

test('links resolve in the own region and in declared ones only', () => {
  const files = new Set(['README.md', 'AGENTS.md', 'method/language.md', 'rails/README.md']);
  const exists = (p) => (files.has(p) ? 'file' : false);
  const own = ['*.md'];
  const method = ['method/'];
  const file = { path: 'README.md', content: '[a](AGENTS.md) [b](method/language.md) [c](rails/README.md) [d](missing.md) [e](method/gone.md#x) [f](https://github.com/x) [g](#top)\n\n```\n[h](nowhere.md)\n```\n`[i](nowhere.md)`' };
  const found = scanLinks(file, { regions: [own, method], exists });
  assert.deepEqual(found.map((f) => f.target), ['rails/README.md', 'missing.md', 'method/gone.md']);
  assert.match(found[0].reason, /does not declare/);
  assert.match(found[1].reason, /does not exist/);
});

test('a link to a directory that holds mapped files passes', () => {
  const found = scanLinks({ path: 'README.md', content: '[m](method/) [w](workspace)' }, { regions: [['*.md'], ['method/language.md'], ['workspace/']], exists: () => 'dir' });
  assert.deepEqual(found, []);
});

test('the links adapter reads the declared relations through the graph', () => {
  const nodes = { root: { id: 'root', mapping: ['*.md'] }, method: { id: 'method', mapping: ['method/'] } };
  const ctx = {
    node: nodes.root,
    graph: { relationsFrom: () => [{ type: 'uses', target: 'method' }], node: (id) => nodes[id] },
    fs: { exists: (p) => (p === 'method/language.md' ? 'file' : false) },
    files: [{ path: 'AGENTS.md', content: '[x](method/language.md) [y](method/nope.md)' }],
  };
  const v = linksCheck(ctx);
  assert.equal(v.length, 1);
  assert.match(v[0].message, /method\/nope\.md/);
});

test('the root holds only its files, and package.json stays private with no dependencies', () => {
  const pkg = (o) => ({ path: 'package.json', content: JSON.stringify({ private: true, type: 'module', engines: { node: '>=22' }, ...o }) });
  assert.deepEqual(checkRoot([{ path: 'README.md', content: '' }, pkg({})]), []);
  assert.equal(checkRoot([{ path: 'NOTES.md', content: '' }]).length, 1);
  assert.equal(checkRoot([pkg({ dependencies: { x: '1' } })]).length, 1);
  assert.equal(checkRoot([pkg({ private: false })]).length, 1);
});

test('kebab-case names below the region, conventional upper-case names allowed', () => {
  assert.equal(checkKebab('method/working-model.md'), null);
  assert.equal(checkKebab('method/INDEX.md'), null);
  assert.equal(checkKebab('family/registry.json'), null);
  assert.ok(checkKebab('method/Working_Model.md'));
  assert.ok(checkKebab('method/notes/Draft.md'));
});

test('skill frontmatter: the name is the directory, the description says when', () => {
  const ok = '---\nname: handling-issues\ndescription: Use when a report arrives.\n---\n# x\n';
  assert.deepEqual(checkSkill('.claude/skills/handling-issues/SKILL.md', ok), []);
  assert.equal(checkSkill('.claude/skills/other/SKILL.md', ok).length, 1);
  assert.equal(checkSkill('.claude/skills/handling-issues/SKILL.md', ok.replace('Use when', 'Helps when')).length, 1);
  assert.equal(checkSkill('.claude/skills/handling-issues/SKILL.md', `---\nname: handling-issues\ndescription: Use when ${'x'.repeat(1100)}\n---\n`).length, 1);
  assert.equal(checkSkill('.claude/skills/handling-issues/SKILL.md', '# no frontmatter').length, 1);
  assert.deepEqual(checkSkill('.claude/skills/handling-issues/reference.md', '# anything'), []);
});

test('workspace code never writes to a remote or a tool', () => {
  const bad = [
    'run(`git push origin main`)',
    "spawnSync('git', ['push', 'origin'])",
    "execFileSync('git', ['tag', 'v1.0.0'])",
    'git tag -a v1 -m x',
    'npm publish --access public',
    "spawn('npm', ['publish'])",
    'gh release create v1',
    'gh repo edit krzysztofdudek/x --add-topic y',
    'gh pr merge 12',
    'gh issue comment 3 --body x',
    "spawn('gh', ['issue', 'close', '3'])",
    'gh api repos/x/y/labels -X POST -f name=z',
    "spawn('gh', ['api', 'repos/x', '--method', 'PATCH'])",
  ];
  for (const b of bad) assert.equal(scanCode('workspace/lib/x.mjs', b).length, 1, b);
  const good = [
    "spawnSync('git', ['tag', '--points-at', 'HEAD'])",
    'git tag -l "v*"',
    'git fetch --tags origin',
    "spawnSync('gh', ['issue', 'list', '--json', 'number'])",
    'gh api repos/x/y',
    'npm view @chrisdudek/yg version',
  ];
  for (const g of good) assert.deepEqual(scanCode('workspace/lib/x.mjs', g), [], g);
  assert.deepEqual(scanCode('workspace/README.md', 'it never runs git push'), [], 'only code files');
});

test('a push is seen in every shape a call takes', () => {
  const pushes = [
    'run(`git push origin main`)',
    'run(`git -C ${dir} push origin main`)',
    'sh -c "git -c user.name=Test -c user.email=test@example.com push -q origin main"',
    'git --git-dir=/x/.git push origin HEAD',
    "spawnSync('git', ['push', 'origin'])",
    "execFileSync('git', ['push', 'origin', 'main'], { cwd })",
    "spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'push', ...args], { cwd: dir })",
    "execFileSync('git', ['-C', dir, 'push', 'origin'])",
    'spawn("git", ["-C", dir, "push"])',
    "const quiet = (dir, ...args) => g(dir, 'push', '-q', ...args);",
    "const command = 'push';",
    "const args = ['push', 'origin', 'main'];",
    'const args = [`push`, remote];',
    "spawnSync('git', ['send-pack', remote, 'main'])",
    'git send-pack ../other main',
  ];
  for (const p of pushes) assert.deepEqual(scanCode('workspace/lib/x.mjs', p).map((f) => f.label), ['git push'], p);
  for (const p of pushes) assert.equal(scanCode('workspace/test/x.test.mjs', p).length, 1, `a test file is workspace code too: ${p}`);
  const not = [
    'out.push({ line: i + 1, label });',
    'git fetch --tags origin',
    'git -C dir fetch origin',
    'git commit -m "docs: what a pre-push hook reads"',
    "spawnSync('git', ['rev-parse', '--verify', 'HEAD'])",
    "const hook = join(dir, '.git', 'hooks', 'pre-push');",
    "g(dir, 'config', `url.${from}.pushInsteadOf`, from);",
    "g(dir, 'remote', 'set-url', '--push', 'origin', family);",
  ];
  for (const n of not) assert.deepEqual(scanCode('workspace/lib/x.mjs', n), [], n);
});

test('a push is allowed in the one file the rail names, and nothing else is allowed there', () => {
  assert.deepEqual(EXCEPTIONS, [{ name: 'scratch-fixture-push', path: 'workspace/test/scratch-push.mjs', label: 'git push' }]);
  const pushing = "const r = git(['push', ...args]);\nspawnSync('git', ['-c', 'core.hooksPath=/dev/null', 'push', '--dry-run'])\n";
  assert.deepEqual(scanCode('workspace/test/scratch-push.mjs', pushing), []);
  for (const other of ['workspace/test/scratch-push.test.mjs', 'workspace/test/other.mjs', 'workspace/scratch-push.mjs', 'workspace/test/lib/scratch-push.mjs', 'workspace/lib/scratch-push.mjs', 'test/scratch-push.mjs']) assert.equal(scanCode(other, pushing).length, 2, `the same text under ${other} is refused`);
  assert.equal(scanCode('workspace/test/scratch-push.mjs', "spawnSync('npm', ['publish'])").length, 1, 'another write in that file is refused');
  assert.equal(scanCode('workspace/test/scratch-push.mjs', 'git tag -a v1 -m x').length, 1);
});

test('the structural detectors carry none of the shapes they refuse', () => {
  const text = readFileSync(new URL('../code.mjs', import.meta.url), 'utf8');
  assert.ok(scanCode('rails/code.mjs', text).length > 0, 'the patterns themselves look like writes, which is why the rail reads only workspace/');
});
