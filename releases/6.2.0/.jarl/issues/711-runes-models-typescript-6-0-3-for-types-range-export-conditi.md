# 711 · Runes models TypeScript 6.0.3 for types@<range> export conditions (MODELLED_TYPESCRIPT_VERSION in s…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0338-vudw
**Tags:** 
**Files:** Runes/src/relations/extractors/typescript-version-range.mts, Runes/docs/api.md
**Repo:** Runes
**Found by:** rev-706-opus
**Where:** the review of 706
**Branch:** jarl/732-readers-for-a-new-tool
**Worker:** w-732-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-13 16:37

## What
Runes models TypeScript 6.0.3 for types@<range> export conditions (MODELLED_TYPESCRIPT_VERSION in src/relations/extractors/typescript-version-range.mts:6). A project compiled with TypeScript 7 gets a different resolution from its compiler: with exports keys types@>=7 or types@7.0.2 TypeScript 7.0.2 picks that entry and Runes does not, and with types@<7 Runes picks it and TypeScript 7 does not (probed with a fixture package and tsc --traceResolution). Whether the modelled version moves to 7, or follows the project's own TypeScript, is a choice of behaviour of its own.

## Why


## Acceptance


[test] Runes resolves a package's types@ export entries as TypeScript 7.0.2 does (types@>=7 and types@7.0.2 chosen, types@<7 not), on its own tests and a catalogue case, with the modelled version stated in docs/api.md, red before and green after (ruling runes-models-typescript-7) · by: npm run check

## Changelog
- TypeScript and JavaScript: a package's `types@<range>` export keys are read as TypeScript 7.0.2 reads them, whatever TypeScript the project uses: `types@>=7` and `types@7.0.2` are entered and `types@<7` is passed over (1.0.x read them as TypeScript 6.0.3). A package that writes such keys can give its edge to another declaration file.

## Evidence

### Proof

- **ran (line c77edeb43812):** node --test test/relations/extractors/typescript-version-range.test.mjs test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (Runes da12c9d, the test commit) · **saw:** tests 320, pass 315, fail 5: typescript-exports-versioned-types-key-typescript-7-edge, 'enters types@>=7 and types@7.0.2 and passes over types@<7', the modelled version against the pinned 7.0.2, and the two versioned-key range lists
- **ran (line c77edeb43812):** node --test the same files, typescript-conditions-compiler.test.mjs and test/exports.test.mjs (Runes fe18a9e, the fix) · **saw:** tests 346, pass 346, fail 0
- **ran (line c77edeb43812):** nice -n 15 timeout 1800 systemd-run --user --scope -q -p MemoryMax=12G npm run check (Runes 899faf0, clean tree) · **saw:** tests 2720, pass 2717, fail 0, skipped 3; dist/ is fresh; exit 0

### Notes

Assumed: the modelled version is exactly 7.0.2, the TypeScript the repository pins, and the test holds it to that pin, so a later pin moves the model with it.

