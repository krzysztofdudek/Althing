# 241 · Jarl: status, resume and branches report a worktree in a devcontainer as gone

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** jarl
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**

## What
In the 6.2.0 loop jarl status shows 'worktree gone' for all Yggdrasil packages, although their worktrees live in the container (the container's worktree directory), which the host does not see; branches could mark them 'DONE → delete'.

## Why



## Acceptance
- First the state git knows: a worktree that git list --porcelain marks as locked, or not as prunable, is not 'gone', even when its path is not visible from this machine (a container); only for the others the fallback rule: a missing path with an existing parent directory is 'worktree gone'.
- branches never gives 'DONE → delete' for a branch whose number of uncommitted changes is unknown; SKILL.md describes the case; the Yggdrasil worker brief creates the worktree in the container with --lock --reason devcontainer; tests red→green for a locked worktree, an invisible one and one truly removed.

## Evidence


