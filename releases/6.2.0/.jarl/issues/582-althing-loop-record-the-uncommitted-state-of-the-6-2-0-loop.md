# 582 · Althing loop record: the uncommitted state of the 6.2.0 loop carries an absolute path under a home …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1341-utvp
**Tags:** 
**Files:** 
**Repo:** ../..
**Found by:** rev-286-fable
**Where:** the review of 286

## What
Althing loop record: the uncommitted state of the 6.2.0 loop carries an absolute path under a home directory (the shared Runes corpus cache) in three places, the ruling one-runes-corpus-cache (decisions.md:848), an evidence row of issue 500 (line 58) and log.md:5372; yg check refuses each with boundary/no-private-paths, so the live checkout is red and the next commit of the loop's state is refused until the path is written in plain words or as a placeholder

## Why


## Acceptance


[check] The loop's state commits with the pre-commit rails green: no absolute home path left in releases/6.2.0/.jarl · by: git commit

## Evidence

### Proof

- **ran (line ebef8397efa6):** git commit of the loop state (pre-commit rails), then grep -rn for the home path in releases/6.2.0/.jarl · **saw:** commit 7ee2d99 accepted, rails staged: clean; grep finds 0

