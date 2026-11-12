# 546 · Jarl: two issues on one branch are not one lease when one Repo field holds the name and the other the path

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T0936-qthp
**Tags:** jarl, jarl-6.3.1, record
**Files:** JarlSkill/skills/jarl/scripts/lib/leases.mjs
**Repo:** JarlSkill
**Found by:** jarl
**Where:** skills/jarl/scripts/lib/leases.mjs:107
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
sameLease compares the Repo fields as written. In the 6.2.0 loop issue 506 held Repo: Runes and 489 held Repo: ../../../Runes, both leased in one set call on one branch, and brief refused them as two leases. The same spelling gap as 540.

## Why
A lease the tool itself wrote cannot be briefed.

## Acceptance
[test] Two issues leased together whose Repo fields name one repository in the two spellings are one lease for brief and next · by: cd skills/jarl/scripts && npm test

## Evidence

### Notes

Deferred: For Jarl 6.3.1; worked around in this loop by writing the name in 489.

