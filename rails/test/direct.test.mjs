import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, cpSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ALTHING = fileURLToPath(new URL('../..', import.meta.url));

let base;
let real;
let roots;

// A copy of Althing's code, reached by its real path, through a link to it and through a link in a folder above it.
before(() => {
  base = mkdtempSync(join(tmpdir(), 'althing-direct-'));
  real = join(base, 'real', 'deep', 'Althing');
  mkdirSync(join(real, 'family'), { recursive: true });
  cpSync(join(ALTHING, 'package.json'), join(real, 'package.json'));
  cpSync(join(ALTHING, 'family', 'registry.json'), join(real, 'family', 'registry.json'));
  cpSync(join(ALTHING, 'workspace'), join(real, 'workspace'), { recursive: true });
  cpSync(join(ALTHING, 'rails'), join(real, 'rails'), { recursive: true, filter: (src) => !/\/rails\/(names|test)$/.test(src) });
  symlinkSync(real, join(base, 'Linked'));
  symlinkSync(join(base, 'real'), join(base, 'above'));
  roots = { 'a link to Althing': join(base, 'Linked'), 'a link above Althing': join(base, 'above', 'deep', 'Althing') };
});
after(() => rmSync(base, { recursive: true, force: true }));

const run = (root, script, args) => {
  const env = { ...process.env, HOME: join(base, 'home') };
  delete env.ALTHING_NAMES_KEY;
  const r = spawnSync(process.execPath, [join(root, script), ...args], { cwd: base, encoding: 'utf8', env });
  return { status: r.status, text: `${r.stdout}${r.stderr}`.replaceAll(root, '<root>').replaceAll(real, '<root>') };
};

// Each entry point with a command that prints something and exits with a code of its own, so a run that did nothing cannot pass for it.
const ENTRIES = [
  ['rails/run.mjs', ['range', 'one-ref-only'], 2, /usage: node rails\/run\.mjs range/],
  ['rails/run.mjs', ['no-such-command'], 2, /usage: node rails\/run\.mjs staged/],
  ['rails/names.mjs', ['status'], 1, /names: not initialised/],
  ['rails/english.mjs', ['--no-such-flag'], 1, /usage: node rails\/english\.mjs --calibrate/],
  ['workspace/blind-starts.mjs', [], 2, /usage: blind-starts\.mjs/],
];

for (const [script, args, code, says] of ENTRIES) {
  test(`${script} ${args.join(' ')} runs its command through a symbolic link, as by its real path`, () => {
    const direct = run(real, script, args);
    assert.equal(direct.status, code, direct.text);
    assert.match(direct.text, says);
    for (const [how, root] of Object.entries(roots)) {
      const linked = run(root, script, args);
      assert.equal(linked.status, code, `${how}: ${linked.text}`);
      assert.equal(linked.text, direct.text, how);
    }
  });
}
