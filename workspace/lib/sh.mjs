// Running other programs from ws: read-only helpers that never throw.

import { spawnSync } from 'node:child_process';

export function run(cmd, args, { cwd, input, env } = {}) {
  const r = spawnSync(cmd, args, { cwd, input, env: env ? { ...process.env, ...env } : process.env, encoding: 'utf8', maxBuffer: 1 << 28 });
  return { ok: r.status === 0, status: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim(), missing: r.error && r.error.code === 'ENOENT' };
}

export function gitIn(dir, args) {
  return run('git', ['-C', dir, ...args]);
}
