# 290 · Jarl: models reads other loops (--with <root>, and the loop's own archives), so calibration outlives one release loop

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, models
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**After:** 287
**Found by:** jarl-architect
**Source:** research/2026-10-11-jarl-model-calibration-and-field-notes#jarl-mc-models-across-loops
**Where:** the models view of 287 (design A.10, last row)

## What
The models view of 287 reads only the loop it is run in, and no loop holds model data before the one that first records it. A model measured over one release is a small sample; calibration needs the samples of several loops. models gains --with <root> (repeatable), which reads another loop's record (a root or an archive under .jarl/archive/), and reads the current loop's own archives when asked.

## Why
Thresholds of n >= 5 per model and kind are reached across loops long before they are reached in one, and a loop that is archived or removed would otherwise take its measurements with it.

## Acceptance
- models --with <root> merges the units, verdicts and counts of each named loop into one table, says which loops it read, and groups by the model value as recorded; a loop in the 6.1.0 format reads as (not recorded) by tier
- models --archives reads the loop's own .jarl/archive/ directories; a root that is not a loop is refused with a message, and nothing is written; tests: two loops with the same model give summed counts, and a share appears only from n >= 5 over the sum

## Evidence

Deferred: Next release (6.3.0), per the design research/2026-10-11-jarl-model-calibration-and-field-notes/design.md, Proposed changes; no loop holds model data before 6.3.0

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).

