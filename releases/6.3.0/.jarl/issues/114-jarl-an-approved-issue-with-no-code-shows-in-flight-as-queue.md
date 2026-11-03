# 114 · Jarl: an approved issue with no code shows in flight as 'queued for the merge' while the merge queue lists nothing

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 039
**Found by:** rev-jarl-039b-opus
**Where:** Review of 039 (2026-11-03): lib/evidence.mjs IN_FLIGHT_MARKS.approved

## What
An issue that carries no code and is approved shows in the in-flight view as queued for the merge, but queue lists nothing for it.

## Why
The two views must agree on what waits for a merger.

## Acceptance
In flight and queue agree for an approved issue with no code, with a test

## Evidence

