# 002 · Jarl: pausing and resuming an issue keeps its proof and its approve while the branch tip is unchanged

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
Moving an in-progress issue back to open (or deferred) and leasing it again counts as a restart: every Proof row and the live approve recorded before it stop counting, so status says no evidence since the start and done is refused for want of an approve, although the branch and its tip are the same. An owner who reorders the queue several times a day spends every review that way.

## Why
Proof and a verdict are about code. A status move that leaves the code untouched must not spend them; a new commit on the branch must.

## Acceptance
- A pause and resume with the same branch tip keeps the rows and the approve that counted before it; a new commit on the branch, a round, or a reopen from done spends them as now
- Each row and verdict records the branch tip it was made on, and the gate compares that with the tip now; a loop whose rows carry no tip reads as now
- Tests for pause and resume, for a new commit after a pause, and for a record written without tips

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

