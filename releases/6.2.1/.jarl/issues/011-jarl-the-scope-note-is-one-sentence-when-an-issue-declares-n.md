# 011 · Jarl: the scope note is one sentence when an issue declares no files

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
Nearly every merge in a long loop ended with a scope note listing every changed file as outside the declared scope, because the issues declared no files or one directory. The note never changed a decision.

## Why
A note that always fires is read as noise, and then the one that matters is missed too.

## Acceptance
- An issue with no declared files gets one sentence saying so, not a list of files
- A declared directory covers everything under it; only files outside every declared place are listed
- Scope is never inferred from the worker's own commits, so a worker does not set its own bounds; the reference says why
- Tests for each

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

