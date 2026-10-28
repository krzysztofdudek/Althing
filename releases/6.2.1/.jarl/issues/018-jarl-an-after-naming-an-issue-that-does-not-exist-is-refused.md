# 018 · Jarl: an after naming an issue that does not exist is refused before any number is taken

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
Filing several issues in parallel, one new named an after issue that did not exist yet and was refused; the next filing took its number, and every later reference was off by one until fixed by hand.

## Why
A refused call must leave the record as it was, numbers included.

## Acceptance
- new checks every after reference before it takes a number, and a refusal takes none
- A test with a refused filing followed by a second filing

## Evidence

