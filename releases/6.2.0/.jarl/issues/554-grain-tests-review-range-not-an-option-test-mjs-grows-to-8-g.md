# 554 · Grain: tests/review-range-not-an-option.test.mjs grows to 8 GB in about 11 seconds, so the full suite cannot finish under a memory cap

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261111T1104-dkel
**Tags:** grain, tests, memory
**Files:** Grain/plugins/grain/tests/review-range-not-an-option.test.mjs
**Repo:** Grain
**Found by:** w-182b-opus
**Where:** plugins/grain/tests/review-range-not-an-option.test.mjs
**Branch:** jarl/554-review-range-memory
**Worker:** w-554-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 11:04

## What
Run alone, the file reaches 8 GB after its 21st passing test, within about 11 seconds, on release/6.2.0 as on the 182 branch; in two full-suite runs it was the file that had just started when the 12 GB cap killed the run. Whether the test or the code under test grows without bound is not established.

## Why
No full Grain suite can finish on a machine with a memory cap, so no Grain change can be shown green.

## Acceptance
[test] The file runs to its end under a 2 GB cap, with the cause of the growth fixed where it lies (the code under test, or the test), red before and green after · by: cd plugins/grain && npm test
[read] The cause is named in the issue with the numbers that show it

## Evidence

### Proof

- **ran (line 2da73cfd1151):** on release/6.2.0, in plugins/grain: systemd-run --user --scope -p MemoryMax=2G -p MemorySwapMax=0 --quiet node --import ./tests/git-env.mjs --test --test-reporter=spec tests/review-range-not-an-option.test.mjs · **saw:** red: 21 tests pass, then the file is killed at the cap after 9.5 s (tests 22, pass 21, fail 1, the file itself). A sampler in the same cap counted 76 processes at 1677 MB, 68 of them the test's stand-in git, none above 90 MB; the stand-in's log held 107 calls, all the same one (rev-parse --show-toplevel). Under 4G: 222 calls, 172 processes at 3806 MB after 12.4 s, killed
- **ran (line 2da73cfd1151):** on the branch tip, in plugins/grain: systemd-run --user --scope -p MemoryMax=2G -p MemorySwapMax=0 --quiet node --import ./tests/git-env.mjs --test --test-reporter=spec tests/review-range-not-an-option.test.mjs · **saw:** green: tests 43, pass 43, fail 0; the cap's peak 163 MB, no kill

### Notes

Cause: the test, not Grain. The file's last test puts a stand-in git first on PATH, and the stand-in starts the git that 'which git' names. On a machine whose first git is a wrapper that looks the real git up on PATH (a proxy that checks commits, a version manager's shim), the wrapper finds the stand-in as the real git and the stand-in starts the wrapper again, without end. Each round is a node process of about 19 MB that waits for the next: 107 rounds at the 2 GB kill (9 s), 222 at the 4 GB kill (12 s), no process above 90 MB, which is why no single process looked large. The 21 tests before it pass; the reporter prints nothing later because the kill takes the buffered output. Each Grain command the earlier tests run peaks near 65 MB. Grain's own code cannot loop this way: it starts git by name (26 call sites) and never puts a git of its own on PATH or changes PATH, so under such a wrapper every call goes wrapper, then real git. Fix: a stand-in runs the real git under the PATH without its own directory.

Assumed: the same fault is fixed in the two other test files that hand calls from a stand-in git to the real git, because the full suite cannot pass on such a machine otherwise: build-coordination (its test (a) did not end within 90 s; a 3 s probe of the pair passed through the stand-in 2405 times, in one process, so no memory grows there) and orphan-child (two tests failed after 30 s and 122 s). The five shell stand-ins now take the real git from one helper, tests/real-git.mjs. After: the four files run 64 tests under a 2 GB cap, peak 312 MB; test (a) ends in 2.3 s.

Assumed: the fault shows only on a machine with such a wrapper, so two checks build a wrapper of their own that counts its passes and stops with exit 97 on the fourth: one test in review-range-not-an-option for its node stand-in, and a new file, stand-in-git-behind-a-wrapper.test.mjs, for the shell helper. Both were committed failing (exit 97) before their fix and pass after it, on any machine.

Assumed: no changelog entry. The change is in tests only; nothing an adopter sees changes.

Found: the whole suite on the branch tip (the test script's own command with --test-concurrency=6, under a 12 GB cap, without Yggdrasil: the gate's environment is not on this machine) ended in 272 s with a peak of 1594 MB: tests 2356, pass 2299, fail 7, skipped 50. All 7 failures are canonical-exemplar.test.mjs, which this branch does not touch: its fixture commits as an agent author, and this machine's git rule against an AI as author refuses that commit. It fails the same way on the release branch.

