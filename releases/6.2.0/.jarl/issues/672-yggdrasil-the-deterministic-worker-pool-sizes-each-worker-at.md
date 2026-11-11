# 672 · Yggdrasil: the deterministic worker pool sizes each worker at 20 bytes of tree per byte of source (…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2240-rxfm
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561b-opus
**Where:** the review of 561, 610
**Branch:** jarl/561-parser-abort
**Worker:** w-561-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 22:42

## What
Yggdrasil: the deterministic worker pool sizes each worker at 20 bytes of tree per byte of source (cli/det-concurrency.ts:74), but a 64 KiB file can fill a worker's whole 2 GiB of parser memory, so a fill on N workers can peak near N times 2 GiB. Seen with 33 per-file script pairs, 24 of them on such files: 4 workers, peak resident 8.4 GiB, the same on release/6.2.0 at 03ac2699d. On a machine with many cores and less memory than that, the fill swaps or is killed. Minor.

## Why


## Acceptance


[test] The deterministic worker pool sizes a worker by a bound that keeps the pool's total under the machine's memory on dense small files (a 64 KiB file that fills a parser), measured peak stated in the test, red before and green after · by: cd source/cli && npm test

## Changelog
- Fixed: the worker threads that run script rules stay under the machine's memory on dense files (the pool is also sized for every worker's 2 GiB parser being full at once).

## Evidence

### Proof

- **ran (line 722709eccfbd):** cd source/cli && npx vitest run (this round's test files, filtered to the new tests, on a scratch copy of the branch at ea4c572eb, built) · **saw:** RED before: resolveDetConcurrency gives 16 workers on a 4 GiB machine with 64 KiB files (worst case 36142317568 bytes against 4294967296), and 5 where one worker fits.
- **ran (line 722709eccfbd):** cd source/cli && npx vitest run tests/unit/cli/det-concurrency.test.ts (branch at e8798d4f6 and after) · **saw:** GREEN after: all passed. On machines of 4, 8, 16, 32 and 64 GiB the parent plus every worker at its own size plus a full 2 GiB parser stays within the machine's memory: 3 workers on 8 GiB, 1 on 2 GiB. The measured peaks are stated in the test: one worker goes from about 60 MiB to 2.1 GiB resident on a 64 KiB file; 8.4 GiB on 4 workers before.

### Notes

Assumed: the bound is the whole machine, not the half the usual estimate is held to: workers times (the parent's size plus 2 GiB) plus the parent stays within total memory. It is a ceiling beside the existing estimate, so large repositories are sized as before and small machines get fewer workers (3 on 8 GiB, 7 on 16 GiB).

