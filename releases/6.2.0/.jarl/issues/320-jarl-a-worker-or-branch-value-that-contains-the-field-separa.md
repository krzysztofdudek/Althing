# 320 · Jarl: a worker or branch value that contains the field separator cannot be read as a model

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261018T1918-mycg
**Tags:** jarl, models
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/models.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** rev-p7-opus
**Where:**
**After:** 290
**Branch:** jarl/320-merge-record
**Merged:** 7dcf62c38c50c8b0ce27720f0d3fa7e3fd5cd11f in ../../../JarlSkill
**CI:** pending

## What
The review of the model records found that --worker and --branch values are not checked for the separator ' · ': a worker name such as 'w-c · model evil' given with no --model is read as the model 'evil' in the lease line.

## Why
A model is a recorded fact the calibration view and its suggestions rest on; a name typed into another field must not be able to forge it.

## Acceptance
A --worker or --branch value containing the separator is refused or neutralised on write, as the lease reason is, so no free text can be read as a model; tested for both flags, and the line stays readable by the frozen reader

## Changelog
- Fixed: A --worker or --branch value that holds ' · ' is now refused, so a name can no longer be read as a model.

## Evidence

- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 7dcf62c · **saw:** 368 tests, 365 pass, 0 fail, 3 skipped

