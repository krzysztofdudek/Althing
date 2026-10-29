# 415 · Gard: gard cleanup --apply removes what the report listed, on one approval

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, cleanup, port
**Files:** Gard/src/cleanup/apply.mjs, Gard/test/cleanup-apply.test.mjs
**Repo:** ../../../Gard
**After:** 414
**Found by:** owner
**Where:** Mimir at 10257cd: src/cleanup/apply.mjs

## What
--apply removes exactly the entries of a report the user saw (by its listing, not a fresh guess), never stops a running container and never removes one by force (docker rm without -f refuses a running container, which is the second guard), and removes a view's worktrees only through gard worktree remove with its own refusals.

## Why
Deletion is one of the few things the owner wants protected, even in internal tooling.

## Acceptance
A test applies a report and sees only its entries go; a container that started between report and apply is left alone

## Evidence

