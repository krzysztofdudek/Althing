# 4 · Runes, C#: a simple name in a constant pattern inside a type that lists a base is read as a type wh…

**Status:** done
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
**Merged:** 8e5aa17 in Runes
**Merge check:** npm run check · saw tests 2858, pass 2855, fail 0, skipped 3; dist/ is fresh.
**CI:** green

## What
Runes, C#: a simple name in a constant pattern inside a type that lists a base is read as a type where C# binds a constant the base class declares in another file (class D : Fields, Fields declaring const string Order, gives D's case Order:, Order => and, after 750, (Order, _) an edge to an imported type App.Models.Order, at v1.1.0 for the lone forms and at 619bccf for the tuple too); the receiver reading carries the member condition for this, the pattern readings do not

## Why


A false edge to an imported type is a false red for every consumer that checks dependencies.

## Acceptance


[test] Inside a type that lists a base declared in another file of the repository, case Order:, Order => and (Order, _) give no edge to a type Order where that base declares a constant or field Order, as the receiver reading already does for members, and keep the edge where no base of the type declares the name; catalogue cases red before and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- C#: a simple name in a constant pattern (`case Order:`, `Order =>`, `(Order, _)`) inside a type that is partial or lists a base now reads a member of that name the type declares in another part or inherits from a base class of the repository, as a receiver already did, and gives no edge to a type `Order` a using imports; `x is Order` keeps its edge. A consumer's graph can lose such false edges. The stored C# extract gains an optional field `members` on a plain descriptor and the C# rev moves, so stored extracts are read again. A constant pattern inside a type whose base in another project declares an internal constant of that name now gives no edge where C# would bind the type (the receiver reading already read such members so).

## Reviews
- **approve** · by rev-4-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh
  Minor: the member condition this change reuses reads an internal or private protected member of a base class in another project as one the derived type sees, which C# does not see across assemblies without InternalsVisibleTo; a scratch case (base Fields of project core with internal const string Order, Router : Fields in project web referencing core and order) gives case Order: and Order => their edge to App.Models.Order at 6c51c5c and none at b46cce5. The receiver reading has had the same gap since 1.1.0 (Order.Make() beside an internal static field Order of that base loses its edge at 6c51c5c too), so the shared condition is filed outside as one issue. Minor: the issue's changelog entry does not name the shape change of the C# extract that docs/api.md names (the new optional field members on a plain descriptor); ruling runes-extract-shapes-follow-the-rev has the CHANGELOG name such a change outright, so the merge's CHANGELOG line should add a clause for it. Verified beyond the cases: red before at 6c51c5c (src and dist equal to the merge base), green at b46cce5; npm run check, coverage and the three C# corpus repositories unchanged (jellyfin carries 151 pattern names under the new condition, none lost); 16 scratch cases agree with C# binding: a base two levels up, a generic base, a record base, a protected constant, a partial type split across files (a private constant in the other part, or the base listed there), an interface extending an interface, inner types, and not, or, and, parenthesized, property and list patterns lose the false edge; an interface constant read in a class, a private base constant, a nested type of the base, a property of another type with the type-only forms, a base constructor and an explicit interface implementation keep the true edge; a method or a non-constant member of the name makes such a pattern invalid C#. Commits name issue 4, carry no trailer, dist is fresh, the rev moves to 49, the catalogue count is raised in all three places.
  outside the issue, filed as 34: Runes, C#: the member condition (receiver readings since 1.1.0, pattern names from issue 4) reads an internal or private protected member of a base class declared in another project as one the derived type sees, where C# does not see it across assemblies without InternalsVisibleTo and binds a type of that name instead; so Order.Make() beside an internal static field Order of a base in project core, and case Order: or Order => beside an internal const Order there, lose their true edge to an imported type Order

## Evidence

### Proof

