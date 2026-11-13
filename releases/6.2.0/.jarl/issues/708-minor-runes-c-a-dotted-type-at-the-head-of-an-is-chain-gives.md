# 708 · Minor: Runes, C#: a dotted type at the head of an is chain gives no edge, and neither does a dotted…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-bnzs
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/extractors/csharp-resolve.mts, Runes/src/relations/extractors/csharp-project.mts, Runes/src/relations/extractors/csharp-reach.mts
**Repo:** Runes
**Found by:** rev-645-opus
**Where:** the review of 645, 646, 651, 653, 654, 659, 666, 667, 677, 693
**Branch:** jarl/696-csharp
**Worker:** w-696-opus
**Model:** claude-opus-5-5@xhigh
**Since:** 2026-11-13 16:59

## What
Minor: Runes, C#: a dotted type at the head of an is chain gives no edge, and neither does a dotted type later in the chain: x is Models.Order || b and x is App.Models.Order || x is App.Models.Line give nothing on c5124ca and 90c330f, while a lone x is Models.Line gives the edge; 659's first-type reading leaves a member-access head to the existing reading, which reads none.

## Why


## Acceptance


[test] A dotted type at the head of an is chain, and one later in the chain, gives its edge as a lone x is Models.Line does: x is Models.Order || b and x is App.Models.Order || x is App.Models.Line give edges to the files that declare Order and Line; a unit test and a catalogue case, red at b326704 and green after · by: npm run check

## Changelog
- A dotted type in a chain of `is` tests gives its edge as a lone test does: `x is Models.Order || b` and `x is App.Models.Order || x is App.Models.Line` reach the files that declare `Order` and `Line`, so a graph may show new refusals where such a chain names a type of another component.

## Reviews
- **approve** · by rev-696-opus (fresh) · 2026-11-13 · model claude-opus-5-5@xhigh · batch 20261113T1825-abbh
  Minor (708, its Assumed): a chain the grammar tears apart whose head is a name the file declares reads nothing, as the lone test does, and so drops an edge the release gave under C#'s Color Color rule: with var Status = Factory.Make(); return x is Status.Active || x is Status.Done; the file had an edge to Status at 8d31e57 and has none at 7693a11; with a property Status Status the chain's line loses its edge and the file keeps it at the property. The lone x is Status.Active gives none at either commit, so the gap is the lone reading's (filed outside). Minor (outside, existed before): a chain of is not tests of dotted types gives no edge (filed outside). Tried against the guards: a fourth walk added to the built extractor turns the walk-count test red (4.01 walks); renewing neither the type lookup nor the condition answers turns the property test red (380 and 34 of 3000 at seed 7); dropping the two added keepFresh() calls does not, since every path reaches another keepFresh first. Notes: the worker's evidence counts 7 changed jellyfin files at 7693a11, where 6 jellyfin files and 1 CleanArchitecture file differ, all 708 readings at the same places; 701 changes resolver.mts, outside the issues' Files, as the worker told the merger; the branch merges cleanly onto 8b0173d.
  outside the issue, filed as 743: Runes, C#: a chain of is not tests of dotted types gives no edge: x is not App.Models.Order || x is not App.Models.Line, and the same with &&, give nothing at 8d31e57 and at 7693a11, while a lone x is not App.Models.Order gives the edge to Order. The grammar reads the chain as (x is not App).Models.Order || (x is not App).Models.Line, and its constant pattern sits under a negated pattern, which 708's reading of torn chains does not reach (it asks for the is test as the pattern's parent). 708's changelog line, a dotted type in a chain of is tests gives its edge as a lone test does, reads as covering this form.
  outside the issue, filed as 744: Runes, C#: a dotted constant pattern led by a member, local or parameter of the file named as its own type (C#'s Color Color rule: public Status Status { get; set; } or var Status = Factory.Make(), then x is Status.Active) gives no edge to the type Status, alone at 8d31e57 and 7693a11 and, since 708, in a chain the grammar tears apart, where C# binds Status to the type. For a var local or an implicitly typed lambda parameter the file then has no edge to Status at all.

## Evidence

### Proof

