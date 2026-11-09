// The starting points of the blind runs: each scenario is built with the skill's own tool and its record checked. The
// skill is a sibling checkout this machine may not have: BLIND_SKILL names it, else the driver the open release pins,
// and with neither the tests that need it say so and skip.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENARIOS, build } from '../blind-starts.mjs';
import { loadLocal } from '../lib/local.mjs';
import { driverOf, readManifest, listReleases, loopFormat, CURRENT_FORMAT } from '../lib/releases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function skillDir() {
  if (process.env.BLIND_SKILL) return process.env.BLIND_SKILL;
  const v = listReleases(ROOT).reverse().find((r) => loopFormat(ROOT, r) === CURRENT_FORMAT);
  if (!v) return null;
  const d = driverOf(ROOT, loadLocal(ROOT), readManifest(ROOT, v));
  return d.script && existsSync(d.script) ? join(dirname(d.script), '..') : null;
}
const skill = skillDir();

function built(name, opts = {}) {
  const folder = mkdtempSync(join(tmpdir(), `althing-blind-${name}-`));
  return build(name, folder, { skill, workerModel: 'test-model', ...opts }).then(({ project }) => ({
    project,
    jarl: (...a) => spawnSync(process.execPath, [join(skill, 'scripts', 'jarl.mjs'), ...a], { cwd: project, encoding: 'utf8', timeout: 60_000 }),
    done: () => rmSync(folder, { recursive: true, force: true }),
  }));
}
const need = (t) => { if (!skill) { t.skip('no skill to build with: set BLIND_SKILL or check out the driver Jarl'); return false; } return true; };

test('an unknown scenario and a folder without a skill are refused', async () => {
  assert.deepEqual([...SCENARIOS].sort(), ['delegation', 'lone', 'owner', 'replacement', 'review', 'stuck', 'trigger', 'two-machines']);
  await assert.rejects(build('nope', '/nowhere', { skill: '/nowhere' }), /no scenario/);
  await assert.rejects(build('lone', '/nowhere', { skill: '/nowhere' }), /--skill/);
});

test('lone: a repository with three scripts whose checks fail, and no loop', async (t) => {
  if (!need(t)) return;
  const b = await built('lone');
  try {
    assert.equal(existsSync(join(b.project, '.jarl')), false, 'the agent opens the loop itself');
    const r = spawnSync(process.execPath, ['check.mjs'], { cwd: b.project, encoding: 'utf8', timeout: 30_000 });
    assert.equal(r.status, 1, r.stdout);
    assert.equal((r.stdout.match(/^FAIL/gm) || []).length, 3, r.stdout);
  } finally { b.done(); }
});

test('delegation: twelve issues, two matters off the slices, one question on the owner', async (t) => {
  if (!need(t)) return;
  const b = await built('delegation');
  try {
    const list = JSON.parse(b.jarl('list', '--json').stdout);
    assert.equal(list.length, 12);
    assert.equal(b.jarl('verify').status, 0);
    assert.match(b.jarl('next', '--as', 'owner', '--all').stdout, /^On the owner \(/m);
  } finally { b.done(); }
});

test('review: the third issue is leased to its worker, with its worktree made', async (t) => {
  if (!need(t)) return;
  const b = await built('review', { workerModel: 'test-model' });
  try {
    const show = JSON.parse(b.jarl('show', '3', '--json').stdout);
    assert.equal(show.fields.worker, 'w-3');
    assert.equal(existsSync(join(b.project, '..', 'wt', '3-wrap')), true);
    assert.match(b.jarl('brief', '3').stdout, /worker's brief for issue 3/);
  } finally { b.done(); }
});

test('replacement: the slice\'s brief carries the rule, promise, question and review in flight, and nothing of the other slice', async (t) => {
  if (!need(t)) return;
  const b = await built('replacement');
  try {
    const brief = b.jarl('brief', '--slice', 'odin').stdout;
    for (const what of [/odin-standing/, /send the owner the render/, /Which screen goes first/, /waits for a reviewer/]) assert.match(brief, what);
    assert.doesNotMatch(brief, /thor-standing|parser keep its name/);
  } finally { b.done(); }
});

test('stuck: the idle lease reads stale and the live one does not', async (t) => {
  if (!need(t)) return;
  const b = await built('stuck');
  try {
    const out = b.jarl('next', '--as', 'jarl', '--all').stdout;
    assert.match(out, /1 a returns the right value:.*no commit, row or log line/);
    assert.doesNotMatch(out, /2 b returns the right value:.*no commit, row or log line/);
  } finally { b.done(); }
});

test('two-machines: verify names the conflict marker and the number taken twice, and the lease taken in both is a conflict', async (t) => {
  if (!need(t)) return;
  const b = await built('two-machines');
  try {
    const verify = b.jarl('verify');
    assert.notEqual(verify.status, 0, verify.stdout);
    assert.match(verify.stdout, /a git conflict marker/);
    assert.match(verify.stdout, /2 issue files carry the number 2/);
    assert.match(b.jarl('next', '--as', 'jarl', '--all').stdout, /leased twice with no move out between/);
  } finally { b.done(); }
});

test('owner: the digest holds the four matters on him, the stop first', async (t) => {
  if (!need(t)) return;
  const b = await built('owner');
  try {
    assert.match(b.jarl('next', '--as', 'owner', '--all').stdout, /^On the owner \(4\)\n- a-3 /);
  } finally { b.done(); }
});

test('trigger: thirty-three issues in three areas, six of them leased with a row of proof', async (t) => {
  if (!need(t)) return;
  const b = await built('trigger');
  try {
    const list = JSON.parse(b.jarl('list', '--json').stdout);
    assert.equal(list.length, 33);
    assert.equal(list.filter((i) => i.status === 'in-progress').length, 6);
    assert.equal(readdirSync(join(b.project, 'ui')).length, 11);
  } finally { b.done(); }
});
