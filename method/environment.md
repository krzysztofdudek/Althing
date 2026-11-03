# The working environment

How a machine that works on the family is laid out, so that every brief, worker and check finds the same things in the same places. `node workspace/ws.mjs doctor` checks all of it and says what is missing ([the workspace](../workspace/README.md)).

## The checkouts

Althing and every family repository are sibling checkouts in one directory:

```
<dir>/Althing
<dir>/Runes   <dir>/Yggdrasil   <dir>/Grain   <dir>/JarlSkill   <dir>/Horde
<dir>/RatatoskrSkill   <dir>/UrdSkill   <dir>/ResearcherSkill
```

Development happens in those checkouts and in worker worktrees cut from them. Verification of exact commits happens in Althing's own clones and per-commit trees (`repos/` and `.cache/`, both ignored by git), never in a development checkout that workers are patching.

## ws.local.json

Each machine says where its checkouts are and how each one is run in `ws.local.json` at Althing's root. It is ignored by git and never committed, because it describes one machine. Paths are relative to Althing's root; `~` is the home directory.

```json
{
  "schema": "ws-local/1",
  "sources": {
    "runes": { "path": "../Runes" },
    "yggdrasil": { "path": "../Yggdrasil", "exec": "docker exec -w /workspaces/Yggdrasil yggdrasil-devcontainer", "worktrees": "<the container's worktree root>" },
    "grain": { "path": "../Grain" },
    "jarl": { "path": "../JarlSkill" },
    "horde": { "path": "../Horde" },
    "ratatoskr": { "path": "../RatatoskrSkill" },
    "urd": { "path": "../UrdSkill" },
    "researcher": { "path": "../ResearcherSkill" }
  },
  "worktrees": "~/.jarl-wt"
}
```

A rendered brief takes every machine value from this file: the checkouts, the worktree roots and the command prefix that runs a command inside a repository's environment. That is why a committed brief carries no path of any machine.

## Worktrees

A worker's worktree goes under `~/.jarl-wt/<Repo>-<NNN>` (NNN is the first issue it carries), and a code issue of Althing's own under `~/.jarl-wt/Althing-<NNN>`. Worktrees and environments never go into the system temporary directory: a reboot empties it, and a worker's state goes with it (ruling `worktrees-outside-tmp`).

The driver Jarl that writes a release loop is a worktree of its own, `~/.jarl-wt/JarlSkill-driver`, pinned to the commit the manifest's `driver` names; `ws.local.json` maps `jarl` to it, so a brief's `{{repo:jarl}}` is that worktree, not JarlSkill's main checkout. Nobody switches, commits, pulls or stashes in it, because the loop's record must be written by the Jarl it was pinned to (ruling `jarl-pinned-in-loop`).

The merger lands approved branches in a second worktree of its own, `~/.jarl-wt/JarlSkill-release`, on the release branch, and runs the full suite there; JarlSkill's main checkout stays on `main`. The merger removes a worker's worktree once its issue is merged, naming it, one at a time, never by a pattern over `~/.jarl-wt`; the driver worktree and the merge worktree are never removed, and a worktree with uncommitted changes is never removed. Only the worktrees of issues in flight remain beside those two.

A test suite that creates temporary directories runs with `TMPDIR` set to a directory of its own under the machine's scratch area (`~/Temp/tmp/<agent>`). The system temporary directory is memory with a limit on the number of files, and on 2026-11-03 Jarl's suite filled it and stopped every command on the machine (issues 075 and 091 of the 6.3.0 loop).

Audits and research extract code into Althing's own `.cache/`, which git ignores; nothing temporary is left in any repository.

## Yggdrasil runs in its devcontainer

Yggdrasil's suite runs inside its devcontainer, never on the host (ruling `yggdrasil-in-devcontainer`). Commands run with the `exec` prefix from `ws.local.json`. Its worker worktrees live inside the container, under the container's worktree root, and are created with `git worktree add --lock --reason devcontainer`. Seen from the host their paths do not exist, so they look prunable: never prune them. `ws doctor` checks that the container is running.

## The machine's load

One stack or corpus run at a time. Two heavy runs side by side make both slow and make timeouts look like failures. Until the workspace's run commands hold their own lock, the jarl keeps this by hand.

## The names key

The keyed names rail needs the key in `~/.config/althing/names.key` (32 random bytes, hex, readable only by its owner). It comes from the owner, who keeps a backup; it is never generated on a new machine, because a new key would not match the committed digests. The same key is the CI secret `ALTHING_NAMES_KEY` on Althing, and on no other repository.

## Git

- `core.hooksPath` is `.githooks` (`ws doctor --fix` sets it). Without it no rail runs before a commit or a push.
- Yggdrasil's merge drivers for its logs and locks (`merge.yg-log.driver`, `merge.yg-lock.driver`) are configured by `yg init --upgrade` in each clone, which also rewrites the managed Yggdrasil block of `AGENTS.md`. A contributor who wants neither can set a plain three-way merge for the clone: `git config merge.yg-log.driver "git merge-file -L ours -L base -L theirs %A %O %B"` and the same for `merge.yg-lock.driver`.
- The names key is the maintainer's. A machine without it is a contributor's machine: `ws doctor` warns, pushes to a fork go through unscanned with one line saying so, and only a push to the canonical repository needs the key.
- The commit identity is `Krzysztof Dudek <me@chrisdudek.com>` in every checkout and container that commits family work.
- Node 22 or later, and `gh` signed in for reading issues and CI.
