# 103 · The measure baseline ('the scope's commits just before the range') is taken before the range's oldest commit by date, not from among the ancestors of --from, so a range that merges an older branch is compared with commits from years earlier

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/measure.mjs, Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/measure.mjs:170-186 (rangeMetrics: the baseline starts from firstIdx, the range's first fingerprint in H.fps, and goes back from firstIdx-1; :181); H.fps has the order of `git log --reverse --no-merges` (history.mjs:269-273), i.e. commit-date priority, not the ancestors of --from; the header comment measure.mjs:22-23 says 'just before `--from`'. Unchanged on release/6.1.1.
**Branch:** jarl/054-measure-advise-like-yg
**Merged:** 944e8fd
**CI:** none

## What
Reproduction (fresh Grain v6.1.0 b70a4e9, node 24.11.1):

1) Synthetically, with the same --from in both runs; the nearest ancestors of --from in the scope are six src-only commits from 2021. Range A merges a branch from 2019 with one src-only commit: measure prints 'the scope's 3 commits just before the range crossed its edge 100%' (JSON baseline: crossing 3 of 3), and these are three crossing commits from 2019. Range B (control: the same two new commits without the merge) gives a baseline of 0% (2 of 2 inside). One old merged commit flips the control from 0% to 100%.

2) express `measure --from 4.21.0 --to v5.0.0 --scope lib`: baseline 42 commits, 90%. Grain's own rangeMetrics over its history store gives exactly the printed numbers (42/4/38). The baseline commits are dated 2014-07-13..2014-10-29, while --from was committed on 2024-09-11; the range's first fingerprint is 085a2968 from 2014-11-07, because the 5.x line merged in the range reaches that far back. The 42 nearest ancestors of --from in the scope are dated 2019-04-16..2024-09-10 and cross the edge 71%, not 90%.

3) Everyday shapes, in days, not years. V1: a feature branch started 4 days before --from and merged in the range; the baseline reads commits from before the branch started (100%) and skips the four src-only commits just before --from (0%). V2: a side branch that is neither an ancestor of --from nor in from..to (checked with git), merged into HEAD after --to; its two crossing commits become the baseline (100%), while the real predecessors of --from have 0%. This is the second face of the same cause (date instead of ancestry), which the issue did not list; V2 counts commits made after --from, which no reading of the documentation allows.

The only test (tests/architect-commands.test.mjs:247) uses a linear history. Different from issue 054 (undeclared node dependencies in measure).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-8/repro/f7-measure-baseline.log and f7b-measure-baseline-express.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-38/repro-synthetic.log, repro-express.log, repro-variants.log (scripts repro-synthetic.sh, repro-express.sh, repro-variants.sh and which-baseline.mjs alongside).

## Why
The baseline comparison is the only question the range half of measure answers (measure.mjs:6-7), and in an ordinary history with branches and merges the answer is silently wrong. The result belongs to the published contract grain-measure/1, which Horde's client report reads, and it can reverse the conclusion: work that looks calmer than usual in fact crosses the edge more often. README.md:244, docs/reference.md:918, commands/measure.md:14 and SKILL.md:141 promise the territory's commits 'just before the range', read as its usual habit.

## Acceptance
- The measure baseline is the scope's commits that are ancestors of --from (e.g. from `git rev-list <from>`, nearest first), excluding the range, leaving out merges and bulk commits as today.
- The synthetic range A from repro-synthetic.sh gives a baseline of 0%, like control B, and variant V2 counts no commit that is not an ancestor of --from.
- express `measure --from 4.21.0 --to v5.0.0 --scope lib`: the baseline consists of ancestors of 4.21.0 (dated 2019-2024), not of commits from 2014.
- A test with a history in which a merged branch has dates interleaved with main.

## Changelog
- Fixed: `grain measure` compares the work with the commits the starting commit was built on, nearest first, so a range that merges an older branch, or a branch merged later, no longer swaps in commits from somewhere else in history.

## Evidence

- **ran:** node --test tests/measure-baseline-ancestors.test.mjs, cb7bb0c vs 591a6a3 · **saw:** before: 3 of 3 fail, each baseline {inside 0, crossing N, crossingShare 1} (merged 2019 branch: the 2019 crossing commits; side branch merged after --to: its two commits; feature branch started 4 days before --from: the commits before its start); after: 3 of 3 pass, each baseline crossingShare 0, the control range without the merge identical (<the session scratchpad, since lost>/patch-611/grain-054/103-red.log, 103-green.log)
- **ran:** express 7ef98448 clone: grain measure --from 4.21.0 --to v5.0.0 --scope lib; then rangeMetrics over the same store with the commits it read (<the session scratchpad, since lost>/patch-611/grain-054/which-baseline-after.mjs) · **saw:** before (verifier, unchanged code): baseline 42 commits dated 2014-07-13..2014-10-29, 90%; after: 'the scope's 42 commits just before the range crossed its edge 71%', 42 commits dated 2019-04-16..2024-09-10, every one an ancestor of 4.21.0, none in the range (<the session scratchpad, since lost>/patch-611/grain-054/103-express-after.log)

docs: docs/reference.md, grain-measure/1 range paragraph (:918): baseline is the same count over as many of the territory's own commits nearest to --from among its ancestors (merges and bulk commits left out), never a commit --from does not contain. README.md:244, commands/measure.md:14 and SKILL.md:141 ('just before the range') stay true and need no change.
- **ran:** YG_BIN=…/grain-611/ci/yggdrasil (6.1.0) HORDE_DIR=… GRAIN_CORPUS_CLONES=… npm test at 591a6a3 (branch jarl/054-measure-advise-like-yg) · **saw:** 1985 tests, 1984 pass, 0 fail, 1 skipped (the Windows-only GNU tar test), exit 0
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2041, pass 2040, fail 0, skipped 1, merge 944e8fd

