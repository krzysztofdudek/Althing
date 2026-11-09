// The release brief templates of a loop of the current format: additions to the tool's own brief, which leave the
// role, the proof and the verdict to the tool and render on a machine that holds only the family's current tools.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loopFormat, CURRENT_FORMAT } from '../lib/releases.mjs';
import { render } from '../lib/briefs.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const RELEASES = join(ROOT, 'releases');

function additions(pattern, keep = () => true) {
  return readdirSync(RELEASES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(RELEASES, d.name, 'briefs')) && loopFormat(ROOT, d.name) === CURRENT_FORMAT && keep(d.name))
    .flatMap((d) => readdirSync(join(RELEASES, d.name, 'briefs'))
      .filter((f) => pattern.test(f))
      .map((f) => ({ release: d.name, file: `releases/${d.name}/briefs/${f}`, text: readFileSync(join(RELEASES, d.name, 'briefs', f), 'utf8') })));
}

const manifest = (release) => JSON.parse(readFileSync(join(RELEASES, release, 'family.json'), 'utf8'));
const isOpen = (release) => manifest(release).state === 'open';

test('no brief template passes --model to a jarl command', () => {
  const offending = additions(/\.md$/).flatMap(({ file, text }) => text.split('\n')
    .filter((line) => /jarl/.test(line) && /--model/.test(line))
    .map((line) => `${file}: ${line.trim()}`));
  assert.deepEqual(offending, []);
});

test('the additions of a loop of the current format leave the role, the proof and the verdict to the tool', () => {
  const all = additions(/\.md$/);
  assert.ok(all.length >= 3, 'the additions of the release are found');
  for (const { file, text } of all) {
    assert.doesNotMatch(text, /\{\{(issue|trailer)\}\}/, `${file}: the tool's brief carries the issue, and no commit carries a trailer`);
    assert.doesNotMatch(text, /\bjarl (?:body|queue|source|tag|prio|after|evidence|review|merged|round|set) /, `${file}: names a command the tool's brief owns or that no longer exists`);
  }
});

test('every brief of an open release renders with only the tools still in the family', () => {
  const registry = JSON.parse(readFileSync(join(ROOT, 'family', 'registry.json'), 'utf8'));
  const current = Object.entries(registry.repos).filter(([, r]) => r.kind !== 'retired').map(([name]) => name);
  const local = { sources: Object.fromEntries(current.map((name) => [name, { path: `../${name}` }])), worktrees: '~/Worktrees' };
  const open = additions(/\.md$/, isOpen);
  assert.ok(open.length >= 1, 'an open release has briefs');
  for (const { release, file, text } of open) {
    const values = { althing: ROOT, root: join(RELEASES, release), jarl: 'node jarl.mjs', env: '', trailer: null, issue: null };
    assert.doesNotThrow(() => render(text, values, local, ROOT), `${file} renders`);
  }
});

test('no brief of an open release names a tool that has left the family', () => {
  const registry = JSON.parse(readFileSync(join(ROOT, 'family', 'registry.json'), 'utf8'));
  const retired = Object.entries(registry.repos).filter(([, r]) => r.kind === 'retired').map(([name]) => name);
  assert.ok(retired.length >= 1, 'the registry names a tool that left');
  for (const { file, text } of additions(/\.md$/, isOpen)) {
    for (const name of retired) assert.doesNotMatch(text, new RegExp(`\\b${name}\\b`, 'i'), `${file} names ${name}`);
  }
});

test('a worker of each current tool that works from the release has its additions', () => {
  const names = additions(/^worker-.*\.md$/, isOpen).map(({ file }) => file.split('/').pop());
  for (const f of ['worker-runes.md', 'worker-yggdrasil.md', 'worker-grain.md', 'worker-jarl.md', 'worker-althing.md']) assert.ok(names.includes(f), `${f} exists`);
});
