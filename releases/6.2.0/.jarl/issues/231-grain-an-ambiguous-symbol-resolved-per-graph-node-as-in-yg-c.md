# 231 · Grain: an ambiguous symbol resolved per graph node, as in yg check (the second half of 117)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1413-fbpi
**Tags:** grain, relations, partial
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Source:** decisions#grain-scope
**Where:**
**After:** 169
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
In 6.1.1 (117) Grain only reports the number of unresolved references; per-node resolution deferred.

## Why
grain measure shows 0 dependencies where yg check refuses.

## Acceptance
[test] An ambiguous symbol is resolved per graph node as yg check resolves it, and grain check gives the same edges as yg check on a fixture with a symbol declared in two nodes, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: when a repository has a graph, Grain now decides an ambiguous name the way yg check does, by the graph node that holds each declaration: a class split over two folders of one node is one dependency, and a name declared in two nodes that share a folder is ambiguous and draws no edge. grain measure, grain check, grain advise and the index follow. Can turn a repository red: dependencies that were missing appear, and a graph that does not declare them fails yg check. Needs a fresh index, which Grain builds by itself.

## Evidence


### Proof

- **ran (line c9958cac5bfc):** cd plugins/grain && YG_BIN=<gate build> node --import ./tests/git-env.mjs --test tests/ambiguous-symbol-resolved-per-node.test.mjs tests/unresolved-references-reported.test.mjs (before the fix 4 of 5 tests failed: the split declaration stayed unresolved with a graph, two nodes in one directory drew a false edge, check found no first edge) and the neighbours: tests/measure*.test.mjs tests/relation*.test.mjs tests/advise*.test.mjs tests/arch*.test.mjs tests/check-*.test.mjs tests/cross-check-*.test.mjs tests/propose.test.mjs tests/export*.test.mjs tests/relations/*.test.mjs · **saw:** new test file 5 of 5 pass with Yggdrasil supplied (yg check refuses exactly app→core on the split fixture and nothing on the two-node fixture); neighbours: 108 tests 107 pass 1 skipped, then 242 tests 241 pass 1 skipped, 0 fail

### Notes

Assumed: with a graph the owner is the node that maps the file (readNodeGraph ownerOf, the deepest node), a file no node maps keeps its directory under a marked key; the index, measure's snapshots, advise and cochange read the graph of the repository root they build from, and check reads it at check time, so an uncommitted graph edit moves check but not the index until HEAD moves. Without a graph the directory rule stands (117's report of the unresolved count stays).

