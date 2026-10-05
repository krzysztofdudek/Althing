import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkFamily, checkResearch, checkRelease } from '../layout.mjs';
import { validateManifest } from '../manifest.mjs';
import { sha256, parseFreeze, renderFreeze, checkFreeze } from '../freeze.mjs';
import { checkLoop } from '../loop.mjs';
import { checkLedger, parseLedger } from '../ledger.mjs';
import { renderReleasesIndex, renderResearchIndex, sameIndex } from '../index.mjs';
import { checkCanon, CANON_START, CANON_END } from '../canon.mjs';
import { check as manifestCheck } from '../aspects/release-manifest.mjs';
import { check as freezeCheck } from '../aspects/freeze-holds.mjs';

const SHA = 'a'.repeat(40);
const DOT = '\u00b7';

test('family/ holds its seven files and a registry that parses', () => {
  assert.deepEqual(checkFamily([{ path: 'family/canon.md', content: '' }, { path: 'family/registry.json', content: '{"schema":"family-registry/1"}' }]), []);
  assert.equal(checkFamily([{ path: 'family/notes.md', content: '' }]).length, 1);
  assert.equal(checkFamily([{ path: 'family/registry.json', content: '{' }]).length, 1);
});

test('research folders are dated, with the four header lines first', () => {
  const readme = '# A study\n\n**Question:** Does it hold?\n**Method:** We ran it.\n**Status:** concluded\n**Conclusion:** Yes.\n';
  const ok = [
    { path: 'research/INDEX.md', content: '' },
    { path: 'research/2026-10-05-a-study/README.md', content: readme },
    { path: 'research/2026-10-05-a-study/findings.json', content: '[]' },
    { path: 'research/2026-10-05-a-study/materials/run.log', content: '' },
  ];
  assert.deepEqual(checkResearch(ok), []);
  assert.equal(checkResearch([{ path: 'research/notes.md', content: '' }]).length, 1);
  assert.equal(checkResearch([{ path: 'research/a-study/README.md', content: readme }]).length, 1);
  assert.ok(checkResearch([{ path: 'research/2026-10-05-x/README.md', content: '**Method:** m\n**Question:** q\n' }]).length >= 1);
  assert.equal(checkResearch([{ path: 'research/2026-10-05-x/README.md', content: readme.replace('concluded', 'done') }]).length, 1);
  assert.equal(checkResearch([{ path: 'research/2026-10-05-x/report.md', content: '' }]).length, 1, 'no README');
  assert.equal(checkResearch([...ok, { path: 'research/2026-10-05-a-study/deep/x.md', content: '' }]).length, 1);
});

test('release directories hold the manifest and only the allowed entries', () => {
  assert.deepEqual(checkRelease([{ path: 'releases/INDEX.md' }, { path: 'releases/6.1.0/family.json' }, { path: 'releases/6.2.0/family.json' }, { path: 'releases/6.2.0/plans/plan.md' }, { path: 'releases/6.2.0/briefs/worker.md' }]), []);
  assert.equal(checkRelease([{ path: 'releases/6.2.0/family.json' }, { path: 'releases/6.2.0/notes.md' }]).length, 1);
  assert.equal(checkRelease([{ path: 'releases/next/family.json' }]).length, 1);
  assert.equal(checkRelease([{ path: 'releases/6.3.0/plans/p.md' }]).length, 1, 'no manifest');
});

