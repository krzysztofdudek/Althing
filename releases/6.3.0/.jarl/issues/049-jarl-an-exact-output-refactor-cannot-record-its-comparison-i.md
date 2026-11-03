# 049 · Jarl: an exact-output refactor cannot record its comparison instead of a review

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-d01e6fd4
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (doneRefusalIn), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2037 at a1132a8
**After:** 035

## What
Claim: A 600-line refactor with byte-identical renders got a review that changed nothing. Corrected by the sceptic: Severity low: a wasted review costs a reviewer run, not a false green, and 004 covers the mechanism; only the comparison as named evidence is new.

Code closes only with a fresh approve unless a loop-wide profile setting drops review. Map row fr-14; issue 004 adds an owner's waiver by ruling.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Owner decision, inside issue 004: the waiver may name the exact-output comparison as its evidence.

## Evidence

