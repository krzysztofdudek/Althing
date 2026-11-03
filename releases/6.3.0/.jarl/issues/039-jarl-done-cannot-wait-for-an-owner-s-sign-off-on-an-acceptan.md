# 039 · Jarl: done cannot wait for an owner's sign-off on an acceptance line

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-c417b0bf
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (doneRefusalIn), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2037 at a1132a8
**After:** 035

## What
Claim: An issue whose acceptance needs the owner's approval of images was set done right after its merge and had to be reopened by hand. Corrected by the sceptic: Severity medium rather than high: the early close was visible and reopened by hand, and 016's listing of unaddressed acceptance lines narrows it; the refusal itself stays the owner's decision.

set 529 done passed on the loop copy with its acceptance line addressed by no row; the gate reads a Proof row and a live approve only. Map row fr-03.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Owner decision: whether done refuses while an acceptance line marked for the owner is open; issue 016 is the nearest place.

## Evidence

