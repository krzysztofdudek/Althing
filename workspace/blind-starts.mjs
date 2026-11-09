#!/usr/bin/env node
// The starting points of the blind runs of Jarl (releases/6.3.0/plans/blind-tests.md). It only builds: one scratch folder
// per run, holding a small git repository and, where the scenario starts from one, a loop made with the skill's own
// tool. The skill is extracted beside it by the observer; nothing here writes to a tool repository, runs an agent or
// scores one.
//
//   node workspace/blind-starts.mjs <scenario> <folder> --skill <path of skills/jarl> [--worker-model <model-id>]
//
// The folder gets project/ (the repository, the loop in its .jarl/ where the scenario has one) and, for the scenarios
// that need a worktree, wt/. Scenarios: see SCENARIOS.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

export const SCENARIOS = ['lone', 'delegation', 'review', 'replacement', 'stuck', 'two-machines', 'owner', 'trigger'];

// One check of a small module: exit 0 when it holds, 1 and the reason when it does not.
const check = (module, name, body) => `import assert from 'node:assert/strict';\nimport { ${name} } from './${module}';\n${body}\nconsole.log('ok ${name}');\n`;
const CHECK_RUNNER = `import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
// Runs every *.check.mjs under this folder, prints each result and exits 1 when one fails.
const skip = new Set(['.git', '.jarl', 'node_modules']);
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (skip.has(e.name) ? [] : e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.check.mjs') ? [join(dir, e.name)] : []));
}
let failed = 0;
for (const file of walk('.')) {
  try { execFileSync(process.execPath, [file], { stdio: 'pipe' }); console.log('pass', file); }
  catch (e) { failed++; console.log('FAIL', file, String(e.stderr).split('\\n').find((l) => l.includes('Error')) || ''); }
}
console.log(failed ? failed + ' failed' : 'all passed');
process.exit(failed ? 1 : 0);
`;

const THREE_SCRIPTS = {
  'slug.mjs': `// The slug of a title: lower case, words joined by one dash.\nexport const slug = (title) => title.toLowerCase().replaceAll(' ', '-');\n`,
  'total.mjs': `// The total price of the items of an order; a quantity defaults to 1.\nexport const total = (items) => items.reduce((sum, item) => sum + item.price, 0);\n`,
  'wrap.mjs': `export function wrap(text, width) {\n  const lines = [];\n  let line = '';\n  for (const word of text.split(' ')) {\n    if (line && (line + ' ' + word).length >= width) { lines.push(line); line = word; }\n    else line = line ? line + ' ' + word : word;\n  }\n  if (line) lines.push(line);\n  return lines;\n}\n`,
  'slug.check.mjs': check('slug.mjs', 'slug', `assert.equal(slug('  Two   Words '), 'two-words');`),
  'total.check.mjs': check('total.mjs', 'total', `assert.equal(total([{ price: 2, qty: 3 }, { price: 1 }]), 7);`),
  'wrap.check.mjs': check('wrap.mjs', 'wrap', `assert.deepEqual(wrap('aa bb cc', 5), ['aa bb', 'cc']);`),
  'check.mjs': CHECK_RUNNER,
  'README.md': '# Three scripts\n\nRun `node check.mjs` to see the state of their checks.\n',
};

function makeWorld(folder, skill) {
  const project = join(folder, 'project');
  mkdirSync(project, { recursive: true });
  const script = join(skill, 'scripts', 'jarl.mjs');
  const at = (dir) => (...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30_000 }).trim();
  const g = at(project);
  const j = (...a) => execFileSync(process.execPath, [script, ...a], { cwd: project, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 60_000 });
  const write = (file, text, base = project) => { mkdirSync(dirname(join(base, file)), { recursive: true }); writeFileSync(join(base, file), text); };
  const repo = (branch, files) => {
    g('init', '-q', '-b', branch);
    g('config', 'user.email', 'blind@example.com'); g('config', 'user.name', 'A Blind Run');
    for (const [name, text] of Object.entries(files)) write(name, text);
    g('add', '-A'); g('commit', '-qm', 'The starting point');
  };
  return { project, script, g, j, write, repo, at };
}

const BY = 'jarl';
const IDENT = ['--by', BY];

function lone(w) { w.repo('main', THREE_SCRIPTS); }

