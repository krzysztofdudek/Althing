# 063 · Jarl: a ruling cannot cite the mandate it was made under

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-42af4cdd
**Where:** JarlSkill/skills/jarl/scripts/lib/questions.mjs (cmdDecide), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5763 at a1132a8
**After:** 035

## What
Claim: Coordinator rulings under the owner's mandate should cite it, and check should warn when one falls outside every mandate.

ask --kind ratify records a choice made under a mandate; decide has no field for the mandate. Map row fr-29.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: decide --under <slug> records the mandate, and verify lists jarl rulings with none.

## Evidence

Kept small by the model (report section 11): decide may name the ruling it rests on (--under <slug>), shown with the ruling; no check that a coordinator's ruling falls under a mandate.

