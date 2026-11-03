# 082 · Jarl: the takeover advice's findings list loses round positions, names only the last model, mis-handles a Tier outside the profile, and four references still describe only the third round

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 003
**Found by:** rev-jarl-003b-opus
**Where:** Review of 003 round 1 (2026-11-03)

## What
Findings per round skips rounds without a count, so positions stop matching round numbers; later advice says the same model failed and names only the last; an issue whose Tier is not in the profile gets the profile's first tier as one tier up; record.mjs's addRound takes no findings count; models.md, glossary.md, jarl.md and merger.md still describe only the third round.

## Why
Each misleads a coordinator reading a takeover block.

## Acceptance
Each of the five is fixed or documented as it is, with a test where behaviour changes

## Evidence

