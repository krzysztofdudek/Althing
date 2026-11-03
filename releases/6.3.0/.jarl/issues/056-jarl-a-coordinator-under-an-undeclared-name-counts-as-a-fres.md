# 056 · Jarl: a coordinator under an undeclared name counts as a fresh reviewer

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-6a2f0067
**Where:** JarlSkill/skills/jarl/scripts/lib/loop.mjs (BASE_COORDINATORS), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:3538 at a1132a8
**After:** 035

## What
Claim: report counted the orchestrator three times among fresh reviewers. Corrected by the sceptic: The proposal narrows to the init and status note; the help part is already in the usage of review.

review 529 approve --by orchestrator was recorded as fresh and cleared the gate; only coordinator, jarl, reeve, the loop's name and a Coordinators line count as coordinator. Map row fr-22.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: init and status note a loop with no Coordinators line, and the help says an undeclared name counts as fresh.

## Evidence