// Twelve one-line functions in two areas, each a stub and an issue, plus two matters that only the jarl or the owner settles.
function delegation(w) {
  const stub = (name, ret) => `export const ${name} = (input) => ${ret};\n`;
  const parser = [['upper', 'in upper case'], ['lower', 'in lower case'], ['trimmed', 'with surrounding spaces removed'], ['firstWord', 'first word only'], ['lineCount', 'number of lines']];
  const report = [['sumAll', 'sum of a list of numbers'], ['maxOf', 'largest of a list of numbers'], ['minOf', 'smallest of a list of numbers'], ['average', 'mean of a list of numbers'], ['countOf', 'length of a list']];
  const files = { 'check.mjs': CHECK_RUNNER, 'README.md': '# Small library\n\nRun `node check.mjs` to run every check.\n' };
  for (const [n] of parser) files[`parser/${n}.mjs`] = stub(n, 'input');
  for (const [n] of report) files[`report/${n}.mjs`] = stub(n, 'input');
  w.repo('feature', files);
  w.j('init', 'Finish the small library so every helper does what its issue says.', ...IDENT);
  w.j('goal', '--set', 'Check: node check.mjs', ...IDENT);
  w.j('goal', '--set', 'Model (light): claude-haiku-5-5', ...IDENT);
  w.j('goal', '--set', 'Model (standard): claude-sonnet-5-5', ...IDENT);
  const issue = (dir, name, says) => w.j('new', `${name}: ${says}`, '--why', `${name} is a stub; callers need it to work.`, '--kind', 'bug', '--acceptance', `[test] ${name} returns the ${says}`, '--acceptance', '[check] the suite passes', '--files', `${dir}/${name}.mjs`, '--tier', 'light', ...IDENT);
  for (const [n, s] of parser) issue('parser', n, s);
  for (const [n, s] of report) issue('report', n, s);
  w.j('new', 'Decide what the package is called', '--why', 'Two names are in use in the notes and neither has been agreed.', '--kind', 'gap', '--acceptance', '[read] one name is recorded as the decision', '--files', 'README.md', '--tier', 'standard', ...IDENT);
  w.j('new', 'Agree the licence wording for the release', '--why', 'A release needs a licence line and only the owner can set one.', '--kind', 'gap', '--acceptance', '[owner] the licence line reads right · material: the README licence section · check: is this the licence he wants', '--files', 'README.md', '--tier', 'standard', ...IDENT);
  w.j('ask', 'Which licence should the release carry: MIT or Apache-2.0?', '--kind', 'charter', ...IDENT);
}

// Three issues, the third leased to a worker with its worktree made: the worker and the examiner are given its briefs.
function review(w, model) {
  w.repo('feature', THREE_SCRIPTS);
  w.j('init', 'Make the three scripts pass their checks.', ...IDENT);
  w.j('goal', '--set', 'Check: node check.mjs', ...IDENT);
  w.j('goal', '--set', 'Model (light): claude-haiku-5-5', ...IDENT);
  w.j('goal', '--set', 'Model (standard): claude-sonnet-5-5', ...IDENT);
  w.j('new', 'slug collapses spaces', '--why', 'A title with double spaces gets a broken slug.', '--kind', 'bug', '--acceptance', '[test] slug trims and joins words by one dash', '--files', 'slug.mjs', '--tier', 'light', ...IDENT);
  w.j('new', 'total honours the quantity', '--why', 'An order of several of one item is undercharged.', '--kind', 'bug', '--acceptance', '[test] total multiplies each price by its quantity', '--files', 'total.mjs', '--tier', 'light', ...IDENT);
  w.j('new', 'wrap fills each line to the width', '--why', 'wrap breaks a line one character too early.', '--kind', 'bug', '--acceptance', '[test] wrap keeps two words on a line when together they are exactly as wide as the width', '--acceptance', '[check] the suite passes', '--acceptance', '[read] a comment at the head of wrap.mjs says what happens to a word longer than the width', '--files', 'wrap.mjs', '--tier', 'standard', ...IDENT);
  const branch = 'jarl/3-wrap';
  w.j('set', '3', 'in-progress', 'the worker is raised', '--branch', branch, '--worker', 'w-3', '--model', model, ...IDENT);
  w.g('worktree', 'add', '-q', join('..', 'wt', '3-wrap'), '-b', branch, 'feature');
}

