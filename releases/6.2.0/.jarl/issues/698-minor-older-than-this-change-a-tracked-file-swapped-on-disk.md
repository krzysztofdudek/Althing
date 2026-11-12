# 698 · Minor, older than this change: a tracked file swapped on disk for a directory, not staged (f.ts rem…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0235-figx
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-695-opus
**Where:** the review of 695, 697

## What
Minor, older than this change: a tracked file swapped on disk for a directory, not staged (f.ts removed, f.ts/g.ts written), stays in the worktree view as the file f.ts on cb8ae6bd and at 91622872 alike (plugins/grain/engine/worktree-view.mjs:39, git ls-files --deleted does not name it), while git add -A and git commit -a remove it; the view then lists a path whose read fails.

## Why


## Acceptance


## Evidence

