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
**After:** 035, 078

## What
Claim: The requirements checklist against about 30 external tickets was built by hand. Corrected by the sceptic: Severity low: coverage and status per requirement already work through import and sources; the gap is re-import diffing and the owner's question of a requirement concept.

import and sources map findings to issues and their status; there is no link to evidence or rulings and no diff of a changed source. Map row fr-09.

## Why


Work driven by outside tickets needs to know which items changed upstream; the issue tree with Sources (078) holds the items, so only the change report is missing.

## Acceptance
- import reports each finding whose text changed since its issue was filed, with both texts
- No separate requirement concept: external requirements are a branch of the issue tree with a Source (078); reason in research/2026-11-03-jarl-as-a-loop-tool/report.md section 11
- Tested

## Evidence

