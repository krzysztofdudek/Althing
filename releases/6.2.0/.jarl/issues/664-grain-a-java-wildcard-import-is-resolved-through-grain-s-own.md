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

## Evidence