function replacement(w) {
  w.repo('feature', { 'screen.mjs': 'export const screen = () => "old";\n', 'parser.mjs': 'export const parse = (s) => s;\n', 'check.mjs': CHECK_RUNNER });
  w.j('init', 'Ship the new screens and parser.', ...IDENT);
  w.j('goal', '--set', 'Coordinators: odin, thor', ...IDENT);
  w.j('goal', '--set', 'Check: node check.mjs', ...IDENT);
  w.j('decide', 'odin-standing', 'Odin keeps the screens together on one branch of work.', '--applies-to', 'slice odin', ...IDENT);
  w.j('decide', 'thor-standing', 'Thor asks before touching the parser.', '--applies-to', 'slice thor', ...IDENT);
  w.j('new', 'send the owner the render of the home screen', '--why', 'He was promised a look before anything else.', '--kind', 'promise', '--found-by', 'odin', '--tags', 'slice:odin', '--acceptance', '[read] the render was sent to him', '--files', 'render.txt', '--by', 'odin');
  w.j('new', 'the screen renders the new header', '--why', 'The old header is gone from the design.', '--kind', 'bug', '--tags', 'slice:odin', '--acceptance', '[test] screen() returns the new header', '--files', 'screen.mjs', '--tier', 'standard', '--by', 'odin');
  w.j('new', 'the parser reads the new field', '--why', 'The field arrives next month.', '--kind', 'gap', '--tags', 'slice:thor', '--acceptance', '[test] parse reads the field', '--files', 'parser.mjs', '--tier', 'standard', '--by', 'thor');
  for (const [id, worker, file] of [['2', 'w-2', 'screen.mjs'], ['3', 'w-3', 'parser.mjs']]) {
    const branch = `jarl/${id}`;
    w.j('set', id, 'in-progress', 'the worker is raised', '--branch', branch, '--worker', worker, '--model', 'claude-sonnet-5-5', '--by', 'jarl');
    w.g('checkout', '-qb', branch); w.write(file, `${readFileNote(file)}\n`); w.g('add', '-A'); w.g('commit', '-qm', `work on ${id}`); w.g('checkout', '-q', 'feature');
    w.j('evidence', id, '--line', '1', '--ran', 'node check.mjs', '--saw', 'all passed', '--by', worker);
  }
  w.j('ask', 'Which screen goes first, the home screen or the detail screen?', '--kind', 'escalation', '--slice', 'odin', '--by', 'odin');
  w.j('ask', 'Does the parser keep its name?', '--kind', 'escalation', '--slice', 'thor', '--by', 'thor');
}
const readFileNote = (file) => `// ${file}: changed by the worker`;

// One lease idle for ninety minutes, one written just now. The old lease is made through the record's own library, with
// its clock set back, which is how a test of the tool makes one; nothing reads that seam outside these two scenarios.
async function stuck(w, model, skill) {
  w.repo('feature', { 'a.mjs': 'export const a = () => 1;\n', 'b.mjs': 'export const b = () => 2;\n', 'check.mjs': CHECK_RUNNER });
  const R = await import(pathToFileURL(join(skill, 'scripts', 'record.mjs')).href);
  const W = await import(pathToFileURL(join(skill, 'scripts', 'lib', 'where.mjs')).href);
  W.setClock(Date.now() - 90 * 60_000);
  R.initLoop(w.project, 'Keep the small helpers working.', { by: BY });
  const L = await import(pathToFileURL(join(skill, 'scripts', 'jarl-lib.mjs')).href);
  L.cmdGoalSet(w.project, 'Check: node check.mjs');
  R.newIssue(w.project, 'a returns the right value', { width: undefined, why: 'a is wrong.', kind: 'bug', files: 'a.mjs', acceptance: '[test] a returns the value the issue names', tier: 'light', by: BY });
  R.newIssue(w.project, 'b returns the right value', { width: undefined, why: 'b is wrong.', kind: 'bug', files: 'b.mjs', acceptance: '[test] b returns the value the issue names', tier: 'light', by: BY });
  R.setStatus(w.project, '1', 'in-progress', 'the worker is raised', { branch: 'jarl/1-a', worker: 'w-gone', model, by: BY });
  W.setClock(null);
  // The stale worker made one commit at the start, on an old stamp, and nothing since.
  w.g('branch', 'jarl/1-a');
  w.g('worktree', 'add', '-q', join('..', 'wt', '1-a'), 'jarl/1-a');
  const old = new Date(Date.now() - 88 * 60_000).toISOString();
  execFileSync('git', ['-C', join(w.project, '..', 'wt', '1-a'), 'commit', '-q', '--allow-empty', '-m', 'start'], { encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_DATE: old, GIT_COMMITTER_DATE: old }, stdio: ['ignore', 'pipe', 'pipe'], timeout: 30_000 });
  // The live worker: a lease, a worktree, a commit and a row of proof, all made just now.
  w.j('set', '2', 'in-progress', 'the worker is raised', '--branch', 'jarl/2-b', '--worker', 'w-alive', '--model', model, ...IDENT);
  w.g('worktree', 'add', '-q', join('..', 'wt', '2-b'), '-b', 'jarl/2-b', 'feature');
  w.write('b.mjs', 'export const b = () => 3;\n', join(w.project, '..', 'wt', '2-b'));
  w.at(join(w.project, '..', 'wt', '2-b'))('add', '-A');
  w.at(join(w.project, '..', 'wt', '2-b'))('commit', '-qm', 'b, in progress');
  w.j('evidence', '2', '--line', '1', '--ran', 'node b.check.mjs', '--saw', 'red: expected 3 got 2 before the fix', '--by', 'w-alive');
}

