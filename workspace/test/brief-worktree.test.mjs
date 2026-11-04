// Brief templates that create a worker worktree inside the Yggdrasil
// devcontainer lock it with the devcontainer reason. Seen from the host, a
// container worktree's path does not exist, so an unlocked one looks prunable.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// The lines that create a worktree inside the container without the lock flag
// and its reason. Prose is never hard-wrapped, so one line is one paragraph.
export function unlockedContainerWorktrees(text) {
  return text.split('\n').filter((line) => /worktree add/.test(line)
    && /container/i.test(line)
    && !/worktree add --lock --reason \S+/.test(line));
}

function briefTemplates() {
  const releases = join(ROOT, 'releases');
  if (!existsSync(releases)) return [];
  return readdirSync(releases, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(releases, d.name, 'briefs')))
    .flatMap((d) => readdirSync(join(releases, d.name, 'briefs'))
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({ file: `releases/${d.name}/briefs/${f}`, text: readFileSync(join(releases, d.name, 'briefs', f), 'utf8') })));
}

test('a brief template that creates a worktree inside the devcontainer locks it with a reason', () => {
  const briefs = briefTemplates();
  assert.ok(briefs.length > 0, 'the release brief templates are found');
  const offending = briefs.flatMap(({ file, text }) => unlockedContainerWorktrees(text).map((line) => `${file}: ${line.trim()}`));
  assert.deepEqual(offending, []);
});

test('the check names a container worktree created without the lock flag', () => {
  const text = [
    'Create it with `git worktree add -b jarl/1 {{wt:yggdrasil}}/1` in the container.',
    'Create it with `git worktree add -b jarl/2 ~/Worktrees/Horde/2-x` on the host.',
    'Create it with `git worktree add --lock --reason devcontainer {{wt:yggdrasil}}/3` in the container.',
    '',
  ].join('\n');
  const found = unlockedContainerWorktrees(text);
  assert.equal(found.length, 1);
  assert.match(found[0], /jarl\/1/);
});
