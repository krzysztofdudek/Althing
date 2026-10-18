#!/usr/bin/env node
// ws: the family's workspace command. Node 22 or later, no dependencies.
// It verifies and records; it never pushes, tags, publishes or writes to a
// tool repository (the rail code/read-only-to-tools holds that).
//
//   ws doctor [--fix]                 this machine: Node, git, gh, hooks, yg and its pin, merge drivers, the names key,
//                                     the sibling checkouts and their branches, worktree roots, the devcontainer,
//                                     the installed plugins and the driver Jarl's pin
//   ws status [<version>]             per repository: branch (red when off the declared one), HEAD, latest tag,
//                                     [Unreleased]; then the open loop's counts
//   ws jarl <command> [args] [--release <v>]
//                                     the release loop's driver Jarl with --root set; a writing command is refused
//                                     when the driver checkout is not on the pinned commit
//   ws brief <role> [--repo <name>] [--issue <id>] [--trailer "<line>"] [--release <v>]
//                                     render a brief template for this machine
//   ws index [--check]                write (or compare) releases/INDEX.md and research/INDEX.md
//   ws freeze <releases/<v> | research/<folder>>
//                                     write FROZEN.sha256 for a closed release or a cited research folder
//   ws release open <v> --previous <p> --goal "<text>" [--version <repo>=<x.y.z>]... [--driver-sibling <commit>]
//                                     a new release directory, its manifest, its nodes, its permanent loop with one
//                                     Check: line per repository, and its release issue
//   ws release nodes <v>              (re)write a release's Yggdrasil nodes and the index node
//   ws check canon-sync [--source repos|local|github] [--ref <ref> | --ref <name>=<ref>]...
//                                     each family README's family section and headline against family/canon.md,
//                                     read from a committed ref: a repos/ clone, a sibling checkout or GitHub (main
//                                     by default)
//
// The four modes (dev, candidate, adopter, upgrade), the other cross-tool checks and
// ws env, up, run, pin, verify-publish and order arrive with the workspace
// packages filed in the release loop.

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { run, gitIn } from './lib/sh.mjs';
import { loadLocal, sourcePath, expand } from './lib/local.mjs';
import { listReleases, readManifest, hasLoop, pickRelease, driverOf, headOf, branchOf } from './lib/releases.mjs';
import { releaseNodes, indexNode } from './lib/nodes.mjs';
import { templatePath, issueText, render } from './lib/briefs.mjs';
import { renderReleasesIndex, renderResearchIndex, sameIndex } from '../rails/index.mjs';
import { sha256, renderFreeze, FREEZE_FILE } from '../rails/freeze.mjs';
import { validateManifest, SEMVER } from '../rails/manifest.mjs';
import { namesState } from '../rails/names.mjs';
import { pinsOf } from '../rails/hooks.mjs';
import { command as canonSyncCommand } from './checks/canon-sync.mjs';

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const JARL_WRITES = new Set(['init', 'new', 'body', 'import', 'source', 'after', 'set', 'tag', 'prio', 'files', 'repo', 'evidence', 'review', 'round', 'merged', 'ask', 'answer', 'log', 'decide', 'archive', 'mode', 'close']);

function takeFlag(args, name, { value = true, many = false } = {}) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--') break;
    if (args[i] === name) {
      if (!value) { args.splice(i, 1); return true; }
      out.push(args[i + 1]);
      args.splice(i, 2);
      i--;
      if (!many) break;
    }
  }
  if (!value) return false;
  return many ? out : out[0];
}