// Two clones of a committed loop worked apart, then merged, with what that leaves behind committed: a number taken in
// both, a lease on one issue taken in both, and the conflict markers of the two leases' file.
function twoMachines(w) {
  w.repo('main', { 'split.txt': 'x\n', 'a.txt': 'x\n', 'b.txt': 'x\n' });
  w.j('init', 'Two drivers work this loop apart.', '--committed', ...IDENT);
  w.j('new', 'filed before the split', '--why', 'It was known before the split.', '--acceptance', '[read] it works', '--files', 'split.txt', '--tier', 'light', ...IDENT);
  w.g('add', '-A'); w.g('commit', '-qm', 'The loop');
  const other = join(w.project, '..', 'other-clone');
  execFileSync('git', ['clone', '-q', w.project, other], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30_000 });
  const og = w.at(other);
  og('config', 'user.email', 'blind@example.com'); og('config', 'user.name', 'A Blind Run');
  const oj = (...a) => execFileSync(process.execPath, [w.script, ...a], { cwd: other, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 60_000 });
  const fileLease = (j, g, title, file, branch, worker, by) => {
    j('new', title, '--why', 'Worked apart on one copy.', '--acceptance', '[read] it works', '--files', file, '--tier', 'light', '--by', by);
    j('set', '2', 'in-progress', 'go', '--branch', branch, '--worker', worker, '--model', 'claude-haiku-5-5', '--by', by);
    j('set', '1', 'in-progress', 'go', '--branch', `${branch}-first`, '--worker', worker, '--model', 'claude-haiku-5-5', '--by', by);
    g('branch', branch); g('branch', `${branch}-first`);
    g('add', '-A'); g('commit', '-qm', `${title}, leased`);
  };
  fileLease(w.j, w.g, 'second on this machine', 'a.txt', 'jarl/2-here', 'w-here', 'coordinator here');
  fileLease(oj, og, 'second on the other machine', 'b.txt', 'jarl/2-other', 'w-other', 'coordinator there');
  w.g('fetch', '-q', other, 'HEAD:other-side', '+refs/heads/jarl/*:refs/heads/jarl/*');
  // The merge stops on the two leases' headers of issue 1; whoever merged committed it as it stood, markers and all.
  try { w.g('merge', '-q', '--no-edit', 'other-side'); } catch { w.g('add', '-A'); w.g('commit', '-qm', 'Merge the other copy of the loop'); }
  rmSync(other, { recursive: true, force: true });
}

function owner(w) {
  w.repo('feature', { 'a.txt': 'x\n', 'check.mjs': CHECK_RUNNER });
  w.j('init', 'Ship the next version of the small tool.', ...IDENT);
  const file = (title, ...flags) => w.j('new', title, '--why', 'It is part of the next version.', '--kind', 'gap', '--acceptance', '[read] it reads right', '--tier', 'standard', ...flags, ...IDENT);
  file('the root of three'); file('the second under the root'); file('the third under the root'); file('the fourth under the root');
  w.j('field', '2,3,4', 'Parent', '1', ...IDENT);
  file('alone'); file('alone after', '--after', '5'); file('a thing of his own');
  w.j('new', 'the home page wording', '--why', 'He wants to see it himself.', '--kind', 'gap', '--acceptance', '[owner] the home page reads well · material: the draft of the home page · check: does it say what the tool is', '--tier', 'standard', ...IDENT);
  w.j('ask', 'Which of the two install paths do we keep? The first breaks old scripts, the second costs a release.', '--issue', '5', ...IDENT);
  w.j('ask', 'May the first piece go now, before the others are ready? It changes a public behaviour.', '--issue', '1', ...IDENT);
  w.j('ask', 'Stop everything: the goal changes if we drop the old format, and only you can say.', '--kind', 'stop', '--issue', '7', ...IDENT);
  w.j('decide', 'keep-the-old-name', 'The tool keeps its old name.', ...IDENT);
  w.j('ask', 'Ratify the decision keep-the-old-name.', '--kind', 'ratify', ...IDENT);
}

