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
- Added: The owner can close chosen tasks without a review, by a decision of his that names them and keeps his own words. Nobody else can. The decision counts until the task is sent back, reopened or its code changes, and the status counts such tasks apart from reviewed ones. The first such decision moves the loop to format 3.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.
- **ran:** node --test tests/review-waiver.test.mjs (branch before the waiver code) · **saw:** pass 0, fail 4: decide refuses the unknown flag --waives-review, so no waiver is refused, recorded, counted or spent
- **ran:** node tests/suite.mjs over the whole suite, then node --test tests/surface.test.mjs tests/mcp.test.mjs tests/review-waiver.test.mjs tests/identical-output.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/record-contract.test.mjs after adding the flag to the fields list and the flag meanings (branch, after the change) · **saw:** suite: tests 1287, pass 1265, fail 2 (the fields list and the flag meaning of --waives-review), skipped 20; after the fix: pass 124, fail 0, including the identical-output test with its waiver case
- **ran:** on a copy of the loop with the branch: evidence 004, decide demo-waive-004 ... --by owner --quote ... --waives-review 004, merged 004 --sha abc1234 --ci none --keep, set 004 done, status; then the pinned driver's decisions on that copy · **saw:** 004 → done; status: done reviewed by: fresh 57 · waived by the owner 1 · coordinator 1 · self 0; the pinned driver lists demo-waive-004 · by owner as an ordinary ruling
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs at the branch tip d31be29 · **saw:** tests 1287, pass 1267, fail 0, skipped 20
- **ran:** node --test tests/review-waiver.test.mjs with the new cases, on the branch at 011bc4c (before the change) · **saw:** tests 8, pass 5, fail 3: the first waiver left the loop at record format 1 (actual 1, expected 3), so a reader of formats 1 and 2 still read the loop; a waiver in a loop below format 3 let done close the issue; show printed a superseded waiver with nothing saying it waives nothing
- **ran:** node --test tests/review-waiver.test.mjs, then with format-marker, record-contract, docs-true, tense, surface, mcp, identical-output, retract, printed-texts, skill-shape, gate-window, words, vocabulary, modules, library-parity, owner-quote, ruling-under, scoped-rules, proof-notes and reviewer-rule (branch at 7e674a6, after the change) · **saw:** review-waiver: tests 8, pass 8, fail 0, including the frozen 6.1.0 and 6.2.0 readers refusing status, report and list of a waived loop with their own format-3 message; with the others: tests 283, pass 282, fail 0, skipped 1
- **ran:** on two copies of the loop: decide demo-waive-004 ... --by owner --quote ... --waives-review 004 with the branch before (011bc4c) and after (7e674a6), the pinned driver's status on each, then decide demo-review-004 --supersedes demo-waive-004 and show 004 · **saw:** before: no profile written (format 1), the pinned driver reads the loop, and show prints the superseded waiver as waiving; after: profile.json holds format 3, the pinned driver refuses the loop (written for record format 3, and this Jarl reads format 1), and show ends the note with (superseded by demo-review-004: it waives nothing). This replaces the earlier row's reading that the pinned driver lists the waiver as an ordinary ruling: a waiver now raises the loop, and the older readers refuse it
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs at the branch tip 7e674a6 · **saw:** tests 1295, pass 1273, fail 0, skipped 22 (an earlier run hit ENOSPC on the shared temporary filesystem in three refusal-walk tests, not counted)

