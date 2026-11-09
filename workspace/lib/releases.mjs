// Release directories, their manifests and the driver Jarl that writes a
// release loop's record.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SEMVER } from '../../rails/manifest.mjs';
import { sourcePath } from './local.mjs';
import { gitIn } from './sh.mjs';

export function versionKey(v) {
  return v.split('.').map((n) => n.padStart(6, '0')).join('.');
}

export function listReleases(root) {
  const dir = join(root, 'releases');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((d) => SEMVER.test(d)).sort((a, b) => (versionKey(a) < versionKey(b) ? -1 : 1));
}

export function readManifest(root, v) {
  const file = join(root, 'releases', v, 'family.json');
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function hasLoop(root, v) {
  return existsSync(join(root, 'releases', v, '.jarl', 'goal.md'));
}

// The format the tool reads: the one machine line of a loop's goal.md, written by init.
export const CURRENT_FORMAT = 4;

// The format of a release's loop, a number; null for a loop with no format line or no loop at all.
export function loopFormat(root, v) {
  const f = join(root, 'releases', v, '.jarl', 'goal.md');
  if (!existsSync(f)) return null;
  const m = /^Format:\s*(\d+)\s*$/m.exec(readFileSync(f, 'utf8'));
  return m ? Number(m[1]) : null;
}

// The release a command acts on: --release <v>, else the newest release whose
// manifest is open or a candidate and that holds a loop.
export function pickRelease(root, wanted) {
  if (wanted) {
    if (!readManifest(root, wanted)) throw new Error(`releases/${wanted}/family.json does not exist`);
    return wanted;
  }
  const open = listReleases(root).filter((v) => { const m = readManifest(root, v); return m && m.state !== 'published' && hasLoop(root, v); });
  if (!open.length) throw new Error('no open release loop; name one with --release <version>');
  return open[open.length - 1];
}

// The driver Jarl of a release: { script, checkout, commit } or { error }.
export function driverOf(root, local, manifest) {
  const j = manifest && manifest.driver && manifest.driver.jarl;
  if (!j) return { error: `releases/${manifest && manifest.release}/family.json names no driver Jarl` };
  if (j.source === 'sibling') {
    const checkout = sourcePath(root, local, j.repo || 'jarl');
    if (!checkout) return { error: `ws.local.json has no source "${j.repo || 'jarl'}" for the driver Jarl` };
    return { script: join(checkout, 'skills', 'jarl', 'scripts', 'jarl.mjs'), checkout, commit: j.commit };
  }
  if (j.source === 'release') {
    const prev = readManifest(root, j.release);
    const commit = prev && prev.repos && prev.repos.jarl && prev.repos.jarl.commit;
    if (!commit) return { error: `the driver is Jarl of release ${j.release}, whose manifest records no Jarl commit` };
    const tree = join(root, '.cache', 'trees', `jarl@${commit.slice(0, 12)}`);
    if (!existsSync(tree)) return { error: `the driver Jarl's tree .cache/trees/jarl@${commit.slice(0, 12)} is not built yet (the workspace's tree builder arrives with package W0)` };
    return { script: join(tree, 'skills', 'jarl', 'scripts', 'jarl.mjs'), checkout: tree, commit };
  }
  return { error: `unknown driver source "${j.source}"` };
}

export function headOf(dir) {
  const r = gitIn(dir, ['rev-parse', 'HEAD']);
  return r.ok ? r.out : null;
}

export function branchOf(dir) {
  const r = gitIn(dir, ['rev-parse', '--abbrev-ref', 'HEAD']);
  return r.ok ? r.out : null;
}
