# 707 · Minor: Runes, TypeScript: a package.json imports target is still resolved with an added extension (…

**Status:** done
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
**Merged:** 34b7e2bded91e928048ca745b704998c4e45dbf3 in Runes
**Merge check:** npm run check · saw ℹ tests 2736, pass 2733, fail 0, skipped 3; dist/ is fresh; exit 0 (catalogue count resolved to 986: 961 + 1 from 713 + 24 from this package)

## What
Minor: Runes, TypeScript: a package.json imports target is still resolved with an added extension (src/relations/extractors/typescript-resolve.mts:69 probes it; 646 changed only exports targets to probeExact), so "imports": { "#u/*": "./src/u/*" } and import { thing } from '#u/thing' give packages/app/use.js:1 -> the file src/u/thing.js on c5124ca and 90c330f, where Node and TypeScript read the target as written and find no file.

## Why


## Acceptance


[test] A package.json imports target is resolved as written, with no extension added: with "imports": { "#u/*": "./src/u/*" } and import { thing } from '#u/thing', Runes gives no edge to src/u/thing.js, as Node and TypeScript find no file there, while a target written with its extension keeps its edge; a unit test and a catalogue case, red at b326704 and green after · by: npm run check

## Changelog
- TypeScript and JavaScript: a package.json `imports` target is taken as written, as an `exports` target is: `"#u/*": "./src/u/*"` names `src/u/thing` for `#u/thing` and no `src/u/thing.js` beside it, so that import gives no edge, while a target that writes its extension (`"./src/u/*.js"`) binds its file.

## Reviews
- **changes** · by rev-732-opus (fresh) · 2026-11-13 · model claude-opus-5-5@xhigh · batch 20261113T1804-qtjz
  Read the 16 commits on release/1.1.0 (8d31e57); re-ran every [test] line red at its test commit and green at 648cf8a (npm run check: 2723 tests, 0 fail; dist/ equal to the committed one), corpus verify --tier all (33 repositories, 0 added, 0 removed), a walk of all 982 catalogue cases (classifyUse resolves exactly where the edge walk binds, 0 mismatches over 2210 uses, candidates sorted and unique), and a type-check of consumer code written to the 1.0 shapes (a plain resolvePathToFile, a hand-written TargetResolver, a wrapper) against 648cf8a and 8d31e57: both compile, so the additions are additive. Line 4 [read] met: docs/api.md says 'TargetResolver gains the optional method classifyUse', 'The ambiguous form gains the optional field candidates', 'The absent form gains the optional fields reason and resolvedFile, which classify never sets either'; the CHANGELOG half is met by the issues' Changelog fields, as the jarl's note on 732 says. Line 5 is the owner's. Assumed notes checked: listOf(1) and println(x) give no use (probe), the TypeScript pin is 7.0.2. Findings: (1) Important, 738: Kotlin reads a star import before the default imports (docs/api.md itself puts the package 'before a star import and the default imports'), but the group ends with the default reading and holds no star reading, so a simple name that a star import of a repository package declares and a default package also holds now answers that it leaves the repository. Repro: k/model/Result.kt 'package com.acme.model' with 'sealed class Result'; k/app/Use.kt 'package com.acme.app', 'import com.acme.model.*', 'fun r(): Result? = null': classifyUse gives { kind: 'absent', reason: 'outside' } at 648cf8a, { kind: 'absent', reason: 'unfollowed' } at 899faf0; Pair the same. A consumer stays quiet about a use of the repository's own type, the false green the change must not add; edges do not move. (2) Minor, 738: the default list lacks kotlin.text.Charsets and kotlin.text.HexFormat, so Charsets.UTF_8 answers absent unfollowed. (3) Minor, 732 lines 2 and 7: a simple name an on-demand import of a library brings answers unfollowed ('import java.util.*;' then 'List<String> xs;'), the noise line 7 removed for java.lang; Kotlin the same for a library star import. (4) Minor, 732 lines 2 and 6: 'Outer.Member' where Outer is a type of the package and the member is not declared in Outer's file answers absent outside though Outer is the repository's: 'Sub.Inner' with Inner inherited from a repository class Base, and a generated member such as Lombok's 'Person.PersonBuilder'. (5) Minor, shape: docs/api.md does not say whether a later 1.x may add a value to reason; a sentence that a consumer reads a reason it does not know as none would keep that union open for all of 1.x.
