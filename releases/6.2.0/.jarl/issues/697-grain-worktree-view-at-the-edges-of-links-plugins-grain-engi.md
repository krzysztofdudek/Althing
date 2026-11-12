# 697 · Grain worktree view at the edges of links (plugins/grain/engine/worktree-view.mjs:28-42), both olde…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0158-jjhf
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-662-opus
**Where:** the review of 662, 678, 680, 691

## What
Grain worktree view at the edges of links (plugins/grain/engine/worktree-view.mjs:28-42), both older than 680: (1) a tracked directory replaced on disk by a link to an ignored generated directory, not staged: git ls-files --deleted does not name the files beneath it (git status says D), lstat follows the directory link, so the view keeps src/a/x.ts and reads the ignored gen/a/x.ts through it, while git add -A would delete those paths and add src/a as a link; reproduced on d9df4a36 and 09ba82bd. (2) a tracked link replaced on disk by a regular file, not staged: the index mode 120000 drops it from the view, though git commit -a would commit it as a file.

## Why


## Acceptance


## Evidence

