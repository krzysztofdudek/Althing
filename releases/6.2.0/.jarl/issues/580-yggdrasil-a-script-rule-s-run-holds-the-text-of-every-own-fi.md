# 580 · Yggdrasil: a script rule's run holds the text of every own file of its component at once, even when…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1335-tamu
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-340b-fable
**Where:** the review of 340

## What
Yggdrasil: a script rule's run holds the text of every own file of its component at once, even when the rule reads only paths. Eight text files of 40 MiB in one component end yg check --approve --only-deterministic with heap out of memory under --max-old-space-size=256, on release/6.2.0 and on the branch of issue 340 alike; the crash is in allocating the next file's buffer. The same eight files at 65 MiB each pass on that branch, because files over 64 MiB are no longer read. So under the 64 MiB limit a component's rule run still costs the sum of its files.

## Why


## Acceptance


## Evidence

