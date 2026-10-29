# 351 · Ratatoskr: development leaves only code on the host

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace
**Files:** 
**Repo:** ../../../RatatoskrSkill
**Found by:** owner
**Where:**
**After:** 379, 385, 387, 392, 414, 424

## What
Today the host holds a .lab folder (about 11 MB). Under the ruling family-repos-through-gard, this repository leaves only code on the host through Gard and no interim pattern: it is a root of Gard (its own dev container stays where it has one, otherwise Gard generates one with a volume over every directory its tools, tests or builds write), every command of it runs through gard run, loop workers get their worktrees as Gard's views (gard worktree add), and gard verify host-clean proves the result.

## Why
The owner's rule: the host keeps the code and nothing else; today the family leaves about 1.8 GB beside its code.

## Acceptance
- gard verify host-clean around the repository's full check and any build lists nothing new on the host but the empty mount points, recorded as a row
- Removing the repository's containers and volumes through gard cleanup leaves nothing of its environment on the host

## Evidence

