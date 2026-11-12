# 697 · Grain worktree view at the edges of links (plugins/grain/engine/worktree-view.mjs:28-42), both olde…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0158-jjhf
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-662-opus
**Where:** the review of 662, 678, 680, 691
**Branch:** jarl/695-grain-git-edges
**Worker:** w-695-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 02:15

## What
Grain worktree view at the edges of links (plugins/grain/engine/worktree-view.mjs:28-42), both older than 680: (1) a tracked directory replaced on disk by a link to an ignored generated directory, not staged: git ls-files --deleted does not name the files beneath it (git status says D), lstat follows the directory link, so the view keeps src/a/x.ts and reads the ignored gen/a/x.ts through it, while git add -A would delete those paths and add src/a as a link; reproduced on d9df4a36 and 09ba82bd. (2) a tracked link replaced on disk by a regular file, not staged: the index mode 120000 drops it from the view, though git commit -a would commit it as a file.

## Why


## Acceptance


[test] grain check's worktree view leaves out the files under a tracked directory replaced by an unstaged link (to an ignored generated directory or anywhere), and keeps a tracked link replaced by a regular file as that file, as git add -A and git commit -a would record them, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Grain now reads a repository with no commit the same way in selftest --extract as in the index, and the files check lists for an edit follow what git would commit when a directory is swapped for a link or a link for a file.

## Evidence

### Proof

- **ran (line 570f47bf7a2e):** cd plugins/grain && npm test (full suite under the gate script) · **saw:** tests 2420, pass 2414, fail 0, skipped 6; tests/worktree-view-links-at-the-edges.test.mjs red on three cases before the fix, six of six green after

