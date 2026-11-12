# 697 · Grain worktree view at the edges of links (plugins/grain/engine/worktree-view.mjs:28-42), both olde…

**Status:** done
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
**Merged:** 112e63b5 in Grain
**Merge check:** cd plugins/grain && npm test · saw tests 2426,pass 2420,fail 0,skipped 6

## What
Grain worktree view at the edges of links (plugins/grain/engine/worktree-view.mjs:28-42), both older than 680: (1) a tracked directory replaced on disk by a link to an ignored generated directory, not staged: git ls-files --deleted does not name the files beneath it (git status says D), lstat follows the directory link, so the view keeps src/a/x.ts and reads the ignored gen/a/x.ts through it, while git add -A would delete those paths and add src/a as a link; reproduced on d9df4a36 and 09ba82bd. (2) a tracked link replaced on disk by a regular file, not staged: the index mode 120000 drops it from the view, though git commit -a would commit it as a file.

## Why


## Acceptance


[test] grain check's worktree view leaves out the files under a tracked directory replaced by an unstaged link (to an ignored generated directory or anywhere), and keeps a tracked link replaced by a regular file as that file, as git add -A and git commit -a would record them, red before and green after · by: cd plugins/grain && npm test

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

- **ran (line 570f47bf7a2e):** cd plugins/grain && npm test (full suite under the gate script) · **saw:** tests 2420, pass 2414, fail 0, skipped 6; tests/worktree-view-links-at-the-edges.test.mjs red on three cases before the fix, six of six green after
- **ran (line 570f47bf7a2e):** cd plugins/grain && npm test (full suite under the gate script, scratch clone at 91622872); node --test tests/worktree-view-links-at-the-edges.test.mjs on cb8ae6bd with the new test copied in; a probe comparing worktreePaths with git add -A on 25 shapes · **saw:** tests 2420, pass 2414, fail 0, skipped 6; on cb8ae6bd the new file fails 3 of 6, 6 of 6 pass at 91622872; probe: every link shape the issue names matches git add -A, but a sparse checkout drops out-of-cone files git keeps, and a core.symlinks=false clone lists every tracked link as a file git keeps as a link (both matched on cb8ae6bd)
- **ran (line 570f47bf7a2e):** cd plugins/grain && npm test (full suite under the gate script), round 2 · **saw:** fail 0; sparse checkout (cone and patterns), core.symlinks=false and swapped-directory cases red before the fix, green after
- **ran (line 570f47bf7a2e):** cd plugins/grain && npm test (full suite under the gate script, scratch clone at 1b2e784f); node --test tests/worktree-view-links-at-the-edges.test.mjs at 91622872 and at 1b2e784f; a probe comparing worktreePaths with git add -A on 61 shapes (round 1's, sparse cone and no-cone with swaps inside and outside the set, core.symlinks=false clones) · **saw:** tests 2426, pass 2420, fail 0, skipped 6; at 91622872 the four new cases fail (sparse cone, sparse patterns, sparse swap, core.symlinks=false), at 1b2e784f all ten pass; probe: every round 1 shape and every core.symlinks=false shape (link-file edited, replaced by a real file, by a manifest, by a real link, by a directory) matches git add -A; in a sparse checkout the view matches git add -A wherever git agrees to run, and git add -A --sparse where plain git add -A refuses a path outside the set

