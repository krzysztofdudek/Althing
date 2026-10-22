# 004 · Jarl: the owner can waive the review of chosen issues by a ruling that says so

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
The only way to close an issue that carries code without a fresh reviewer is a loop-wide profile setting (no approve, merge required). When the owner rules that some issues need no review, the coordinator still has to raise a reviewer for each, or the done gate and the merge queue refuse it.

## Why
A ruling of the owner is the loop's highest authority; the record should carry it as the reason an issue closed unreviewed, instead of a review bought only to satisfy the gate.

## Acceptance
- A waiver names its issues and an owner's ruling; it is refused when the ruling is not the owner's, is superseded, or carries no words of the owner
- A waived issue passes the done gate and the merge queue; status counts it apart from fresh and coordinator reviews, and show names the ruling
- A new commit, a round or a reopen after the waiver spends it, as it spends an approve
- Tests for each refusal and for the counts

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

