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

## Reviews
- **approve** · by rev-554-opus (fresh) · 2026-11-11 · model claude-opus-5-5
  Line 1 is met. Red on release/6.2.0: 21 pass, then the file is killed at the 2 GB cap, and the stand-in's log holds 103 identical calls. Green on the tip: 43 of 43. The four touched files pass 64 of 64 under 2 GB (peak 326 MB), on a PATH with a git wrapper and on one without. The whole suite ends under 12 GB: 2299 pass, 50 skipped, and 7 fail, all in canonical-exemplar, the machine-rule failure. Line 2 is met. Note 1 says: 'Cause: the test, not Grain. ... Each round is a node process of about 19 MB that waits for the next: 107 rounds at the 2 GB kill (9 s), 222 at the 4 GB kill (12 s), no process above 90 MB.' The helper finds the first git under the test's own PATH and runs it under that same PATH, so where no wrapper exists it runs the real git as before. It names the stand-in only if it is given a PATH that holds the stand-in. The worker's claim about users holds: Grain starts git by name at 26 sites and never writes PATH. Widening the fix to build-coordination and orphan-child is sound: a probe of the old shell form passed through its stand-in 2136 times in 3 s. Findings: Minor (known limitation), plugins/grain/tests/real-git.mjs:35: the counting wrapper takes the first PATH entry where anything named git exists, not the first executable git. A PATH directory that holds a directory or a non-executable file named git makes both new checks fail with exit 1, a false red on an input nobody is expected to have. Minor (known limitation), plugins/grain/tests/real-git.mjs:17: realGitSh trusts its caller to pass the PATH from before the stand-in is put first. Every caller does today, and the new check covers only that use. Tried against the guard: --end-of-options planted into Grain's diff call (the old-git test catches it, 7 of 11 fail); both new checks before and after their fixes, with and without a wrapper (red with exit 97, then green); a wrapper that runs the second git on PATH (the old form loops, the helper reaches git); a PATH entry with a quote and a space (the helper quotes it, git answers).

## Evidence

### Proof

