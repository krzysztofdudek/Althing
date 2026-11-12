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

## Reviews
- **changes** · by rev-560-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0326-ktyd
  Important (639, 655): core/fill-report-phase.ts:71 builds one detUnreadFiles list from the parser-memory and the over-limit pairs together, and core/fill-report.ts:335 and :342 print that same list on both summary lines, so each cause names the other cause's files. Reproduced: one fill with two dense 6.8 MiB JSON arrays walked by a rule on one node and a 70 MiB text file read on another prints '1 script rule pair left unverified because the parser ran out of memory ... (src/more/transcript.txt)', a file the parser never read; tests/unit/core/fill-report.test.ts:145 (the mixed case) asserts the same list on both lines, so the test pins the fault. Keep one list per cause. Important (663): no proof row and no test for the line. My own run on d2cc7b6af and fbf372dab does not reproduce it: plain yg check on 2,000,000 numbers (digits 4.0 MB, spaced 6.4 MB, nested 4.0 MB) imported from another node takes 6.2 to 6.7 s first and 0.16 to 0.18 s second on both trees, 9.1 s with a yg-suppress marker in the file, 9.4 s under a rule reading file.ast; the evidence row is recorded, and the line needs the director's call (a test with a stated bound, or the issue closed as not reproducing). Minor (639): the fill's done line still counts these pairs as failed ('0 passed · 0 refused · 2 failed'). Minor, outside: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs, the fault 611 fixed in the tree-too-large report. Checked and holding: every test red on the base for the stated reason (41 failed there) and green on the tip (262 passed); 560's scan gives the base's markers, lines and reasons for a token split at the 1 MiB read, 2-byte and 4-byte characters split there, CRLF and a Markdown fence across it; 580 passes under 256 MiB with a rule reading one file's text and with a rule reporting every file; 611 ctx.parseAst on a 70 MiB file peaks at 694 MB against 688 MB for file.ast, so no new memory cost; 656's 'no code needed beyond the cause' holds (the base already replaced the worker and printed no Aborted()); 689's floor is dead (bounded by total/256 MiB, always looser than the worst-case bound); the new --json causes are in the UnverifiedCause type, the schema and docs/cli-reference.md. 611 line 2 [read] holds: the tree report reads 'asked for the syntax tree of <file>, N bytes, over the 536870888 characters of text a syntax tree can be built from' and its next ends 'then run yg check --approve --only-deterministic'. Tried against the guards: a symlinked companion (stat follows it), a companion of exactly the limit (read), a marker in a string literal of a file over 64 MiB (waives, as docs/reviewers.md now says).
  outside the issue, filed as 710: Minor: ast/parse-guard.ts:123, :147, :162 and :175 end a script rule's parser-memory report with 'then run yg check --approve', which starts paid reviewer pairs; the free command is yg check --approve --only-deterministic, as 611 made the tree-too-large report say

## Evidence

### Proof

- **ran (line 58a4d1cf3676):** cd source/cli && npx vitest run tests/unit/ast/parse-guard.test.ts tests/unit/cli/det-concurrency.test.ts tests/unit/core/drill-runner.test.ts tests/unit/core/fill-infra-grouping.test.ts (3 of the new assertions red on the base: no parallel advice with both own and others' trees, drill next about mapping, companion group headed 'Companion resolution ... aspect-companion-runtime-error') · **saw:** green after: 73 tests passed; the floor is gone (no test can fail on it)
- **ran (line 58a4d1cf3676):** cd source/cli && npx vitest run tests/unit/ast/parse-guard.test.ts tests/unit/cli/det-concurrency.test.ts tests/unit/core/drill-runner.test.ts tests/unit/core/fill-infra-grouping.test.ts, on fbf372dab and on d2cc7b6af · **saw:** green on the branch; red on the base for the parallel advice, the drill next step and the companion heading. The floor is dead: with it, the memory bound is at most total/256 MiB, always looser than the worst-case bound (total - rss)/(rss + 2 GiB)

### Notes

Assumed: the per-worker floor (128 MiB) is dead, not under-tested: the worst-case bound (2 GiB per worker plus the parent) is below the budget-over-floor quotient for every input, and the floor changed no result, so it is removed rather than given a test that cannot be made to fail; a zero reading is still guarded (per-worker estimate of at least one byte), which the existing 'never returns less than one worker' case pins (it gives NaN without it). The 'applies a floor' test is renamed for the bound that decides.

