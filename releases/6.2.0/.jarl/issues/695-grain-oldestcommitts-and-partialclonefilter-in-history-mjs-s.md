# 695 · Grain: oldestCommitTs and partialCloneFilter in history.mjs swallow a refused git start the way headTs did, and selftest --extract walks the disk in a repository with no commit

**Status:** in-progress
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
**Worker:** w-695-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 02:15

## What


## Why
A refused git start read as no history gives wrong numbers with no word, and selftest --extract disagreeing with the index on a fresh repository makes the self test untrue.

## Acceptance
[test] oldestCommitTs and partialCloneFilter stop with the open-files message when git cannot start, and selftest --extract in a repository with no commit reads the files the index reads, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Grain now reads a repository with no commit the same way in selftest --extract as in the index, and the files check lists for an edit follow what git would commit when a directory is swapped for a link or a link for a file.

## Evidence

### Proof

- **ran (line f313b182a5f6):** cd plugins/grain && npm test (full suite under the gate script) · **saw:** tests 2420, pass 2414, fail 0, skipped 6; tests/shallow-window-and-extract-git-edges.test.mjs red on the three new cases before the fix (no exception on a refused start, 8 scopes against 3), green after

