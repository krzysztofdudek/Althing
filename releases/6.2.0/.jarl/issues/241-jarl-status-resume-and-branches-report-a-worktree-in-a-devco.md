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
**After:** 306

## What
In the 6.2.0 loop jarl status shows 'worktree gone' for all Yggdrasil packages, although their worktrees live in the container (the container's worktree directory), which the host does not see; branches could mark them 'DONE → delete'. Amended by the architect's scope review of 2026-10-18 (sections 2 and 4, item 2): 241 and 247 both define worktree views, so this issue builds the single lookup of worktree state and the others reuse it: it asks git (git worktree list --porcelain, in each repository an issue names) for the worktree holding a lease's branch, and falls back to the stored path only for old leases that have one. The states are: here; listed but not visible from here (prunable with its parent missing); elsewhere, for a worktree locked with a reason; no worktree holds the branch. 247 then only stops storing the path, and 306 finds every worktree's copy of the loop the same way. The brief line from the earlier acceptance (the Yggdrasil worker creates its worktree in the container with --lock --reason devcontainer) is Althing's, not JarlSkill's, and moved to Althing's 315.

## Why



## Acceptance
- One function returns the worktree state of a branch, by asking git first: a worktree that git worktree list --porcelain marks as locked, or not as prunable, is not 'gone', even when its path is not visible from this machine (a container); only for the others the fallback rule: a missing path with an existing parent directory is 'worktree gone'. It finds the worktree by the lease's branch, and by the stored Worktree path for an old lease that has one. status, resume and branches read worktree state only through it, and 247 and 306 reuse it.
- branches never gives 'DONE → delete' for a branch whose number of uncommitted changes is unknown; SKILL.md describes the states and the case; tests red→green for a locked worktree, an invisible one, one found by branch with no stored path, and one truly removed.

## Evidence


