# 320 · Jarl: a worker or branch value that contains the field separator cannot be read as a model

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** jarl, models
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/models.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** rev-p7-opus
**Where:**
**After:** 290
**Branch:** jarl/320-merge-record
**Worker:** w-p8-sonnet
**Since:** 2026-10-18 19:18

## What
The review of the model records found that --worker and --branch values are not checked for the separator ' · ': a worker name such as 'w-c · model evil' given with no --model is read as the model 'evil' in the lease line.

## Why
A model is a recorded fact the calibration view and its suggestions rest on; a name typed into another field must not be able to forge it.

## Acceptance
A --worker or --branch value containing the separator is refused or neutralised on write, as the lease reason is, so no free text can be read as a model; tested for both flags, and the line stays readable by the frozen reader

## Changelog
- Fixed: A --worker or --branch value that holds ' · ' is now refused, so a name can no longer be read as a model.

## Evidence

