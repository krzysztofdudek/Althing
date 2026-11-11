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

## Reviews
- **approve** · by rev-623-fable (fresh) · 2026-11-11 · model claude-fable-5-2
  Minor: the two reads of a ratio are taken seconds to minutes apart, so a change of load between them moves it; when six reverted copies started at once and their share of the processor changed mid-run, the reverted Java, Kotlin, PHP, Rust and Ruby passed at 3.8 to 5.8, and the same disturbance took a fixed read to 6.2 of the 8 allowed. Run alone, each fails at 31 to 49, and no false red appeared in five loaded coverage runs or a full coverage run (3.2 to 4.6). Minor: the file takes about 53 s plain and 102 to 119 s under coverage, against 20 s and 42 s before; the full coverage gate still ends in 263 s on one core, which I judge acceptable for a bound that no longer fails the gate one run in two. Minor: the 50 ms floor is reached only by the plain quarter reads of Ruby and Python (40 to 60 ms), where it allows 400 ms against full reads of 160 to 270 ms; under coverage no quarter read is below 125 ms, so start-up cost does not carry the ratio. Tried to get past the guard: reverted each extractor's fix, the walker, and the walker with the TypeScript reader; only C# got through. One commit, its subject names the issue, only the test file moved, dist rebuilds identical.
  outside the issue, filed as 636: Runes: neither C# wide-node test fails when the issue 566 change of the C# extractor is reverted (ratios 4.5 and 4.3, full reads 1.7 s and 2.5 s, so the earlier 10 s bound passed it too); the C# part of that fix has no test that can fail for it

## Evidence

### Proof

- **ran (line 7cda673aeac7):** node --test wide-node.test.mjs in a scratch copy with the issue 566 fix reverted for Java and Ruby (dist files of 7684713^), plain and with --experimental-test-coverage · **saw:** Java and Ruby fail in both modes, ratios 21.4 and 32.3 plain, 21.3 and 31.7 instrumented; the other 12 pass at ratios 2.5 to 4.2; fixed code (this branch) passes 14 of 14
- **ran (line 7cda673aeac7):** npm run coverage, then the wide-node test file four more times under --experimental-test-coverage · **saw:** full suite: tests 2394, pass 2393, fail 0, skipped 1, all files 99.08 lines, 95.52 branches, 99.10 functions, exit 0; wide-node file 4 of 4 times pass 14 fail 0 (5 of 5 with the full run)
- **ran (line 7cda673aeac7):** npm run check, then the wide-node test file four more times plain · **saw:** tests 2394, pass 2393, fail 0, skipped 1, check:dist clean, git status clean, exit 0; wide-node file 4 of 4 times pass 14 fail 0 (5 of 5 with the check run)
- **ran (line 7cda673aeac7):** node --test wide-node.test.mjs in a scratch copy of 125c7f6, each time with one part reverted: the issue 566 change of one extractor (Java, Kotlin with its recovery, PHP, Rust, Ruby, C#), each run alone; the pre-168 walker; the pre-168 walker with the pre-168 TypeScript reader · **saw:** alone, the reverted extractor's test fails: Java ratio 38, Kotlin 31, PHP 49, Rust 47, Ruby 35 (bound 8); reverted C# passes both C# tests at 4.5 and 4.3, and its full reads take 1.7 s and 2.5 s, so the 10 s bound did not catch it either; the old walker fails Go 26, Java 24, PHP 47, C 27, C++ 28, Python 56, and with the old TypeScript reader JavaScript 42; fixed code passes 14 of 14 at 1.7 to 4.4. When six reverted copies were started at once and their share of the processor changed during the run, Java, Kotlin, PHP, Rust and Ruby passed at 3.8 to 5.8
- **ran (line 7cda673aeac7):** the wide-node file five times with --experimental-test-coverage while a full suite at 6 processes looped on the same two cores (load average 28); then npm run coverage once in a scratch copy, and a rebuild of dist compared with the branch · **saw:** 5 of 5: pass 14, fail 0, ratios 3.2 to 4.5, quarter reads 125 ms to 2.8 s, 102 to 119 s a run; npm run coverage: tests 2394, pass 2393, fail 0, skipped 1, all files 99.08 lines, 95.52 branches, 99.10 functions, exit 0, ratios 3.5 to 4.6; rebuilt dist identical to the branch's

### Notes

Assumed: the bound is a ratio of two reads, not a number of seconds. A wider fixed bound under coverage cannot keep the failing-before proof: old Java took 32 s plain and 34 s instrumented (the quadratic cost is in the parser, which instrumentation does not slow), so a 30 s bound fails it by a sliver while the fixed C# reads reach 13 s instrumented. Each input is read at a quarter of its size and in full, fastest of two reads each; the full read may take at most 8 times the quarter read (linear measures 2.5 to 4.3, the square gives 16).

