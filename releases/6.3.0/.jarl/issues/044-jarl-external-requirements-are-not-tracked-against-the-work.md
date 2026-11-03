# 044 · Jarl: external requirements are not tracked against the work

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-ead14454
**Where:** JarlSkill/skills/jarl/scripts/lib/import.mjs (cmdImport), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:6184 at a1132a8
**After:** 035

## What
Claim: The requirements checklist against about 30 external tickets was built by hand. Corrected by the sceptic: Severity low: coverage and status per requirement already work through import and sources; the gap is re-import diffing and the owner's question of a requirement concept.

import and sources map findings to issues and their status; there is no link to evidence or rulings and no diff of a changed source. Map row fr-09.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Owner decision: whether Jarl holds requirement items; the smaller step is import reporting findings whose text changed since filing.

## Evidence

