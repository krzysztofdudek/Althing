# 007 · Jarl: a review queue, with the issues that wait for a reviewer offered as one batch

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**After:** 035, 052, 085, 086
**Branch:** jarl/007-review-queue
**Merged:** dedd9efc39e61ba3ac648243ac17939cbcce6a32 in ../../../JarlSkill
**CI:** none

## What
Status marks issues that wait for a reviewer, but there is no view a coordinator can hand one reviewer from, and nothing suggests reviewing several ready issues together. Coordinators built batches by hand to save cost.

## Why
One reviewer reading several small ready branches at once costs less than one per issue and loses little; the record already knows which are ready.

## Acceptance
- A coordinator's list (next --as, 052, over its slice, 085) groups its issues waiting for a verdict into units one reviewer may take under the built-in rule of 086: one shared review only over issues that are one contract or one screen, at most four
- Each grouped unit names why it may be grouped; tests

## Changelog
- Added: Work on code that waits for a review is shown in groups one reviewer may take: the tasks built together on one branch, at most four to a group and named by their branch, and every other task alone.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.
- **ran:** cd skills/jarl/scripts && node --test tests/review-units.test.mjs (before the change, at f463d82) · **saw:** pass 0, fail 4: the review row of next --as carried no units and said raise a fresh reviewer for 1, 2, 3, 4, 5, 6, 7, 8 as one, with the command review <id>
- **ran:** cd skills/jarl/scripts && node --test tests/review-units.test.mjs tests/lone-agent-review.test.mjs tests/liveness.test.mjs (at 12dce63) · **saw:** all pass: a package of six on one branch is two units of three named (one branch, jarl/a), every other issue alone, a coordinator's list holds its slice's units, a verdict over one unit carries one batch id, one proof alone keeps its line
- **ran:** next --as jarl --all on a copy of the 6.3.0 loop, with release/6.2.1 and with 12dce63 · **saw:** release/6.2.1: 040, 041: proof recorded, no verdict; raise a fresh reviewer for 040, 041 ... review <id>; 12dce63: raise one fresh reviewer per unit: 040, 041 (one branch, jarl/007-review-queue) ... review <ids>
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch jarl/007-review-queue at 12dce63) · **saw:** tests 1399, pass 1377, fail 0, skipped 22
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1407, pass 1385, fail 0, skipped 22, merge dedd9ef

