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

## Reviews
- **changes** · by rev-732-opus (fresh) · 2026-11-13 · model claude-opus-5-5@xhigh · batch 20261113T1804-qtjz
  Read the 16 commits on release/1.1.0 (8d31e57); re-ran every [test] line red at its test commit and green at 648cf8a (npm run check: 2723 tests, 0 fail; dist/ equal to the committed one), corpus verify --tier all (33 repositories, 0 added, 0 removed), a walk of all 982 catalogue cases (classifyUse resolves exactly where the edge walk binds, 0 mismatches over 2210 uses, candidates sorted and unique), and a type-check of consumer code written to the 1.0 shapes (a plain resolvePathToFile, a hand-written TargetResolver, a wrapper) against 648cf8a and 8d31e57: both compile, so the additions are additive. Line 4 [read] met: docs/api.md says 'TargetResolver gains the optional method classifyUse', 'The ambiguous form gains the optional field candidates', 'The absent form gains the optional fields reason and resolvedFile, which classify never sets either'; the CHANGELOG half is met by the issues' Changelog fields, as the jarl's note on 732 says. Line 5 is the owner's. Assumed notes checked: listOf(1) and println(x) give no use (probe), the TypeScript pin is 7.0.2. Findings: (1) Important, 738: Kotlin reads a star import before the default imports (docs/api.md itself puts the package 'before a star import and the default imports'), but the group ends with the default reading and holds no star reading, so a simple name that a star import of a repository package declares and a default package also holds now answers that it leaves the repository. Repro: k/model/Result.kt 'package com.acme.model' with 'sealed class Result'; k/app/Use.kt 'package com.acme.app', 'import com.acme.model.*', 'fun r(): Result? = null': classifyUse gives { kind: 'absent', reason: 'outside' } at 648cf8a, { kind: 'absent', reason: 'unfollowed' } at 899faf0; Pair the same. A consumer stays quiet about a use of the repository's own type, the false green the change must not add; edges do not move. (2) Minor, 738: the default list lacks kotlin.text.Charsets and kotlin.text.HexFormat, so Charsets.UTF_8 answers absent unfollowed. (3) Minor, 732 lines 2 and 7: a simple name an on-demand import of a library brings answers unfollowed ('import java.util.*;' then 'List<String> xs;'), the noise line 7 removed for java.lang; Kotlin the same for a library star import. (4) Minor, 732 lines 2 and 6: 'Outer.Member' where Outer is a type of the package and the member is not declared in Outer's file answers absent outside though Outer is the repository's: 'Sub.Inner' with Inner inherited from a repository class Base, and a generated member such as Lombok's 'Person.PersonBuilder'. (5) Minor, shape: docs/api.md does not say whether a later 1.x may add a value to reason; a sentence that a consumer reads a reason it does not know as none would keep that union open for all of 1.x.

## Evidence

### Proof

- **ran (line c77edeb43812):** node --test test/relations/extractors/typescript-version-range.test.mjs test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (Runes da12c9d, the test commit) · **saw:** tests 320, pass 315, fail 5: typescript-exports-versioned-types-key-typescript-7-edge, 'enters types@>=7 and types@7.0.2 and passes over types@<7', the modelled version against the pinned 7.0.2, and the two versioned-key range lists
- **ran (line c77edeb43812):** node --test the same files, typescript-conditions-compiler.test.mjs and test/exports.test.mjs (Runes fe18a9e, the fix) · **saw:** tests 346, pass 346, fail 0
- **ran (line c77edeb43812):** nice -n 15 timeout 1800 systemd-run --user --scope -q -p MemoryMax=12G npm run check (Runes 899faf0, clean tree) · **saw:** tests 2720, pass 2717, fail 0, skipped 3; dist/ is fresh; exit 0
- **ran (line c77edeb43812):** node --test typescript-version-range.test.mjs typescript-resolve.test.mjs typescript-name-resolution-matrix.test.mjs catalogue.test.mjs in a git archive extraction of Runes da12c9d (the test commit); npm ci and npm run check in a git archive extraction of Runes 648cf8a in a mktemp -d folder (systemd-run --user --scope -p MemoryMax=12G); node scripts/corpus.mjs verify --tier all at 648cf8a with the shared corpus cache · **saw:** da12c9d: tests 320, pass 315, fail 5: typescript-exports-versioned-types-key-typescript-7-edge (expected edge packages/app/use.ts:1->ts7, got ->ts6), 'enters types@>=7 and types@7.0.2 and passes over types@<7', the modelled version (expected '6.0.3' to be '7.0.2') and the two versioned-key range lists; the package.json pin is typescript 7.0.2 and docs/api.md states 7.0.2; 648cf8a: tests 2723, pass 2720, fail 0, skipped 3; check:dist cannot ask git outside a checkout (not a git repository), and the dist/ it rebuilt equals the committed dist/ of 648cf8a by diff -r; corpus verify --tier all: 33 repositories ok, 0 added, 0 removed, corpus verify: passed

### Notes

Assumed: the modelled version is exactly 7.0.2, the TypeScript the repository pins, and the test holds it to that pin, so a later pin moves the model with it.

