# 350 · Horde: development leaves only code on the host

**Status:** dropped
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261028T0941-cotr
**Tags:** gard, workplace
**Files:** 
**Repo:** ../../../Horde
**Found by:** owner
**Where:**
**After:** 379, 385, 387, 392, 414, 424

## What
Horde leaves nothing ignored in its checkout, but its suite writes scratch missions and repositories into the host's temporary folder and needs built Yggdrasil, Grain and Jarl beside it. Under the ruling family-repos-through-gard, this repository leaves only code on the host through Gard and no interim pattern: it is a root of Gard (its own dev container stays where it has one, otherwise Gard generates one with a volume over every directory its tools, tests or builds write), every command of it runs through gard run, loop workers get their worktrees as Gard's views (gard worktree add), and gard verify host-clean proves the result.

## Why
The owner's rule: the host keeps the code and nothing else; today the family leaves about 1.8 GB beside its code.

## Acceptance
- gard verify host-clean around the repository's full check and any build lists nothing new on the host but the empty mount points, recorded as a row
- Removing the repository's containers and volumes through gard cleanup leaves nothing of its environment on the host

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

