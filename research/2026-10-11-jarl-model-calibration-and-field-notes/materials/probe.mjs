// Probe: what Jarl 6.1.0 (the driver checkout ws.local.json names as "jarl") does in the cases the model-calibration
// design and the triage of the coordinator's notes depend on. It builds a scratch loop under Althing's .cache/ (ignored
// by git), never deletes anything, runs every command with a timeout, and prints each case with the scratch path
// replaced by <scratch>, so the output can be quoted without a machine path.
//
// Cases:
//   M1-M3  merged --sha notes a merge whose issue holds no live fresh approve (note 7)
//   R1     any name that is not a worker or a coordinator name counts as fresh (note 6)
//   F1-F4  the line formats the design proposes, read by Jarl 6.1.0: a lease line with "· model <m>" before
//          "· worker <w>", a review line with "· model <m> · relayed" after the kind, a **Model:** header field and
//          a Tier the built-in list does not have
//
// Run from Althing's root: node research/2026-10-11-jarl-model-calibration-and-field-notes/materials/probe.mjs
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ALTHING = process.cwd();
const local = JSON.parse(readFileSync(join(ALTHING, 'ws.local.json'), 'utf8'));
const JARL = resolve(ALTHING, local.sources.jarl.path, 'skills/jarl/scripts/jarl.mjs');
if (!existsSync(JARL)) throw new Error('the driver Jarl named in ws.local.json is not on this machine');

const SCRATCH = join(ALTHING, '.cache', `jarl-probe-models-${Date.now()}`);
const LOOP = join(SCRATCH, 'loop');
const ID = ['-c', 'user.name=probe', '-c', 'user.email=probe@example.invalid'];
const clean = (s) => String(s).split(SCRATCH).join('<scratch>').trim();

