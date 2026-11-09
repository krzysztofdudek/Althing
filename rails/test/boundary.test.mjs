import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scanPaths, resolveLink } from '../paths.mjs';
import { scanBinary } from '../binaries.mjs';
import { scanSecrets } from '../secrets.mjs';
import { check as pathsCheck } from '../aspects/boundary-no-private-paths.mjs';
import { check as binCheck } from '../aspects/boundary-no-binaries.mjs';
import { check as secretCheck } from '../aspects/secret-scan.mjs';

// Every sample path and secret is assembled at run time, so this file itself
// carries none of the shapes the rails refuse.
const S = '/';
const home = (rest) => `${S}Users${S}${rest}`;
const linuxHome = (rest) => `${S}home${S}${rest}`;
const tmp = (rest) => `${S}tmp${S}${rest}`;

test('absolute local paths are refused wherever they appear', () => {
  const cases = [
    `see ${home('someone/repo/file.md')}`,
    `run it in ${linuxHome('dev/work')}`,
    `logs under ${tmp('session/x.log')}`,
    `the scratchpad is ${S}private${S}var/x`,
    `${S}var${S}folders/ab/cd`,
    'C:\\Users\\someone\\repo',
    `open ${'file'}:///etc/hosts`,
    `\`\`\`\ncd ${home('someone')}\n\`\`\``,
  ];
  for (const c of cases) assert.ok(scanPaths(c, 'notes/a.md').length >= 1, c);
});

test('private repository shapes are refused, ordinary words are not', () => {
  assert.equal(scanPaths(`in ${'clients'}/acme-corp/topics`, 'a.md').length, 1);
  assert.equal(scanPaths(`see ${'journal'}/2026-10-05.md`, 'a.md').length, 1);
  assert.deepEqual(scanPaths('HTTP clients and servers; a journal of the week; clients/ alone', 'a.md'), []);
});

test('URLs, home-relative paths and repository paths pass', () => {
  const text = [
    'https://github.com/krzysztofdudek/Althing/tree/main/rails',
    'https://example.com/home/page and https://example.com/tmp/x',
    'worktrees live under ~/Worktrees/<Repository>/<name>',
    'the key lives in ~/.config/althing/names.key',
    'run node rails/run.mjs and read releases/6.2.0/.jarl/log.md',
    'the devcontainer runs in /workspaces/Yggdrasil',
  ].join('\n');
  assert.deepEqual(scanPaths(text, 'method/environment.md'), []);
});

test('a relative link that climbs out of the repository is refused', () => {
  assert.equal(scanPaths('[x](../../outside.md)', 'method/a.md').length, 1);
  assert.deepEqual(scanPaths('[x](../README.md) [y](#anchor) [z](https://x.org/a)', 'method/a.md'), []);
  assert.equal(resolveLink('method/a.md', '../rails/README.md'), 'rails/README.md');
  assert.equal(resolveLink('a.md', '../x.md'), null);
});

test('the loop allowance covers only Jarl worktree fields and log segments', () => {
  const wt = home('me/.jarl-wt/Grain-028');
  const ct = linuxHome('node/wt/Yggdrasil-021');
  const issue = `releases/6.2.0/.jarl/issues/028-x.md`;
  const log = `releases/6.2.0/.jarl/log.md`;
  assert.deepEqual(scanPaths(`**Worktree:** ${wt}\n**Worktree:** ${ct}`, issue), []);
  assert.deepEqual(scanPaths(`- 2026-10-05 10:00 \u00b7 028 \u2192 in-progress \u00b7 worker w \u00b7 worktree ${wt}`, log), []);
  assert.equal(scanPaths(`**Repo:** ${home('me/repos/Grain')}`, issue).length, 1, 'Repo: is never allowed');
  assert.equal(scanPaths(`**Worktree:** ${home('me/elsewhere/x')}`, issue).length, 1, 'only the worktree shapes');
  assert.equal(scanPaths(`**Worktree:** ${wt}`, 'research/2026-10-05-x/README.md').length, 1, 'only inside a loop');
  assert.equal(scanPaths(`merged abc in ${home('me/repos/Runes')}`, log).length, 1);
});

test('a log line of the current format keeps the worktree allowance after its key and writer', () => {
  const wt = home('me/Worktrees/Grain/28-a-fix');
  const log = 'releases/6.3.0/.jarl/log.md';
  assert.deepEqual(scanPaths(`- 2026-11-09 10:00 key 20261109T1000-abcd by w-1 · 028 → in-progress · worker w · worktree ${wt}`, log), []);
  assert.deepEqual(scanPaths(`- 2026-11-09 10:00 key 20261109T1000-abcd by unrecorded · 028 → in-progress · worker w · worktree ${wt}`, log), []);
  assert.equal(scanPaths(`- 2026-11-09 10:00 key 20261109T1000-abcd by unrecorded · 028 note ${wt}`, log).length, 1, 'only the worktree segment');
});