- **approve** · by rev-732-opus (fresh) · 2026-11-13 · model claude-opus-5-5@xhigh · batch 20261113T1829-stdd
  Round 2, read b2e0df0, 8bf4eaf, b57cf68, 8efc9cb and 20a5806. Re-ran the two test commits red for the right reason (b2e0df0: 2 fail, answers outside where unfollowed is expected; 8bf4eaf: 6 fail on the new answers, edges passing) and 20a5806 green: npm run check 2730 tests, 0 fail, dist/ equal to the committed one; corpus verify --tier all 33 repositories, 0 added, 0 removed; a walk of every catalogue use: classifyUse resolves exactly where the edge walk binds, and every answer of the 982 cases 648cf8a holds is unchanged; consumer code typed to the 1.0 shapes, with a hand-built hint without onDemand, compiles against 20a5806. The five findings of round 1 are met, probed at 648cf8a and 20a5806: Result and Pair under 'import com.acme.model.*' now answer absent unfollowed (were outside); Charsets.UTF_8 and HexFormat answer outside (were unfollowed); List under 'import java.util.*;' and Job under 'import kotlinx.coroutines.*' answer outside; Sub.Inner and Person.PersonBuilder answer unfollowed (were outside); docs/api.md now says the values of reason and of explainMiss may grow within 1.x and a consumer reads an unknown one as no reason, the three kinds staying. onDemand judged as part of 1.x: an optional field on the symbol form of the listed TargetHint, documented in docs/api.md, set only on the same-package reading, read by classifyUse alone (classify, resolve, resolveFile and every edge unchanged, as the corpus and catalogue show), with the Java rev at 7 and the Kotlin rev at 10 so a stored hint is stale by rev; additive. Line 4 [read] met as quoted in round 1, with the 1.x sentence added. Line 5 is the owner's. Finding: (1) Minor, known limitation, 732: a library on-demand import now makes any simple name the file's package does not declare answer outside, so a type of the package that a generator writes reads as leaving the repository: 'AutoValue_Use' beside 'import java.util.*;' and 'DaggerAppComponent' beside 'import kotlinx.coroutines.*' answer absent outside, where 648cf8a answered unfollowed (without the star import they stay unfollowed). docs/api.md says such a name 'can give' it but does not name this consequence; a sentence there would let a consumer know.

## Evidence

### Proof

- **ran (line 93054a683116):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (Runes 885a2f5, the test commit) · **saw:** tests 315, pass 313, fail 2: typescript-imports-pattern-target-without-extension-silence and 'takes a package.json imports target as written' (expected 'packages/app/src/u/thing.js' to be undefined)
- **ran (line 93054a683116):** node --test the same three files and test/relations/extractors/javascript-name-resolution-matrix.test.mjs (Runes 376a466, the fix) · **saw:** tests 322, pass 322, fail 0
- **ran (line 93054a683116):** nice -n 15 timeout 1800 systemd-run --user --scope -q -p MemoryMax=12G npm run check (Runes 899faf0, clean tree) · **saw:** tests 2720, pass 2717, fail 0, skipped 3; dist/ is fresh; exit 0
- **ran (line 93054a683116):** node --test typescript-resolve.test.mjs typescript-name-resolution-matrix.test.mjs catalogue.test.mjs in a git archive extraction of Runes 885a2f5 (the test commit); npm ci and npm run check in a git archive extraction of Runes 648cf8a in a mktemp -d folder (systemd-run --user --scope -p MemoryMax=12G); node scripts/corpus.mjs verify --tier all at 648cf8a with the shared corpus cache · **saw:** 885a2f5: tests 315, pass 313, fail 2: 'takes a package.json imports target as written' (expected 'packages/app/src/u/thing.js' to be undefined) and typescript-imports-pattern-target-without-extension-silence (unexpected cross-owner edge packages/app/use.js:1->u), the with-extension edge case passing; 648cf8a: tests 2723, pass 2720, fail 0, skipped 3; check:dist cannot ask git outside a checkout (not a git repository), and the dist/ it rebuilt equals the committed dist/ of 648cf8a by diff -r; corpus verify --tier all: 33 repositories ok, 0 added, 0 removed, corpus verify: passed
- **ran (line 93054a683116):** npm ci and npm run check in a git archive extraction of Runes 20a5806 (systemd-run --user --scope -p MemoryMax=12G); node scripts/corpus.mjs verify --tier all with the shared corpus cache · **saw:** 20a5806: tests 2730, pass 2727, fail 0, skipped 3; check:dist cannot ask git outside a checkout, and the rebuilt dist/ equals the committed dist/ by diff -r; corpus: 33 repositories ok, 0 added, 0 removed; round 2 touched no TypeScript source

### Notes

Assumed: an imports target is probed exactly as an exports target is since 646, but it is not mapped back from build output to its source as an exports target is; the issue asks only that no extension be added.

