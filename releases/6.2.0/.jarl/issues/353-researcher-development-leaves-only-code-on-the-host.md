# 353 · Researcher: development leaves only code on the host

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../ResearcherSkill
**Found by:** owner
**Where:**

## What
It leaves nothing ignored in its checkout today; its container keeps it so. Under the ruling family-repos-leave-only-code-on-host, this repository is developed in a dev container of its own built on the pattern of issue 346: every directory its tools, tests or builds write under the checkout is a named volume, the npm cache and TMPDIR live in the container, a post-start script empties the temporary folder, commands run as the container user, and loop workers use clones on a volume instead of worktrees.

## Why
The owner's rule: the host keeps the code and nothing else; today the family leaves about 1.8 GB beside its code.

## Acceptance
- After the repository's full check and any build in the container, git status --ignored --short on the host lists nothing new but the empty mount points, recorded as a row
- Removing the container, its volumes and its image leaves nothing of it on the host

## Evidence

