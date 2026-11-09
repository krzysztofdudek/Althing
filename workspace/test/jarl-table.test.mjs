// The command table ws keeps for the writing guard, compared with the driver Jarl the open release pins. The driver is
// a sibling checkout this machine may not have: a machine without it says so and skips.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { JARL_WRITES, JARL_READS } from '../ws.mjs';
import { loadLocal } from '../lib/local.mjs';
import { driverOf, headOf, loopFormat, readManifest, listReleases, CURRENT_FORMAT } from '../lib/releases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function pinnedDriver() {
  const v = listReleases(ROOT).reverse().find((r) => loopFormat(ROOT, r) === CURRENT_FORMAT);
  if (!v) return { skip: 'no loop of the current format in this tree' };
  const d = driverOf(ROOT, loadLocal(ROOT), readManifest(ROOT, v));
  if (d.error) return { skip: d.error };
  if (!existsSync(d.script)) return { skip: `the driver Jarl is not checked out: ${d.script}` };
  if (headOf(d.checkout) !== d.commit) return { skip: `the driver checkout is not on the commit ${v} pins` };
  return d;
}

const helpCommands = (script) => spawnSync(process.execPath, [script, '--help'], { encoding: 'utf8' }).stdout
  .split('\n').map((l) => /^ {2}([a-z]+) /.exec(l)).filter(Boolean).map((m) => m[1]);

test('every command the driver\'s help lists is a write or a read in ws, and nothing else is', (t) => {
  const d = pinnedDriver();
  if (d.skip) { t.skip(d.skip); return; }
  const help = new Set(helpCommands(d.script));
  assert.ok(help.size > 30, 'the help lists the commands');
  const known = new Set([...JARL_WRITES, ...JARL_READS]);
  assert.deepEqual([...help].filter((c) => !known.has(c)).sort(), [], 'a command of the tool ws does not place');
  assert.deepEqual([...known].filter((c) => !help.has(c)).sort(), [], 'a command ws places and the tool does not have');
});

test('the writing guard holds exactly the writing commands of the driver', async (t) => {
  const d = pinnedDriver();
  if (d.skip) { t.skip(d.skip); return; }
  const base = join(dirname(d.script), 'lib', 'base.mjs');
  const { MUTATING } = await import(pathToFileURL(base).href);
  assert.deepEqual([...JARL_WRITES].sort(), [...MUTATING].sort());
});
