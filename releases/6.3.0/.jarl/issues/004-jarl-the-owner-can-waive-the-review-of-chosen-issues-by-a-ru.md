# 004 · Jarl: the owner can waive the review of chosen issues by a ruling that says so

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/004-gate-and-ratify
**Worker:** w-jarl-004-opus-r2
**Worktree:** /home/me/Worktrees/JarlSkill/004-gate-and-ratify
**Since:** 2026-11-06 16:11

## What
The only way to close an issue that carries code without a fresh reviewer is a loop-wide profile setting (no approve, merge required). When the owner rules that some issues need no review, the coordinator still has to raise a reviewer for each, or the done gate and the merge queue refuse it.

## Why
A ruling of the owner is the loop's highest authority; the record should carry it as the reason an issue closed unreviewed, instead of a review bought only to satisfy the gate.

## Acceptance
- A waiver names its issues and an owner's ruling; it is refused when the ruling is not the owner's, is superseded, or carries no words of the owner
- A waived issue passes the done gate and the merge queue; status counts it apart from fresh and coordinator reviews, and show names the ruling
- A new commit, a round or a reopen after the waiver spends it, as it spends an approve
- Tests for each refusal and for the counts

## Changelog
- Added: The owner can close chosen tasks without a review, by a decision of his that names them and keeps his own words. Nobody else can. The decision counts until the task is sent back, reopened or its code changes, and the status counts such tasks apart from reviewed ones.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.
- **ran:** node --test tests/review-waiver.test.mjs (branch before the waiver code) · **saw:** pass 0, fail 4: decide refuses the unknown flag --waives-review, so no waiver is refused, recorded, counted or spent
- **ran:** node tests/suite.mjs over the whole suite, then node --test tests/surface.test.mjs tests/mcp.test.mjs tests/review-waiver.test.mjs tests/identical-output.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/record-contract.test.mjs after adding the flag to the fields list and the flag meanings (branch, after the change) · **saw:** suite: tests 1287, pass 1265, fail 2 (the fields list and the flag meaning of --waives-review), skipped 20; after the fix: pass 124, fail 0, including the identical-output test with its waiver case
- **ran:** on a copy of the loop with the branch: evidence 004, decide demo-waive-004 ... --by owner --quote ... --waives-review 004, merged 004 --sha abc1234 --ci none --keep, set 004 done, status; then the pinned driver's decisions on that copy · **saw:** 004 → done; status: done reviewed by: fresh 57 · waived by the owner 1 · coordinator 1 · self 0; the pinned driver lists demo-waive-004 · by owner as an ordinary ruling
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs at the branch tip d31be29 · **saw:** tests 1287, pass 1267, fail 0, skipped 20

