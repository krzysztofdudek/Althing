# 224 · Jarl: small gaps of the next and merge-queue views found by the examination of P1

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261108T1858-rtco
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-206-opus-p1
**Where:** lib/queue.mjs, lib/ball.mjs, lib/evidence.mjs nextRows

## What
Reproduced on scratch loops: after merged 1,2 then round 1 and a new approve of 1, the record-only queue row lists 1 and 2 with the spent-merge reason while next --as jarl says of 2 merged, close it; an approved issue whose branch is in the base with no merge ever recorded gets approved, not merged; merge it and no queue row; an open question on a parent whose children are all dropped shows it held in next --all while next --as jarl --all offers check its own acceptance; a parent with an After and an open question shows only under waiting-after and the question holds up nothing.

## Why


## Acceptance
[test] each of the four scenarios shows one consistent state across next, next --as and the queue

## Evidence

Dropped: absorbed by piece 2 (issue 226), landed

