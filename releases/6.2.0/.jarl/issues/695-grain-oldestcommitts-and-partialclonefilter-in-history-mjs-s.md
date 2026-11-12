# 695 · Grain: oldestCommitTs and partialCloneFilter in history.mjs swallow a refused git start the way headTs did, and selftest --extract walks the disk in a repository with no commit

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261112T0149-ehud
**Tags:** grain, git
**Files:** 
**Repo:** Grain
**After:** 662
**Found by:** jarl
**Where:** w-662-sonnet, Grain small package report (plugins/grain/engine/history.mjs, engine/grain.mjs)
**Branch:** jarl/695-grain-git-edges
**Merged:** 112e63b5 in Grain
**Merge check:** cd plugins/grain && npm test · saw tests 2426,pass 2420,fail 0,skipped 6

## What


## Why
A refused git start read as no history gives wrong numbers with no word, and selftest --extract disagreeing with the index on a fresh repository makes the self test untrue.

## Acceptance
[test] oldestCommitTs and partialCloneFilter stop with the open-files message when git cannot start, and selftest --extract in a repository with no commit reads the files the index reads, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Grain now reads a repository with no commit the same way in selftest --extract as in the index, and the files check lists for an edit follow what git would commit when a directory is swapped for a link or a link for a file.

## Reviews
- **changes** · by rev-695-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0235-ahtg
  Important (697, a regression): plugins/grain/engine/worktree-view.mjs:58, a parent directory missing from the disk counts as not reached, so in a sparse checkout (cone or no-cone) or under a skip-worktree entry whose directory is absent the view drops tracked files that git add -A and git commit -a keep in the next commit (git ls-files --deleted skips them, cb8ae6bd listed them); grain check then resolves an import into a path outside the cone as a file that does not exist. Reproduced: git sparse-checkout set --cone src drops lib/m/n.ts from the view, set --no-cone '/*' '!/src/a/deep/' drops src/a/deep/y.ts. A missing directory is already git's --deleted to judge: treating ENOENT there as reached keeps all six new tests green (checked). Important (697, a regression): plugins/grain/engine/worktree-view.mjs:44-47 adds every tracked link whose path is a regular file, but with core.symlinks=false (Git for Windows' default, or any clone made with it) every tracked link is a regular file on disk while git still records it as a link (status clean, git add -A keeps mode 120000); the view now lists each link as a file whose text is its target path (a link named package.json or tsconfig.json reads as that manifest), where cb8ae6bd matched git. Reproduced with git clone -c core.symlinks=false: the view gains l and src/a/lk, git records neither as a file. Adding a link only when git ls-files --modified also names it would follow git's own verdict. Minor (695): tests/shallow-window-and-extract-git-edges.test.mjs:89 never reaches the guard on the second read of partialCloneFilter (plugins/grain/engine/history.mjs:128): the refused start stops at the first read, so removing that guard keeps every test green; a stub that refuses only the partialclonefilter config read would cover it. Tried and held: refused start on oldestCommitTs and both partialCloneFilter repos stops with the open-files message, an ordinary failure (a folder with no repository) still answers 0 and null; the view matches git add -A for a directory swapped for a link inside the project, outside it (same file names behind it), to an ignored directory, nested, to a link to a directory, to a dangling link, staged, staged then back to a directory, a directory swapped for a file, a file swapped for a link to a directory, a link swapped for a file staged and unstaged, for a directory, for another link, a link to a directory swapped for a file, a link swapped for a file whose path is now ignored, and a link under a directory swapped for a link. Each new test red on cb8ae6bd and green at 91622872; full suite 2420, pass 2414, fail 0, skipped 6. No text tells an agent to call Grain.
  outside the issue, filed as 698: Minor, older than this change: a tracked file swapped on disk for a directory, not staged (f.ts removed, f.ts/g.ts written), stays in the worktree view as the file f.ts on cb8ae6bd and at 91622872 alike (plugins/grain/engine/worktree-view.mjs:39, git ls-files --deleted does not name it), while git add -A and git commit -a remove it; the view then lists a path whose read fails.
- **approve** · by rev-695b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0256-igch
  All three round 1 findings are fixed. 697 sparse: a directory missing from disk now counts as reached (plugins/grain/engine/worktree-view.mjs:60); cone and no-cone checkouts keep their out-of-set files as git does. 697 core.symlinks=false: a tracked link becomes a file only when git ls-files --modified names it and core.symlinks is not false (:45-50); clean, edited, replaced by a real file, replaced by a manifest named tsconfig.json, by a real link and by a directory all match git add -A, which keeps mode 120000. 695: the new case goes red when the guard on the second partialCloneFilter read (plugins/grain/engine/history.mjs:128) is removed. 698: a modified path that is now a directory leaves the view (:43-44). Red before, green after: the four new 697 cases and the 698 case fail at 91622872 and pass at 1b2e784f. Full suite 2426, pass 2420, fail 0, skipped 6. A probe on 61 shapes found no mismatch with git add -A wherever git agrees to run. Every round 1 shape still matches. Also matching: a file swapped for a directory (unstaged, staged, staged then back to a file, an empty directory, a directory holding only an ignored file or only a link, nested), and sparse swaps inside the set (a directory swapped for a link or a file, a file swapped for a directory). Outside a sparse set, where a link or a file now stands at a path git left off the disk, plain git add -A refuses and git add -A --sparse removes the files beneath it. The view follows --sparse, so git has two answers there and this is not a defect. Minor: the header of plugins/grain/engine/worktree-view.mjs:5-8 still says a tracked link swapped for a file counts as that file, with no word on core.symlinks=false, and does not name a tracked file swapped for a directory (wording). Minor: 698 has no changelog fragment, and the shared line of 695 and 697 does not cover a file swapped for a directory.

## Evidence

### Proof

- **ran (line f313b182a5f6):** cd plugins/grain && npm test (full suite under the gate script) · **saw:** tests 2420, pass 2414, fail 0, skipped 6; tests/shallow-window-and-extract-git-edges.test.mjs red on the three new cases before the fix (no exception on a refused start, 8 scopes against 3), green after
- **ran (line f313b182a5f6):** cd plugins/grain && npm test (full suite under the gate script, scratch clone at 91622872); node --test tests/shallow-window-and-extract-git-edges.test.mjs on cb8ae6bd with the new test copied in · **saw:** tests 2420, pass 2414, fail 0, skipped 6; on cb8ae6bd the new file fails 3 of 5 (oldestCommitTs and partialCloneFilter refused-start cases, extract no-commit case), 5 of 5 pass at 91622872; mutation: removing the guard on the second partialCloneFilter read keeps all 5 green
- **ran (line f313b182a5f6):** cd plugins/grain && npm test (full suite under the gate script), round 2 · **saw:** ℹ tests 2426, fail 0; the new test for the filter read goes red when its guard is removed
- **ran (line f313b182a5f6):** cd plugins/grain && npm test (full suite under the gate script, scratch clone at 1b2e784f); node --test tests/shallow-window-and-extract-git-edges.test.mjs at 1b2e784f with the guard on the second partialCloneFilter read removed · **saw:** tests 2426, pass 2420, fail 0, skipped 6; the new case 'partialCloneFilter stops when only its read of the filter cannot start' goes red with the second guard removed and green with it, the other 5 stay green

