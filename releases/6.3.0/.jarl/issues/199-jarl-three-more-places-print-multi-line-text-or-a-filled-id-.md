# 199 · Jarl: three more places print multi-line text or a filled id: resume's escalation, proposed-rule and ratify sections, the lease refusal across slices, and a ruling note of several lines logged with joined lines

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-182-opus
**Where:** lib/resume.mjs sections for escalations, proposed rules and ratify items; lib/commands.mjs the lease refusal across slices; the log of a multi-line ruling note

## What
(1) resume's escalation, proposed-rule and ratify sections print multi-line text on several lines. (2) The lease refusal across slices in lib/commands.mjs still ends with a filled issue id. (3) A ruling note of several lines is logged with its lines joined, so if retracted it keeps its line in resume's tail.

## Why
One row per item keeps a list scannable, a refusal's form should hold a placeholder, and a retracted note should leave the tail.

## Acceptance
The three sections print one row per item, the lease refusal ends with a form that holds a placeholder, the ruling note's joined line is matched when retracted, with a test each

## Evidence