test('the host worktree place is allowed in the same two places only, and only in its exact shape', () => {
  const mac = home('me/Worktrees/Althing/143-host-worktree-place');
  const linux = linuxHome('dev/Worktrees/JarlSkill/driver');
  const issue = 'releases/6.3.0/.jarl/issues/143-x.md';
  const log = 'releases/6.3.0/.jarl/log.md';
  const segment = (p) => `- 2026-11-04 21:45 \u00b7 143 \u2192 in-progress \u00b7 worker w \u00b7 worktree ${p}`;
  // Allowed: the Worktree header of an issue and the worktree segment of a log line, inside a loop.
  assert.deepEqual(scanPaths(`**Worktree:** ${mac}\n**Worktree:** ${linux}`, issue), []);
  assert.deepEqual(scanPaths(`**Worktree:** ${mac}/`, issue), []);
  assert.deepEqual(scanPaths(segment(mac), log), []);
  assert.deepEqual(scanPaths(segment(linux), log), []);
  // The old shapes stay allowed: closed loops hold them.
  assert.deepEqual(scanPaths(`**Worktree:** ${home('me/.jarl-wt/Grain-028')}`, issue), []);
  // Refused in any other place.
  assert.equal(scanPaths(`see ${mac} for the copy`, issue).length, 1, 'a prose line in a loop file');
  assert.equal(scanPaths(`## What\nthe copy is ${mac}`, issue).length, 1, 'an issue body');
  assert.equal(scanPaths(`- 2026-11-04 21:45 \u00b7 143 \u00b7 note ${mac}`, log).length, 1, 'a log line without the worktree segment');
  assert.equal(scanPaths(`**Repo:** ${mac}`, issue).length, 1, 'Repo: is never allowed');
  assert.equal(scanPaths(`**Worktree:** ${mac}`, 'research/2026-11-04-x/README.md').length, 1, 'a file outside releases/*/.jarl/');
  assert.equal(scanPaths(`**Worktree:** ${mac}`, 'method/environment.md').length, 1, 'a method file');
  assert.equal(scanPaths(segment(mac), 'releases/6.3.0/plans/x.md').length, 1, 'a release file outside .jarl');
  assert.equal(scanPaths(segment(mac), 'releases/6.3.0/.jarl/issues/143-x.md').length, 1, 'the log segment only counts in log.md');
  // Refused in any other shape.
  const shapes = [
    home('me/Worktrees/Althing'),
    home('me/Worktrees/Althing/'),
    home('me/Worktrees'),
    home('me/Worktrees/Althing/143-x/extra'),
    home('me/Worktrees/Althing/143-x/extra/'),
    home('me/Worktrees/Althing/..'),
    home('me/Worktrees/../143-x'),
    home('me/Worktrees/Althing/../..'),
    home('me/Worktrees/../../etc'),
    home('me/Worktrees/./143-x'),
    home('../Worktrees/Althing/143-x'),
    home('Worktrees/Althing/143-x'),
    home('me/Worktree/Althing/143-x'),
    home('me/repos/Worktrees/Althing/143-x'),
    `${S}private${S}me/Worktrees/Althing/143-x`,
    linuxHome('dev/Worktrees/Althing'),
    linuxHome('dev/Worktrees/Althing/143-x/extra'),
    linuxHome('dev/Worktrees/Althing/..'),
  ];
  for (const p of shapes) {
    assert.ok(scanPaths(`**Worktree:** ${p}`, issue).length >= 1, `issue header: ${p}`);
    assert.ok(scanPaths(segment(p), log).length >= 1, `log segment: ${p}`);
  }
  // A Windows path is refused in both places.
  const win = 'C:\\Users\\me\\Worktrees\\Althing\\143-x';
  assert.ok(scanPaths(`**Worktree:** ${win}`, issue).length >= 1, 'Windows, issue header');
  assert.ok(scanPaths(segment(win), log).length >= 1, 'Windows, log segment');
});

test('binary files are refused by extension or content; SVG and text pass', () => {
  assert.ok(scanBinary('shots/screen.png', 'x'));
  assert.ok(scanBinary('docs/report.PDF', 'x'));
  assert.ok(scanBinary('a/b.txt', 'abc\u0000def'));
  assert.equal(scanBinary('diagram.svg', '<svg/>'), null);
  assert.equal(scanBinary('notes.md', '# hi'), null);
});

test('secret shapes are refused; prose about secrets is not', () => {
  const samples = [
    ['-----BEGIN ', 'RSA PRIVATE KEY-----'],
    ['AKIA', 'Q'.repeat(16)],
    ['gh', 'p_', 'a'.repeat(36)],
    ['github_pat_', 'b'.repeat(40)],
    ['npm_', 'c'.repeat(36)],
    ['xox', 'b-', '1234567890-abc'],
    ['sk-', 'd'.repeat(24)],
    ['AIza', 'e'.repeat(35)],
    ['ey', 'J', 'f'.repeat(12), '.', 'g'.repeat(12), '.', 'h'.repeat(12)],
    ['ALTHING_NAMES_KEY=', '0123456789abcdef'.repeat(4)],
    ['api_key = "', 'q'.repeat(12), '"'],
  ];
  for (const parts of samples) assert.equal(scanSecrets(parts.join('')).length, 1, parts.join(''));
  assert.deepEqual(scanSecrets('The names key lives in a local file and one CI secret; a password is never committed.'), []);
});

test('the adapters report through Yggdrasil violations', () => {
  const files = [{ path: 'a.md', content: `x ${home('me/a')}` }, { path: 'p.png', content: 'x' }, { path: 'k.txt', content: ['AKIA', 'Q'.repeat(16)].join('') }];
  assert.equal(pathsCheck({ files }).length, 1);
  assert.equal(binCheck({ files }).length, 1);
  assert.equal(secretCheck({ files }).length, 1);
});

test('the detectors do not trip on their own sources', () => {
  for (const f of ['paths.mjs', 'binaries.mjs', 'secrets.mjs', 'test/boundary.test.mjs']) {
    const text = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    assert.deepEqual(scanPaths(text, `rails/${f}`), [], f);
    assert.deepEqual(scanSecrets(text), [], f);
  }
});
