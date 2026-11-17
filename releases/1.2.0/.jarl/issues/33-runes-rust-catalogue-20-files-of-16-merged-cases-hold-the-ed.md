# 33 · Runes, Rust catalogue: 20 files of 16 merged cases hold the edge probe their case expects in a file…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1636-zhbz
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-7-opus
**Where:** the review of 7, 8, 9, 21

## What
Runes, Rust catalogue: 20 files of 16 merged cases hold the edge probe their case expects in a file no mod declares (KEPT_OUT_OF_THE_BUILD's 'a fixture to complete'), and 5 more files hold expected edge lines beside a path that names nothing, so rustc never checks those edges; declare each probe where its case means it, and move a line rustc refuses into a file of its own

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: catalogue cases merged before 1.2.0 whose expected edge rustc never checks, a gap of the test, not of the readers (ruling runes-1-2-0-cut-for-new-findings); 21's check now lists them

