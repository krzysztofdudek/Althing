# 664 · Grain: a Java wildcard import is resolved through Grain's own module owner even when the repository…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2148-mmvq
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-557-opus
**Where:** the review of 231, 557, 563, 564, 567, 637, 640, 643, 644, 652
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:49

## What
Grain: a Java wildcard import is resolved through Grain's own module owner even when the repository has a graph (relations.mjs:398 passes modOwner to makeResolvePathToFile; Yggdrasil passes the node owner), on release/6.2.0 and on jarl/557-grain-rest alike: import com.x.* with A.java and B.java of one package mapped by two nodes draws app→left in grain measure and grain check where yg check refuses nothing; with A.java in no node, B.java in node core and the importer using B, grain binds the import to A.java and finds no node dependency where yg check refuses Late.java:3 → core.

## Why


## Acceptance


[test] With a graph, a Java wildcard import resolves by the graph node that maps each declaring file, so Grain agrees with yg check on two nodes in one directory and on an unmapped file beside a mapped one, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: with a graph, a Java wildcard import is resolved by the graph node that holds each file of the package, as yg check does: a package split over two nodes of one folder draws no dependency, and a file that no node maps is not part of the package. Can turn a repository red: a dependency that was missing appears, and a graph that does not declare it fails yg check.

## Evidence

### Proof

- **ran (line 7158f4b66c4b):** cd plugins/grain && YG_BIN=<gate build> node --import ./tests/git-env.mjs --test tests/java-wildcard-resolved-per-node.test.mjs (red on its test commit: 1 !== 0 for two nodes in one folder, 0 !== 1 for an unmapped file beside a mapped one), then the whole suite through full-gate.sh (tests 2353, pass 2346, fail 0, skipped 7) on 60343e6f · **saw:** all green, and yg check refuses nothing for the first fixture and Late.java into core for the second

