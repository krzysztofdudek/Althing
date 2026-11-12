# 659 · Runes: the first type of an 'x is A || x is B' chain gives no edge in C#, three jellyfin Program.cs explanations judge nothing, and Kotlin recovery repairs a broken declaration depending on how far down the file it sits

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2034-rldw
**Tags:** runes, csharp, kotlin
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-233-opus, the JVM and tooling package
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
A missing edge for a type the code tests against, explanation entries that do not say why an edge is right, and a recovery whose result depends on position rather than on the code.

## Acceptance
[test] x is A || x is B gives an edge to A and to B, a catalogue case; jellyfin's Program.cs explanations say why each edge is right; Kotlin recovery gives the same result for a broken declaration wherever it sits in the file, red before and green after · by: npm run check

## Changelog
- Fixed: C#: the first type of a chain of type tests (`item is A || item is B`, `item is A && …`) gives its edge, as the others do (jellyfin gains 63 such references); Kotlin: a damaged declaration is re-read the same wherever it stands in the file.

## Evidence

### Proof

- **ran (line bd6b9b716b26):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs; node --test test/relations/extractors/kotlin-recover-position.test.mjs (Runes, commits 7ebd6e2 and c6d3826, before the fixes) · **saw:** C#: fail csharp-is-type-test-chain-or-edge (Use.cs:3->first not emitted, got 3->second, 4->second, 4->third); Kotlin: fail, the same damaged declaration parses into 2 different trees by its row (expected 2 to be 1)
- **ran (line bd6b9b716b26):** npm run check (Runes, branch jarl/645-runes-rest at 90c330f); RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared node scripts/corpus.mjs verify --tier all · **saw:** tests 2646, pass 2646 (3 skipped: the rustc build tests without rustc on PATH), fail 0, dist/ is fresh; npm run coverage: 99.18 lines, 95.70 branches, 99.19 functions; corpus verify: passed, jellyfin 63 added references each explained (the 3 Program.cs entries rewritten with the judgment), no other repository changed; 600 broken copies of the Kotlin files of moshi and okhttp give the same facts before and after
- **ran (line bd6b9b716b26):** the branch's catalogue and matrix test files copied into a scratch extraction of c5124ca, node --test test/relations/extractors/<language>-name-resolution-matrix.test.mjs; then on a scratch extraction of 90c330f: npm run build, npm run grammars, node --test --test-concurrency=6 on every test file with rustc and cargo 1.99.1 on PATH, dist compared with the committed dist; node --test test/relations/extractors/kotlin-recover-position.test.mjs on a scratch extraction of c6d3826; extracted facts of 660 damaged variants of 220 moshi and okhttp Kotlin files compared between c5124ca and 90c330f · **saw:** before: csharp-is-type-test-chain-or-edge fails, the Kotlin position test fails at c6d3826 (expected 2 to be 1); after: 2649 tests, 2648 pass, 0 fail, 1 skipped (go not installed), the two rustc build tests ran and passed, rebuilt dist identical to the committed one; the 660 damaged variants give identical facts; all 63 added jellyfin references read: each is the head type of an is chain under ||, &&, == or not, bound as the file's usings name it; the 3 Program.cs explanations match the source

### Notes

Assumed: the Kotlin acceptance is met at the level of the recovery parse: parseAt no longer pads the parse, and moves the tree to the file's rows with Tree.edit and a shifted text callback, so the same damaged declaration makes the same tree at any row (the test fails on the base for rows 0-1 against 2 and more). A file-level difference I found is not a recovery one and stays: with exactly one val line before an annotated declaration, the grammar's own parse of the whole file splits an annotation off a function (see Found in the report). Over 600 broken copies of moshi and okhttp Kotlin files the facts are equal before and after.

Assumed: C# first-type reading: the name at the head of a constant pattern whose expression is a binary expression of an operator that binds looser than is (||, &&, |, &, ^, ==, !=, ??) is the type test; a member-access head is left to the existing reading.

