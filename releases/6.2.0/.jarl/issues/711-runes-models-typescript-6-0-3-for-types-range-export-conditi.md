# 711 · Runes models TypeScript 6.0.3 for types@<range> export conditions (MODELLED_TYPESCRIPT_VERSION in s…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0338-vudw
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-706-opus
**Where:** the review of 706

## What
Runes models TypeScript 6.0.3 for types@<range> export conditions (MODELLED_TYPESCRIPT_VERSION in src/relations/extractors/typescript-version-range.mts:6). A project compiled with TypeScript 7 gets a different resolution from its compiler: with exports keys types@>=7 or types@7.0.2 TypeScript 7.0.2 picks that entry and Runes does not, and with types@<7 Runes picks it and TypeScript 7 does not (probed with a fixture package and tsc --traceResolution). Whether the modelled version moves to 7, or follows the project's own TypeScript, is a choice of behaviour of its own.

## Why


## Acceptance


[test] Runes resolves a package's types@ export entries as TypeScript 7.0.2 does (types@>=7 and types@7.0.2 chosen, types@<7 not), on its own tests and a catalogue case, with the modelled version stated in docs/api.md, red before and green after (ruling runes-models-typescript-7) · by: npm run check

## Evidence

