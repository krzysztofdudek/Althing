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

## Reviews
- **approve** · by rev-696-opus (fresh) · 2026-11-13 · model claude-opus-5-5@xhigh · batch 20261113T1825-abbh
  Minor (708, its Assumed): a chain the grammar tears apart whose head is a name the file declares reads nothing, as the lone test does, and so drops an edge the release gave under C#'s Color Color rule: with var Status = Factory.Make(); return x is Status.Active || x is Status.Done; the file had an edge to Status at 8d31e57 and has none at 7693a11; with a property Status Status the chain's line loses its edge and the file keeps it at the property. The lone x is Status.Active gives none at either commit, so the gap is the lone reading's (filed outside). Minor (outside, existed before): a chain of is not tests of dotted types gives no edge (filed outside). Tried against the guards: a fourth walk added to the built extractor turns the walk-count test red (4.01 walks); renewing neither the type lookup nor the condition answers turns the property test red (380 and 34 of 3000 at seed 7); dropping the two added keepFresh() calls does not, since every path reaches another keepFresh first. Notes: the worker's evidence counts 7 changed jellyfin files at 7693a11, where 6 jellyfin files and 1 CleanArchitecture file differ, all 708 readings at the same places; 701 changes resolver.mts, outside the issues' Files, as the worker told the merger; the branch merges cleanly onto 8b0173d.
  outside the issue, filed as 743: Runes, C#: a chain of is not tests of dotted types gives no edge: x is not App.Models.Order || x is not App.Models.Line, and the same with &&, give nothing at 8d31e57 and at 7693a11, while a lone x is not App.Models.Order gives the edge to Order. The grammar reads the chain as (x is not App).Models.Order || (x is not App).Models.Line, and its constant pattern sits under a negated pattern, which 708's reading of torn chains does not reach (it asks for the is test as the pattern's parent). 708's changelog line, a dotted type in a chain of is tests gives its edge as a lone test does, reads as covering this form.
  outside the issue, filed as 744: Runes, C#: a dotted constant pattern led by a member, local or parameter of the file named as its own type (C#'s Color Color rule: public Status Status { get; set; } or var Status = Factory.Make(), then x is Status.Active) gives no edge to the type Status, alone at 8d31e57 and 7693a11 and, since 708, in a chain the grammar tears apart, where C# binds Status to the type. For a var local or an implicitly typed lambda parameter the file then has no edge to Status at all.

## Evidence

### Proof