// A backlog of thirty-three in three areas, with six workers holding leases and reports coming in as rows.
function trigger(w, model) {
  const areas = { api: ['route', 'auth', 'limit', 'cache', 'log', 'retry', 'schema', 'error', 'health', 'version', 'search'], ui: ['header', 'footer', 'menu', 'table', 'form', 'modal', 'toast', 'tabs', 'chart', 'list', 'empty'], billing: ['invoice', 'tax', 'refund', 'plan', 'coupon', 'receipt', 'card', 'usage', 'dunning', 'export', 'report'] };
  const files = { 'check.mjs': CHECK_RUNNER };
  for (const [area, names] of Object.entries(areas)) for (const n of names) files[`${area}/${n}.mjs`] = `export const ${n} = () => null;\n`;
  w.repo('feature', files);
  w.j('init', 'Rebuild the small service one module at a time.', ...IDENT);
  w.j('goal', '--set', 'Check: node check.mjs', ...IDENT);
  w.j('goal', '--set', 'Model (standard): claude-sonnet-5-5', ...IDENT);
  let n = 0;
  const leased = [];
  for (const [area, names] of Object.entries(areas)) {
    for (const name of names) {
      n++;
      w.j('new', `${area} ${name} is rewritten`, '--why', `${name} still has the old behaviour.`, '--kind', 'gap', '--acceptance', `[test] ${name} does what the module list says`, '--files', `${area}/${name}.mjs`, '--tier', 'standard', ...IDENT);
      if (n % 5 === 0 && leased.length < 6) leased.push([String(n), `${area}-${name}`]);
    }
  }
  for (const [id, slug] of leased) {
    w.j('set', id, 'in-progress', 'the worker is raised', '--branch', `jarl/${id}-${slug}`, '--worker', `w-${id}`, '--model', model, ...IDENT);
    w.g('branch', `jarl/${id}-${slug}`);
    w.j('evidence', id, '--line', '1', '--ran', 'node check.mjs', '--saw', 'the row of a worker that finished', '--by', `w-${id}`);
  }
}

export async function build(name, folder, { skill, workerModel = 'claude-haiku-5-5' } = {}) {
  if (!SCENARIOS.includes(name)) throw new Error(`no scenario "${name}": ${SCENARIOS.join(', ')}`);
  if (!skill || !existsSync(join(skill, 'scripts', 'jarl.mjs'))) throw new Error('--skill must name a directory holding scripts/jarl.mjs');
  const w = makeWorld(resolve(folder), resolve(skill));
  if (name === 'lone') lone(w);
  else if (name === 'delegation') delegation(w);
  else if (name === 'review') review(w, workerModel);
  else if (name === 'replacement') replacement(w);
  else if (name === 'stuck') await stuck(w, workerModel, resolve(skill));
  else if (name === 'two-machines') twoMachines(w);
  else if (name === 'owner') owner(w);
  else if (name === 'trigger') trigger(w, workerModel);
  return { project: w.project };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const argv = process.argv.slice(2);
  const flag = (f) => { const i = argv.indexOf(f); if (i === -1) return undefined; const v = argv[i + 1]; argv.splice(i, 2); return v; };
  const skill = flag('--skill');
  const workerModel = flag('--worker-model');
  const [name, folder] = argv;
  if (!name || !folder) { process.stderr.write(`usage: blind-starts.mjs <${SCENARIOS.join('|')}> <folder> --skill <dir> [--worker-model <id>]\n`); process.exit(2); }
  build(name, folder, { skill, workerModel }).then((r) => console.log(`built ${name}: ${r.project}`), (e) => { process.stderr.write(`${e.stderr || e.message}\n`); process.exit(1); });
}
