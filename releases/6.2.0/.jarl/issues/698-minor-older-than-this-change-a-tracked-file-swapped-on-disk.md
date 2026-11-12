# 698 · Minor, older than this change: a tracked file swapped on disk for a directory, not staged (f.ts rem…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0235-figx
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-695-opus
**Where:** the review of 695, 697
**Branch:** jarl/695-grain-git-edges
**Worker:** w-695-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 02:36

## What
Minor, older than this change: a tracked file swapped on disk for a directory, not staged (f.ts removed, f.ts/g.ts written), stays in the worktree view as the file f.ts on cb8ae6bd and at 91622872 alike (plugins/grain/engine/worktree-view.mjs:39, git ls-files --deleted does not name it), while git add -A and git commit -a remove it; the view then lists a path whose read fails.

## Why


## Acceptance


[test] A tracked file swapped for a directory and not staged leaves grain check's view as git add -A and git commit -a would remove it, red before and green after · by: cd plugins/grain && npm test

## Evidence

### Proof

- **ran (line d91d80045820):** cd plugins/grain && npm test (full suite under the gate script) · **saw:** fail 0; tests/worktree-view-file-swapped-for-directory.test.mjs red before the fix, green after

