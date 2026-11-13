# 701 · Runes: the C# type lookup's memos (bases, usings, members, attribute classes, methods, ancestry, sh…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0305-blkn
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/extractors/csharp-resolve.mts, Runes/src/relations/extractors/csharp-project.mts, Runes/src/relations/extractors/csharp-reach.mts
**Repo:** Runes
**Found by:** rev-686c-opus
**Where:** the review of 686
**Branch:** jarl/696-csharp
**Worker:** w-696-opus
**Model:** claude-opus-5-5@xhigh
**Since:** 2026-11-13 16:59

## What
Runes: the C# type lookup's memos (bases, usings, members, attribute classes, methods, ancestry, shapes) and the resolver's answers to C# conditions are kept for the resolver's life and are not renewed when the symbol table takes a declaration, so a resolver whose table takes declarations after its first lookups gives other C# edges than a fresh resolver over the whole table. Found in the round-3 review of 686: on random multi-project repositories declared in two halves around a resolution, 302 of 3000 runs differ from a resolver that met the whole table, the same on the release before 686 and on 686's fix; dropping both together with 686's kept readings gives 0 differences. Today's consumers fill the table before resolving, so no edge is lost in their output; what breaks is any consumer that declares after resolving, and 686's split-run test could not be widened to base lists or using directives without turning red on the release too.

## Why


## Acceptance


[test] A resolver whose symbol table takes declarations after its first C# lookups gives the same C# edges as a fresh resolver over the whole table: a seeded randomized test over multi-project repositories declared in two halves around a resolution finds no difference in 3000 runs, where b326704 differs in about 302 · by: npm run check

## Changelog
- A resolver whose symbol table takes C# declarations after its first lookups gives the C# edges of one that met the whole table first; a consumer that fills the table before resolving sees no change.

## Evidence

### Proof

- **ran (line 3bb6b65c65b0):** nice -n 15 node --test test/relations/csharp-resolve-work.test.mjs at 19f7afc (the property test on the code before the fix) and at c7818d8 (the fix), at c7818d8 again under RUNES_PROPERTY_SEED 1 to 8; the property's generator run as a scratch script (1000 repositories, 3 orders, seed 7) on git archive extractions of 8d31e57, whose src and dist equal b326704's, and of c7818d8 with either line of the renewal taken out of dist/relations/resolver.mjs · **saw:** 19f7afc: the property fails, 405 of 3000 runs differ at the seed it drew and 382 at seed 7 (the first losing P1/F1.cs:5 and P1/F3.cs:4 to P0/F1.cs); the five other tests of the file pass. c7818d8: 6 of 6 pass; 0 of 3000 runs differ at seeds 1 to 8 and at the drawn seed. 8d31e57: 384 of 3000 differ at seed 7. Mutants of c7818d8: without renewing the type lookup 382 of 3000 differ, without renewing the condition answers 40 of 3000
- **ran (line 3bb6b65c65b0):** node harness-resolve.mjs <runes> <repository> (a scratch harness: every C# file's declarations into one table first, then every C# reference resolved as the corpus gate does, timed, with the symbol table's questions counted and the edges hashed), nice -n 15, alternating git archive extractions of b56f1c1 (before the fix) and c7818d8: eShop 5 rounds, jellyfin 9 rounds, the shared corpus cache · **saw:** the same edges before and after (eShop 2082, jellyfin 33501 references resolved to another file; sha 4f273aa75bc7e224 and cb0f01bb5794c92f) and exactly the same questions to the table (eShop has 196565, defCount 196565, filesFor 59822, valuesOf 1900, hasNamespace 29; jellyfin has 740438, defCount 740438, filesFor 185109, valuesOf 9303). Resolution medians, before and after: eShop 0.891 s and 0.875 s, jellyfin 4.35 s and 4.26 s (spread 4.07 to 4.63 s and 4.12 to 4.80 s, other agents sharing the machine). One machine: Apple silicon, 14 cores, a Linux VM, Node 24.22.2
- **ran (line 3bb6b65c65b0):** nice -n 15 npm run check, then nice -n 15 npm run coverage, at 7693a11 (the tip of jarl/696-csharp, clean tree), each under MemoryMax=12G · **saw:** npm run check: 2686 tests, 2683 pass, 0 fail, 3 skipped; dist/ is fresh. npm run coverage: the same 2683 pass, 0 fail; all files 99.19% lines, 95.83% branches, 99.13% functions

### Notes

Assumed: the generator of the review of 686 is not in any repository, so the test's generator is rebuilt from the issue's text (two to four projects with references, base lists dotted, generic, nested, through an alias and to attribute bases, usings, aliases, global usings, using static, partial and nested types, enums, members, attributes, instance, extension and static calls); on the release branch it differs in 382 to 405 of 3000 runs where the review's differed in 302. The fix renews the type lookup and the condition answers in resolver.mts, at the point that already renews the kept readings: the answers to C# conditions live there, so the change cannot stay in the C# files. 732 also lists resolver.mts; the change is 15 lines in the C# part of makeResolver (keepFresh, csharp, holds), for the merger.

