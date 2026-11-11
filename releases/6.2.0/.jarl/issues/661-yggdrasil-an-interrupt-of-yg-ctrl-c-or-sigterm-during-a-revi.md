# 661 · Yggdrasil: an interrupt of yg (Ctrl-C or SIGTERM) during a review or a reviewer availability check …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2103-disx
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-620b-opus
**Where:** the review of 615, 620, 621, 625, 627
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:38

## What
Yggdrasil: an interrupt of yg (Ctrl-C or SIGTERM) during a review or a reviewer availability check leaves running for good any process of the reviewer's group that ignores SIGTERM once the group's leader has exited: cli-base.ts trackReviewerGroup drops the group when its leader exits, so the escalating SIGKILL of onInterrupt and endReviewerWork never reaches the rest. Tried: a stand-in claude that is a sh wrapper running a node child that ignores SIGTERM and SIGINT; SIGINT and SIGTERM to yg check --approve during the review and during the version question both end yg (130, 143) and leave the node child running. The review path is unchanged from release/6.2.0; the version question gained the same tracking in 625.

## Why


## Acceptance


[test] After SIGINT or SIGTERM to yg during a review and during the reviewer availability check, no process of the reviewer's group is left running, even one that ignores SIGTERM after the group's leader has exited, red before and green after · by: cd source/cli && npm test

## Changelog
- Interrupting yg no longer leaves a reviewer process running when the reviewer is a wrapper script that exits while the program it started ignores the request to stop: everything the reviewer started is given the request and, if it does not stop, killed.

## Evidence

### Proof

- **ran (line 694ad7095c86):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/io/aspect-adapt-merge.test.ts tests/e2e/cli-reviewer-fill-runtime.test.ts tests/unit/repo/e2e-prose-ratchet.test.ts · **saw:** 108 passed; SIGINT, SIGTERM and SIGHUP during a review and during the version question leave no stubborn group member running; 6 of 6 failed on the release build, pass on this branch

### Notes

Assumed: a member that outlives its leader and is still running when yg ends normally is now killed at exit with the rest of the group (endReviewerWork), as the group is no longer forgotten when its leader exits.

