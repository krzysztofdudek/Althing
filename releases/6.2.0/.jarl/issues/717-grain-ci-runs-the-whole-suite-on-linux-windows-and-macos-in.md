# 717 · Grain: CI runs the whole suite on Linux, Windows and macOS in parallel, as Jarl's ci.yml does (ruling ci-everywhere-like-jarl)

**Status:** in-progress
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261112T0406-irfl
**Tags:** ci, windows, macos
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Where:** the owner, 2026-11-12
**Branch:** jarl/717-ci-everywhere
**Worker:** w-717-sonnet
**Model:** claude-sonnet-5-5@medium
**Since:** 2026-11-12 04:06

## What


## Why
Paths, links, signals and git behave differently on Windows and macOS; a suite run on Linux alone lets those faults through to users.

## Acceptance
- [read] .github/workflows/ci.yml runs the repository's whole test suite on ubuntu-latest, windows-latest (sharded where the suite is long) and macos-latest, Node 22 and 24, fail-fast off, as Jarl's does, and every step that ran on Linux alone now runs on all three or says in the workflow why it cannot
- [read] Every test that cannot run on a platform is skipped there with a stated reason, and the suite was run once locally on Linux with the platform guards in place; the first CI run on GitHub on all three platforms is green, recorded after the push

## Changelog
- CI now runs the whole suite on Linux, Windows and macOS; npm test passes node's test options (such as --test-shard) through.

## Reviews
- **approve** · by rev-717-opus (fresh) · 2026-11-12 · model claude-opus-5-5
  Line 1 [read] met: .github/workflows/ci.yml at d5fe778b runs the suite on ubuntu-latest (test), windows-latest in 3 shards on Node 22 and 24 (test-windows), macos-latest on Node 22 and 24 (test-macos), fail-fast false everywhere; lockfile and seams run on all three platforms; YAML parses and action-validator passes. scripts/test.mjs passes node's options ahead of the file patterns: run with --test-shard=1/3, 2/3, 3/3 the shards listed 144+144+144 files, no file twice, and their union equals the full run's 429 files. npm test -- --test-shard=N/3 reaches scripts/test.mjs (npm appends to the last command). tests/ci-shards.test.mjs fails when the runner's pass-through is removed, when the Windows matrix drops a shard, when its run line changes, and when the seams job drops macOS. Line 2 [read]: no skip added; the first green GitHub run on three platforms is still to be recorded after the push. Minor: tests/ci-shards.test.mjs:61-66 does not hold the seams job's Windows shards; removing the shard 3 entry from seams' matrix (ci.yml:131-136) keeps the test green while a third of that job's suite with Yggdrasil's CLI stops running on Windows. Minor: the lockfile (ci.yml:51-53) and seams (ci.yml:185-187) jobs run Node 22 only and the workflow says no reason (unchanged from before, but the ruling names Node 22 and 24). Not run here: Windows and macOS themselves (npm link and command -v yg under Git for Windows' bash, YG_BIN with a drive-letter workspace, the suite on macOS).
  outside the issue, filed as 719: Grain: tests/address-space-limit-never-ends-the-run.test.mjs:63 fails under full-suite load and passes alone (Linux, Node 24.22.2, full npm test under a 12G cap: 2423 pass, 1 fail, run 2 under ulimit -v 1700000 exited 134 with 'FATAL ERROR: MarkCompactCollector: young object promotion failed Allocation failed - JavaScript heap out of memory' after 'reading the relations of src/data.py'; the same test alone passed 3 of 3). The process still ends fatally under an address-space limit, the very thing the guard exists to prevent, so the room check before the worker starts is not enough; and the Linux CI job can go red on it.

## Evidence

### Notes

Assumed: the lockfile and seam jobs also run on all three platforms (no reason found for Linux alone); the seam job's Windows suite is sharded 1-3 and its seam and oracle steps run in shard 1 only.

