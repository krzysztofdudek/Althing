# 492 · C#: a bare name never reads the nested types of its enclosing types

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 1.1.0, must-for-1.1.0, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-nestencl
**Where:** src/relations/extractors/csharp.mts:1801
**Branch:** jarl/492-csharp-member-and-arity-lookup
**Merged:** 6f3df1b in ../../../Runes
**CI:** pending

## What
Claim: Inside a type that nests Command, Result or Status, the bare name binds a same-named type of an enclosing namespace, the global namespace, an import or a global alias in another node. C# reads the nested types of each enclosing type, from every partial part, first (spec 7.6.1, 12.8.4). Pre-existing in v1.0.0.

probes/csharp p01 (CreateOrder.cs:4->shared, expected silence), p02 (GetOrder.cs:5->shared), p19 (Order.cs:4->codes), p31 (Importer.Run.cs:3->grid), p38 (Handler.cs:4->lib); same edges on v1.0.0; csharp-probe-output-5227538.txt

## Why


## Acceptance
- A bare name inside a type reads the nested types of its enclosing types, innermost first, before any namespace reading (C# 7.6.1), with the audit's probes as catalogue cases (a nested Command, Result or Status beside a same-named type elsewhere), red before and green after
- The C# matrix, csharp-parity and candidate-parity tests are unchanged apart from the new cases, and the corpus goldens change only by explained lines

## Changelog
- Fixed: C#: a simple name written inside a type reads the nested types of each enclosing type, from every part of a partial type, before any namespace, alias or using, so a nested `Command` or `Result` no longer gives an edge to a same-named type of another component.

## Evidence

- **ran:** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (the six new cases, before the fix) · **saw:** tests 167, pass 161, fail 6: CreateOrder.cs:4->shared, GetOrder.cs:5->shared, Order.cs:4->codes, Importer.Run.cs:3->grid, Handler.cs:4->lib, and the control got Importer.Run.cs:3->grid instead of ->model
- **ran:** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (after 4939332) · **saw:** tests 167, pass 167, fail 0; csharp-parity, csharp.test (106 pass), extractor-rev, catalogue (668) green; corpus verify jellyfin: 3 references removed, all false edges, explained
- **ran:** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (two header cases, src held at the 14c3cfe merge) · **saw:** tests 174, pass 172, fail 2: Handler.cs:3 no edge to core (base list and constraint read the nested Command); Handler.cs:2 no edge to core (class Handler : Command)
- **ran:** matrix, csharp.test, branch-coverage, parity; npm run check; npm run coverage; corpus verify --tier all (on 3c7c0b2) · **saw:** matrix 174 pass, csharp.test 109 pass; check exit 0, 2100 pass, dist fresh; coverage 99.05/95.11/98.97; corpus passed, 33 repositories, no reference changed
- **ran:** nice -n 15 timeout 1800 npm run check; npm run corpus -- --tier routine; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 2101, pass 2100, fail 0, dist/ is fresh; corpus gate passed on the routine tier; edges verified on all tiers (merge 6f3df1b on release/1.1.0)

