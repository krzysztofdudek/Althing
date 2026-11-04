# 131 · Jarl: the fill hint for Found by says only at filing while field writes it

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096-opus
**Where:** Review of 096 (rev-jarl-096-opus), Outside the issue

## What
FILL_WITH in lib/issues.mjs says the Found by header is written only at filing, but the field command changes it.

## Why
A hint that contradicts what the tool does misleads the next reader.

## Acceptance
The hint names the field call that sets it, and a test reads the hint against the field command

## Evidence

