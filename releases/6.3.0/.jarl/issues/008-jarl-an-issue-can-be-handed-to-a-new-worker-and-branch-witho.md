# 008 · Jarl: an issue can be handed to a new worker and branch without a stale-lease alarm

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
Replacing a worker is done by leasing the issue again with a new branch; status then reports the old lease as stale with its branch gone. There is no verb for a handover, and nothing records why the worker changed. The lease also has no place for what the coordinator knows of a worker's cost (a context grown far beyond the others).

## Why
A handover is routine in a long loop; the record should say who took over and why, and the views should stop alarming about a branch that was retired on purpose.

## Acceptance
- A handover moves the lease to a new worker and, optionally, a new branch, with a reason, in one journal line; the old branch is no longer reported as gone
- A lease may carry an optional cost note set by the coordinator, shown in status beside the lease
- Tests for a handover with and without a new branch, and for the note

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

Waits on 035 (analysis session): the model refuses a second lease on a leased issue unless the call names a handover or takeover with its reason (technical critique C1 of research/2026-11-03-jarl-as-a-loop-tool), and its replacement row carries who holds the work; 008's handover is that path, so its shape comes from the model.

