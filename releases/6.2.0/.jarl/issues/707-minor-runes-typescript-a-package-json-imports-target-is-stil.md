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

## Changelog
- TypeScript and JavaScript: a package.json `imports` target is taken as written, as an `exports` target is: `"#u/*": "./src/u/*"` names `src/u/thing` for `#u/thing` and no `src/u/thing.js` beside it, so that import gives no edge, while a target that writes its extension (`"./src/u/*.js"`) binds its file.

## Evidence

### Proof

- **ran (line 93054a683116):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (Runes 885a2f5, the test commit) · **saw:** tests 315, pass 313, fail 2: typescript-imports-pattern-target-without-extension-silence and 'takes a package.json imports target as written' (expected 'packages/app/src/u/thing.js' to be undefined)
- **ran (line 93054a683116):** node --test the same three files and test/relations/extractors/javascript-name-resolution-matrix.test.mjs (Runes 376a466, the fix) · **saw:** tests 322, pass 322, fail 0
- **ran (line 93054a683116):** nice -n 15 timeout 1800 systemd-run --user --scope -q -p MemoryMax=12G npm run check (Runes 899faf0, clean tree) · **saw:** tests 2720, pass 2717, fail 0, skipped 3; dist/ is fresh; exit 0

### Notes

Assumed: an imports target is probed exactly as an exports target is since 646, but it is not mapped back from build output to its source as an exports target is; the issue asks only that no extension be added.

