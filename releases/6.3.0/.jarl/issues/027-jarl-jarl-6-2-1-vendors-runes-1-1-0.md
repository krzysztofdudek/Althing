# 027 · Jarl: Jarl 6.2.1 vendors Runes 1.1.0

**Status:** deferred
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:**

## What
Jarl 6.2.0 shipped alone on Runes 1.0.0 (ruling jarl-release-alone-with-every-jarl-issue). The family 6.2.0 ships on Runes 1.1.0, and every tool should point to the same Runes (checked by issue 258 of the 6.2.0 loop).

## Why
One Runes across the family keeps the blocks Jarl's skill shares with the other tools identical.

## Acceptance
- vendor/runes.pin.json names the Runes 1.1.0 tag, the pinned blocks and the vendored copy are re-vendored by the script, and the suite is green
- This waits for the Runes 1.1.0 tag

## Evidence

Deferred: ruling only-jarl-now: Jarl 6.2.1 ships on Runes 1.0.0

