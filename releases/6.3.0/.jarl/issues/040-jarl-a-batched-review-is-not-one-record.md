# 040 · Jarl: a batched review is not one record

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0838-cqko
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-e9f47e3b
**Where:** JarlSkill/skills/jarl/scripts/lib/review.mjs (cmdReview), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4439 at a1132a8
**After:** 035, 083
**Branch:** jarl/007-review-queue
**Merged:** dedd9efc39e61ba3ac648243ac17939cbcce6a32 in ../../../JarlSkill
**CI:** none

## What
Claim: Four tasks shared one review and one merge SHA, and the record shows four separate reviews. Corrected by the sceptic: Severity low: the record already lets a reader group a batch from identical verdict lines; an explicit batch id only makes that exact.

review <ids> writes one verdict and one log line per issue with nothing linking them (help, the <ids> paragraph). Map row fr-05; issue 007 offers batches but adds no batch record.

## Why

The record should say what happened: one review of several issues is one review, and report can then show batch sizes and what came after.

## Acceptance
- One verdict given on several issues carries one batch id on each of its lines, under format 3 (083)
- report shows batch sizes and the rounds per batch
- Tests

## Changelog
- Added: One verdict given on several tasks at once is now recorded as one shared review, and the report lists each shared review with how many tasks it covered and how many failed rounds came after it. The first one moves the loop to format 3.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/batch-review.test.mjs (before the change, at 969f84b) · **saw:** pass 2, fail 4: no batch id on the lines of a verdict over 001,002,003, the format stayed 1, report printed no batched reviews line and its JSON had no metrics.batches
- **ran (history):** cd skills/jarl/scripts && node --test tests/batch-review.test.mjs tests/log-reader.test.mjs (at a643bd4) · **saw:** pass 20, fail 0: one batch id on each line of one verdict over several issues, format raised to 3 and both frozen readers refuse, a verdict on one issue carries none and raises nothing, a composer's loop records none, report prints the batch with its size and rounds
- **ran (history):** jarl.mjs review 040,041 changes --by probe-reviewer, then report --metrics, on a copy of the 6.3.0 loop (at a643bd4) · **saw:** both log lines carry batch 20261106T1920-xgls after the reviewer, the copy's profile.json became format 3, report printed: batched reviews: 1 batch over 2 issues · 040, 041 (2, changes by probe-reviewer): 0 rounds after it; before the review report --metrics was identical to release/6.2.1's
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch jarl/007-review-queue at 12dce63) · **saw:** tests 1399, pass 1377, fail 0, skipped 22
- **ran (history):** cd skills/jarl/scripts && node --test tests/gate-decide-tips.test.mjs (at a643bd4, then at e2f15e5) · **saw:** at a643bd4 the review test failed: its log line now carries the batch id after the standing; at e2f15e5 it reads the batch id and passes
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1407, pass 1385, fail 0, skipped 22, merge dedd9ef

