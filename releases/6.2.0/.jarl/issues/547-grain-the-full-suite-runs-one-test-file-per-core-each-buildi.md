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

## Reviews
- **approve** · by rev-547-fable (fresh) · 2026-11-11 · model claude-fable-5-2
  Line 1 "[read] npm test caps its parallel test files at a number that keeps one suite well under a typical machine's memory, and docs say how to raise it": met. scripts/test.mjs passes --test-concurrency=4 to node --test with the same four globs; the shell expansion and node's own glob give the same 395 files. Six 2-second files took 14 s at 1 and 4 s at 6, so the cap is honoured. Unset and empty give 4; 0, -3, 2.5, abc and true are refused with exit 2 and a message that names the value; " 3 ", 1e2 and 0x10 are accepted as 3, 100 and 16. A failing test gives exit 1, a pass exit 0, and the script works from another directory. It imports only node built-ins. CI calls npm test on Ubuntu and Windows with Node 22 and 24, where node expands the globs itself. README.md and CLAUDE.md name GRAIN_TEST_CONCURRENCY and the default 4, and neither tells an agent to call Grain. The default is honest for a 16 GB machine: 4 files at the measured 1.31 GB each is about 5 GB. Full suite at 4009d0d8 under MemoryMax=12G: 2377 tests, 2364 pass, 7 fail, 6 skipped, 454 s on 2 cores; all 7 failures are in tests/canonical-exemplar.test.mjs, the known ones. Only the four files of the commit moved. Not run: Windows. Minor: the script uses spawnSync and forwards no signal, so SIGTERM sent to it alone ends it with 143 while node --test and its test files keep running (6 processes left in the probe); a time limit that signals the whole process group, as coreutils timeout does, still stops everything. Minor: when node --test is killed by a signal the script exits 1, not the signal's code. Minor: arguments after npm test -- are dropped without a word, so npm test -- <file> runs the whole suite; before the change the file was added to the full list, so it never narrowed. It should narrow, or refuse the argument, as a separate issue. Minor: the 5 GB in README is computed from 4 x 1.3 GB; the measured peak on 2 cores was 2.73 GB. Minor: the script's comment says about 1 GB, the docs 1.3 GB.

## Evidence

### Proof

- **ran (line f9aef44164b9):** SIGTERM to scripts/test.mjs during a run of a 30 s test, then pgrep for the run's processes · **saw:** left: 0 (fix 9e757e2c after rev-547-fable's minor 1)

### Notes

Assumed: default cap 4. Measured on this host (Throttle pins a run to about 2 cores): heaviest single file 1.31 GB (cross-check-propose-parity), scope-cochange-cap-split 1.05 GB; whole suite peak 2.81 GB at concurrency 2 (470 s), 2.73 GB at 4 (294 s), 3.08 GB at 6 (185 s), 3.68 GB at 12 (194 s). On a machine with free cores the peaks approach concurrency x 1.3 GB, so 4 is about 5 GB and the old default on 13 cores about 16 GB. Cost of the cap: on this 2-core-pinned host 4 vs 6 is 294 s vs 185 s; with more free cores the suite runs longer by up to roughly a third. Raise with GRAIN_TEST_CONCURRENCY (runner script, not a shell expansion, because CI also runs on Windows).

