# 637 · Grain: two branches that each add an unrelated file at one path are read as one file, so a rename on one side hands its history to the other; and the merges' changes are read in one buffered call that can pass the string limit on very large histories

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1905-gype
**Tags:** grain, history
**Files:** 
**Repo:** Grain
**After:** 182
**Found by:** jarl
**Where:** rev-182d-opus, 182 and 217 after the takeover (lineage.mjs:22-24, :154-160; lineage.mjs:211-227 with history.mjs:392)
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What


## Why
On symfony 13 paths at merges get a file born over another branch's file; and the merge read is 87 MB on symfony (+405 MB peak), 117 MB on kubernetes, about a fifth of the string limit, past which the whole history read throws.

## Acceptance
[test] Two branches adding unrelated files at one path keep two identities through a rename on one side (the reviewer's u.js/h.js probe gives h.js~q.js 9 and u.js~p.js 9), and the merges' changes are read streamed with peak memory bounded, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: two unrelated files added at the same path on two branches are now two files in the co-change counts, so a rename on one branch no longer hands its history to the other file; the same content added on both branches is still one file. The merges' changes are read as a stream, so very large histories no longer hold them all in memory. The history is walked again once after you upgrade.

## Evidence

### Proof

- **ran (line 406da3e966fa):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/lineage-unrelated-adds-on-two-branches.test.mjs tests/merge-changes-are-read-streamed.test.mjs tests/history-rename-limit.test.mjs tests/history-rename-and-skewed-side-branch.test.mjs tests/history-path-quoting.test.mjs tests/cochange*.test.mjs tests/engine-module-size-budget.test.mjs (before the fixes the two-branch probe gave u.js no q.js partner but lost h.js's q.js pair and the merge reader was not a stream) · **saw:** all green after the fixes: u.js keeps p.js (10 with the add), h.js keeps q.js (9), in both merge directions; mergeOps reads one line at a time; history.mjs 49248 characters

### Notes

Assumed: an add that brings the same content on two lines still joins into one file (the cherry-pick case the reviewer named); every file identity now carries the first 8 hex characters of its birth content hash, so HIST_V needs a bump (Needs line in the identity commit). tests/history-path-quoting.test.mjs reads raw pair keys and now strips the hash tag before comparing paths; its intent (real paths, not git-quoted octal) is unchanged.

