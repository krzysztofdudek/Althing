# 551 · Minor: the resolution-mode import attribute (import type ... with { 'resolution-mode': 'import' }, …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1042-xchh
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-526-opus
**Where:** the review of 491, 526
**Branch:** jarl/550-typescript
**Worker:** w-550-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 19:11

## What
Minor: the resolution-mode import attribute (import type ... with { 'resolution-mode': 'import' }, and the same in an import type node) overrides the mode in TypeScript, and Runes ignores it; it existed before this change.

## Why


## Acceptance


[test] An import type and an import type node carrying the resolution-mode attribute read the require or import condition the attribute names, as TypeScript does, a catalogue case each, red before and green after · by: npm run check

## Evidence

