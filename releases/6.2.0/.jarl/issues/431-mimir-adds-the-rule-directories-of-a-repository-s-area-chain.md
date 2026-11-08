# 431 · Mimir adds the rule directories of a repository's area chain to Gard's list

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** mimir, gard, workplace, git-gate, compatibility
**Files:** Mimir/src/hooks/git-gate-rules.mjs, Mimir/src/commands
**Repo:** ../../../Mimir
**After:** 426, 403
**Found by:** owner
**Where:** the owner, 2026-10-27: rules per area, for example no AI attribution in commits, triggered from above and computed up the hierarchy, repository to company area to Desk

## What
For every code repository Mimir knows, the gate rule directories of its area chain (the area's hooks/git, its parents', the Desk's) are written into Gard's list of rule directories under Mimir's name, kept in step when areas are added, moved or removed, and removed when Mimir is uninstalled. Mimir's own gate engine is not used once Gard is installed.

## Why
A rule written once in a company's area must hold in every repository of that company, while the engine that runs it lives in Gard.

## Acceptance
A fixture with a company area holding a rule: gard commit in that area's repository is blocked by the rule; moving the repository to another area removes the rule from Gard's list

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

