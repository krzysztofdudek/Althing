// Probe: what Jarl 6.1.0 (the driver checkout ws.local.json names as "jarl") does in the cases the field report and
// the repository-names design depend on. It builds a scratch loop under Althing's .cache/ (ignored by git), never
// deletes anything, runs every command with a timeout, and prints each case with the scratch path replaced by
// <scratch>, so the output can be quoted in the report without a machine path.
//
// Run from Althing's root: node research/2026-10-08-jarl-field-report-and-repository-names/materials/probe.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ALTHING = process.cwd();
const local = JSON.parse(readFileSync(join(ALTHING, 'ws.local.json'), 'utf8'));
const JARL = resolve(ALTHING, local.sources.jarl.path, 'skills/jarl/scripts/jarl.mjs');
if (!existsSync(JARL)) throw new Error('the driver Jarl named in ws.local.json is not on this machine');

const SCRATCH = join(ALTHING, '.cache', `jarl-probe-${Date.now()}`);
const LOOP = join(SCRATCH, 'loop');
const R1 = join(SCRATCH, 'r1');
const R2 = join(SCRATCH, 'r2');
const ID = ['-c', 'user.name=probe', '-c', 'user.email=probe@example.invalid'];
const clean = (s) => String(s).split(SCRATCH).join('<scratch>').trim();

function git(cwd, args) { return execFileSync('git', [...ID, ...args], { cwd, encoding: 'utf8', timeout: 30_000, stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
function jarl(args) {
  try {
    const out = execFileSync(process.execPath, [JARL, ...args, '--root', LOOP], { encoding: 'utf8', timeout: 60_000, stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true, out: clean(out) };
  } catch (e) {
    return { ok: false, out: clean(`${e.stdout || ''}${e.stderr || ''}`) };
  }
}
function repo(dir) {
  mkdirSync(dir, { recursive: true });
  git(dir, ['init', '-q', '-b', 'main']);
  writeFileSync(join(dir, 'a.txt'), 'a\n');
  git(dir, ['add', '.']);
  git(dir, ['commit', '-q', '-m', 'root']);
}
function say(name, r) { console.log(`\n## ${name}\n${r.ok ? '' : '(refused) '}${r.out}`); }

repo(LOOP); repo(R1); repo(R2);
say('init', jarl(['init', 'probe loop']));

// A. A pseudo-file used as a resource in a single-repository loop.
jarl(['new', 'first holder', '--files', 'resource:gate', '--acceptance', 'x']);
jarl(['new', 'second holder', '--files', 'resource:gate', '--acceptance', 'x']);
jarl(['set', '001', 'in-progress', 'probe']);
say('A. next, one repository, 001 holds resource:gate', jarl(['next', '--json']));

// B. The same pseudo-file on issues of two different repositories.
jarl(['new', 'in r1', '--repo', '../r1', '--files', 'resource:gate', '--acceptance', 'x']);
jarl(['new', 'in r2', '--repo', '../r2', '--files', 'resource:gate', '--acceptance', 'x']);
jarl(['set', '003', 'in-progress', 'probe']);
say('B. next, two repositories, 003 holds resource:gate', jarl(['next', '--json']));

// C. check on a branch whose issue declares only the pseudo-file.
git(LOOP, ['switch', '-q', '-c', 'jarl/001-first']);
writeFileSync(join(LOOP, 'a.txt'), 'changed\n');
git(LOOP, ['commit', '-q', '-am', 'change (issue 001)']);
git(LOOP, ['switch', '-q', 'main']);
say('C. check 001 --branch jarl/001-first (only resource:gate declared)', jarl(['check', '001', '--branch', 'jarl/001-first', '--base', 'main']));

// D. A worker tries a status that does not exist.
say('D. set 002 ready', jarl(['set', '002', 'ready', 'done, please review']));

// E. A merge recorded with no --ci.
const sha = git(LOOP, ['rev-parse', 'HEAD']);
say('E. merged 001 --sha <sha> (no --ci)', jarl(['merged', '001', '--sha', sha]));
say('E. status counts after it', jarl(['status']));

// F. The same fresh reviewer approves again after a round.
jarl(['new', 'reviewed twice', '--acceptance', 'x']);
jarl(['set', '005', 'in-progress', 'probe', '--branch', 'jarl/005-x', '--worker', 'w1']);
jarl(['evidence', '005', '--ran', 'npm test', '--saw', 'pass 1']);
jarl(['review', '005', 'changes', '--by', 'rev-a', 'Important: the edge case is not tested']);
jarl(['round', '005', 'review asked for the edge case']);
jarl(['evidence', '005', '--ran', 'npm test', '--saw', 'pass 2']);
say('F. review 005 approve --by rev-a (the reviewer of the earlier round)', jarl(['review', '005', 'approve', '--by', 'rev-a', 'Minor: none']));
say('F. set 005 done', jarl(['set', '005', 'done']));

// G. A lease naming a worktree path, relative to the loop's root.
jarl(['new', 'leased', '--acceptance', 'x']);
say('G. set 006 in-progress --worktree ../wt-006 (not created)', jarl(['set', '006', 'in-progress', 'probe', '--branch', 'jarl/006-x', '--worker', 'w2', '--worktree', '../wt-006']));
say('G. show 006 header', { ok: true, out: clean(readFileSync(join(LOOP, '.jarl', 'issues', '006-leased.md'), 'utf8')).split('\n## ')[0] });

// H. A repository written as a bare name, as Jarl 6.2.0 would write it.
say('H. repo 004 r2 (a bare name)', jarl(['repo', '004', 'r2']));
const f4 = join(LOOP, '.jarl', 'issues', '004-in-r2.md');
writeFileSync(f4, readFileSync(f4, 'utf8').replace(/^\*\*Repo:\*\* .*$/m, '**Repo:** r2'));
say('H. status --by repo with Repo: r2 written by hand', jarl(['status', '--by', 'repo']));
say('H. next --json with Repo: r2 written by hand', jarl(['next', '--json']));

// I. A format marker carried by profile.json.
writeFileSync(join(LOOP, '.jarl', 'profile.json'), JSON.stringify({ 'jarl-profile': 1, format: 2 }));
say('I. list, with .jarl/profile.json {"jarl-profile":1,"format":2}', jarl(['list']));
say('I. status, same', jarl(['status']));

console.log(`\n(Jarl at commit ${git(resolve(ALTHING, local.sources.jarl.path), ['rev-parse', '--short', 'HEAD'])})`);
