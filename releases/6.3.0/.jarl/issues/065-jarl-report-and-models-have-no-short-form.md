# 065 · Jarl: report and models have no short form

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-8dc7aacb
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (cmdReport), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:6022 at a1132a8
**Branch:** jarl/065-report-short-form
**Worker:** w-jarl-065-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-065
**Since:** 2026-11-03 20:07

## What
Claim: models printed about 40 KB where 10 lines were needed. Corrected by the sceptic: The claim narrows to report: a summary or metrics-only form of report; models needs no short form at this size.

models --full is refused as an unknown flag; on the loop copy models was 2,115 bytes and report 109,665 bytes. Map row fr-31.

## Why


## Acceptance
- report prints the loop metrics before the issue lists, and one flag prints the metrics alone
- On a copy of the 6.2.0 loop the metrics-only form is under 10 KB (report is about 110 KB today); report --json keeps everything; tested

## Changelog
- Added: `report --metrics` prints only the loop's metrics, so the summary stays short even for a loop with hundreds of issues. `report` now prints the metrics before its lists of issues.

## Evidence

- **ran:** node --test tests/report-metrics.test.mjs · **saw:** tests 11, pass 6, fail 5 before the change: the metrics come before the open issues fails on the order; the four report --metrics tests fail with unknown flag --metrics for report
- **ran:** node --test tests/report-metrics.test.mjs · **saw:** tests 12, pass 11, fail 1 before the testimony fix: the testimony mark is printed once fails with 2 !== 1
- **ran:** node --test tests/report-metrics.test.mjs · **saw:** tests 12, pass 12, fail 0 after the change
- **ran:** node skills/jarl/scripts/jarl.mjs report --metrics --root <a copy of the 6.2.0 loop> · **saw:** 5040 bytes: the heading, the goal and the loop metrics, nothing after them. The full report is 109416 bytes, 109697 before the change, with the same lines reordered and the duplicate testimony mark removed. The JSON differs from before in its text line only.
- **ran:** npm test in skills/jarl/scripts · **saw:** tests 1040, pass 1017, fail 0, skipped 23: the live loop copy and platform checks, all unset on this machine; run on the committed tree, tip b4640e3

