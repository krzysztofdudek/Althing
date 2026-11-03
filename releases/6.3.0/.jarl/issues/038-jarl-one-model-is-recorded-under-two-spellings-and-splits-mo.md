# 038 · Jarl: one model is recorded under two spellings and splits models

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-46d8748a
**Where:** JarlSkill/skills/jarl/scripts/lib/models.mjs (modelValue), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4084 at a1132a8

## What
Claim: claude-sonnet-5-5 and claude-sonnet-5.5 are counted as two models.

Verdicts with --model claude-opus-5-5 and claude-opus-5.5 on the loop copy show as two reviewers in models; --model is stored as given. Map row fr-02.

## Why


## Acceptance
- models folds model ids that differ only in '.' against '-' into one row and says which spellings it folded; the log keeps every id as written
- A lease or a verdict whose --model is a new spelling of a model already in the record prints a note naming the known spelling
- Tests for the fold and for the note; red on 71ebc5b

## Evidence