test('a manifest is consistent with its state, its registry and its previous release', () => {
  const base = { schema: 'family-release/1', release: '6.2.0', state: 'open', previous: '6.1.0', driver: { jarl: { source: 'sibling', repo: 'jarl', commit: SHA, version: '6.1.0' } }, repos: { yggdrasil: { version: '6.2.0', commit: null }, grain: { version: '6.2.0', commit: null }, runes: { version: '1.1.0', commit: null }, althing: { branch: 'main' } } };
  const registry = { repos: { yggdrasil: { kind: 'core' }, grain: { kind: 'core' }, runes: { kind: 'shared' } } };
  const opts = { dir: '6.2.0', registry, previousExists: () => true };
  assert.deepEqual(validateManifest(base, opts), []);
  assert.equal(validateManifest({ ...base, state: 'candidate' }, opts).length, 3, 'commits required once a candidate');
  assert.equal(validateManifest({ ...base, repos: { ...base.repos, grain: { version: '6.1.5', commit: null } } }, opts).length, 1, 'the core on one version');
  assert.equal(validateManifest({ ...base, repos: { ...base.repos, skald: { version: '1.0.0', commit: null } } }, opts).length, 1, 'not in the registry');
  assert.equal(validateManifest(base, { ...opts, previousExists: () => false }).length, 1);
  assert.equal(validateManifest(base, { ...opts, previousExists: () => null }).length, 1);
  assert.equal(validateManifest({ ...base, driver: { jarl: { source: 'sibling', repo: 'jarl', commit: 'c9c36cf' } } }, opts).length, 1, 'a short commit is not a pin');
  const published = { ...base, state: 'published', repos: { yggdrasil: { version: '6.2.0', commit: SHA }, althing: { branch: 'main' } } };
  assert.equal(validateManifest(published, opts).length, 1, 'published but not frozen');
  assert.deepEqual(validateManifest(published, { ...opts, frozen: new Set(['family.json']) }), []);
  assert.equal(validateManifest({ ...base, release: '6.3.0' }, opts).length, 1);
});

test('the manifest adapter reads the previous release only through a relation', () => {
  const m = JSON.stringify({ schema: 'family-release/1', release: '6.2.0', state: 'open', previous: '6.1.0', repos: {} });
  const ctx = (reachable) => ({ files: [{ path: 'releases/6.2.0/family.json', content: m }], fs: { exists: (p) => { if (!reachable) throw new Error('undeclared'); return p === 'releases/6.1.0/family.json' ? 'file' : false; }, read: () => '{}' } });
  assert.deepEqual(manifestCheck(ctx(true)), []);
  assert.match(manifestCheck(ctx(false))[0].message, /release nodes 6\.2\.0/);
});

test('a frozen directory holds: changed, removed and added files are found', () => {
  const files = [{ path: 'research/2026-10-05-x/README.md', content: 'a' }, { path: 'research/2026-10-05-x/report.md', content: 'b' }];
  const text = renderFreeze(files.map((f) => [f.path.slice('research/2026-10-05-x/'.length), sha256(f.content)]));
  const list = parseFreeze(text);
  assert.equal(list.size, 2);
  assert.deepEqual(checkFreeze({ root: 'research/2026-10-05-x', list, files }), []);
  const changed = [{ ...files[0], content: 'A' }, files[1], { path: 'research/2026-10-05-x/new.md', content: 'c' }];
  assert.equal(checkFreeze({ root: 'research/2026-10-05-x', list, files: changed }).length, 2);
  assert.equal(checkFreeze({ root: 'research/2026-10-05-x', list, files: [files[0]] }).length, 1, 'removed');
});

test('the loop node checks only its own frozen entries, read through the record', () => {
  const loop = [{ path: 'releases/6.2.0/.jarl/log.md', content: 'L' }];
  const freeze = renderFreeze([['family.json', sha256('{}')], ['.jarl/log.md', sha256('L')]]);
  const ctx = (log) => ({ files: [{ ...loop[0], content: log }], fs: { exists: () => 'file', read: () => freeze } });
  assert.deepEqual(freezeCheck(ctx('L')), []);
  assert.equal(freezeCheck(ctx('changed')).length, 1);
});

test('a loop has its own files only, is permanent, and its issues are well formed', () => {
  const issue = (n, extra = '') => ({ path: `releases/6.2.0/.jarl/issues/${n}-a-fix.md`, content: `# ${n} ${DOT} A fix\n\n**Status:** open\n**Kind:** bug\n**Priority:** 2\n${extra}` });
  const base = [{ path: 'releases/6.2.0/.jarl/.permanent', content: '' }, { path: 'releases/6.2.0/.jarl/goal.md', content: '' }, { path: 'releases/6.2.0/.jarl/log.md', content: '' }];
  assert.deepEqual(checkLoop([...base, issue('001', '**Repo:** ../../../Grain, grain\n')]), []);
  assert.equal(checkLoop([...base, issue('001', `**Repo:** ${'/'}Users/x/Grain\n`)]).length, 1);
  assert.equal(checkLoop([...base, issue('001'), { ...issue('001'), path: 'releases/6.2.0/.jarl/issues/001-other.md' }]).length, 1, 'number used twice');
  assert.equal(checkLoop([...base, { ...issue('002'), path: 'releases/6.2.0/.jarl/issues/003-a-fix.md' }]).length, 1, 'header number');
  assert.equal(checkLoop([...base, { path: 'releases/6.2.0/.jarl/issues/004-x.md', content: `# 004 ${DOT} x\n` }]).length, 3, 'missing fields');
  assert.equal(checkLoop([...base, { path: 'releases/6.2.0/.jarl/.lock', content: '' }]).length, 1);
  assert.equal(checkLoop([...base, { path: 'releases/6.2.0/.jarl/notes.md', content: '' }]).length, 1);
  assert.equal(checkLoop(base.slice(1)).length, 1, 'not permanent');
  assert.equal(checkLoop([...base, issue('005', '**Repo:** nowhere\n')], { registryNames: new Set(['grain']) }).length, 1);
});