function registry(root) {
  const f = join(root, 'family', 'registry.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
}

// ---- doctor -----------------------------------------------------------------------

export function doctor(root, { fix = false, home = homedir() } = {}) {
  const rows = [];
  const add = (level, name, detail) => rows.push({ level, name, detail });
  const major = Number(process.versions.node.split('.')[0]);
  add(major >= 22 ? 'ok' : 'FAIL', 'node', `${process.versions.node}${major >= 22 ? '' : ' (22 or later is needed)'}`);
  const gitv = run('git', ['--version']);
  add(gitv.ok ? 'ok' : 'FAIL', 'git', gitv.ok ? gitv.out : 'git is not on PATH');
  const gh = run('gh', ['auth', 'status']);
  add(gh.missing ? 'warn' : gh.ok ? 'ok' : 'warn', 'gh', gh.missing ? 'gh is not on PATH (reading GitHub issues and CI needs it)' : gh.ok ? 'signed in' : 'not signed in (gh auth login)');
  const hp = gitIn(root, ['config', '--get', 'core.hooksPath']);
  if (hp.out === '.githooks') add('ok', 'hooks', 'core.hooksPath is .githooks');
  else if (fix) { gitIn(root, ['config', 'core.hooksPath', '.githooks']); add('ok', 'hooks', 'core.hooksPath set to .githooks'); }
  else add('FAIL', 'hooks', 'core.hooksPath is not .githooks; the rails do not run. Fix: node workspace/ws.mjs doctor --fix');
  const preCommit = join(root, '.githooks', 'pre-commit');
  const pin = existsSync(preCommit) ? pinsOf(readFileSync(preCommit, 'utf8'))[0] : null;
  const yg = run('yg', ['--version']);
  if (yg.missing) add('warn', 'yg', `yg is not installed; the hooks fall back to npx @chrisdudek/yg@${pin}`);
  else add(!pin || yg.out === pin ? 'ok' : 'warn', 'yg', `installed ${yg.out}${pin && yg.out !== pin ? `, the hooks pin ${pin}: npm install -g @chrisdudek/yg@${pin}` : ''}`);
  for (const d of ['yg-log', 'yg-lock']) {
    const c = gitIn(root, ['config', '--get', `merge.${d}.driver`]);
    add(c.ok && c.out ? 'ok' : 'warn', `merge driver ${d}`, c.ok && c.out ? 'configured' : `not configured; a plain three-way merge is enough in this clone: git config merge.${d}.driver "git merge-file -L ours -L base -L theirs %A %O %B" (yg init --upgrade installs Yggdrasil's own driver, and also rewrites the managed Yggdrasil block of AGENTS.md)`);
  }
  const names = namesState({ keyPath: join(home, '.config', 'althing', 'names.key') });
  if (names.state === 'ready') add('ok', 'names', 'ready: the key matches the digests');
  else if (names.state === 'no-key') add('warn', 'names', 'no key on this machine, so it cannot run the private-name scan (only the maintainer\'s machine and CI can). You can work and push to your own fork; the maintainer scans a pull request\'s commits with the key before merging it, and CI scans every push to the canonical repository. A maintainer puts the key in ~/.config/althing/names.key with mode 600 and never generates one.');
  else add('FAIL', 'names', names.message);
  let local;
  try { local = loadLocal(root); } catch (e) { add('FAIL', 'ws.local.json', e.message); local = { sources: {}, missing: true }; }
  if (local.missing) add('warn', 'ws.local.json', 'missing: write this machine\'s sibling checkouts into it (method/environment.md shows the shape)');
  const release = (() => { try { return pickRelease(root); } catch { return null; } })();
  const manifest = release ? readManifest(root, release) : null;
  for (const [name, s] of Object.entries(local.sources || {})) {
    const p = sourcePath(root, local, name);
    if (!existsSync(join(p, '.git'))) { add('FAIL', `source ${name}`, `${s.path} is not a git checkout`); continue; }
    const branch = branchOf(p);
    const declared = manifest && manifest.repos && manifest.repos[name] && manifest.repos[name].branch;
    add(declared && branch !== declared ? 'warn' : 'ok', `source ${name}`, `${s.path} on ${branch}${declared && branch !== declared ? `, but release ${release} declares ${declared}` : ''}`);
    if (s.exec && /^docker exec\b/.test(s.exec)) {
      const container = s.exec.trim().split(/\s+/).pop();
      const ps = run('docker', ['ps', '--filter', `name=^${container}$`, '--format', '{{.Names}}']);
      add(ps.ok && ps.out === container ? 'ok' : 'warn', `container ${name}`, ps.ok && ps.out === container ? `${container} is running; its worktrees are locked and look prunable from the host: never prune them` : `${container} is not running (start the devcontainer before working on ${name})`);
    }
  }
  if (!local.missing) {
    const wt = expand(root, local.worktrees || '~/.jarl-wt');
    add(existsSync(wt) ? 'ok' : 'warn', 'worktrees', existsSync(wt) ? `${local.worktrees || '~/.jarl-wt'} exists` : `${local.worktrees || '~/.jarl-wt'} does not exist yet`);
  }
  const pluginsFile = join(home, '.claude', 'plugins', 'installed_plugins.json');
  if (existsSync(pluginsFile)) {
    const plugins = JSON.parse(readFileSync(pluginsFile, 'utf8')).plugins || {};
    for (const want of ['jarl', 'grain']) {
      const id = Object.keys(plugins).find((k) => k.startsWith(`${want}@`));
      const versions = id ? [...new Set(plugins[id].map((x) => x.version))].join(', ') : null;
      add(id ? 'ok' : 'warn', `plugin ${want}`, id ? `${id} ${versions}` : 'not installed (its MCP tools are missing; the CLI through ws jarl still works)');
    }
  }
  if (manifest) {
    const d = driverOf(root, local, manifest);
    if (d.error) add('warn', 'driver jarl', d.error);
    else {
      const head = headOf(d.checkout);
      add(head === d.commit ? 'ok' : 'FAIL', 'driver jarl', head === d.commit ? `release ${release}: on the pinned ${d.commit.slice(0, 12)}` : `release ${release} pins ${String(d.commit).slice(0, 12)}, the checkout is at ${String(head).slice(0, 12)} on ${branchOf(d.checkout)}: ws jarl refuses every write until it is back`);
    }
  }
  return rows;
}

function printRows(rows) {
  for (const r of rows) process.stdout.write(`${r.level.padEnd(4)}  ${r.name}: ${r.detail}\n`);
  return rows.some((r) => r.level === 'FAIL') ? 1 : 0;
}

// ---- status ------------------------------------------------------------------------

function status(root, args) {
  const local = loadLocal(root);
  let v = args[0];
  if (!v) { try { v = pickRelease(root); } catch { v = null; } }
  const m = v ? readManifest(root, v) : null;
  const names = m ? Object.keys(m.repos || {}).filter((n) => n !== 'althing') : Object.keys(local.sources);
  process.stdout.write(v ? `release ${v} (${m.state})\n` : 'no open release loop\n');
  for (const name of names) {
    const p = sourcePath(root, local, name);
    const entry = (m && m.repos[name]) || {};
    if (!p || !existsSync(join(p, '.git'))) { process.stdout.write(`  ${name.padEnd(11)} no sibling checkout in ws.local.json\n`); continue; }
    const branch = branchOf(p);
    const head = headOf(p);
    const tag = gitIn(p, ['describe', '--tags', '--abbrev=0']);
    const cl = join(p, 'CHANGELOG.md');
    const unreleased = existsSync(cl) && /^## \[Unreleased\]\s*\n+(?!## )\S/m.test(readFileSync(cl, 'utf8')) ? 'has [Unreleased] entries' : 'no [Unreleased] entries';
    const off = entry.branch && branch !== entry.branch ? `  OFF ITS DECLARED BRANCH ${entry.branch}` : '';
    process.stdout.write(`  ${name.padEnd(11)} ${String(branch).padEnd(16)} ${String(head).slice(0, 12)}  manifest ${entry.version || '-'}  tag ${tag.ok ? tag.out : '-'}  ${unreleased}${off}\n`);
  }
  if (v && hasLoop(root, v)) {
    const d = driverOf(root, local, m);
    if (d.error) process.stdout.write(`  loop: ${d.error}\n`);
    else {
      const r = run(process.execPath, [d.script, 'status', '--root', join(root, 'releases', v), '--json']);
      if (r.ok) {
        const s = JSON.parse(r.out);
        process.stdout.write(`  loop: open ${s.open}, in flight ${s.inFlight}, waiting ${s.waiting}, done ${s.done}, deferred ${s.deferred}, questions ${s.questions}, to ratify ${s.ratify}\n`);
      } else process.stdout.write(`  loop: the driver Jarl did not answer (${r.err.split('\n')[0]})\n`);
    }
  }
  return 0;
}

// ---- jarl --------------------------------------------------------------------------

export function jarl(root, argv, { spawn = true } = {}) {
  const args = [...argv];
  const wanted = takeFlag(args, '--release');
  const v = pickRelease(root, wanted);
  const m = readManifest(root, v);
  const local = loadLocal(root);
  const d = driverOf(root, local, m);
  if (d.error) throw new Error(d.error);
  const cmd = args[0];
  const head = headOf(d.checkout);
  if (head !== d.commit) {
    const where = `the driver checkout is at ${String(head).slice(0, 12)} on ${branchOf(d.checkout)}, but release ${v} pins ${String(d.commit).slice(0, 12)}`;
    if (JARL_WRITES.has(cmd)) throw new Error(`refused: ${where}. Put the checkout back on the pinned commit before writing the record.`);
    process.stderr.write(`ws jarl: note: ${where}.\n`);
  }
  const full = [d.script, cmd, '--root', join(root, 'releases', v), ...args.slice(1)];
  if (!spawn) return full;
  const r = run(process.execPath, full);
  if (r.out) process.stdout.write(`${r.out}\n`);
  if (r.err) process.stderr.write(`${r.err}\n`);
  return r.status ?? 1;
}

// ---- brief -------------------------------------------------------------------------

export function brief(root, argv) {
  const args = [...argv];
  const repo = takeFlag(args, '--repo');
  const issue = takeFlag(args, '--issue');
  const trailer = takeFlag(args, '--trailer');
  const v = pickRelease(root, takeFlag(args, '--release'));
  const role = args[0];
  if (!role) throw new Error('usage: ws brief <role> [--repo <name>] [--issue <id>] [--trailer "<line>"]');
  const t = templatePath(root, v, role, repo);
  if (!t) throw new Error(`no brief template for "${role}"${repo ? ` (${role}-${repo}.md or ${role}.md)` : ''} in releases/${v}/briefs/`);
  const local = loadLocal(root);
  const m = readManifest(root, v);
  const d = driverOf(root, local, m);
  const values = {
    althing: root,
    root: join(root, 'releases', v),
    jarl: d.error ? null : `node ${d.script}`,
    env: '',
    trailer: trailer ?? null,
    issue: issue ? issueText(root, v, issue) : null,
  };
  return render(readFileSync(t, 'utf8'), values, local, root);
}

// ---- index and freeze -------------------------------------------------------------------

export function indexes(root) {
  const out = {};
  if (existsSync(join(root, 'releases'))) {
    out['releases/INDEX.md'] = renderReleasesIndex(listReleases(root).map((version) => {
      let manifest = null;
      try { manifest = readManifest(root, version); } catch { manifest = null; }
      return { version, manifest };
    }));
  }
  if (existsSync(join(root, 'research'))) {
    const dirs = readdirSync(join(root, 'research')).filter((d) => statSync(join(root, 'research', d)).isDirectory());
    out['research/INDEX.md'] = renderResearchIndex(dirs.map((dir) => {
      const f = join(root, 'research', dir, 'README.md');
      return { dir, readme: existsSync(f) ? readFileSync(f, 'utf8') : '' };
    }));
  }
  return out;
}

function index(root, args) {
  const check = args.includes('--check');
  let stale = 0;
  for (const [rel, text] of Object.entries(indexes(root))) {
    const f = join(root, rel);
    const cur = existsSync(f) ? readFileSync(f, 'utf8') : '';
    if (sameIndex(cur, text)) { process.stdout.write(`${rel}: in sync\n`); continue; }
    if (check) { stale++; process.stdout.write(`${rel}: out of sync\n`); continue; }
    writeFileSync(f, text);
    process.stdout.write(`${rel}: written\n`);
  }
  if (!check) { const n = indexNode(root); if (n) process.stdout.write(`${n}: written\n`); }
  return stale ? 1 : 0;
}

export function freeze(root, target) {
  const rel = String(target || '').replace(/\/+$/, '');
  if (!/^releases\/\d+\.\d+\.\d+$/.test(rel) && !/^research\/\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(rel)) throw new Error('ws freeze takes releases/<version> or research/<YYYY-MM-DD-slug>');
  const ls = gitIn(root, ['ls-files', '-co', '--exclude-standard', '-z', '--', rel]);
  if (!ls.ok) throw new Error(ls.err);
  const files = ls.out.split('\0').filter((p) => p && !p.endsWith(`/${FREEZE_FILE}`));
  if (!files.length) throw new Error(`${rel} holds no file`);
  const entries = files.map((p) => [p.slice(rel.length + 1), sha256(readFileSync(join(root, p), 'utf8'))]);
  writeFileSync(join(root, rel, FREEZE_FILE), renderFreeze(entries));
  return { file: `${rel}/${FREEZE_FILE}`, count: entries.length };
}

// ---- release open --------------------------------------------------------------------------

export function newManifest(prev, { version, previous, versions = {}, driver }) {
  const repos = {};
  for (const [name, r] of Object.entries(prev.repos || {})) {
    if (name === 'althing') { repos.althing = { branch: r.branch || 'main', check: r.check }; continue; }
    const v = versions[name] || (prev.repos[name].version === prev.release ? version : r.version);
    const entry = { version: v, branch: `release/${v}`, commit: null, tag: `v${v}` };
    for (const k of ['npm', 'plugin', 'check']) {
      if (r[k] !== undefined) entry[k] = typeof r[k] === 'string' && r.version ? r[k].replace(r.version, v) : r[k];
    }
    repos[name] = entry;
  }
  return { schema: 'family-release/1', release: version, state: 'open', previous, driver, repos };
}

function releaseOpen(root, args) {
  const a = [...args];
  const v = a.shift();
  const previous = takeFlag(a, '--previous');
  const goal = takeFlag(a, '--goal');
  const sibling = takeFlag(a, '--driver-sibling');
  const versions = Object.fromEntries(takeFlag(a, '--version', { many: true }).map((x) => x.split('=')));
  if (!SEMVER.test(String(v)) || !SEMVER.test(String(previous)) || !goal) throw new Error('usage: ws release open <x.y.z> --previous <x.y.z> --goal "<the goal in the owner\'s words, translated>" [--version <repo>=<x.y.z>]... [--driver-sibling <commit>]');
  const dir = join(root, 'releases', v);
  if (existsSync(dir)) throw new Error(`releases/${v} exists already; a second loop never goes into one directory`);
  const prev = readManifest(root, previous);
  if (!prev) throw new Error(`releases/${previous}/family.json does not exist`);
  const local = loadLocal(root);
  let driver;
  if (sibling) {
    const checkout = sourcePath(root, local, 'jarl');
    const full = checkout ? gitIn(checkout, ['rev-parse', `${sibling}^{commit}`]) : { ok: false };
    if (!full.ok) throw new Error(`the sibling Jarl checkout does not know commit ${sibling}`);
    driver = { jarl: { source: 'sibling', repo: 'jarl', commit: full.out } };
  } else driver = { jarl: { source: 'release', release: previous } };
  const m = newManifest(prev, { version: v, previous, versions, driver });
  const msgs = validateManifest(m, { dir: v, registry: registry(root), previousExists: () => true });
  if (msgs.length) throw new Error(`the new manifest is not valid: ${msgs.join(' ')}`);
  const d = driverOf(root, local, m);
  if (d.error) throw new Error(`${d.error}; open the release with --driver-sibling <commit> until then`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'family.json'), `${JSON.stringify(m, null, 2)}\n`);
  const checks = Object.entries(m.repos).filter(([, r]) => r.check).map(([name, r]) => `Check: ${r.check} (in ${name})`);
  const goalText = `${goal}\n\n${checks.join('\n')}`;
  const steps = [
    ['init', goalText, '--permanent'],
    ['new', `Release ${v}`, '--kind', 'process', '--prio', '1', '--tier', 'strong', '--tags', 'release,needs-owner',
      '--what', `Ship release ${v}: in every repository with work, release/<version> green on its exact commit, the corpus gate and the candidate verdict green, the bump commits, the order to main, the tags through each repository's release workflow, the publish verified, the branches cleaned up.`,
      '--why', 'A release that skips a step is found by a user after the tag.',
      '--acceptance', 'every step of the shipping checklist in the releasing-the-family skill has a --ran/--saw row',
      '--acceptance', 'the owner said to start it, and each push and publish happened on his word'],
  ];
  for (const s of steps) {
    const r = run(process.execPath, [d.script, s[0], '--root', dir, ...s.slice(1)]);
    if (!r.ok) throw new Error(`jarl ${s[0]} failed: ${r.err || r.out}`);
  }
  const written = releaseNodes(root, v);
  index(root, []);
  return { dir: `releases/${v}`, nodes: written };
}

