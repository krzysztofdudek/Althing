# 719 · Grain: tests/address-space-limit-never-ends-the-run.test.mjs:63 fails under full-suite load and pas…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0501-lxav
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-717-opus
**Where:** the review of 717

## What
Grain: tests/address-space-limit-never-ends-the-run.test.mjs:63 fails under full-suite load and passes alone (Linux, Node 24.22.2, full npm test under a 12G cap: 2423 pass, 1 fail, run 2 under ulimit -v 1700000 exited 134 with 'FATAL ERROR: MarkCompactCollector: young object promotion failed Allocation failed - JavaScript heap out of memory' after 'reading the relations of src/data.py'; the same test alone passed 3 of 3). The process still ends fatally under an address-space limit, the very thing the guard exists to prevent, so the room check before the worker starts is not enough; and the Linux CI job can go red on it.

## Why


## Acceptance


## Evidence