test('the ledger: well-formed entries, unique slugs, pointers that resolve', () => {
  const ledger = [
    '# Standing rulings', '',
    '## autonomy-quality', `**Date:** 2026-10-05 ${DOT} **Status:** standing ${DOT} **Origin:** releases/6.2.0`, '',
    '## issues-live-in-althing', `**Date:** 2026-09-20 ${DOT} **Status:** superseded by autonomy-quality ${DOT} **Origin:** private 6.1.0 loop, translated`, '', 'Translated text.', '',
  ].join('\n');
  const decisions = `## 2026-10-05 ${DOT} autonomy-quality\nText.\n`;
  assert.equal(parseLedger(ledger).length, 2);
  assert.deepEqual(checkLedger(ledger, { decisionsOf: () => decisions }), []);
  assert.equal(checkLedger(ledger, { decisionsOf: () => '' }).length, 1, 'pointer does not resolve');
  assert.equal(checkLedger(ledger, { decisionsOf: () => null }).length, 1, 'loop not readable');
  assert.equal(checkLedger(`${ledger}\n## autonomy-quality\nno meta line\n`, { decisionsOf: () => decisions }).length, 2);
  assert.equal(checkLedger(ledger.replace('superseded by autonomy-quality', 'superseded by gone'), { decisionsOf: () => decisions }).length, 1);
});

test('generated indexes are deterministic and compared ignoring trailing space', () => {
  const r = renderReleasesIndex([{ version: '6.1.0', manifest: { state: 'published', previous: '6.0.0', repos: { yggdrasil: { version: '6.1.0' } } } }, { version: '6.2.0', manifest: { state: 'open', previous: '6.1.0', repos: { yggdrasil: { version: '6.2.0' }, althing: {} } } }]);
  assert.match(r, /\| \[6\.2\.0\]\(6\.2\.0\/family\.json\) \| open \| 6\.1\.0 \| yggdrasil 6\.2\.0 \|/);
  assert.ok(r.indexOf('6.2.0') < r.indexOf('[6.1.0]'), 'newest first');
  const s = renderResearchIndex([{ dir: '2026-10-05-x', readme: '**Question:** Why? | how\n**Status:** open\n' }]);
  assert.match(s, /\| Why\? \\\| how \| open \|/);
  assert.ok(sameIndex(`${s}\n\n`, s));
  assert.ok(!sameIndex(s.replace('open', 'closed'), s));
});

test('the canon block, map and contracts name exactly the registry members', () => {
  const registry = { repos: { yggdrasil: { display: 'Yggdrasil', kind: 'core' }, urd: { display: 'Urd', kind: 'add-on' }, runes: { display: 'Runes', kind: 'shared' } }, retired: ['Skald'] };
  const canon = `# Canon\n\nSkald left in history.\n\n${CANON_START}\nYggdrasil and Urd.\n${CANON_END}\n`;
  assert.deepEqual(checkCanon(registry, { 'family/canon.md': canon, 'family/map.md': 'Yggdrasil, Urd.' }), []);
  assert.equal(checkCanon(registry, { 'family/map.md': 'Yggdrasil only.' }).length, 1);
  assert.equal(checkCanon(registry, { 'family/map.md': 'Yggdrasil, Urd, Skald.' }).length, 1);
  assert.equal(checkCanon(registry, { 'family/canon.md': 'no markers' }).length, 1);
});
