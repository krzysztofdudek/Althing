# Git hook layer ("the gate"): design

> **In Althing, 29 October 2026.** Ported from Mimir's development documents with every private name replaced by a neutral one. An M-number (M93) names an issue of Mimir's first loop, which is kept outside Althing; the ones that still matter are listed in `releases/6.2.0/plans/plan-mimir.md`. On 29 October the owner moved the gate to Gard and dropped everything this document installs into a repository: the gate is now `gard commit` and `gard push`, which run the rules and then call git (ruling `git-through-gard`, [gard-design.md](gard-design.md)). The rule engine and the rule API below still hold; the stubs, the chain mode, the hooks path and the snapshot are history. Mimir's word "shell" names what Gard calls a rig (ruling `rig-is-the-name`).

> 2026-10-27. Architect (Opus) design for the owner's request: a commit or push made in a Mimir-managed repo, by any tool
> (VS Code, terminal, Claude Code, later Copilot/Codex/Cursor), can be blocked by rules that live above the repo: in the
> areas of its chain and in the Desk. Outside the repo, in English, not to be copied into the Mimir repo (it names issue
> numbers and rulings). Nothing in the Mimir working tree was changed.
>
> Includes the owner's clarification of 27.10: **commits in the owner's client repos happen inside the devcontainer of
> the shell (otoczka), so that is the primary case**. Host-side git is the second case and uses the same stub. Container
> mechanics are the owner's setup, not the core. Section 0 says what this split moved.
>
> Read for this: `spec-v3.md` (Scope and principles, Data model, Algorithms, Write protocol, Session, Area elements,
> Installation, The owner's setup), `architecture.md` (sections 3-8, 12-13), `pytania-na-rano.md` (answers 26, 27,
> 35c, 35d), `plan-celu-fale.md`, `review/2026-10-27-drugi-przeglad-opus-szwy-protezy/report.md` (Z11), Jarl M62,
> 80, 93, 114, 130 (and the titles of 31, 42, 58, 60, 79, 102, 104). Code: `bin/mimir.mjs`, `src/hooks/entry.mjs`,
> `src/hooks/protocol.mjs`, `src/install/shim.mjs`, `plugin/hooks/hooks.json`, `src/git/policy.mjs`, `src/git/run.mjs`,
> `src/git/remote.mjs`, `src/context/chain.mjs`, `src/registry/gitdir.mjs`.

## 0. The answer in ten lines

1. **Trigger:** a small POSIX `sh` stub per repo, in the repo's own hooks directory (`<git-common-dir>/hooks/`), for
   `pre-commit`, `pre-merge-commit`, `commit-msg` and `pre-push`. The stub calls one entry, `mimir hook git <hook>`, and
   then runs the hook that was there before it. No global `core.hooksPath`, no `init.templateDir` by default, no git
   wrapper on `PATH`, nothing in VS Code settings.
2. **Window:** exit code 10 from Mimir means "block"; any other non-zero means "Mimir is broken" and the stub lets the
   commit through with a one-line notice. A missing `mimir` is a notice too. The owner can never be locked out by a
   broken or missing Mimir.
3. **Rules:** modules in `<area>/hooks/git/`, found by scanning (auto-registration, no manifest entry). Every area of
   the repo's chain contributes: the area that owns the repo, its parents, the overlays, the Desk. `reads` contribute
   nothing. The result is the **union**: any block blocks. A lower area cannot relax a higher one. Only the owner's own
   layers (Desk prefs, computer config) can switch a rule off, by address, and that is logged.
4. **Container first:** the rules reach a place where Mimir has no registry, such as a container, through a
   **snapshot** in the repo's git dir (`<git-common-dir>/mimir/gate/`). It is written by a Mimir that knows the chain.
   Private data travels as hashes, never as clear text. The core defines the snapshot. *How* Mimir and the snapshot
   reach the container is owner setup (M79 and M80).
