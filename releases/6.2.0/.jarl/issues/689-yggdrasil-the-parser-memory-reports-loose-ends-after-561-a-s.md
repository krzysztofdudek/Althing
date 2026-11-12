# 689 · Yggdrasil: the parser-memory reports' loose ends after 561: a side-by-side report never advises lowering parallel, the per-worker floor no longer binds and its test would pass without it, and drill's next step and the grouped side-by-side heading still speak of the component's mapping and companion resolution

**Status:** open
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

## What


## Why
At parallel 10 the last pair of each rule always run together and fail again on every rerun, while the advice names only fewer trees; a test that cannot fail guards nothing; a next step about a mapping does not fit a drill case file.

## Acceptance
[test] A side-by-side parser-memory report advises lowering parallel when other runs held trees; the floor test fails with the floor removed or the floor is gone; drill's next step for such a case names the case file; the grouped heading names the parser, not companion resolution, each red before and green after · by: cd source/cli && npm test

## Evidence

