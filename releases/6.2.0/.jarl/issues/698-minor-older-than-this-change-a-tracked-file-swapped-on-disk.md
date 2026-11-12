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

## Reviews
- **approve** · by rev-695b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0256-igch
  All three round 1 findings are fixed. 697 sparse: a directory missing from disk now counts as reached (plugins/grain/engine/worktree-view.mjs:60); cone and no-cone checkouts keep their out-of-set files as git does. 697 core.symlinks=false: a tracked link becomes a file only when git ls-files --modified names it and core.symlinks is not false (:45-50); clean, edited, replaced by a real file, replaced by a manifest named tsconfig.json, by a real link and by a directory all match git add -A, which keeps mode 120000. 695: the new case goes red when the guard on the second partialCloneFilter read (plugins/grain/engine/history.mjs:128) is removed. 698: a modified path that is now a directory leaves the view (:43-44). Red before, green after: the four new 697 cases and the 698 case fail at 91622872 and pass at 1b2e784f. Full suite 2426, pass 2420, fail 0, skipped 6. A probe on 61 shapes found no mismatch with git add -A wherever git agrees to run. Every round 1 shape still matches. Also matching: a file swapped for a directory (unstaged, staged, staged then back to a file, an empty directory, a directory holding only an ignored file or only a link, nested), and sparse swaps inside the set (a directory swapped for a link or a file, a file swapped for a directory). Outside a sparse set, where a link or a file now stands at a path git left off the disk, plain git add -A refuses and git add -A --sparse removes the files beneath it. The view follows --sparse, so git has two answers there and this is not a defect. Minor: the header of plugins/grain/engine/worktree-view.mjs:5-8 still says a tracked link swapped for a file counts as that file, with no word on core.symlinks=false, and does not name a tracked file swapped for a directory (wording). Minor: 698 has no changelog fragment, and the shared line of 695 and 697 does not cover a file swapped for a directory.

## Changelog
- Fixed: when a tracked file is replaced on disk by a folder and the change is not yet staged, grain check no longer reads it as the file, as git would remove it at the next commit; and a sparse checkout's folders that are not on disk keep their files for check.

## Evidence

### Proof

- **ran (line d91d80045820):** cd plugins/grain && npm test (full suite under the gate script) · **saw:** fail 0; tests/worktree-view-file-swapped-for-directory.test.mjs red before the fix, green after
- **ran (line d91d80045820):** cd plugins/grain && npm test (full suite under the gate script, scratch clone at 1b2e784f); node --test tests/worktree-view-file-swapped-for-directory.test.mjs at 91622872 and at 1b2e784f; probe against git add -A · **saw:** tests 2426, pass 2420, fail 0, skipped 6; the new case fails at 91622872 and passes at 1b2e784f; probe: a file swapped for a directory unstaged, staged, staged then back to a file, for an empty directory, a directory holding only an ignored file or only a link, nested, in a sparse cone, and in a core.symlinks=false clone all match git add -A (91622872 and cb8ae6bd kept the file in each unstaged case)

