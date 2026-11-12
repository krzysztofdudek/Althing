# 689 · Yggdrasil: the parser-memory reports' loose ends after 561: a side-by-side report never advises lowering parallel, the per-worker floor no longer binds and its test would pass without it, and drill's next step and the grouped side-by-side heading still speak of the component's mapping and companion resolution

**Status:** in-progress
**Kind:** cleanup
**Priority:** 3
**Tier:** light
**Key:** 20261112T0019-hfgw
**Tags:** yggdrasil, parser
**Files:** 
**Repo:** Yggdrasil
**After:** 561
**Found by:** jarl
**Where:** rev-561c-opus, 561 round 3 (ast/parse-guard.ts:143-150, cli/det-concurrency.ts:121-126, tests/unit/cli/det-concurrency.test.ts:42, core/drill-runner.ts:578)
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
At parallel 10 the last pair of each rule always run together and fail again on every rerun, while the advice names only fewer trees; a test that cannot fail guards nothing; a next step about a mapping does not fit a drill case file.

## Acceptance
[test] A side-by-side parser-memory report advises lowering parallel when other runs held trees; the floor test fails with the floor removed or the floor is gone; drill's next step for such a case names the case file; the grouped heading names the parser, not companion resolution, each red before and green after · by: cd source/cli && npm test

## Changelog
- The reports for a syntax tree the parser had no memory for name the right way out in more places. When other rule runs held trees side by side, the report also advises lowering `parallel` in `yg-config.yaml`. `yg drill` tells you to make the case file smaller or remove the case, where it spoke of a component's mapping. A companion that got no tree on several units is reported under words about the parser, not as a companion that failed to run.

## Evidence

### Proof

- **ran (line 58a4d1cf3676):** cd source/cli && npx vitest run tests/unit/ast/parse-guard.test.ts tests/unit/cli/det-concurrency.test.ts tests/unit/core/drill-runner.test.ts tests/unit/core/fill-infra-grouping.test.ts (3 of the new assertions red on the base: no parallel advice with both own and others' trees, drill next about mapping, companion group headed 'Companion resolution ... aspect-companion-runtime-error') · **saw:** green after: 73 tests passed; the floor is gone (no test can fail on it)

### Notes

Assumed: the per-worker floor (128 MiB) is dead, not under-tested: the worst-case bound (2 GiB per worker plus the parent) is below the budget-over-floor quotient for every input, and the floor changed no result, so it is removed rather than given a test that cannot be made to fail; a zero reading is still guarded (per-worker estimate of at least one byte), which the existing 'never returns less than one worker' case pins (it gives NaN without it). The 'applies a floor' test is renamed for the bound that decides.

