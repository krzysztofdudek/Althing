# 006 · Jarl: a model ceiling in the profile, which the fresh-review rule and the advice respect

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**After:** 035

## What
The fresh-review rule (another model, not a lower-ranked one) always points at the strongest allowed model, and Jarl knows neither a ceiling nor a cost. A loop that bars a model, or runs on a tight budget, gets advice it cannot follow.

## Why
Model choice is the largest cost of a loop; the rule should say what to do when the reviewer it wants is above the ceiling: run the worker on a lighter model so a reviewer under the ceiling still outranks it.

## Acceptance
- The profile can name the models a loop may not use, or the strongest it may use; the profile check refuses an unknown model
- When the reviewer the rule needs is above the ceiling, the refusal and next say so and name the lighter worker that would make the review possible
- Jarl reads no usage or budget from the host; the help says the ceiling is the owner's lever for cost
- Tests for the ceiling in the profile, in the refusal and in next

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

From 003 (2026-11-03), part of this issue: where the profile caps the models, the takeover advice of 003 stays under the cap, with a test