- **ran (line 3bb6b65c65b0):** nice -n 15 node --test test/relations/csharp-resolve-work.test.mjs at 19f7afc (the property test on the code before the fix) and at c7818d8 (the fix), at c7818d8 again under RUNES_PROPERTY_SEED 1 to 8; the property's generator run as a scratch script (1000 repositories, 3 orders, seed 7) on git archive extractions of 8d31e57, whose src and dist equal b326704's, and of c7818d8 with either line of the renewal taken out of dist/relations/resolver.mjs · **saw:** 19f7afc: the property fails, 405 of 3000 runs differ at the seed it drew and 382 at seed 7 (the first losing P1/F1.cs:5 and P1/F3.cs:4 to P0/F1.cs); the five other tests of the file pass. c7818d8: 6 of 6 pass; 0 of 3000 runs differ at seeds 1 to 8 and at the drawn seed. 8d31e57: 384 of 3000 differ at seed 7. Mutants of c7818d8: without renewing the type lookup 382 of 3000 differ, without renewing the condition answers 40 of 3000
- **ran (line 3bb6b65c65b0):** node harness-resolve.mjs <runes> <repository> (a scratch harness: every C# file's declarations into one table first, then every C# reference resolved as the corpus gate does, timed, with the symbol table's questions counted and the edges hashed), nice -n 15, alternating git archive extractions of b56f1c1 (before the fix) and c7818d8: eShop 5 rounds, jellyfin 9 rounds, the shared corpus cache · **saw:** the same edges before and after (eShop 2082, jellyfin 33501 references resolved to another file; sha 4f273aa75bc7e224 and cb0f01bb5794c92f) and exactly the same questions to the table (eShop has 196565, defCount 196565, filesFor 59822, valuesOf 1900, hasNamespace 29; jellyfin has 740438, defCount 740438, filesFor 185109, valuesOf 9303). Resolution medians, before and after: eShop 0.891 s and 0.875 s, jellyfin 4.35 s and 4.26 s (spread 4.07 to 4.63 s and 4.12 to 4.80 s, other agents sharing the machine). One machine: Apple silicon, 14 cores, a Linux VM, Node 24.22.2
- **ran (line 3bb6b65c65b0):** nice -n 15 npm run check, then nice -n 15 npm run coverage, at 7693a11 (the tip of jarl/696-csharp, clean tree), each under MemoryMax=12G · **saw:** npm run check: 2686 tests, 2683 pass, 0 fail, 3 skipped; dist/ is fresh. npm run coverage: the same 2683 pass, 0 fail; all files 99.19% lines, 95.83% branches, 99.13% functions
- **ran (line 3bb6b65c65b0):** nice -n 15 node --test test/relations/csharp-resolve-work.test.mjs at 19f7afc, c7818d8 and 7693a11, each a git archive extraction under MemoryMax=8G; the property test at 7693a11 under RUNES_PROPERTY_SEED 1, 2, 3, 4, 11 and 12, at 19f7afc under seed 7, and the tip's test file on 8d31e57's code at seed 7; three mutants of 7693a11's built resolver at seed 7 (without csharpLookup = undefined, without held = new WeakMap(), without the two keepFresh() calls the fix adds); node resolve-count.mjs <runes> <repository> (a scratch harness of the reviewer's own: every C# file declared into one table first, then every candidate classified, every SymbolTable method call counted, the edges hashed) at b56f1c1, c7818d8 and 7693a11 on eShop and jellyfin from the shared corpus cache · **saw:** 19f7afc: the property fails, 435 of 3000 runs differ at the drawn seed (1998395372) and 382 at seed 7; the 5 other tests pass. 8d31e57's code: 382 of 3000 at seed 7. c7818d8 and 7693a11: 6 of 6 pass, 0 runs differ at seeds 1, 2, 3, 4, 11 and 12. Mutants: without renewing the type lookup 380 of 3000 differ, without renewing the condition answers 34 of 3000; without the two added keepFresh() calls the test passes (every path reaches another keepFresh first, so they are a second guard). Whole table first, before and after the fix: the same edges (eShop 2079, jellyfin 33461, same sha256) and exactly the same questions to the table (eShop has 196565, defCount 196565, filesFor 59822, valuesOf 1900, hasNamespace 29; jellyfin has 740438, defCount 740438, filesFor 185109, valuesOf 9303); 7693a11 asks 196 more has and 20 more filesFor on jellyfin, from 708's longer receivers, with the same edges.
- **ran (line 3bb6b65c65b0):** npm run check:compiler && npm test -- --test-concurrency=6 at 7693a11 in a git archive extraction (build, grammars, suite), the suite once more with the tap reporter for its counts, and the rebuilt dist compared with git archive 7693a11 dist by diff -r (check:dist needs a git checkout), each under nice -n 15 and MemoryMax=12G · **saw:** exit 0; tests 2686, pass 2683, fail 0, skipped 3; the rebuilt dist equals the committed one

### Notes

Assumed: the generator of the review of 686 is not in any repository, so the test's generator is rebuilt from the issue's text (two to four projects with references, base lists dotted, generic, nested, through an alias and to attribute bases, usings, aliases, global usings, using static, partial and nested types, enums, members, attributes, instance, extension and static calls); on the release branch it differs in 382 to 405 of 3000 runs where the review's differed in 302. The fix renews the type lookup and the condition answers in resolver.mts, at the point that already renews the kept readings: the answers to C# conditions live there, so the change cannot stay in the C# files. 732 also lists resolver.mts; the change is 15 lines in the C# part of makeResolver (keepFresh, csharp, holds), for the merger.

