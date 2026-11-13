# 707 · Minor: Runes, TypeScript: a package.json imports target is still resolved with an added extension (…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-dqki
**Tags:** 
**Files:** Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** Runes
**Found by:** rev-645-opus
**Where:** the review of 645, 646, 651, 653, 654, 659, 666, 667, 677, 693
**Branch:** jarl/732-readers-for-a-new-tool
**Worker:** w-732-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-13 16:37

## What
Minor: Runes, TypeScript: a package.json imports target is still resolved with an added extension (src/relations/extractors/typescript-resolve.mts:69 probes it; 646 changed only exports targets to probeExact), so "imports": { "#u/*": "./src/u/*" } and import { thing } from '#u/thing' give packages/app/use.js:1 -> the file src/u/thing.js on c5124ca and 90c330f, where Node and TypeScript read the target as written and find no file.

## Why


## Acceptance


[test] A package.json imports target is resolved as written, with no extension added: with "imports": { "#u/*": "./src/u/*" } and import { thing } from '#u/thing', Runes gives no edge to src/u/thing.js, as Node and TypeScript find no file there, while a target written with its extension keeps its edge; a unit test and a catalogue case, red at b326704 and green after · by: npm run check

## Evidence