function git(args) { return execFileSync('git', [...ID, ...args], { cwd: LOOP, encoding: 'utf8', timeout: 30_000, stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
// Both streams are kept: Jarl's notes go to stderr, and a refusal exits non-zero.
function jarl(args) {
  const r = spawnSync(process.execPath, [JARL, ...args, '--root', LOOP], { encoding: 'utf8', timeout: 60_000, stdio: ['ignore', 'pipe', 'pipe'] });
  const err = r.stderr && r.stderr.trim() ? `\n[stderr] ${r.stderr.trim()}` : '';
  return { ok: r.status === 0, out: clean(`${r.stdout || ''}${err}`) };
}
const jarlBoth = jarl;
function say(name, r) { console.log(`\n## ${name}\n${r.ok ? '' : '(refused or exit 2) '}${r.out}`); }
const logPath = () => join(LOOP, '.jarl', 'log.md');
const issueFile = (id) => join(LOOP, '.jarl', 'issues', readdirSync(join(LOOP, '.jarl', 'issues')).find((f) => f.startsWith(`${id}-`)));
const stamp = () => new Date().toISOString().slice(0, 16).replace('T', ' ');

mkdirSync(LOOP, { recursive: true });
git(['init', '-q', '-b', 'main']);
writeFileSync(join(LOOP, 'a.txt'), 'a\n');
git(['add', '.']);
git(['commit', '-q', '-m', 'root']);
const sha = git(['rev-parse', 'HEAD']);
say('init', jarl(['init', 'probe loop for model calibration']));
for (const t of ['merge with no review', 'merge after a review a round spent', 'merge after a live fresh approve', 'any name is fresh', 'proposed line formats']) jarl(['new', t, '--acceptance', 'probe']);

// M1: leased, merged with no review at all.
jarl(['set', '001', 'in-progress', 'probe', '--branch', 'jarl/001-a', '--worker', 'w1']);
say('M1. merged --sha on an issue with no review', jarlBoth(['merged', '001', '--sha', sha, '--json']));

// M2: a fresh approve, then a round (the merger's red check), then merged.
jarl(['set', '002', 'in-progress', 'probe', '--branch', 'jarl/002-b', '--worker', 'w2']);
jarl(['review', '002', 'approve', '--by', 'rev-a', 'Minor: none']);
jarl(['round', '002', 'check red after the approve']);
say('M2. merged --sha after an approve a round spent', jarlBoth(['merged', '002', '--sha', sha, '--json']));

// M3: a live fresh approve, then merged: no note.
jarl(['set', '003', 'in-progress', 'probe', '--branch', 'jarl/003-c', '--worker', 'w3']);
jarl(['review', '003', 'approve', '--by', 'rev-b', 'Minor: none']);
say('M3. merged --sha after a live fresh approve', jarlBoth(['merged', '003', '--sha', sha, '--json']));

// R1: a verdict recorded by the coordinator in a reviewer's name is indistinguishable from the reviewer's own.
jarl(['set', '004', 'in-progress', 'probe', '--branch', 'jarl/004-d', '--worker', 'w4']);
say('R1. review --by reviewer-123 (typed by anyone)', jarl(['review', '004', 'approve', '--by', 'reviewer-123', 'relayed from the reviewer report']));
say('R1. the log line it wrote', { ok: true, out: readFileSync(logPath(), 'utf8').trim().split('\n').filter((l) => l.includes('004 review')).join('\n') });

// F1-F4: the proposed formats, written by hand into the scratch loop, read by Jarl 6.1.0.
const at = stamp();
appendFileSync(logPath(), `- ${at} · 005 → in-progress · probe · branch jarl/005-e · model claude-sonnet-5-5@high · worker w5\n`);
let text = readFileSync(issueFile('005'), 'utf8');
// No **Worker:** field on the issue: the only place naming w5 is the lease line, so F1 shows how 6.1.0 parses it.
text = text.replace('**Status:** open', '**Status:** in-progress').replace('**Tier:** standard', '**Tier:** light').replace(/(\*\*Where:\*\*.*\n)/, '$1**Branch:** jarl/005-e\n**Model:** claude-sonnet-5-5@high\n**Since:** ' + at + '\n');
writeFileSync(issueFile('005'), text);
say('F1. self-review check on a lease line "… · model <m> · worker w5": review --by w5', jarl(['review', '005', 'approve', '--by', 'w5', 'Minor: none']));
appendFileSync(logPath(), `- ${stamp()} · 005 review approve · by rev-c (fresh) · model claude-opus-5-5 · relayed · Minor: none\n`);
jarl(['evidence', '005', '--ran', 'probe', '--saw', 'probe']);
say('F2. done on a review line "by rev-c (fresh) · model <m> · relayed · …"', jarl(['set', '005', 'done', 'probe']));
say('F3. show reads a **Model:** field and Tier light', jarl(['show', '005', '--json']));
say('F4. status and list with that issue in the loop', jarl(['status']));
say('F4. list --all', jarl(['list', '--all']));
// F0: the other order, "· worker w6 · model <m>", which 6.1.0 would misread: the worker is taken to the end of the line.
jarl(['new', 'the other order', '--acceptance', 'probe']);
appendFileSync(logPath(), `- ${stamp()} · 006 → in-progress · probe · branch jarl/006-f · worker w6 · model claude-sonnet-5-5\n`);
let t6 = readFileSync(issueFile('006'), 'utf8');
t6 = t6.replace('**Status:** open', '**Status:** in-progress').replace(/(\*\*Where:\*\*.*\n)/, '$1**Branch:** jarl/006-f\n');
writeFileSync(issueFile('006'), t6);
say('F0. the other order, "… · worker w6 · model <m>": review --by w6 (a self-approve 6.1.0 fails to see)', jarl(['review', '006', 'approve', '--by', 'w6', 'Minor: none']));
say('report metrics: fresh reviews', { ok: true, out: (jarl(['report']).out.split('\n').filter((l) => l.startsWith('fresh reviews') || l.startsWith('rounds'))).join('\n') });
