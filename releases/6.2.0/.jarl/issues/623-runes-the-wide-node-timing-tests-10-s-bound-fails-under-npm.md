# 623 · Runes: the wide-node timing tests' 10 s bound fails under npm run coverage, so the coverage gate is red on release/1.1.0

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** light
**Key:** 20261111T1645-isdy
**Tags:** runes, tests
**Files:** Runes/test/relations/extractors/wide-node.test.mjs
**Repo:** Runes
**Found by:** jarl
**Where:** w-494-fable, round 2 of the C# package; release/1.1.0 at 262238e took 9.9 s and 11.6 s under coverage
**Branch:** jarl/623-timing-bound
**Worker:** w-623-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 16:45

## What


## Why
Coverage instrumentation slows the parse and extraction by about a fifth, so a bound set for a plain run fails the coverage gate one run in two on the release itself, a false red for every package.

## Acceptance
[test] The wide-node tests keep a bound that fails the pre-168 walker and the pre-566 extractors by a wide margin and passes under npm run coverage on a loaded machine, five runs of five · by: npm run check

## Evidence

### Proof

- **ran (line 7cda673aeac7):** node --test wide-node.test.mjs in a scratch copy with the issue 566 fix reverted for Java and Ruby (dist files of 7684713^), plain and with --experimental-test-coverage · **saw:** Java and Ruby fail in both modes, ratios 21.4 and 32.3 plain, 21.3 and 31.7 instrumented; the other 12 pass at ratios 2.5 to 4.2; fixed code (this branch) passes 14 of 14
- **ran (line 7cda673aeac7):** npm run coverage, then the wide-node test file four more times under --experimental-test-coverage · **saw:** full suite: tests 2394, pass 2393, fail 0, skipped 1, all files 99.08 lines, 95.52 branches, 99.10 functions, exit 0; wide-node file 4 of 4 times pass 14 fail 0 (5 of 5 with the full run)
- **ran (line 7cda673aeac7):** npm run check, then the wide-node test file four more times plain · **saw:** tests 2394, pass 2393, fail 0, skipped 1, check:dist clean, git status clean, exit 0; wide-node file 4 of 4 times pass 14 fail 0 (5 of 5 with the check run)

### Notes

Assumed: the bound is a ratio of two reads, not a number of seconds. A wider fixed bound under coverage cannot keep the failing-before proof: old Java took 32 s plain and 34 s instrumented (the quadratic cost is in the parser, which instrumentation does not slow), so a 30 s bound fails it by a sliver while the fixed C# reads reach 13 s instrumented. Each input is read at a quarter of its size and in full, fastest of two reads each; the full read may take at most 8 times the quarter read (linear measures 2.5 to 4.3, the square gives 16).

