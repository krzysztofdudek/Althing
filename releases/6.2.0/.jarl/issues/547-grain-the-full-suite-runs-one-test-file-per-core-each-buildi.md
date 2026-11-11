# 547 · Grain: the full suite runs one test file per core, each building an index of about 1 GB, so it can exhaust a machine's memory

**Status:** open
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

## What
npm test runs node --test with its default concurrency, one file per core less one. Each file that builds an index takes about 1 GB, so on a 13-core machine one suite can reach 12 GB, and two suites at once killed four agents on 2026-11-11.

## Why
A test suite that can take a whole machine down fails a contributor before it tests anything.

## Acceptance
[read] npm test caps its parallel test files at a number that keeps one suite well under a typical machine's memory, and docs say how to raise it

## Evidence