// ---- command line --------------------------------------------------------------------------

// The help is the comment block at the top of this file, after its first line.
const HELP = (() => {
  const out = [];
  for (const l of readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1)) {
    if (!l.startsWith('//')) break;
    out.push(l.replace(/^\/\/ ?/, ''));
  }
  return out.slice(1).join('\n');
})();

// ---- check ---------------------------------------------------------------------------

// The cross-tool checks, by name. Each takes (root, args) and resolves to an exit code.
export const CHECKS = { 'canon-sync': canonSyncCommand };

export async function check(root, args) {
  const [name, ...rest] = args;
  if (!CHECKS[name]) {
    process.stderr.write(`ws check: ${name ? `no check named "${name}"` : 'name a check'}; the checks are ${Object.keys(CHECKS).join(', ')}\n`);
    return 2;
  }
  try {
    return await CHECKS[name](root, rest);
  } catch (e) {
    process.stderr.write(`ws check ${name}: ${e.message}\n`);
    return 1;
  }
}

export function main(argv, root = ROOT) {
  const [cmd, ...rest] = argv;
  try {
    if (cmd === 'doctor') return printRows(doctor(root, { fix: rest.includes('--fix') }));
    if (cmd === 'status') return status(root, rest);
    if (cmd === 'jarl') return jarl(root, rest);
    if (cmd === 'brief') { process.stdout.write(brief(root, rest)); return 0; }
    if (cmd === 'index') return index(root, rest);
    if (cmd === 'freeze') { const r = freeze(root, rest[0]); process.stdout.write(`${r.file}: ${r.count} files\n`); return 0; }
    if (cmd === 'release' && rest[0] === 'open') { const r = releaseOpen(root, rest.slice(1)); process.stdout.write(`${r.dir}: opened; nodes ${r.nodes.join(', ')}\n`); return 0; }
    if (cmd === 'check') return check(root, rest);
    if (cmd === 'release' && rest[0] === 'nodes') { for (const n of releaseNodes(root, rest[1])) process.stdout.write(`${n}: written\n`); const i = indexNode(root); if (i) process.stdout.write(`${i}: written\n`); return 0; }
    process.stdout.write(`${HELP}\n`);
    return cmd && cmd !== 'help' ? 2 : 0;
  } catch (e) {
    process.stderr.write(`ws ${cmd}: ${e.message}\n`);
    return 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  Promise.resolve(main(process.argv.slice(2))).then((code) => { process.exitCode = code; });
}

