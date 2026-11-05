# Loops

How Jarl loops are run in Althing, and why they are shaped this way. Jarl's own mechanics (issues, leases, workers, the reviewer, the merger, asks and rulings) are the Jarl skill, public at https://github.com/krzysztofdudek/JarlSkill/blob/main/skills/jarl/SKILL.md. The procedure for Althing is the skill `directing-a-release-loop` (`.claude/skills/directing-a-release-loop/SKILL.md`).

## The loop is the record

Everything about a release lives in its loop: the goal, the issues, the rulings, the questions, the evidence and the log. A session starts by resuming from it, and the CLI assembles the state live (`handoff-from-cli`), so there is no handoff note to write and none to go stale. Intentions live where they belong: order in priorities and `After`, reasons in rulings and in the issues' text. A session never re-derives what the record already says.

## One loop per release directory

- A loop is `releases/<version>/.jarl/`: permanent, committed, and kept as the release's record (`loop-in-release-directory`, `one-loop-per-directory`).
- By default Jarl keeps `.jarl/` out of git. Committing it is the explicit choice the family's release loops make (`loop-outside-git-by-default`), because Althing is public and the record is part of what it shows.
- Several loops at once are several directories. A patch backlog is a directory of its own, never a second loop inside an open release.
- A renumbered release keeps its loop: a ruling first, then the directory moves, and the goal is amended citing the ruling.

## The loop lives here, the code elsewhere

The issues of every family repository live only here (`issues-live-in-althing`): one backlog, one place to find a duplicate, one record anyone can read. An issue names its repository by a path relative to the loop's root (`../../../Grain`, or `../..` for Althing), and its files with the repository's directory as a prefix, so that Jarl keeps workers apart across repositories and the record carries no machine path.

The worktree path is the one absolute path the record holds, because Jarl writes it while a lease is held, and rewriting the log would move the done gate. [The rails](../rails/README.md) allow exactly its two shapes, only inside a loop, and nothing else.

## The driver Jarl

The Jarl that writes a release's record is pinned for the whole release (`jarl-pinned-in-loop`). A release often changes Jarl itself; if the Jarl being changed also wrote the record, a format change in the middle of the release could leave the record unreadable to the Jarl that started it. `ws jarl` checks the pin before every write and refuses on a mismatch. Built today: the driver is a sibling checkout pinned to one commit. Where it is going: from 6.3.0 the driver is the previous release's tagged Jarl, run from its own tree, so the Jarl a release changes is never the Jarl that writes its record.

## Workers and worktrees

- **A package** is two to ten small neighbouring issues for one worker on one branch: fewer spawns, fewer merges, and neighbouring changes reviewed together.
- **Worktrees go under `~/Worktrees/<Repository>/<name>`**, as the host's rules say (`host-rules-place-worktrees-and-scratch`), never into the system temporary directory (`worktrees-outside-tmp`). A reboot once emptied it and took six workers' uncommitted work with it. Scratch and a test run's `TMPDIR` go in a `mktemp -d` folder under the system temporary directory.
- **Yggdrasil's workers run in its devcontainer** (`yggdrasil-in-devcontainer`), with the worktree locked, because from the host such a worktree looks prunable and is not ([environment](environment.md)).
- **One heavy run at a time.** Two stack or corpus runs side by side make both slow and turn timeouts into false failures.

## Briefs are templates

A role's brief is a template in `releases/<version>/briefs/`, with a placeholder for every machine value, and `ws brief` renders it for the machine at hand. There are two reasons. A committed brief with machine paths would leak them. And a brief amended by appended notes ("read every X above as Y") contradicts its own body, so a worker who follows the body does the wrong thing. A brief changes by being rewritten, with one line added to its "Changes" list.

## Never by hand

- `log.md` is the done gate's event store: editing it changes which issues count as done. A wrong entry is retracted by an appended one.
- `goal.md` changes only on the owner's word, or under the mandate with a ratify item filed in the same move, citing the ruling.
- An issue's header fields change through the tool, never by editing the file.

## Closing

A release loop closes with the ratification batch, the close itself, the ledger pass and the freeze, in that order ([releases](releases.md)). A permanent loop keeps its directory when it closes.