- **ran (line 2da73cfd1151):** on release/6.2.0, in plugins/grain: systemd-run --user --scope -p MemoryMax=2G -p MemorySwapMax=0 --quiet node --import ./tests/git-env.mjs --test --test-reporter=spec tests/review-range-not-an-option.test.mjs · **saw:** red: 21 tests pass, then the file is killed at the cap after 9.5 s (tests 22, pass 21, fail 1, the file itself). A sampler in the same cap counted 76 processes at 1677 MB, 68 of them the test's stand-in git, none above 90 MB; the stand-in's log held 107 calls, all the same one (rev-parse --show-toplevel). Under 4G: 222 calls, 172 processes at 3806 MB after 12.4 s, killed
- **ran (line 2da73cfd1151):** on the branch tip, in plugins/grain: systemd-run --user --scope -p MemoryMax=2G -p MemorySwapMax=0 --quiet node --import ./tests/git-env.mjs --test --test-reporter=spec tests/review-range-not-an-option.test.mjs · **saw:** green: tests 43, pass 43, fail 0; the cap's peak 163 MB, no kill
- **ran (line 2da73cfd1151):** on release/6.2.0 (b1ddc48b), extracted with git archive, in plugins/grain: systemd-run --user --scope -p MemoryMax=2G -p MemorySwapMax=0 --quiet node --import ./tests/git-env.mjs --test --test-reporter=spec tests/review-range-not-an-option.test.mjs · **saw:** red: tests 22, pass 21, cancelled 1 (the file itself), killed at the 2 GB cap 4.7 s into the file; the stand-in's log held 103 calls, all the same one (rev-parse --show-toplevel)
- **ran (line 2da73cfd1151):** on the branch tip (fafec664), same extraction and the same command · **saw:** green: tests 43, pass 43, fail 0, no kill
- **ran (line 2da73cfd1151):** on fafec664, in plugins/grain, under MemoryMax=2G MemorySwapMax=0: node --import ./tests/git-env.mjs --test tests/review-range-not-an-option.test.mjs tests/build-coordination.test.mjs tests/orphan-child.test.mjs tests/stand-in-git-behind-a-wrapper.test.mjs, once on a PATH whose first git is a wrapper that looks git up on PATH and once on a PATH with no wrapper (first git the real one) · **saw:** with the wrapper: tests 64, pass 64, fail 0, cap peak 326 MB; without it: tests 64, pass 64, fail 0, cap peak 317 MB
- **ran (line 2da73cfd1151):** the two new checks at each commit, under MemoryMax=2G, on both PATHs above: --test-name-pattern='looks git up' tests/review-range-not-an-option.test.mjs at d1e4e3bc and bb7f086a; tests/stand-in-git-behind-a-wrapper.test.mjs at dba3bdc3 and fafec664 · **saw:** d1e4e3bc: 1 fail (97 !== 0); bb7f086a: 1 pass; dba3bdc3: 2 fail (97 !== 0); fafec664: 2 pass; the same on the PATH with no wrapper, so the checks are red before and green after on a machine without one
- **ran (line 2da73cfd1151):** a scratch copy of fafec664 with --end-of-options planted into fileDirty's git diff call (engine/grain-context.mjs), under MemoryMax=2G: --test-name-pattern='older than 2.24' tests/review-range-not-an-option.test.mjs · **saw:** tests 11, pass 4, fail 7, each 'no git call passes --end-of-options': the old-git test still catches its fault through the reworked stand-in
- **ran (line 2da73cfd1151):** a clone at fafec664, in plugins/grain, under systemd-run --user --scope -p MemoryMax=12G -p MemorySwapMax=0: npm run --silent runes:check && node --import ./tests/git-env.mjs --test --test-concurrency=6 tests/*.test.mjs tests/relations/*.test.mjs tests/relations/e2e/*.test.mjs tests/relations/e2e-cli/*.test.mjs (npm test's own command, without Yggdrasil) · **saw:** runes check passed; tests 2356, pass 2299, fail 7, skipped 50, 414 s, cap peak 1519 MB, no kill; all 7 failures are canonical-exemplar.test.mjs, whose fixture commit this machine's git rule refuses for an AI author, a file the branch does not touch

### Notes

Cause: the test, not Grain. The file's last test puts a stand-in git first on PATH, and the stand-in starts the git that 'which git' names. On a machine whose first git is a wrapper that looks the real git up on PATH (a proxy that checks commits, a version manager's shim), the wrapper finds the stand-in as the real git and the stand-in starts the wrapper again, without end. Each round is a node process of about 19 MB that waits for the next: 107 rounds at the 2 GB kill (9 s), 222 at the 4 GB kill (12 s), no process above 90 MB, which is why no single process looked large. The 21 tests before it pass; the reporter prints nothing later because the kill takes the buffered output. Each Grain command the earlier tests run peaks near 65 MB. Grain's own code cannot loop this way: it starts git by name (26 call sites) and never puts a git of its own on PATH or changes PATH, so under such a wrapper every call goes wrapper, then real git. Fix: a stand-in runs the real git under the PATH without its own directory.

Assumed: the same fault is fixed in the two other test files that hand calls from a stand-in git to the real git, because the full suite cannot pass on such a machine otherwise: build-coordination (its test (a) did not end within 90 s; a 3 s probe of the pair passed through the stand-in 2405 times, in one process, so no memory grows there) and orphan-child (two tests failed after 30 s and 122 s). The five shell stand-ins now take the real git from one helper, tests/real-git.mjs. After: the four files run 64 tests under a 2 GB cap, peak 312 MB; test (a) ends in 2.3 s.

Assumed: the fault shows only on a machine with such a wrapper, so two checks build a wrapper of their own that counts its passes and stops with exit 97 on the fourth: one test in review-range-not-an-option for its node stand-in, and a new file, stand-in-git-behind-a-wrapper.test.mjs, for the shell helper. Both were committed failing (exit 97) before their fix and pass after it, on any machine.

Assumed: no changelog entry. The change is in tests only; nothing an adopter sees changes.

Found: the whole suite on the branch tip (the test script's own command with --test-concurrency=6, under a 12 GB cap, without Yggdrasil: the gate's environment is not on this machine) ended in 272 s with a peak of 1594 MB: tests 2356, pass 2299, fail 7, skipped 50. All 7 failures are canonical-exemplar.test.mjs, which this branch does not touch: its fixture commits as an agent author, and this machine's git rule against an AI as author refuses that commit. It fails the same way on the release branch.