- **ran (line 80f2f6fc4016):** node --test --test-name-pattern='csharp-pattern-constant-inherited-from-base-edge|csharp-pattern-type-in-derived-class-without-the-name-edge' test/relations/extractors/csharp-name-resolution-matrix.test.mjs (at 6c51c5c, the cases without the fix) · **saw:** ✖ csharp-pattern-constant-inherited-from-base-edge: unexpected cross-owner edge src/web/Router.cs:5->order; ✔ csharp-pattern-type-in-derived-class-without-the-name-edge
- **ran (line 80f2f6fc4016):** node --test test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/csharp-name-resolution-matrix.test.mjs (at b46cce5, with the fix) · **saw:** tests 324, pass 324, fail 0; both new cases ✔, catalogue holds 1010 cases, C# rev 49
- **ran (line 80f2f6fc4016):** npm run check (at b46cce5, committed tree, MemoryMax=12G) · **saw:** tests 2837, pass 2834, fail 0, skipped 3; dist/ is fresh; exit 0
- **ran (line 80f2f6fc4016):** npm run corpus:edges -- --only CleanArchitecture,eShop,jellyfin (RUNES_CORPUS_DIR shared cache, at 6c51c5c before the fix and with the fix built) · **saw:** before and after alike: CleanArchitecture 452 edges, eShop 2031, jellyfin 32248; 0 added, 0 removed each; corpus verify: passed
- **ran (line 80f2f6fc4016):** npm run coverage (at b46cce5, MemoryMax=12G) · **saw:** exit 0; all files 99.31% lines, 95.96% branches, 99.18% functions; csharp.mjs 99.24 / 96.54 / 98.44
- **ran (line 80f2f6fc4016):** node --test --test-name-pattern='csharp-pattern-constant-inherited-from-base-edge|csharp-pattern-type-in-derived-class-without-the-name-edge' test/relations/extractors/csharp-name-resolution-matrix.test.mjs (a fresh clone at 6c51c5c, whose src and dist equal the merge base 4922b8b, built) · **saw:** ✖ csharp-pattern-constant-inherited-from-base-edge: unexpected cross-owner edge src/web/Router.cs:5->order; ✔ csharp-pattern-type-in-derived-class-without-the-name-edge; tests 2, pass 1, fail 1
- **ran (line 80f2f6fc4016):** node --test test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/csharp-name-resolution-matrix.test.mjs (a fresh clone at b46cce5, built) · **saw:** tests 324, pass 324, fail 0; both new cases ✔; the catalogue holds 1010 cases over 12 languages ✔; C# rev 49
- **ran (line 80f2f6fc4016):** npm run check (a fresh clone at b46cce5, MemoryMax=12G) · **saw:** tests 2837, pass 2834, fail 0, skipped 3; dist/ is fresh; exit 0
- **ran (line 80f2f6fc4016):** npm run corpus:edges -- --only CleanArchitecture,eShop,jellyfin (RUNES_CORPUS_DIR the shared cache, a fresh clone at b46cce5) · **saw:** CleanArchitecture 452 edges, jellyfin 32248, eShop 2031; 0 added, 0 removed, 0 explained each; corpus verify: passed
- **ran (line 80f2f6fc4016):** extractCsharpRefs over every tracked .cs file of the three corpus repositories at b46cce5, counting plain descriptors that carry members · **saw:** jellyfin 151 (case and or-pattern type names such as Video, UserView, IOException inside classes that list a base), CleanArchitecture 2, eShop 0; the corpus edges above are unchanged, so the condition held for none of them
- **ran (line 80f2f6fc4016):** npm run coverage (a fresh clone at b46cce5, MemoryMax=12G) · **saw:** tests 2837, pass 2834, fail 0; all files 99.31% lines, 95.98% branches, 99.18% functions; csharp.mjs 99.24 / 96.54 / 98.44; exit 0
- **ran (line 80f2f6fc4016):** 16 scratch C# cases through the catalogue runner (loadCaseDoc and caseEdges, on disk and through the view), at 6c51c5c and at b46cce5: losing the false edge for a base two levels up, a generic base, a record base, a protected constant, a private constant in another part of a partial type, a base listed in another part, an interface extending an interface, a non-open inner type and an open inner type in a derived outer type, not, or, and, parenthesized, property and list patterns and case ... when, a file-local derived type, a type of the derived type's own namespace; keeping the edge for an interface constant read in a class, a private base constant, a nested type of the base (edge to the base), a property of another type with x is Order, Order o, Order { } and new Order(), a base constructor and an explicit interface implementation · **saw:** at 6c51c5c 11 of 16 red, each with false edges to the imported type; at b46cce5 16 of 16 green, no duplicate edge, disk and view alike

### Notes

Assumed: the catalogue cases use a constant the base declares, not a field: a field in a constant pattern is not valid C# (CS0150), and the member condition reads fields and constants alike from the members record, so the field half of the line rides on the same condition. The cases also put the is-type operator x is Order in the derived class, which keeps its edge because C# looks it up as a type first.

Assumed: every pattern form the extractor already reads expression-first (not Order, Order or Line, a parenthesized Order) takes the same member condition, since C# binds them as constant patterns first too; the condition is the receiver's, so a base outside the repository is still not followed (the known limit docs/api.md names).

