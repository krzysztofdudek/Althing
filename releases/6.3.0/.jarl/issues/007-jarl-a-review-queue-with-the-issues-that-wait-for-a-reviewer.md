# 007 · Jarl: a review queue, with the issues that wait for a reviewer offered as one batch

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**After:** 035

## What
Status marks issues that wait for a reviewer, but there is no view a coordinator can hand one reviewer from, and nothing suggests reviewing several ready issues together. Coordinators built batches by hand to save cost.

## Why
One reviewer reading several small ready branches at once costs less than one per issue and loses little; the record already knows which are ready.

## Acceptance
- A view lists the issues waiting for a verdict, each with its branch and tier, grouped into batches a single reviewer may take (same repository, tier and kind, a set size)
- The view says which issues may not go into a batch (strong tier, security or a record format) and why
- review records one verdict on several issues in one call, as now; the reviewer reference shows how to review a batch
- Tests for the grouping and the exclusions

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

