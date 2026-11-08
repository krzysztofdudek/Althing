# 444 · Mimir: tools to plan taking an older knowledge repository apart

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, migration
**Files:** Mimir/src/migrate, Mimir/src/commands/migrate.mjs, Mimir/src/commands/temp-list.mjs, Mimir/test/migrate-plan.test.mjs, Mimir/test/fixtures/old-repo-synthetic
**Repo:** ../../../Mimir
**After:** 426
**Found by:** owner
**Where:** the owner, 2026-10-24: an older repository that mixes a diary, company knowledge, private notes and large files in its history must be taken apart step by step and checkably

## What
Read-only tools: a list of every .temp folder under attached directories with sizes, for decision; a list of objects of a repository's history above a size threshold with path and size; migrate plan on a synthetic tree, which turns the steps (diary to the Desk, company knowledge to an area, private notes to a personal area, ingests to an overlay, large files to places) into topics, with a check before and after each step (checksums and links that still resolve). Nothing writes outside --dry-run.

## Why
A real migration of a user's old repository is the user's own work; Mimir gives the tools that make it safe.

## Acceptance
- On the synthetic tree the plan is deterministic, and the check after a step finds a lost file and a broken link
- The large-object list on a synthetic repository finds the planted files with path and size, and the working tree and refs are unchanged

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

