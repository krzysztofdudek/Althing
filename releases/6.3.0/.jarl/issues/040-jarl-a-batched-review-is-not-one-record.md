# 040 · Jarl: a batched review is not one record

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-e9f47e3b
**Where:** JarlSkill/skills/jarl/scripts/lib/review.mjs (cmdReview), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4439 at a1132a8
**After:** 035

## What
Claim: Four tasks shared one review and one merge SHA, and the record shows four separate reviews. Corrected by the sceptic: Severity low: the record already lets a reader group a batch from identical verdict lines; an explicit batch id only makes that exact.

review <ids> writes one verdict and one log line per issue with nothing linking them (help, the <ids> paragraph). Map row fr-05; issue 007 offers batches but adds no batch record.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: A multi-issue verdict carries a batch id in the log, and report shows batch sizes and later rounds per batch.

## Evidence

