---
name: family-workspace
description: Use when a session needs the family's tools built or checked together - running a tool's suite with its siblings supplied, the stack scenario, contract shapes, the upgrade path, the pins, the plugins installed together, the canon drift check, a candidate verdict - or the workspace command itself (ws) - setting a machine up, reading what it printed, adding a check, or deciding whether a test belongs in a tool's repository or in Althing. Applies whatever language the request is in.
---

# The family workspace

The workspace is `ws`, the one command in Althing that sees the family's repositories together: `node workspace/ws.mjs <command>`, Node 22 or later, no dependencies. It verifies and records. It never pushes, tags, publishes, opens a pull request or writes to a tool repository; the rail `code/read-only-to-tools` refuses such code, and an act that leaves the machine is printed for the owner, never run. Below, `ws` is `node workspace/ws.mjs`. The command reference is `workspace/README.md`; the machine layout it relies on is [the working environment](../../../method/environment.md).

## Built today, and where it is going

Keep the two apart in everything you write or say.

- **Built today:** `doctor [--fix]`, `status [<version>]`, `jarl <command>`, `brief <role>`, `index [--check]`, `freeze <path>`, `release open` and `release nodes`. None of them gives a verdict on a release.
- **Being built** (the workspace packages W0 to W6 and WF, issues in the open release loop; `ws jarl list --grep workspace` finds them): the registry `family/registry.json`, `env`, `up`, `check <name>`, `run <mode> <version>`, `pin`, `verify-publish`, `order`, `inventory`, `plan`, `verdict`, the cross-tool checks under `workspace/checks/`, and the workflows `dev.yml`, `candidate.yml` and `adopter.yml`.

Before you rely on a command, run `ws help` or read the header of `workspace/ws.mjs`. A command that is not there yet is not run by hand under its name: say that it does not exist yet, do the nearest honest thing (below), and record what you did as an evidence row.

## Setting a machine up

1. `ws doctor`. Fix every `FAIL` before anything else; `ws doctor --fix` sets the hooks path. It names a missing names key and where it goes; the key comes from the owner and is never generated.
2. `ws.local.json` at Althing's root (never committed) names this machine's sibling checkouts, how each one is run (`exec`, the devcontainer prefix for Yggdrasil) and the worktree root. Its shape is in [the working environment](../../../method/environment.md).
3. `ws status`: each repository's branch against the one the open release declares. A checkout off its declared branch is fixed first (switching it is the owner's or the jarl's call, never a worker's).

## The four modes

| Mode | Which commits | What it can block |
|---|---|---|
| dev | each repository's declared branch, or a `--ref` override; advisory | nothing: a red run is a finding to file in the loop |
| candidate | the exact commits `releases/<version>/family.json` names | the family's tags |
| adopter | the published npm packages and plugins, after a publish and weekly | nothing after the fact; it is "verify the publish" as a command |
| upgrade | the previous release's published tools, then the candidate, on the same state | the tags, inside every candidate run |

A manifest moves `open` (branches, commits `null`) → `candidate` (every commit filled, by `ws pin` once it exists) → `published` (after `ws verify-publish`, never edited again). A fix in any repository after pinning means a re-pin, a new commit in Althing and a new run.

## Where a test belongs

**A test belongs to the repository whose commit must change when the test's expectation changes. When an expectation can only change through commits in two or more repositories, the test belongs to Althing.**

- Runes' edge goldens and resolver oracles move with Runes commits: Runes. Yggdrasil's `surface-truth`: Yggdrasil. Jarl reading its own older records: Jarl (Althing only supplies real loops through `JARL_LIVE_LOOP`).
- `grain propose` → `yg adopt` → `yg check`, the three-way edge parity, the upgrade path, one Runes across the family, contract shapes, the plugins installed together, and every tool's suite run with nothing skipped: Althing.
- Data is separate from tests. Althing may hand real data to a tool's own test through the environment, as `GRAIN_CORPUS_CLONES` and `JARL_LIVE_LOOP` already do.

## Running a tool against its siblings

The tools' suites already read their siblings from the environment and skip when nobody supplies them: `YG_BIN`, `YGG_DIR`, `HORDE_DIR`, `HORDE_TEST_YG`, `HORDE_TEST_GRAIN`, `HORDE_TEST_JARL`, `HORDE_TEST_RATATOSKR_DIR`, `GRAIN_CORPUS_CLONES`, `JARL_LIVE_LOOP`. A skipped test proves nothing.

- **Never point `YG_BIN` (or any sibling variable) at a development checkout** that workers are patching. Verification uses the workspace's own clones (`repos/`) and one detached tree per commit (`.cache/trees/<repo>@<sha12>/`), both ignored by git; a build is keyed by its commit, so it is never stale.
- Once `ws env` exists, a worker's full gate is `eval "$(node <althing>/workspace/ws.mjs env)" && <the repository's check>` inside its worktree; a rendered brief carries it as `{{env}}`.
- Until then, build the sibling at the exact commit you are checking in a detached tree under Althing's `.cache/`, export the variables by hand, and write the commits and the command line into the evidence row. Never under the system temporary directory or a session scratchpad: a reboot empties them and the evidence goes with it (ruling `worktrees-outside-tmp`).
- In candidate mode a test skipped for an environment reason (a missing `YG_BIN`, a missing sibling, no corpus) fails the run. A test skipped for a platform is reported, not failed.
- One stack or corpus run at a time on a machine; `ws` holds a lock and runs under `nice` once its run commands land, and until then the jarl keeps the rule by hand.

## Adding a check

1. The question first: does its expectation move with commits in two or more repositories? If not, it belongs in that tool, as an issue in the open loop with that tool's `--repo`.
2. A module in `workspace/checks/<name>.mjs`, with tests in `workspace/test/` on small synthetic repositories in `workspace/fixtures/` (invented names only, no binary files).
3. What it needs from a repository goes into that repository's `env` entry in `family/registry.json`, never into a hard-coded path.
4. When it covers a machine document the core exchanges, its row in `family/contracts.md` names it. The schemas themselves stay on Yggdrasil's Family Contracts page.
5. It reads and reports; a check that would push, tag, publish or comment is refused by the rail, and that is the point.
6. Work on Althing's code happens in a worktree under `~/.jarl-wt/Althing-<NNN>`, as an issue of the open loop with `--repo ../..` (directing-a-release-loop).

## The gate on a tool's exact commit

In 6.2.0 a person reads it: the release issue records the candidate verdict on the Althing commit whose manifest names the release's commits, as an evidence row. From 6.3.0 the release workflows of Runes, Yggdrasil, Grain, Jarl and Horde gain one read-only step that asks the public Althing repository whether the latest manifest for the version names that exact commit and whether that manifest commit's `verdict` is green. There is no bypass input. No tool's push or pull-request CI reads Althing, so a broken workspace blocks nobody's everyday work; it is fixed by a commit here.

## What a green verdict does not prove

That the named commits passed the named checks together, and nothing more. Not that the tools work for every adopter in every repository (the corpus is public repositories at fixed commits), not that a host that could not install headless works (the run names those hosts), and not that a judgment an agent recorded is true: that is testimony. Say so whenever you report a verdict.
