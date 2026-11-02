# 427 · Mimir: the first build branch becomes release/1.0.0 and the first loop is archived

**Status:** deferred
**Kind:** process
**Priority:** 2
**Tier:** standard
**Tags:** mimir, workplace
**Files:** Mimir/package.json
**Repo:** ../../../Mimir
**After:** 426, 361
**Found by:** jarl
**Where:** Mimir's first build branch, faza-0 at 10257cd, carries 133 issues of its first loop; that loop lives untracked in the Mimir checkout

## What
release/1.0.0 is cut from the tip of the first build branch, and its check passes in Mimir's dev container on that commit; the first loop's directory is moved out of the checkout into an archive the owner keeps privately, and the checkout's untracked files are only what Mimir itself needs. From here on every Mimir issue lives in Althing, and M-numbers in commit messages are resolved through the table in plan-mimir.md.

## Why
Issues of every family repository live only in Althing (issues-live-in-althing); a second, private loop beside the public one would split the record.

## Acceptance
- release/1.0.0 exists at the tip of the first build branch and the check's summary line is recorded
- git status --ignored in the Mimir checkout shows no loop directory

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

