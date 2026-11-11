# 547 · Grain: the full suite runs one test file per core, each building an index of about 1 GB, so it can exhaust a machine's memory

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261111T0947-vwoe
**Tags:** grain, tests
**Files:** Grain/plugins/grain/package.json
**Repo:** Grain
**Found by:** jarl
**Where:** plugins/grain/package.json:18
**After:** 554
**Branch:** jarl/547-suite-concurrency
**Worker:** w-547-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 14:21

## What
npm test runs node --test with its default concurrency, one file per core less one. Each file that builds an index takes about 1 GB, so on a 13-core machine one suite can reach 12 GB, and two suites at once killed four agents on 2026-11-11.

## Why
A test suite that can take a whole machine down fails a contributor before it tests anything.

## Acceptance
[read] npm test caps its parallel test files at a number that keeps one suite well under a typical machine's memory, and docs say how to raise it

## Changelog
- npm test now runs at most 4 test files at once so one suite stays near 5 GB of memory; set GRAIN_TEST_CONCURRENCY to run more or fewer.

## Evidence

### Notes

Assumed: default cap 4. Measured on this host (Throttle pins a run to about 2 cores): heaviest single file 1.31 GB (cross-check-propose-parity), scope-cochange-cap-split 1.05 GB; whole suite peak 2.81 GB at concurrency 2 (470 s), 2.73 GB at 4 (294 s), 3.08 GB at 6 (185 s), 3.68 GB at 12 (194 s). On a machine with free cores the peaks approach concurrency x 1.3 GB, so 4 is about 5 GB and the old default on 13 cores about 16 GB. Cost of the cap: on this 2-core-pinned host 4 vs 6 is 294 s vs 185 s; with more free cores the suite runs longer by up to roughly a third. Raise with GRAIN_TEST_CONCURRENCY (runner script, not a shell expansion, because CI also runs on Windows).

