// The one place in workspace/ that runs a push: a test's push to a scratch
// bare repository under the system temporary directory. Workspace code never
// writes to a remote or a tool (the rail code/read-only-to-tools), and a test
// of the names gate still has to push for real, through the hook it tests. So
// every such push goes through here, and this file is where it is held to a
// fixture:
//
// - only the file transport is allowed (GIT_ALLOW_PROTOCOL=file), so no push
//   leaves the machine whatever its address says;
// - git is asked first, with a dry run that runs no hook, where the push would
//   go once every setting has rewritten the address, and each place it names
//   must be a bare repository under the system temporary directory. A checkout
//   on this machine is a place a push could write to as well, and it is
//   refused like any other.
//
// A push it will not run throws, so a test cannot take it for a refusal of
// the gate.

import { spawnSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, sep } from 'node:path';

const IDENTITY = ['-c', 'user.name=Test', '-c', 'user.email=test@example.com'];

// Runs a push in `dir` with the arguments given after the command's name and the environment given, and returns { status, text }.
export function scratchPush(dir, args, { env = process.env } = {}) {
  const local = { ...env, GIT_ALLOW_PROTOCOL: 'file' };
  const git = (extra, options = {}) => spawnSync('git', [...IDENTITY, ...extra], { cwd: dir, encoding: 'utf8', env: local, ...options });
  // A quiet push prints no place, so the dry run leaves that flag out; anything else that hides the place ends in the refusal below.
  const dry = git(['-c', 'core.hooksPath=/dev/null', 'push', '--dry-run', '--porcelain', ...args.filter((a) => a !== '-q' && a !== '--quiet')]);
  const places = String(dry.stdout).split('\n').filter((line) => line.startsWith('To ')).map((line) => line.slice(3));
  if (!places.length) throw new Error(`scratch push: git names no place this push would go to, so it is not run (${String(dry.stderr).trim().split('\n')[0]})`);
  const scratch = realpathSync(tmpdir());
  for (const place of places) {
    let real;
    try { real = realpathSync(resolve(dir, place.replace(/^file:\/\//, ''))); } catch { throw new Error('scratch push: the push would go to a place that is not a folder on this machine, so it is not run'); }
    if (!real.startsWith(`${scratch}${sep}`)) throw new Error('scratch push: the push would go outside the system temporary directory, so it is not run');
    const bare = spawnSync('git', ['rev-parse', '--is-bare-repository'], { cwd: real, encoding: 'utf8', env: { ...local, GIT_DIR: real } });
    if (String(bare.stdout).trim() !== 'true') throw new Error('scratch push: the push would go to a repository that is not bare, so it is not run');
  }
  const r = git(['push', ...args]);
  return { status: r.status, text: `${r.stdout}${r.stderr}` };
}
