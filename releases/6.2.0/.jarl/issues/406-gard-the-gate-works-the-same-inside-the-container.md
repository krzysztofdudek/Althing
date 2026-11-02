# 406 · Gard: the gate works the same inside the container

**Status:** deferred
**Kind:** test
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, git-gate, container
**Files:** Gard/test/gate-container.test.mjs
**Repo:** ../../../Gard
**After:** 402, 387
**Found by:** owner
**Where:** the owner, 2026-10-27: commits happen in the container, because the host has nothing installed

## What
gard commit and gard push give the same result inside a view's container and on the host: the generated container carries gard itself and a read-only view of the rule directories the computer's config lists, and a commit started on the host runs its final git call in the container. A test commits in the same worktree from both sides with the same rules.

## Why
A gate that runs only on the host would let every commit made in the container through.

## Acceptance
The same blocking rule refuses the same commit in the container and on the host, and the same clean commit passes on both (with real Docker, skipped with the reason where it is missing)

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

