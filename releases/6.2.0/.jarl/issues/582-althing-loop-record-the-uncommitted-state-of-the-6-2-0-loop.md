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


## Evidence

