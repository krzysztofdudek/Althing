# 152 · Jarl: an approved lease that waits for its merge is shown idle after the liveness threshold

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-042-opus
**Where:** Review of 042 and 068 (rev-jarl-042-opus), Minor finding of 042

## What
status and resume mark a lease that holds an approve and waits for the merger as idle once the Liveness minutes pass with no commit, row or log line. The changelog promises the idle mark for work or proof waiting for review, not for an approved lease waiting for its merge, and the merger's wait is not the worker's.

## Why
An idle mark on work that only waits for the merger is noise on the coordinator's list and teaches the reader to ignore the mark.

## Acceptance
A lease with a live approve that waits for its merge is not marked idle for that wait (it shows under the merger's list instead), with a test on a loop copy; a lease without an approve is marked as before

## Evidence