- **ran (line 1ca0f2e38d37):** nice -n 15 node --test --test-name-pattern='is. chain|is-type-test-chain' test/relations/extractors/csharp.test.mjs test/relations/extractors/csharp-name-resolution-matrix.test.mjs at 213133e (the tests and the case before the fix), in a git archive extraction of 8d31e57 (src and dist equal to b326704's) with the new tests and case copied in, and at 0952eb4 (the fix) and 7693a11 (one more test) · **saw:** 213133e and 8d31e57: csharp-is-type-test-chain-dotted-edge fails (expected edge src/c/Use.cs:3->order not emitted, got none), and both unit tests fail: the chains give only their first names ([2, C+Models, Models] where the lone test gives [2, C+Models, C+Models.Order, Models, Models.Order]) and the field Config is read as a type. 0952eb4: the case and both tests pass; 7693a11: the type-parameter test passes too; the catalogue holds 962 cases; the C# rev is 42
- **ran (line 1ca0f2e38d37):** RUNES_CORPUS_DIR=<the shared corpus cache> node scripts/corpus.mjs gate --only eShop,jellyfin,CleanArchitecture --tier all at 0952eb4; a scratch script comparing every C# file's declarations and extract between git archive extractions of b56f1c1 and 7693a11 on jellyfin · **saw:** corpus gate: passed, 0 added and 0 removed (CleanArchitecture 452, jellyfin 32196, eShop 2017 edges). The extracts differ in 7 jellyfin files, all at chains of enum constants such as x is VideoRangeType.DOVIWithELHDR10Plus || x is ...: the dotted constant is now one receiver of every name (VideoRangeType, DOVIWithELHDR10Plus) where it was the first name alone, and its first name binds the enum type first, so the edges stay the same; declarations unchanged
- **ran (line 1ca0f2e38d37):** nice -n 15 npm run check, then nice -n 15 npm run coverage, at 7693a11 (the tip of jarl/696-csharp, clean tree), each under MemoryMax=12G · **saw:** npm run check: 2686 tests, 2683 pass, 0 fail, 3 skipped; dist/ is fresh. npm run coverage: the same 2683 pass, 0 fail; all files 99.19% lines, 95.83% branches, 99.13% functions
- **ran (line 1ca0f2e38d37):** nice -n 15 node --test --test-name-pattern='is. chain|is-type-test-chain' test/relations/extractors/csharp.test.mjs test/relations/extractors/csharp-name-resolution-matrix.test.mjs at 213133e, 0952eb4 and 7693a11, and in a git archive extraction of 8d31e57 (src and dist equal to b326704's) with 7693a11's two test files and new case copied in, MemoryMax=8G; probes of the reviewer's own through the catalogue runner's caseEdges at 8d31e57 and 7693a11: chains the grammar tears apart with ||, && and a ternary, a using alias head, generic and nested constants, or and and patterns, is not tests, a head the file declares as a type, a partial type head, Color Color heads (a property and a var local named as their type) · **saw:** 213133e: the case fails (expected edge src/c/Use.cs:3->order not emitted, got none) and both unit tests fail; 8d31e57 with the tests copied in: the case and all three unit tests fail; 0952eb4: the case and both tests pass; 7693a11: the case and all three tests pass. Probes at 7693a11: the torn chains with ||, &&, a ternary condition, an alias head, a generic and a nested constant give the lone test's edges where 8d31e57 gave none or the first only; a declared type head and a partial type head give none, as alone. x is not App.Models.Order || x is not App.Models.Line gives no edge at either commit, while a lone x is not App.Models.Order gives it. With var Status = Factory.Make(); return x is Status.Active || x is Status.Done; the file had an edge to Status at 8d31e57 and has none at 7693a11; the lone x is Status.Active gives none at either.
- **ran (line 1ca0f2e38d37):** npm run check:compiler && npm test -- --test-concurrency=6 at 7693a11 in a git archive extraction (build, grammars, suite), the suite once more with the tap reporter for its counts, and the rebuilt dist compared with git archive 7693a11 dist by diff -r (check:dist needs a git checkout), each under nice -n 15 and MemoryMax=12G · **saw:** exit 0; tests 2686, pass 2683, fail 0, skipped 3; the rebuilt dist equals the committed one

### Notes

Assumed: in the chain the grammar tears apart, (x is App).Models.Order, a head that this file declares as a value or a type reads nothing, as the lone test's dotted reading does; the lone test then still reads a type of the file through the member-access reading (all names but the last), which in a torn chain would always bind that same file, so it is left out.

