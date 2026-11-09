# 485 · Runes: in C#, a compilation-unit using beside a global type of the same simple name binds the imported type, where C# reads the global namespace's members first

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261103T0205-abfm
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 476
**Found by:** rev-runes-476-fable
**Where:** Review of 476 (2026-11-03): C# specification 7.8.1
**Branch:** jarl/485-csharp-global-and-file-scoped
**Merged:** 5227538 in ../../../Runes
**CI:** green

## What
With using Lib; at the top of a file and a type Order declared in the global namespace, a use of Order binds Lib.Order; C# finds the global namespace's own member Order before it looks at the using directives of the compilation unit.

## Why
A false edge to the imported type and a lost edge to the real one.

## Acceptance
The case gives the edge to the global type, red before and green after, with a control where no global Order exists

## Changelog
- Fixed: C#: a type declared in the global namespace binds before the types the compilation unit's using directives import, so `using Lib;` beside a global `Order` gives the edge to the global `Order`, not to `Lib.Order`.

## Evidence

- **ran (history):** node --test --test-name-pattern=csharp-using-beside-global-type-edge test/relations/extractors/csharp-name-resolution-matrix.test.mjs (before the fix) · **saw:** fail 1: expected edge src/c/Use.cs:2->global not emitted (got src/c/Use.cs:2->lib, src/c/Use.cs:5->lib)
- **ran (history):** node --test the C# matrix, catalogue, rev, parity, reach, project and csharp unit tests (after 4b01d43) · **saw:** matrix+catalogue+rev: tests 163 pass 163 fail 0; parity and unit files: tests 168 pass 168 fail 0; control csharp-plain-using-simple-name passes before and after
- **ran (history):** node scripts/corpus.mjs verify --only CleanArchitecture,eShop,jellyfin --tier all · **saw:** all three ok, 0 added, 0 removed: no C# golden changes
- **ran (history):** npm run check; npm run coverage; node scripts/corpus.mjs verify --tier all (at d24426e) · **saw:** check: tests 2030 pass 2030, dist fresh; coverage lines 99.02, branches 94.93, functions 98.93; corpus: 33 repositories ok, no golden change
- **ran (history):** nice -n 15 timeout 1800 npm run check; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 2045, pass 2045, fail 0, dist/ is fresh; corpus verify passed on all 33 (5227538 on release/1.1.0: 481 and 484 merged at 7d949f7, 485 and 486 at 5227538)

