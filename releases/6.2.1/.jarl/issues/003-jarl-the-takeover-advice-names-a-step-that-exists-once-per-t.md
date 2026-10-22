# 003 · Jarl: the takeover advice names a step that exists, once per takeover

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
After the third round the takeover block says to raise the fresh worker one tier up from strong, a tier that does not exist, and repeats the same advice word for word on every later round, also after a takeover with a changed approach. A loop that bars the strongest model cannot follow it at all.

## Why
Advice that cannot be followed teaches the coordinator to ignore the takeover block, which is the one place that stops a fourth patch of the same failure.

## Acceptance
- From the strong tier the advice names a different model or a changed approach, never a tier above strong
- A takeover starts a new count: the next takeover advice comes after three rounds of the new worker, not on every round after the third
- Where the profile caps the models (see the model ceiling issue), the advice stays under the cap
- Tests for each

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