5. **Honesty:** `--no-verify`, another machine and a machine without Mimir all bypass the gate. A pushed bad commit is
   found afterwards by `mimir git-gate audit` (doctor, and the owner's wrapper CI). Only a server-side check or CI
   *guarantees* anything.

**What the owner's clarification moved from core to owner setup:** mounting the Desk or `~/.mimir` into a container,
same-path mounts, getting Node and Mimir into the container image, running the snapshot refresh from devcontainer
`initializeCommand`, and container names. **What stayed in core:** the stub, `mimir hook git`, the rule API, the chain
and union semantics, the snapshot *format* and the `mimir git-gate snapshot` command (generic: "evaluate rules where
the Desk is not"; it serves a container, another computer or a CI runner the same way), install/remove/doctor/audit. The core never
says "container".

## 1. Where the coordinator's and the owner's framing is wrong

1. **"One global trigger" is not a git-config thing.** A global `core.hooksPath` is the wrong tool, for three reasons:
   (a) a repo-local `core.hooksPath` overrides it, and husky 9 sets one, so it is not global anyway; (b) VS Code Dev
   Containers copies the host `~/.gitconfig` into the container, so a global `core.hooksPath=~/...` points at a
   path that does not exist there, and git then runs **no hooks at all** in the container, including the team's
   lefthook/pre-commit hooks; (c) the pre-commit framework refuses to install while any `core.hooksPath` is set.
   "Global" is the dispatcher (`mimir hook git`). The trigger is per repo.
2. **"Node-based stubs, no POSIX shell" is wrong for git hooks.** Git runs hooks through `sh` on every platform, and Git
   for Windows ships its own `sh` for that (husky and lefthook depend on it). A stub with `#!/usr/bin/env node` fails
   *closed* when `node` is not on `PATH` (GUI apps, nvm, a container without Node): `env` exits 127 and git aborts the
   commit. So the stub is `sh`, and Node lives behind `mimir`. M93's "no shell" rule still holds for the agent
   plugin's `hooks.json`, not here.
3. **"repo -> area -> Desk" has no Mimir level inside the repo.** Mimir never reads rules from a team's code repo, which
   stays clean. The "repo level" is the team's own hook (husky, lefthook, pre-commit, App's script), and the stub chains
   to it. The order of evaluation does not matter for a union. Mimir runs Desk first and then down, the same order as the
   agent dispatcher (spec, The dispatcher hook), and reports every block at once.
4. **"Or another layout, chosen automatically":** nothing needs choosing. The chain is the one `mimir context` already
   computes (`buildChain`, `src/context/chain.mjs:133`), minus the entries with relation `read`.
5. **A team-area rule binds only teammates who run Mimir.** App's "no AI attribution" script already sits in App's code
   repo and binds everyone there. A copy in a Mimir area adds nothing for that repo. Its value is for repos where the
   team cannot add hooks, and for commits into the area repo itself. A team's real gate is its CI or a server hook.
6. **The leak guard needs scopes.** "Block client names" would block every commit in that client's own repos, where the
   name belongs. A word group is allowed inside named areas (the client's subtree) and blocked everywhere else.
7. **Mimir's own writes skip `pre-commit` and `commit-msg`.** Beside commits are `commit-tree` + `update-ref`. They do
   run `pre-push`, because the git policy has no `--no-verify` for push. So the write core must call the gate itself.
   Otherwise a blocked message sits in the queue and every push fails. Also, `classifyRemote` (`src/git/remote.mjs`)
   files a pre-push refusal under "failed", so it needs its own classification.
8. **The git runner would check the wrong content inside a hook.** During `git commit -a` / `--only` / `-i`, git points
   `GIT_INDEX_FILE` at a temporary index inside `.git` (`index.lock`, `next-index-*.lock`). `runGit` drops
   `GIT_INDEX_FILE` (`GIT_KEPT` in `src/git/run.mjs`), and `indexFileProblem` (`src/git/policy.mjs:500`) refuses any
   index inside `.git`. As written, the gate would read `.git/index` and miss what `commit -a` actually commits. This
   needs a narrow policy door (task G4).
9. **Never put "no AI attribution" in the Desk.** The Mimir repo's own commits carry `Co-Authored-By: Claude` and
   `Claude-Session:` trailers by the brief rules (`plan-celu-fale.md`). A Desk-level rule would block the owner's own
   loop. The rule belongs in the team's area.
10. **Mounting the Desk into a client container exposes all of the Desk** (other clients' knowledge, the clear word list)
    to every npm package that runs there. The spec already refuses a host connection from containers for this reason
    (spec, Container). The snapshot carries only the rules of that repo's chain, with the word list hashed.
11. **Doubt to confirm:** "no tooling on the private laptop" cannot mean "no Mimir on the Mac". The Desk, the registry
    and the agent session live there (spec, Container: "the session runs on the host"). I read it as no *project*
    tooling on the host (husky, node_modules of client repos, the gate runtime for client repos). The design works
    either way: the snapshot can also be written by a Mimir inside the container that has the Desk mounted read-only.

## 2. Mechanism (question 1)

### 2.1 Options compared

| Option | Fires for any tool | Existing repos | Container | Team hooks keep working | Verdict |
|---|---|---|---|---|---|
| Global `core.hooksPath` | yes, unless a repo-local value wins | yes | **breaks**: copied `.gitconfig` points at a missing dir, so no hooks run at all | only if Mimir chains; pre-commit framework refuses to install | no |
| `init.templateDir` | only new clones/inits | no | path also copied, so git warns "templates not found" | the copied stub can be replaced later | optional later, for "every new repo", off by default |
| **Per-repo stub in `<git-common-dir>/hooks/`, written by `mimir`** | yes: git runs it for CLI, VS Code, agents, JetBrains | yes, for repos in the registry | **yes**: the repo is mounted, so its `.git/hooks` is there too | yes, by chaining (2.3) | **chosen** |
| Repo-local `core.hooksPath` -> Mimir's dir | yes | yes | yes | husky's `prepare` resets it on every `npm install`; pre-commit framework refuses | opt-in fallback for husky repos only (2.3) |
| `git` shim on `PATH` | no: libgit2 tools and VS Code's `git.path` bypass it | - | needs PATH games in every image | - | no; also against "Git without a proxy" (spec) |
| VS Code settings | no hook API exists | - | - | - | only make sure `git.allowNoVerifyCommit` stays `false` (default) |

### 2.2 Which hooks

| Hook | Who runs it | Use |
|---|---|---|
| `pre-commit` | `git commit`, including `--amend`; not cherry-pick, not rebase, not `commit-tree` | staged content (added lines, new paths), branch name, author/committer identity |
| `pre-merge-commit` | an automatic merge commit | same as pre-commit, on the merge result |
| `commit-msg` | `git commit`, `git merge` (and rebase `reword`) | the message |
| `pre-push` | `git push`, including Mimir's own pushes | **the net**: every commit leaving the machine, however it was made (rebase, cherry-pick, a commit made with `--no-verify` earlier), plus ref and tag names |
| `post-checkout`, `post-merge`, `prepare-commit-msg` | - | **not installed.** Refreshing on checkout costs time on every checkout and SessionStart/sync already refresh. A rewriting `prepare-commit-msg` is excluded by design (4.4) |

`--no-verify` skips `pre-commit`, `commit-msg` and `pre-push`. Nothing local can stop that (section 7).

### 2.3 Coexistence (never overwrite)

`mimir git-gate install` decides per hook, in the effective hooks dir (`git rev-parse --git-path hooks`):

| Found | Action |
|---|---|
| nothing | write the stub |
| Mimir's stub (first comment line `# mimir-gate stub`) | rewrite it if its version differs |
| another file (pre-commit framework, lefthook, husky 4, a hand-written hook, App's script) | rename it to `<hook>.pre-mimir`, write the stub, record name and sha256 in `gate/installed.json`; the stub runs it after Mimir with the same args and stdin |
| repo-local `core.hooksPath` (husky 9: `.husky/_`, or custom) | **change nothing**; `doctor` reports `GATE_NOT_ACTIVE` (hooks are owned by `core.hooksPath=<v>`) and offers opt-in `mimir git-gate install --take-hookspath`, which sets the local value to `<git-common-dir>/hooks`, records the old value and chains to `<old>/<hook>`. husky resets it on the next `npm install`; doctor and the next refresh see that and say so |
| a global `core.hooksPath` | report only; Mimir never writes global config |

Later re-installs by other managers. The pre-commit framework moves an existing hook to `<hook>.legacy` and runs it, so
the chain survives. That is why the stub hard-codes its hook name instead of reading `$0`. Whether lefthook runs the
hook it moved to `.old` is **unverified** (probe in G8). If it does not, `doctor` reports `GATE_NOT_ACTIVE` with the
reinstall command.

Worktrees share `<git-common-dir>/hooks`, so one install covers the main checkout and every worktree, Mimir's included.
Submodules have their own git dir and are not covered (the spec allows no submodules in `repos`). A nested repo (a
shell's `source/`) is its own repo with its own stub and its own chain (owner area -> parents -> Desk). The shell's area
repo gets a stub too.

### 2.4 The stub (same file on macOS, Linux, Windows, host and container)

```sh
#!/bin/sh
# mimir-gate stub 1 (pre-commit). Written by `mimir git-gate install`; `mimir git-gate remove` takes it out and
# puts back what was here. It holds no path of a computer.
hook=pre-commit
here=$(dirname "$0")
chained="$here/pre-commit.pre-mimir"          # take-hookspath variant: chained=".husky/_/pre-commit"
input=""; [ "$hook" = pre-push ] && input=$(cat)
m="${MIMIR_BIN:-}"
[ -z "$m" ] && m=$(command -v mimir 2>/dev/null)
[ -z "$m" ] && [ -x "${MIMIR_HOME:-$HOME/.mimir}/bin/mimir" ] && m="${MIMIR_HOME:-$HOME/.mimir}/bin/mimir"
if [ -n "$m" ]; then
  printf '%s\n' "$input" | "$m" hook git "$hook" -- "$@"; rc=$?
  [ "$rc" -eq 10 ] && exit 1
  [ "$rc" -ne 0 ] && echo "mimir: the git rules could not run (exit $rc), so this $hook goes through unchecked" >&2
else
  echo "mimir: the git rules were not checked here (no mimir on PATH)" >&2
fi
if [ -x "$chained" ]; then printf '%s\n' "$input" | "$chained" "$@"; exit $?; fi
exit 0
```

- Exit 10 means block, and nothing else does. A Node crash also exits 1, so treating 1 as a block would lock the owner
  out whenever Mimir breaks.
- Mimir runs first: it is fast, and when it blocks, a slow team hook (lint-staged) does not run for nothing.
- Windows: Git for Windows runs this under its `sh`. `command -v mimir` finds the extensionless `mimir` script that npm
  writes next to `mimir.cmd`. The `~/.mimir/bin` shim form for Windows comes from M93 (acceptance line there).

## 3. The window: contract between stub and Mimir (question 2)

### 3.1 Command

`mimir hook git <hook> [--json] -- <git hook args...>`. It goes through the light path of `bin/mimir.mjs`, the same
branch that `mimir hook` takes today, before the command table, Runes or YAML load (`src/hooks/entry.mjs` header, aspect
`hooks/light-and-fail-open`).

| Item | Value |
|---|---|
| args | `commit-msg`: path of the message file; `pre-push`: remote name, remote url; others: none |
| stdin | `pre-push`: `<local ref> <local sha> <remote ref> <remote sha>` lines; else empty |
| cwd | the work tree top (git sets it) |
| env read | `GIT_DIR`, `GIT_INDEX_FILE` (kept for the hook's reads only, see G4), `MIMIR_GATE` (`off` = skip all, logged), `MIMIR_GATE_ALLOW` (`<rule-id>[,<rule-id>]`, logged), `MIMIR_HOME` |
| exit | `0` pass (warnings may be on stderr), `10` block, anything else = internal failure (the stub passes) |
| stdout | empty; with `--json` one result object (tests, agents, `audit`) |
| stderr | the human text (3.3) |
| time | each rule `meta.timeoutMs` (default 2000; pre-push default 10000); whole run 5 s for commit hooks, 30 s for pre-push; a deadline the same way `DEADLINE_VAR` works today |

`--json` result:

```json
{ "hook": "commit-msg", "verdict": "block",
  "repo": { "address": "github.com/acme-apps/webapp", "branch": "feat/x" },
  "source": "live",
  "results": [
    { "rule": "desk-me/leak-guard", "verdict": "block", "ms": 14,
      "message": "\"globex\" in the commit message (line 1)", "fix": "remove the name from the message" },
    { "rule": "acme/team/no-ai-attribution", "verdict": "pass", "ms": 2 } ],
  "notices": ["new rule acme/team/no-ai-attribution (area acme/team) runs from now on"],
  "skipped": [] }
```

`source` is `live` (chain from the registry), `snapshot`, or `none`.

### 3.2 Rule module contract

```js
// <area>/hooks/git/<name>.mjs   or   <area>/hooks/git/<name>/index.mjs (+ data files beside it)
export const meta = {
  api: 1,                                   // gate API version; an unknown version is skipped with a notice
  events: ['pre-commit', 'commit-msg', 'pre-push'],
  mustRun: false,                           // true: a crash/timeout of this rule blocks (with the escape hatch)
  timeoutMs: 2000,
  travel: ['hashes.json'],                  // files that go into a snapshot; default: the whole rule folder
};
// optional: runs where the chain is known, when a snapshot is written; derives what may travel
export async function prepare({ sourceDir, targetDir }) {}
export async function check(ctx) { return { verdict: 'block', message: '...', fix: '...' }; }
```

`ctx` (everything is lazy and memoized per run, so a rule that asks for nothing costs nothing, and two rules that ask
for the staged diff share one `git diff`):

```
ctx.hook                     'pre-commit' | 'pre-merge-commit' | 'commit-msg' | 'pre-push' | 'audit'
ctx.repo                     { top, commonDir, address|null, branch|null, head }
ctx.chain                    [{ id, title, type, visibility, relation: 'area'|'parent'|'overlay'|'desk' }]
ctx.self                     { ruleId: '<area-id>/<name>', areaId, dir }   // dir = source or snapshot copy
ctx.message()                -> string                                  (commit-msg)
ctx.staged.files()           -> [{ path, status }]                      (pre-commit, pre-merge-commit)
ctx.staged.added()           -> [{ path, line, text }]  added lines only, binary files skipped
ctx.identity()               -> { author: {name,email}, committer: {name,email} }
ctx.push                     { remote: {name,url}, updates: [{ localRef, localSha, remoteRef, remoteSha, deleting }] }
ctx.push.commits(update)     -> [{ sha, message, author, committer, added() }]   range remoteSha..localSha,
                                                                             or localSha --not --remotes=<remote>
ctx.data(file)               -> Buffer, from the rule's own folder (works from a snapshot copy)
ctx.deadlineMs               time left
```

Return `undefined` or `{verdict:'pass'}`, `{verdict:'warn', message}`, or `{verdict:'block', message, fix}`.
**No rewrite.** A hook that edits the message (strips trailers, adds ids) mutates people's text silently. Two rules
rewriting would conflict, and an agent would not learn the rule. The fix line tells the person or the agent what to do.

A rule may import only Node built-ins and files inside its own folder. Its folder is what travels into a snapshot.
Rules do not depend on each other.

### 3.3 What a block looks like (VS Code, terminal, agent)

VS Code shows a failed hook as an error notification with roughly one line of the output, plus a button to the Git
output channel. Exact truncation is **to verify** in a probe (G1). An agent reads the full stderr of `git commit`. So
the first line must stand alone, with no ANSI colours, no box drawing and at most six lines:

```
Mimir blocked this commit: desk-me/leak-guard: "globex" in the commit message.
  fix: remove the name. Deliberate? run: mimir git-gate allow desk-me/leak-guard --once
  also: acme/team/no-ai-attribution: trailer "Co-Authored-By: Claude ..." (fix: delete that line)
  details: .git/mimir/gate/last.txt
```

VS Code keeps the commit message in the input box after a failed commit, so the person fixes and presses commit again.

## 4. Hierarchy and evaluation (question 3)

### 4.1 The chain of a repo

The chain is `buildChain` of the area that owns the repo (the area that declares it in `repos`, or the area in the
Desk's `links`). It contains that area, its parents up to the Desk, and the overlays on each. **Entries with relation
`read` are dropped**: reading an area is not belonging to it. `UNAVAILABLE` entries are skipped with a notice. A repo
that two areas declare is already ambiguous for `mimir context`, so the gate follows whatever context decides and does
not invent a union. Doctor warns about that ambiguity today.

A repo that is not in the registry but has a stub, and no snapshot, gets `source: none`: one notice line, then pass.

### 4.2 Discovery (auto-registration)

- The directory is `<area>/<roles.hooks>/git/` (default `hooks/git/`). It holds `*.mjs` files, or folders with
  `index.mjs`. Names starting with `_` or `.` and all other files are ignored. Rules are sorted by name within an area,
  so `10-leak-guard.mjs` runs before `20-...`. The rule id is `<area-id>/<name>`.
- **Proposed for M62:** the same `hooks/` role splits into `hooks/agent/` (agent events, 62) and `hooks/git/`
  (this). One scanner (`src/hooks/area-modules.mjs`) serves both, so neither imports modules that cannot apply.
- Versioning is the area's git history plus `meta.api`. Nothing is registered and nothing is written into a manifest.

### 4.3 Order, combining, relaxing

- Areas run from the Desk down to the owning area. All applicable rules run within the budget. The verdict is a block
  if any rule blocks; otherwise it is a warn if any rule warns.
- **Union only.** A team area cannot switch off a Desk rule, and a child area cannot switch off a parent's rule. The
  owner's own layers can switch any rule off by id, as the effective-configuration order intends ("the owner can always
  override locally"):

```yaml
# Desk area.yaml (prefs) or ~/.mimir/config; the config wins
prefs:
  git-gate: { off: [acme/team/commit-style] }
```

  Every switched-off rule is listed in `doctor` and in the `--json` result (`skipped`).
- **Fail-open per rule:** an exception, a timeout or an import error makes the rule `failed`. The run passes with a
  notice naming the rule and its area. When `meta.mustRun: true`, the run instead blocks with the escape hatch in the
  message (section 5). A missing or broken Mimir is never a block (2.4).

### 4.4 Speed

| Case | Cost (target, measured in G1 against a cold `node` on the owner's Mac) |
|---|---|
| no `mimir` reachable | the stub's `sh` only: about 5 ms |
| Mimir, no rule for this hook | one Node start on the light path, plus reading the registry cache or `snapshot.json`: 50-90 ms |
| leak guard on a normal commit | above, plus one `git diff --cached -U0` and one import: 90-150 ms |
| pre-push of 50 commits | dominated by `git log -p`; capped scan (5.1) |

The live path reads the existing context cache (`~/.mimir/cache`, keyed by manifest mtimes). Rule metadata (`events`,
`mustRun`) is cached by file path, mtime and size, so a rule that does not apply to the hook is not imported. If
measurement shows more than 120 ms with no rules, the fallback is a marker file `gate/on-<hook>` written with the
snapshot. The stub tests it with `[ -f "$here/../mimir/gate/on-$hook" ]` and does not start Node at all. Not
built until measured.

## 5. Where it runs, and the snapshot (question 6)

### 5.1 One resolution order (core, says nothing about containers)

`mimir hook git` takes the first that works:

1. **live**: this Mimir's registry knows the repo, so it uses the chain and the rule folders in the areas (host case,
   or a container where the owner mounted the Desk);
2. **snapshot**: `<git-common-dir>/mimir/gate/snapshot.json` exists, so it uses the chain and the rule copies recorded
   there (the primary container case, and another computer or a CI runner);
3. **none**: one notice line, pass.

Snapshot layout (local to the clone's git dir, never pushed, visible wherever the repo is mounted):

```
<git-common-dir>/mimir/gate/
  snapshot.json        chain, rules, hashes, versions (below)
  rules/<area-slug>/<rule>/   copies of the rule folders (only meta.travel files, plus prepare() output)
  installed.json       stubs written, chained hooks and their sha256
  allow-once.json      one-time allowances (section 6)
  log.jsonl            every block, override, failure and first run
  seen.json            sha256 of every rule that has run here (first-run notice)
  last.txt             full text of the last block
```

```json
{ "v": 1, "api": 1, "mimir": "1.0.0-alpha.1", "written": "2026-10-27T09:12:00Z", "by": "live",
  "repo": { "address": "github.com/acme-apps/webapp" },
  "chain": [ { "id": "desk-me", "relation": "desk" }, { "id": "acme", "relation": "parent" },
             { "id": "acme/webapp-shell", "relation": "area" } ],
  "rules": [ { "id": "desk-me/leak-guard", "copy": "rules/desk-me/leak-guard", "sha256": "…",
               "events": ["pre-commit","commit-msg","pre-push"], "mustRun": true } ],
  "off": [] }
```

Who writes it: `mimir git-gate snapshot [<repo>]`, which needs a Mimir that knows the chain (live), and the lifecycle
triggers in section 8. On the live path, `mimir hook git` also rewrites a snapshot it finds stale (rule hashes or chain
differ). That is cheap and happens after the verdict.

Staleness, honestly: inside a container, a Desk rule edited on the host takes effect at the next snapshot write. In the
owner's setup that write happens at every container start (5.2), at `sync`, and at the start of each agent session in
that repo. `doctor` shows the age of each snapshot.

### 5.2 Owner setup: how Mimir and the rules reach the container (M79 and M80, not core)

Recommended, smallest:

- **Snapshot, not a Desk mount.** `.devcontainer` of the shell (generated by `container build`, 79):
  `"initializeCommand": "mimir git-gate snapshot source"`. This runs on the host before the container starts. The
  repo's `.git` is in the mount, so the snapshot is there. A host without Mimir (a teammate opening the shell) gets a
  failing `initializeCommand`. Wrap it in the shell's own run script so that it is optional.
- **Mimir in the image:** a feature layer of the shell's container that provides Node (most client images already
  have it) and Mimir. Until npm publication: a read-only bind mount of the host package at a fixed path, with `mimir`
  on `PATH` through a symlink. After publication: `npm i -g @chrisdudek/mimir@<exact>`. No `~/.mimir` mount, so the
  container's Mimir has an empty registry and takes the snapshot path.
- **Alternative for a later decision** (needed only if the in-container agent mode is ever built): mount `~/.mimir` and
  the chain's area folders read-only at the same absolute paths, so the live path works. Cost: the whole Desk is
  visible to client packages, and Mimir must tolerate a read-only home (cache writes fail quietly).
- **Host case** (VS Code on the host, the another company laptop): Mimir is installed, the registry knows the repo, the live path
  runs. The stub is the same file.

### 5.3 Platforms

The stub is `sh` (2.4) and the rule runtime is the Node of `mimir`. Paths inside the snapshot are relative to its
folder, so it works whatever the mount point. Windows: the path layer of 114 normalises `commonDir`. Long paths in
`rules/` stay short because area slugs are short.

## 6. Escape hatch and honesty (question 5)

| Want | How | Logged |
|---|---|---|
| one deliberate commit or push past one rule (terminal) | `MIMIR_GATE_ALLOW=desk-me/leak-guard git commit ...` | `log.jsonl` + stderr line "allowed by MIMIR_GATE_ALLOW" |
| the same from VS Code (no env per commit) | `mimir git-gate allow <rule-id> --once [--for 10m]` writes `allow-once.json`; the next run of that rule consumes it | yes, with who/when/rule/commit |
| everything off for a while | `MIMIR_GATE=off` (same spirit as `MIMIR_HOOKS=off`) | yes |
| a `mustRun` rule that crashes | the same `allow` command, printed in the block message | yes |
| git's own bypass | `git commit --no-verify` / `git push --no-verify` | **not seen** at that moment |

**Detection after the fact:** `mimir git-gate audit [<repo>] [--range <a>..<b> | --unpushed | --all]` runs every rule
whose events include `commit-msg`, `pre-commit` or `pre-push` in `audit` mode over each commit of the range, reusing
`ctx.push.commits`. It reports `GATE_BYPASSED` findings: commits that violate a rule today, whether they skipped the
gate or were made elsewhere. The question is "does the content break a rule", not "did the hook run", because the
first can be answered and the second cannot. Where it runs:

- `doctor` runs it over `--unpushed` of every repo in the registry (cheap: local commits only);
- the owner's wrapper of the public Mimir repo runs the leak guard with `--all` over the whole history in its CI, using
  a snapshot as input (answer 35c). This is the real gate for the public repo;
- a team that wants its area rule enforced puts the same check in its own CI. Mimir offers `audit --json`; the team
  decides.

**What this design does not guarantee:** a commit made with `--no-verify`, on a machine without Mimir, in a repo whose
hooks a manager took over (2.3), with a snapshot older than the rule, or by a tool that writes objects without running
hooks (libgit2-based GUIs, Mimir's own `commit-tree`, until G6). A rule that times out lets the commit through unless it
is `mustRun`. The gate is a barrier, as the agent hooks are (spec, The dispatcher hook: "barriers, not guarantees").
Server-side checks and CI are the only guarantee.

## 7. Rules as modules (question 4)

### 7.1 Owner's leak guard (Desk, private; never in the public repo)

```
<desk>/hooks/git/10-leak-guard/
  index.mjs          the rule
  words.json         clear list: never travels (meta.travel excludes it)
  (prepare() writes hashes.json into the snapshot copy)
```

`words.json`, using placeholders here (the real names live only in the Desk):

```json
{ "groups": [
    { "name": "client-a", "words": ["acme", "acme apps", "roadrunner"], "allowedIn": ["acme", "acme-me"],
      "allowedRepos": ["github.com/acme-apps/*"] },
    { "name": "client-b", "words": ["globex"], "allowedIn": ["globex"] } ],
  "alsoScan": { "identity": true, "paths": true, "refs": true },
  "maxScanBytes": 5242880 }
```

Behaviour:

- **Scope:** a group is skipped when the repo's chain contains an area id in `allowedIn` (or a descendant of one), or
  when the repo address matches `allowedRepos`. In the public Mimir repo, in the owner's "Me" repos and in client B's
  repos, client A's words block. In client A's own repos they do not.
- **Matching:** text goes through NFKD with diacritics stripped and lowercasing, then is split on anything that is not
  a letter or digit and on camelCase boundaries. 1- to 3-token n-grams are compared both joined by a space and
  concatenated, so `AcmeApps`, `acme_apps`, `acme-apps`, `ACME-123` (an issue key) and `acmeapps` all match.
- **Hashed in transit:** `prepare()` writes `hashes.json`: `{ "salt": "<random per Desk>", "groups": [{ "name",
  "allowedIn", "allowedRepos", "h": ["sha256(salt+ngram)", ...] }] }`. In a snapshot the rule hashes the n-grams of the
  scanned text and compares. The clear list never enters a client container, so client A's packages cannot read client
  B's names. A block message quotes the matching word *from the scanned text*, which is already on that machine.
- **What it scans:**
  - `commit-msg`: the message.
  - `pre-commit` / `pre-merge-commit`: added lines (`ctx.staged.added()`), new and renamed paths, the current branch
    name, and the author and committer name and email. An email at a client's domain in a public repo is a leak too.
  - `pre-push`: for each update, the remote ref name (branches and tags), then for every commit in the range its
    message, identity and added lines. The scan is capped at `maxScanBytes`. A capped scan **warns** with
    `mimir git-gate audit --range …` as its fix and does not block. A deleted ref is skipped.
- `mustRun: true`: a crash blocks, with the `allow --once` line. This is the only rule with that flag.
- Tests for it live in the Desk beside the rule, run with `node --test` by the owner. The public repo holds only the
  mechanism test with a neutral fixture rule (G10).

### 7.2 Team rule "no AI attribution" (shared area, reviewed by PR)

`<team-area>/hooks/git/no-ai-attribution.mjs`:

```js
export const meta = { api: 1, events: ['commit-msg', 'pre-push'] };
const TRAILERS = [
  /^co-authored-by:.*\b(claude|copilot|chatgpt|openai|anthropic|cursor|codex|gemini|devin)\b/im,
  /^co-authored-by:.*@(anthropic\.com|openai\.com)>?\s*$/im,
  /^(claude-session|generated-by|ai-assisted):/im,
  /generated with \[?(claude code|copilot|cursor|codex)/i,
];
const hit = (text) => TRAILERS.map((r) => r.exec(text)?.[0]).find(Boolean);
export async function check(ctx) {
  const msgs = ctx.hook === 'pre-push'
    ? ctx.push.updates.filter((u) => !u.deleting).flatMap((u) => ctx.push.commits(u)).map((c) => [c.sha.slice(0, 8), c.message])
    : [['this commit', ctx.message()]];
  for (const [where, text] of msgs) {
    const line = hit(text);
    if (line) return { verdict: 'block', message: `${where}: "${line.trim()}"`,
      fix: 'delete the attribution line, and turn off the attribution setting of your agent tool for this repo' };
  }
}
```

A teammate does nothing beyond what Mimir already does: they have Mimir, they clone or attach the team area,
`mimir sync` installs stubs in the area's repos and writes snapshots, and the rule runs from their next commit, with
the first-run notice. When the rule changes in the area by PR, the new version runs after their next pull. Teammates
without Mimir are not covered (1.5). The better companion is to stop the tool from adding the trailer at all, through
the tool's per-repo setting, which the area's skills or MCP config can set. The gate catches what slips through.

### 7.3 Example: conventional commits plus an issue id (generic; a public test fixture)

`<area>/hooks/git/commit-style/index.mjs` with `commit-style.json`:

```json
{ "types": ["feat","fix","chore","docs","refactor","test","ci","build","perf"],
  "issue": "[A-Z][A-Z0-9]+-\\d+", "requireIssueOnBranches": ["feature/*", "fix/*"], "maxSubject": 72 }
```

On `commit-msg`, it checks that the subject is `type(scope)?: text` within 72 characters. When the branch matches
`requireIssueOnBranches`, the message must contain an issue id; if the branch name holds one (`feature/ABC-12-x`), the
fix line proposes `feat: <subject> (ABC-12)`. Merge commits (`Merge …`) and `fixup!`/`squash!` subjects pass. Verdict:
block. An area that wants it softer copies the rule and returns `warn`.

## 8. Installation and lifecycle (question 7)

| When | What (core) |
|---|---|
| `init` | stub + snapshot in the Desk repo |
| `area create / attach / clone`, `repo attach / clone` (58), `sync` (42) | stubs + snapshot in every repo of the area; `sync` also re-installs missing stubs and reports replaced ones |
| SessionStart hook in a known repo | refreshes that repo's snapshot in the background when stale (`src/hooks/background.mjs` style; the hook itself starts no git) |
| `doctor` | read-only report per repo (below); prints the fix commands, as the other checks do |
| `area detach / remove` (60) | rebuilds the snapshots of the affected repos; removes the rule copies of areas that left the chain |
| `repo detach`, `mimir git-gate remove [<repo>|--all]` | deletes Mimir's stubs (recognised by header), renames `<hook>.pre-mimir` back when the hook path is free (otherwise reports), restores a taken `core.hooksPath` from `installed.json`, deletes `<git-common-dir>/mimir/gate/` |
| `mimir uninstall` | `git-gate remove --all` over the registry, before the rest |

`doctor` lines:

```
gate  github.com/acme-apps/webapp   active (snapshot 2h old): desk-me/leak-guard (must run), acme/team/no-ai-attribution
gate  github.com/me/tool            NOT ACTIVE: core.hooksPath=.husky/_ owns the hooks. Fix: mimir git-gate install --take-hookspath
gate  github.com/acme-apps/api      stub replaced (lefthook); chained hook missing. Fix: mimir git-gate install
gate  github.com/me/mimir           2 unpushed commits break rules (GATE_BYPASSED). See: mimir git-gate audit --unpushed
gate  off by you: acme/team/commit-style (prefs.git-gate.off)
```

Writing `.git/hooks/*` and `.git/mimir/*` is a file write in the git dir, not a git command, so the git policy is not
involved. Deleting them joins the list of `files/delete-only-own-or-approved` (Mimir's own files, recognised by the
header). Only `--take-hookspath` needs a policy addition: `config --local core.hooksPath <path>` and
`config --local --unset core.hooksPath`, nothing broader.

## 9. Threat model for this feature (question 9)

The new exposure compared with agent hooks: a rule from an area now runs **on every commit and push of a person in
any tool**, not only in agent sessions. It runs inside the client's container from the snapshot copy, and it sees
staged content, messages and identities. "Mimir trusts everything cloned" (spec, Trust in what is cloned) makes a
hostile or compromised shared area equal to code execution on each commit in its repos, and exfiltration of what it
sees.

What limits it already, by construction:

- A rule runs only in repos whose chain contains its area: its own repos and its descendants' repos. A team area's rule
  does not run in the owner's other clients' repos or in the Desk. Only Desk rules run everywhere.
- Rules come only from areas in the registry (attached or cloned by the owner) and never from a code repo. A team repo
  cannot plant a rule.

Minimum extra guards (recommended; all cheap; none needs an approval step, which the trust ruling rejected):

1. **Provenance in every line.** A block, warn or failure names `<area-id>/<rule>`. `--json` adds the area's repo
   address and the rule's sha256.
2. **First-run notice.** When a rule's sha256 is not in `seen.json`, the run prints one line: `mimir: new git rule
   acme/team/no-ai-attribution (area acme/team, from github.com/acme/team-knowledge) runs from now on`, and logs it.
   `doctor` lists the rules that are new in the last 7 days.
3. **A snapshot never outlives membership.** Copies of an area that left the chain are deleted at the next write, and
   `detach` writes at once.
4. **Watch auto-found sub-areas.** The registry scan picks up a sub-area that a colleague adds to a shared area repo
   (spec, The registry, step 2). If that sub-area declares, in `repos`, a repo the owner has, its rules join that repo's
   chain. The first-run notice covers it. Optionally, `doctor` warns when a repo's owning area changed since the last
   snapshot.
5. **`mustRun` cannot lock out.** It blocks only on that rule's own crash or timeout, and the message always carries the
   escape. The stub's exit-code rule (2.4) keeps a broken Mimir from blocking.

Accepted, and written into the threat model and README: rules from different areas run in one Node process, so a
hostile rule can read another rule's data. With hashed words, that exposes hashes, not names. One process per area
would cost one Node start per area per commit.

## 10. Fit with existing issues (question 8)

| Issue | Change |
|---|---|
| 62 (area hooks in the dispatcher) | grows: the role splits into `hooks/agent/` and `hooks/git/` with one shared scanner; acceptance line "a `hooks/git/` module is never imported by the agent dispatcher" |
| 130 (owner's rules to the Desk) | gains the leak guard as a Desk module (answer 35d), after G1-G3; the public repo keeps only a neutral fixture rule |
| 80 (shells) | the "`.devcontainer` in a team repo" block moves from a core switch (`prefs.hooks.devcontainer-in-team-repo`) to an owner rule in the Desk: `hooks/git/devcontainer-in-team-repo` on pre-commit. That catches VS Code commits too, and the core loses one owner-specific switch. Shell snapshot via `initializeCommand` (O2) |
| 79 (container build) | the feature layer provides Node + Mimir and the `initializeCommand` (O2); owner setup |
| 93 (Windows, no shell) | add: the gate stub is `sh` by design (Git for Windows' sh); golden stub file; the shim lookup in the stub finds the Windows shim form |
| 114 (Windows paths) | `commonDir` and snapshot paths through the path layer; no git above the existing minimum (`rev-parse --git-common-dir`, `--path-format=absolute`) |
| 31 / remote classification | pre-push refusal by the gate classified as `GATE_BLOCKED` (marker line `mimir-gate: blocked` on stderr), not "failed" |
| 102 (codes registry) | new codes: `GATE_BLOCKED`, `GATE_RULE_FAILED` (warning), `GATE_NOT_ACTIVE`, `GATE_STALE`, `GATE_BYPASSED` |
| 104 (refusal log) | gate blocks, allowances and failures land in the same log; `hooks report` shows them |
| 42, 58, 60 | lifecycle triggers in section 8 |
| 129 (provenance, dropped) | stays dropped; the gate records no provenance |

### 10.1 Tasks (C = public core, O = owner's private setup in the Desk or the shell)

Order: **G4 -> G1 -> G3 -> G2 -> O1 -> O2 is the first slice**: the owner's leak guard on pre-commit, commit-msg and
pre-push inside one client repo's container. Everything after it is independent and can follow in any order.

**G4 (C, S, risk high). The hook's index for read-only diffs.**
- `runGit` takes `hookIndex` (from `GIT_INDEX_FILE` of a git hook), allowed only for `diff --cached`, `diff-index
  --cached` and `ls-files`, never for a write command; the policy test lists the refusals.
- A test: `git commit -a` with an unstaged change and a pre-commit stub. The gate sees the change in
  `ctx.staged.added()`.
- The same with `commit --only <path>`.
- After: none.

**G1 (C, M, risk medium). `mimir hook git` and the rule runtime.**
- Light path in `bin/mimir.mjs`; no YAML, SQLite or Runes loaded (loaded-modules test extended).
- Discovery of `hooks/git/` across the chain without `read` entries; order Desk -> area; union; `prefs.git-gate.off`.
- Exit codes 0/10/other; text shape of 3.3; `--json` shape of 3.1.
- Per-rule timeout and failure pass with a notice; `mustRun` blocks with the escape line; `MIMIR_GATE`,
  `MIMIR_GATE_ALLOW`, `allow --once`, `log.jsonl`, `seen.json` first-run notice.
- p95 with no rule for the hook, cold, printed and asserted under 200 ms in the test (goal 100 ms printed only, like
  62); a probe note records what the VS Code notification shows for the block text.
- After: G4.

**G3 (C, M). Snapshot.**
- `mimir git-gate snapshot [<repo>]` writes the layout of 5.1, honouring `meta.travel` and `prepare()`.
- `mimir hook git` with an empty `MIMIR_HOME` and a snapshot gives the same verdicts as live (test runs both).
- Stale rewrite on the live path; rule copies of departed areas removed.
- Paths inside the snapshot are relative; moving the repo folder keeps it working.
- After: G1.

**G2 (C, M). Stub install and remove.**
- `mimir git-gate install|remove [<repo>|--all]`; the decision table of 2.3, apart from `--take-hookspath` (G8).
- Golden stub per hook; the stub's exit-code rule tested with a fake `mimir` returning 0, 1, 10 and 127, and with none
  on PATH.
- Chaining: with a pre-existing hook that reads stdin (pre-push), both see the same input; remove restores it
  byte-identical (sha256 from `installed.json`).
- Worktree: a commit in a linked worktree runs the stub.
- After: G1.

**O1 (O, M). Leak guard in the Desk.**
- `<desk>/hooks/git/10-leak-guard/` per 7.1, with tests beside it (owner runs them).
- Blocks a placeholder word in message, added line, path, branch, author email and pushed tag; passes inside an
  `allowedIn` area.
- The snapshot contains `hashes.json` and no `words.json` (test greps the snapshot for every clear word).
- `mustRun` crash -> block with the `allow --once` line.
- Moved into the Desk by jarl with the owner's consent (as M130 says).
- After: G3.

**O2 (O, S). Mimir and the snapshot in one shell's container.**
- The shell's devcontainer gets Node and `mimir` on PATH (read-only mount of the package until publication).
- `initializeCommand` (through the shell's own run script, optional when Mimir is absent) runs
  `mimir git-gate snapshot source`.
- In the container: a commit with a placeholder client word from VS Code's SCM view is refused with the 3.3 text; the
  same commit with `allow --once` passes and is logged.
- Without Mimir in the container: one notice line, the commit passes, and the team's own hook still runs.
- After: G2, O1; part of 79/80.

**G5 (C, M). `doctor` and `audit`.**
- `doctor` lines of section 8, read-only, each with a fix.
- `mimir git-gate audit --unpushed|--range|--all [--json]`; `GATE_BYPASSED` findings.
- A commit made with `--no-verify` that breaks a rule is reported by the next `doctor`.
- After: G1, G2.

**G6 (C, M, risk medium). Mimir's own writes.**
- The write core runs commit-msg and content rules before `commit-tree`; a block is `GATE_BLOCKED` with the rule's text
  for the agent; nothing is queued.
- `pushRemote` classifies a gate refusal as `GATE_BLOCKED`; the queue reports it and does not retry it as offline.
- After: G1, 102.

**G7 (C, S). Lifecycle triggers.**
- Install and snapshot on init, attach, create, clone and sync; remove on detach and uninstall; background refresh on
  SessionStart.
- After: G2, G3, and 42/58/60 for their commands.

**G8 (C, M, risk high). Hook managers.**
- Probes in the test container with real husky 9, lefthook and pre-commit: install order both ways, and record whether
  each one still runs Mimir's stub.
- `--take-hookspath` with the policy addition; doctor detection when husky takes it back.
- After: G2.

**G9 (C, S). Windows stub.** A golden file, a run under Git for Windows' sh recorded on the CI runner, and the shim
lookup. Folded into 93.

**G10 (C, S). Neutral example rules as fixtures.** `no-ai-attribution` and `commit-style` in `test/fixtures/gate/`,
with neutral names, tested through G1; not shipped as active rules.

**O3 (O, S). The wrapper CI for the public Mimir repo** runs `audit --all` with the leak guard snapshot as input (answer
35c).

**O4 (O, S). The `.devcontainer`-in-team-repo rule as a Desk git rule** (replaces the core switch planned in 80).

Architecture notes for the graph (`architecture.md`): put the gate runtime in `src/gate/` (integration layer, next to
`src/hooks`) and the scanner shared with 62 in `src/hooks/area-modules.mjs`. `hooks/light-and-fail-open` must also
cover `src/gate/**`. Git calls go through `src/git/run.mjs` (G4), so no new launcher is needed.

## 11. Open questions for the owner

1. Does "no tooling on the private laptop" exclude Mimir on the Mac host? (1.11) The design assumes it does not.
2. Snapshot (recommended) or a read-only Desk mount in client containers? (5.2)
3. Should `init.templateDir` be opt-in now, so that every *new* clone, attached or not, gets the leak guard? It costs a
   global-config write and a harmless "templates not found" warning inside containers.
4. husky repos: is it acceptable that the gate is off there until `--take-hookspath`, and off again after each
   `npm install`?
5. Does the leak guard also scan author and committer emails (recommended yes), and is a capped pre-push scan a warn
   (recommended) or a block?
