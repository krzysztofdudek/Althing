# 284 · 6.2.0 loop: the worktree paths leave the record before Althing's first push (no --worktree from the coordinator; the 217 lease lines rewritten; the paths rail's allowance retired)

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** strong
**Key:** 20261008T1144-jlfd
**Tags:** althing, migration, record
**Files:** Althing/.claude/skills/directing-a-release-loop/SKILL.md, Althing/releases/6.2.0/briefs/worker-althing.md, Althing/releases/6.2.0/briefs/worker-grain.md, Althing/releases/6.2.0/briefs/worker-horde.md, Althing/releases/6.2.0/briefs/worker-jarl.md, Althing/releases/6.2.0/briefs/worker-runes.md, Althing/releases/6.2.0/briefs/worker-yggdrasil.md, Althing/releases/6.2.0/.jarl/log.md, Althing/rails/paths.mjs, Althing/rails/test/boundary.test.mjs
**Repo:** ../..
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#althing-fr-worktree-paths
**Where:** Althing/releases/6.2.0/.jarl/log.md (217 lease lines); Althing/rails/paths.mjs:7-31 (the allowance); Althing/.claude/skills/directing-a-release-loop/SKILL.md:43 (the lease call passes --worktree)

## What
The loop's log holds 217 lease lines with an absolute worktree path ("· worktree <path>": 144 under a home directory's .jarl-wt/, 73 under the devcontainer's worktree root), and 24 live leases hold a Worktree field. Althing's first push (266) goes out as one squashed commit before this loop can close, so whatever the record holds then becomes public for good, and whatever is rewritten before it never does (the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, A.5 items 1 and 2; ruling worktree-paths-before-push). Nothing needs the paths: Jarl 6.1.0's done gate reads a lease line's worker up to " · worktree " or the end of the line (jarl-lib.mjs:1766 at 2c12aa3), the Worktree field's only reader is the "worktree gone" warning (:2395), which is wrong for the devcontainer's worktrees anyway, and branches reads worktrees from git (:2466). Three steps. Now: the coordinator passes no --worktree (the lease call in the skill for directing a release loop), and the worker briefs name the worktree by its place under {{wt:<repo>}} and the issue's Branch instead of the issue's Worktree field. Before 266, by the method of ruling althing-move: each "· worktree <path>" tail becomes "· worktree <its last segment>", and every Worktree field on a live lease is removed. Then the paths rail's worktree allowance (rails/paths.mjs:7-31) goes, as a new version of the rule.

## Why
The worktree path is the one value in the record that belongs to one machine: a home directory with its user name, or the devcontainer's root. A public record must not carry it, and the first push cannot be taken back.

## Acceptance
- The skill's lease call passes no --worktree, and the six worker briefs locate the worktree without the issue's Worktree field; a lease taken after this records none
- No lease line in log.md and no issue header holds an absolute path: each lease line ends in '· worktree <last segment>' and no live lease has a Worktree field; recorded as a --ran/--saw row with the counts before and after
- With Jarl 6.1.0's library imported directly, before and after show zero difference in every issue's gate state, its header fields other than Worktree and its evidence rows, and in status, next, report and list; recorded as a --ran/--saw row
- Done while no other copy of the loop's log is in flight (the log merges by union and only main carries this loop), and before 266
- The paths rail's worktree allowance is removed as a new version of the rule, with a test that a worktree path in a loop file is refused, and a ratify item for the owner; yg check && npm test green

## Evidence

