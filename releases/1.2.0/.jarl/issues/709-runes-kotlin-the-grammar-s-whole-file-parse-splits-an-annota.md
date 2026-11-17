# 709 · Runes, Kotlin: the grammar's whole-file parse splits an annotation off a function when exactly one declaration precedes it

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-mhre
**Tags:** runes, kotlin, line-numbers
**Files:** 
**Repo:** Runes
**Found by:** rev-645-opus
**Where:** the review of 645, 646, 651, 653, 654, 659, 666, 667, 677, 693
**Branch:** jarl/709-kotlin-annotation-line
**Worker:** w-709-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 16:18

## What
Minor: Runes, Kotlin: the grammar's whole-file parse splits an annotation off a function when exactly one declaration precedes it: the 24-line damaged text of the dropped test in c02ae8f after one line val filler0 = 1 parses as annotated_expression plus function_declaration (no error node) and declares primaryConstructor one line lower than at depth 0 or 2 and more, on c5124ca and 90c330f; a remaining form of issue 018's annotated declarations.

Moved from issue 709 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A declaration reported one line off gives a consumer the wrong line for whatever it reports there.

## Acceptance
[test] The damaged Kotlin text of issue 018's annotated declarations, after exactly one declaration, declares primaryConstructor on the same line as at depth 0 and at depth 2 and more, in a test red at v1.1.0 and green after; or, where the grammar's own parse cannot be worked around, docs/api.md names the form as a limit and a test pins the answer · by: npm run check

## Changelog
- Fixed: Kotlin: a top-level declaration whose annotation lines the grammar read as a statement of their own (`@Suppress("UNCHECKED_CAST")` or `@Throws(IOException::class)` over a `fun`, a `val` or a `class`, depending on what comes before it in the file) is declared on the line of its first annotation, as every other annotated declaration is; in 1.1.0 it was declared below those lines. No edge and no `classifyUse` answer changes; a consumer that reports at a declaration's line sees that line move up.

## Evidence

### Proof

- **ran (line 9a9f67caa94f):** node --test --test-name-pattern='splits off' test/relations/extractors/kotlin.test.mjs (at 0616fec, the test commit on the base, dist unchanged from release/1.2.0) · **saw:** tests 3, pass 1, fail 2: 'reads the declaration the same wherever it sits in the file' expected p.primaryConstructor@13 and got p.primaryConstructor@14 after one declaration; 'declares it on the line of its first annotation' failed; the statement guard passed
- **ran (line 9a9f67caa94f):** npm run build && node --test test/relations/extractors/kotlin.test.mjs test/relations/extractor-rev.test.mjs (at 55ce939) · **saw:** tests 71, pass 71, fail 0
- **ran (line 9a9f67caa94f):** npm run check (at 55ce939, clean tree) · **saw:** tests 2838, pass 2835, fail 0, skipped 3; dist/ is fresh
- **ran (line 9a9f67caa94f):** npm run check (at 984e8bf, after merging release/1.2.0 at b4b3ffe, clean tree) · **saw:** tests 2859, pass 2856, fail 0, skipped 3; dist/ is fresh

### Notes

Assumed: no catalogue case. A catalogue case asserts edges, and an edge carries the use's line, never a declaration's, so no case can tell the two readings apart; the test in the Kotlin extractor's test file carries the line. Catalogue delta 0.

Assumed: red at the base stands for red at v1.1.0. The Kotlin extractor and its recovery are the same source at v1.1.0 and at release/1.2.0, and the Kotlin grammar is the same commit; only the CLI that builds it moved (issue 586).

Assumed: the outcome is the fix, not a limit. A top-level declaration directly after an annotated_expression whose innermost operand is a parenthesized expression, after an annotation without arguments of its own, takes that statement's first line, with the annotations nested or on several lines. An annotation with arguments followed by an expression (@Suppress("x") (y), @Suppress("x") run()) is a real statement, which the grammar reads so at every depth, and keeps its reading; a test pins both. A spaced @OptIn (X::class) counts too, as the grammar's unsplit reading has it.

Corpus, npm run corpus:edges -- --only moshi,okhttp with RUNES_CORPUS_DIR the shared cache, before (dist of release/1.2.0) and after (the fix): moshi 156 files, 2075 edges, 0 added, 0 removed; okhttp 688 files, 8984 edges, 0 added, 0 removed; both passed, unchanged, since edges carry no declaration line. A scratch diff of declarations over the 716 Kotlin files of both: 4 files change, 6 declarations each move up to their first annotation's line (moshi internal/LinkedHashTreeMap.kt NATURAL_ORDER 8 to 7; okhttp -UtilCommon.kt concat 100 to 99, writeMedium 212 to 211, readMedium 219 to 218; EchRemoteTest 52 to 50; AndroidDnsRobolectricTest 48 to 45); uses unchanged in all 716.

