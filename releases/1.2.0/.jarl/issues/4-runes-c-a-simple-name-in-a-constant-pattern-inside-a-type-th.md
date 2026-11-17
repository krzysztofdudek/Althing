# 4 · Runes, C#: a simple name in a constant pattern inside a type that lists a base is read as a type wh…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1204-odef
**Tags:** csharp, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-743-opus
**Where:** the review of 741, 743, 747, 750
**Branch:** jarl/4-csharp-base-constants
**Worker:** w-4-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 16:08

## What
Runes, C#: a simple name in a constant pattern inside a type that lists a base is read as a type where C# binds a constant the base class declares in another file (class D : Fields, Fields declaring const string Order, gives D's case Order:, Order => and, after 750, (Order, _) an edge to an imported type App.Models.Order, at v1.1.0 for the lone forms and at 619bccf for the tuple too); the receiver reading carries the member condition for this, the pattern readings do not

## Why


A false edge to an imported type is a false red for every consumer that checks dependencies.

## Acceptance


[test] Inside a type that lists a base declared in another file of the repository, case Order:, Order => and (Order, _) give no edge to a type Order where that base declares a constant or field Order, as the receiver reading already does for members, and keep the edge where no base of the type declares the name; catalogue cases red before and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- C#: a simple name in a constant pattern (`case Order:`, `Order =>`, `(Order, _)`) inside a type that is partial or lists a base now reads a member of that name the type declares in another part or inherits from a base class of the repository, as a receiver already did, and gives no edge to a type `Order` a using imports; `x is Order` keeps its edge. A consumer's graph can lose such false edges.

## Evidence

### Proof

- **ran (line 80f2f6fc4016):** node --test --test-name-pattern='csharp-pattern-constant-inherited-from-base-edge|csharp-pattern-type-in-derived-class-without-the-name-edge' test/relations/extractors/csharp-name-resolution-matrix.test.mjs (at 6c51c5c, the cases without the fix) · **saw:** ✖ csharp-pattern-constant-inherited-from-base-edge: unexpected cross-owner edge src/web/Router.cs:5->order; ✔ csharp-pattern-type-in-derived-class-without-the-name-edge
- **ran (line 80f2f6fc4016):** node --test test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/csharp-name-resolution-matrix.test.mjs (at b46cce5, with the fix) · **saw:** tests 324, pass 324, fail 0; both new cases ✔, catalogue holds 1010 cases, C# rev 49
- **ran (line 80f2f6fc4016):** npm run check (at b46cce5, committed tree, MemoryMax=12G) · **saw:** tests 2837, pass 2834, fail 0, skipped 3; dist/ is fresh; exit 0
- **ran (line 80f2f6fc4016):** npm run corpus:edges -- --only CleanArchitecture,eShop,jellyfin (RUNES_CORPUS_DIR shared cache, at 6c51c5c before the fix and with the fix built) · **saw:** before and after alike: CleanArchitecture 452 edges, eShop 2031, jellyfin 32248; 0 added, 0 removed each; corpus verify: passed
- **ran (line 80f2f6fc4016):** npm run coverage (at b46cce5, MemoryMax=12G) · **saw:** exit 0; all files 99.31% lines, 95.96% branches, 99.18% functions; csharp.mjs 99.24 / 96.54 / 98.44

### Notes

Assumed: the catalogue cases use a constant the base declares, not a field: a field in a constant pattern is not valid C# (CS0150), and the member condition reads fields and constants alike from the members record, so the field half of the line rides on the same condition. The cases also put the is-type operator x is Order in the derived class, which keeps its edge because C# looks it up as a type first.

Assumed: every pattern form the extractor already reads expression-first (not Order, Order or Line, a parenthesized Order) takes the same member condition, since C# binds them as constant patterns first too; the condition is the receiver's, so a base outside the repository is still not followed (the known limit docs/api.md names).

